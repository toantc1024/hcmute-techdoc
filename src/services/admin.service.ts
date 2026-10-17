import {
  DocSectionItem,
  EvaluationCriterion,
  UnitWebsiteItem,
  ProjectPhase,
  CriterionRating
} from '@/models/admin.model';
import seedData from './admin-seed.json';
import { supabaseService } from './supabase.service';

const STORAGE_KEYS = {
  DOC_SECTIONS: 'hcmute_techdoc_admin_sections',
  CRITERIA: 'hcmute_techdoc_admin_criteria',
  UNITS: 'hcmute_techdoc_admin_units',
  PHASES: 'hcmute_techdoc_admin_phases',
  VIEWS_START_DATE: 'hcmute_techdoc_views_start_date',
};

function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function computeUnitScore(
  ratings: Record<string, CriterionRating>,
  criteria: EvaluationCriterion[]
): number {
  if (!criteria.length) return 0;
  const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 10), 0);
  if (totalWeight <= 0) return 0;

  let earned = 0;
  for (const c of criteria) {
    const r = ratings[c.id];
    const weight = c.weight || 10;
    if (r === 'pass') earned += weight;
    else if (r === 'warning') earned += weight * 0.5;
  }
  return Math.min(100, Math.max(0, Math.round((earned / totalWeight) * 100)));
}

