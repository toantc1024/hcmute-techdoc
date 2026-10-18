import { getBrowserClient } from '@/lib/supabase/client';
import {
  DocSectionItem,
  EvaluationCriterion,
  UnitWebsiteItem,
  ProjectPhase,
  CriterionRating,
} from '@/models/admin.model';
import seedData from './admin-seed.json';

export interface TechDocsDashboardData {
  sections: DocSectionItem[];
  criteria: EvaluationCriterion[];
  units: UnitWebsiteItem[];
  phases: ProjectPhase[];
  periodId: string | null;
  fromDatabase: boolean;
}

const CACHE_KEY = 'hcmute_techdoc_dashboard_cache_v2';
const CACHE_TTL_MS = 60 * 1000; // 60s in-memory freshness

let memoryCache: { data: TechDocsDashboardData; timestamp: number } | null = null;

export const techdocsDbService = {
  getInstantData(): TechDocsDashboardData {
    if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_TTL_MS) {
      return memoryCache.data;
    }
    if (typeof window !== 'undefined') {
      try {
        const raw = sessionStorage.getItem(CACHE_KEY) || localStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.units) && parsed.units.length > 0) {
            memoryCache = { data: parsed, timestamp: Date.now() };
            return parsed;
          }
        }
      } catch {
        // storage fallback
      }
    }
    return this.getFallbackSeedData();
  },

  setCache(data: TechDocsDashboardData): void {
    memoryCache = { data, timestamp: Date.now() };
    if (typeof window !== 'undefined') {
      try {
        const str = JSON.stringify(data);
        sessionStorage.setItem(CACHE_KEY, str);
        localStorage.setItem(CACHE_KEY, str);
      } catch {
        // quota fallback
      }
    }
  },

  invalidateCache(): void {
    memoryCache = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(CACHE_KEY);
      localStorage.removeItem(CACHE_KEY);
    }
  },

  async fetchDashboardData(options?: { forceFresh?: boolean }): Promise<TechDocsDashboardData> {
    if (!options?.forceFresh && memoryCache && Date.now() - memoryCache.timestamp < CACHE_TTL_MS) {
      return memoryCache.data;
    }

    const supabase = getBrowserClient();
    try {
      // 5-in-1 Parallel Relational Fetch (Single network round-trip ~450ms)
      const [unitsRes, periodsRes, secRes, critRes, phaseRes] = await Promise.all([
        supabase
          .from('organizational_units')
          .select(
            'id, legacy_id, sort_order, group_type, group_label, name, domain, is_new_web, staff_in_charge, contact_email, contact_phone, unit_ratings(id, period_id, total_score, admin_notes, unit_rating_items(criterion_id, rating, note))'
          )
          .order('legacy_id', { ascending: true }),
        supabase.from('evaluation_periods').select('id, slug, is_active').order('created_at', { ascending: false }),
        supabase.from('doc_sections').select('*').order('chapter_number', { ascending: true }),
        supabase.from('evaluation_criteria').select('*').order('sort_order', { ascending: true }),
        supabase.from('project_phases').select('*').order('phase_number', { ascending: true }),
      ]);

      if (unitsRes.error || critRes.error || !unitsRes.data || unitsRes.data.length === 0) {
        return this.getInstantData();
      }

      const activePeriod = periodsRes.data?.find((p) => p.is_active) || periodsRes.data?.[0];
      const periodId = activePeriod?.id || null;

      // Map criteria lookup table
      const critCodeToIdMap: Record<string, string> = {};
      (critRes.data || []).forEach((c: { id: string; code: string }) => {
        critCodeToIdMap[c.id] = c.code;
      });

      const criteria: EvaluationCriterion[] = (critRes.data || []).map((c: Record<string, unknown>) => ({
        id: String(c.code || c.id),
        code: String(c.display_code || c.code),
        name: String(c.title || ''),
        description: String(c.description || ''),
        weight: Number(c.weight || 15),
        passCondition: String(c.pass_condition || ''),
        warningCondition: String(c.warning_condition || ''),
        failCondition: String(c.fail_condition || ''),
        isCustom: Boolean(c.is_custom),
      }));

      // Map units & relational ratings in single pass
      const units: UnitWebsiteItem[] = unitsRes.data.map((u: Record<string, unknown>) => {
        const ratings = (u.unit_ratings as Array<Record<string, unknown>>) || [];
        const rInfo = ratings.find((r) => r.period_id === periodId) || ratings[0];
        const uItems = (rInfo?.unit_rating_items as Array<Record<string, unknown>>) || [];

        const criteriaRatings: Record<string, CriterionRating> = {};
        const criteriaNotes: Record<string, string> = {};

        for (const item of uItems) {
          const critDbId = String(item.criterion_id);
          const critCode = critCodeToIdMap[critDbId] || critDbId;
          criteriaRatings[critCode] = item.rating as CriterionRating;
          if (item.note) criteriaNotes[critCode] = String(item.note);
        }

        return {
          id: Number(u.legacy_id || 0),
          stt: Number(u.sort_order || u.legacy_id || 0),
          group: u.group_type as UnitWebsiteItem['group'],
          groupLabel: String(u.group_label || ''),
          name: String(u.name || ''),
          domain: String(u.domain || ''),
          isNewWeb: Boolean(u.is_new_web),
          staff: String(u.staff_in_charge || ''),
          criteriaRatings,
          criteriaNotes,
          completenessScore: rInfo ? Math.round(Number(rInfo.total_score)) : 0,
          notes: String(rInfo?.admin_notes || ''),
          contactEmail: u.contact_email ? String(u.contact_email) : undefined,
          contactPhone: u.contact_phone ? String(u.contact_phone) : undefined,
        };
      });

      // Map doc sections
      const sections: DocSectionItem[] = (secRes.data || []).map((s: Record<string, unknown>) => ({
        id: String(s.section_key),
        slug: String(s.slug),
        chapterNumber: Number(s.chapter_number || 1),
        chapterTitle: String(s.chapter_title || ''),
        pageTitle: String(s.page_title || ''),
        pageSlug: String(s.slug || ''),
        summary: String(s.summary || ''),
        luong: s.luong_type as DocSectionItem['luong'],
        isVisible: Boolean(s.is_visible),
        viewCount: Number(s.view_count || 0),
        readingTimeMinutes: Number(s.reading_time_minutes || 1),
        lastUpdated: String(s.last_updated || ''),
        tags: Array.isArray(s.tags) ? s.tags : [],
      }));

      // Map project phases
      const phases: ProjectPhase[] = (phaseRes.data || []).map((p: Record<string, unknown>) => ({
        phaseId: Number(p.phase_number),
        title: String(p.title),
        timeFrame: String(p.time_frame || ''),
        target: String(p.target_description || ''),
        status: p.status as ProjectPhase['status'],
        completionRate: Number(p.completion_rate || 0),
      }));

      const result: TechDocsDashboardData = {
        sections,
        criteria,
        units,
        phases,
        periodId,
        fromDatabase: true,
      };

      this.setCache(result);
      return result;
    } catch {
      return this.getInstantData();
    }
  },

  async updateUnitRatingItem(
    unitLegacyId: number,
    criterionCode: string,
    rating: CriterionRating,
    note?: string
  ): Promise<boolean> {
    const supabase = getBrowserClient();
    try {
      this.invalidateCache();
      const { data: unit } = await supabase
        .from('organizational_units')
        .select('id')
        .eq('legacy_id', unitLegacyId)
        .maybeSingle();
      if (!unit) return false;

      const { data: period } = await supabase
        .from('evaluation_periods')
        .select('id')
        .eq('is_active', true)
        .maybeSingle();
      if (!period) return false;

      const { data: ratingRow } = await supabase
        .from('unit_ratings')
        .select('id')
        .eq('unit_id', unit.id)
        .eq('period_id', period.id)
        .maybeSingle();
      if (!ratingRow) return false;

      const { data: crit } = await supabase
        .from('evaluation_criteria')
        .select('id')
        .eq('code', criterionCode)
        .maybeSingle();
      if (!crit) return false;

      const { error } = await supabase.from('unit_rating_items').upsert(
        {
          rating_id: ratingRow.id,
          criterion_id: crit.id,
          rating,
          note: note || '',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'rating_id,criterion_id' }
      );

      return !error;
    } catch {
      return false;
    }
  },

  async updateUnitServerStatus(unitLegacyId: number, isNewWeb: boolean): Promise<boolean> {
    const supabase = getBrowserClient();
    this.invalidateCache();
    const { error } = await supabase
      .from('organizational_units')
      .update({ is_new_web: isNewWeb, updated_at: new Date().toISOString() })
      .eq('legacy_id', unitLegacyId);
    return !error;
  },

  async updateDocSection(section: DocSectionItem): Promise<boolean> {
    const supabase = getBrowserClient();
    this.invalidateCache();
    const { error } = await supabase
      .from('doc_sections')
      .update({
        is_visible: section.isVisible,
        view_count: section.viewCount,
        last_updated: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      })
      .eq('section_key', section.id);
    return !error;
  },

  async resetDocSectionViews(): Promise<boolean> {
    const supabase = getBrowserClient();
    this.invalidateCache();
    const { error } = await supabase
      .from('doc_sections')
      .update({ view_count: 0, updated_at: new Date().toISOString() })
      .neq('section_key', '');
    return !error;
  },

  getFallbackSeedData(): TechDocsDashboardData {
    return {
      sections: seedData.docSections as DocSectionItem[],
      criteria: seedData.criteria as EvaluationCriterion[],
      units: seedData.units as unknown as UnitWebsiteItem[],
      phases: seedData.phases as ProjectPhase[],
      periodId: null,
      fromDatabase: false,
    };
  },
};