export const adminService = {
  getDocSections(): DocSectionItem[] {
    if (!isClient()) return seedData.docSections as DocSectionItem[];
    const raw = localStorage.getItem(STORAGE_KEYS.DOC_SECTIONS);
    if (!raw) return seedData.docSections as DocSectionItem[];
    try {
      return JSON.parse(raw);
    } catch {
      return seedData.docSections as DocSectionItem[];
    }
  },

  saveDocSections(items: DocSectionItem[]): void {
    if (isClient()) {
      localStorage.setItem(STORAGE_KEYS.DOC_SECTIONS, JSON.stringify(items));
      supabaseService.saveRemoteValue('sections', items).catch(() => {});
    }
  },

  toggleDocSectionVisibility(id: string): DocSectionItem[] {
    const list = this.getDocSections().map((item) =>
      item.id === id ? { ...item, isVisible: !item.isVisible } : item
    );
    this.saveDocSections(list);
    return list;
  },

  updateDocSection(updated: DocSectionItem): DocSectionItem[] {
    const list = this.getDocSections().map((item) =>
      item.id === updated.id ? { ...updated, lastUpdated: new Date().toISOString().split('T')[0] } : item
    );
    this.saveDocSections(list);
    return list;
  },

  getViewsStartDate(): string {
    if (!isClient()) return '16/10/2026';
    return localStorage.getItem(STORAGE_KEYS.VIEWS_START_DATE) || '16/10/2026';
  },

  resetViews(): { items: DocSectionItem[]; startDate: string } {
    const nowStr = new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    if (isClient()) {
      localStorage.setItem(STORAGE_KEYS.VIEWS_START_DATE, nowStr);
      supabaseService.saveRemoteValue('views_start_date', nowStr).catch(() => {});
    }
    const zeroed = this.getDocSections().map((item) => ({ ...item, viewCount: 0 }));
    this.saveDocSections(zeroed);
    return { items: zeroed, startDate: nowStr };
  },

  incrementView(id: string): DocSectionItem[] {
    const list = this.getDocSections().map((item) =>
      item.id === id ? { ...item, viewCount: item.viewCount + 1 } : item
    );
    this.saveDocSections(list);
    return list;
  },

  getCriteria(): EvaluationCriterion[] {
    if (!isClient()) return seedData.criteria as EvaluationCriterion[];
    const raw = localStorage.getItem(STORAGE_KEYS.CRITERIA);
    if (!raw) return seedData.criteria as EvaluationCriterion[];
    try {
      return JSON.parse(raw);
    } catch {
      return seedData.criteria as EvaluationCriterion[];
    }
  },

  saveCriteria(items: EvaluationCriterion[]): void {
    if (isClient()) {
      localStorage.setItem(STORAGE_KEYS.CRITERIA, JSON.stringify(items));
      supabaseService.saveRemoteValue('criteria', items).catch(() => {});
    }
  },

  addCriterion(data: Omit<EvaluationCriterion, 'id' | 'isCustom'>): EvaluationCriterion[] {
    const criteria = this.getCriteria();
    const newId = `crit_custom_${Date.now()}`;
    const newCriterion: EvaluationCriterion = {
      ...data,
      id: newId,
      isCustom: true
    };
    const updated = [...criteria, newCriterion];
    this.saveCriteria(updated);

    // Cập nhật điểm cho tất cả đơn vị
    const units = this.getUnits().map((u) => {
      const nextRatings = { ...u.criteriaRatings, [newId]: 'warning' as CriterionRating };
      return {
        ...u,
        criteriaRatings: nextRatings,
        completenessScore: computeUnitScore(nextRatings, updated)
      };
    });
    this.saveUnits(units);

    return updated;
  },

  updateCriterion(target: EvaluationCriterion): EvaluationCriterion[] {
    const criteria = this.getCriteria().map((c) => (c.id === target.id ? target : c));
    this.saveCriteria(criteria);

    // Tính lại điểm
    const units = this.getUnits().map((u) => ({
      ...u,
      completenessScore: computeUnitScore(u.criteriaRatings, criteria)
    }));
    this.saveUnits(units);

    return criteria;
  },

  deleteCriterion(id: string): EvaluationCriterion[] {
    const criteria = this.getCriteria().filter((c) => c.id !== id);
    this.saveCriteria(criteria);

    const units = this.getUnits().map((u) => {
      const nextRatings = { ...u.criteriaRatings };
      delete nextRatings[id];
      return {
        ...u,
        criteriaRatings: nextRatings,
        completenessScore: computeUnitScore(nextRatings, criteria)
      };
    });
    this.saveUnits(units);

    return criteria;
  },

  getUnits(): UnitWebsiteItem[] {
    if (!isClient()) return seedData.units as unknown as UnitWebsiteItem[];
    const raw = localStorage.getItem(STORAGE_KEYS.UNITS);
    if (!raw) return seedData.units as unknown as UnitWebsiteItem[];
    try {
      return JSON.parse(raw);
    } catch {
      return seedData.units as unknown as UnitWebsiteItem[];
    }
  },

  saveUnits(items: UnitWebsiteItem[]): void {
    if (isClient()) {
      localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(items));
      supabaseService.saveRemoteValue('units', items).catch(() => {});
    }
  },

  updateUnitRating(unitId: number, criterionId: string, rating: CriterionRating): UnitWebsiteItem[] {
    const criteria = this.getCriteria();
    const units = this.getUnits().map((u) => {
      if (u.id !== unitId) return u;
      const nextRatings = { ...u.criteriaRatings, [criterionId]: rating };
      return {
        ...u,
        criteriaRatings: nextRatings,
        completenessScore: computeUnitScore(nextRatings, criteria)
      };
    });
    this.saveUnits(units);
    return units;
  },

  updateUnitCriterionNote(unitId: number, criterionId: string, note: string): UnitWebsiteItem[] {
    const units = this.getUnits().map((u) => {
      if (u.id !== unitId) return u;
      const nextNotes = { ...(u.criteriaNotes || {}), [criterionId]: note };
      return {
        ...u,
        criteriaNotes: nextNotes
      };
    });
    this.saveUnits(units);
    return units;
  },

  getPhases(): ProjectPhase[] {
    if (!isClient()) return seedData.phases as ProjectPhase[];
    const raw = localStorage.getItem(STORAGE_KEYS.PHASES);
    if (!raw) return seedData.phases as ProjectPhase[];
    try {
      return JSON.parse(raw);
    } catch {
      return seedData.phases as ProjectPhase[];
    }
  },

  savePhases(items: ProjectPhase[]): void {
    if (isClient()) {
      localStorage.setItem(STORAGE_KEYS.PHASES, JSON.stringify(items));
      supabaseService.saveRemoteValue('phases', items).catch(() => {});
    }
  },

  async syncFromCloud(): Promise<boolean> {
    if (!supabaseService.isConfigured()) return false;
    const remote = await supabaseService.fetchAllRemote();
    if (!remote || !remote.units) return false;
    if (remote.units) this.saveUnits(remote.units);
    if (remote.criteria) this.saveCriteria(remote.criteria);
    if (remote.sections) this.saveDocSections(remote.sections);
    if (remote.phases) this.savePhases(remote.phases);
    if (remote.viewsStartDate && isClient()) {
      localStorage.setItem(STORAGE_KEYS.VIEWS_START_DATE, remote.viewsStartDate);
    }
    return true;
  },

  resetToDefault(): void {
    if (isClient()) {
      localStorage.removeItem(STORAGE_KEYS.DOC_SECTIONS);
      localStorage.removeItem(STORAGE_KEYS.CRITERIA);
      localStorage.removeItem(STORAGE_KEYS.UNITS);
      localStorage.removeItem(STORAGE_KEYS.PHASES);
    }
  }
};
