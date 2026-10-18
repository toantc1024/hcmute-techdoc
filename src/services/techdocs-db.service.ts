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

export const techdocsDbService = {
  async fetchDashboardData(): Promise<TechDocsDashboardData> {
    const supabase = getBrowserClient();
    try {
      // 1. Fetch active period
      const { data: periodData } = await supabase
        .from('evaluation_periods')
        .select('id, slug, is_active')
        .eq('is_active', true)
        .maybeSingle();

      const periodId = periodData?.id || null;

      // 2. Fetch doc sections
      const { data: secData, error: secErr } = await supabase
        .from('doc_sections')
        .select('*')
        .order('chapter_number', { ascending: true });

      // 3. Fetch criteria
      const { data: critData, error: critErr } = await supabase
        .from('evaluation_criteria')
        .select('*')
        .order('sort_order', { ascending: true });

      // 4. Fetch phases
      const { data: phaseData, error: phaseErr } = await supabase
        .from('project_phases')
        .select('*')
        .order('phase_number', { ascending: true });

      // 5. Fetch units and ratings
      const { data: unitData, error: unitErr } = await supabase
        .from('organizational_units')
        .select('id, legacy_id, sort_order, group_type, group_label, name, domain, is_new_web, staff_in_charge, contact_email, contact_phone')
        .order('legacy_id', { ascending: true });

      if (secErr || critErr || phaseErr || unitErr || !unitData || unitData.length === 0) {
        return this.getFallbackSeedData();
      }

      // 6. Fetch ratings for active period
      let ratingsMap: Record<string, { total_score: number; admin_notes: string; rating_id: string }> = {};
      let itemsMap: Record<string, Record<string, { rating: CriterionRating; note: string }>> = {};

      if (periodId) {
        const { data: ratingsData } = await supabase
          .from('unit_ratings')
          .select('id, unit_id, total_score, admin_notes')
          .eq('period_id', periodId);

        if (ratingsData) {
          for (const r of ratingsData) {
            ratingsMap[r.unit_id] = { total_score: Number(r.total_score), admin_notes: r.admin_notes || '', rating_id: r.id };
          }
        }

        const ratingIds = Object.values(ratingsMap).map((r) => r.rating_id);
        if (ratingIds.length > 0) {
          const { data: itemsData } = await supabase
            .from('unit_rating_items')
            .select('rating_id, criterion_id, rating, note')
            .in('rating_id', ratingIds);

          if (itemsData) {
            for (const item of itemsData) {
              if (!itemsMap[item.rating_id]) itemsMap[item.rating_id] = {};
              itemsMap[item.rating_id][item.criterion_id] = {
                rating: item.rating as CriterionRating,
                note: item.note || '',
              };
            }
          }
        }
      }

      // Map criteria back to domain model
      const criteria: EvaluationCriterion[] = (critData || []).map((c: Record<string, unknown>) => ({
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

      // Map criteria code to UUID for mapping
      const critCodeToIdMap: Record<string, string> = {};
      (critData || []).forEach((c: { id: string; code: string }) => {
        critCodeToIdMap[c.id] = c.code;
      });

      // Map units back to domain model
      const units: UnitWebsiteItem[] = unitData.map((u: Record<string, unknown>) => {
        const rInfo = ratingsMap[String(u.id)];
        const ratingId = rInfo?.rating_id;
        const uItems = ratingId ? itemsMap[ratingId] || {} : {};

        const criteriaRatings: Record<string, CriterionRating> = {};
        const criteriaNotes: Record<string, string> = {};

        for (const [critDbId, val] of Object.entries(uItems)) {
          const critCode = critCodeToIdMap[critDbId] || critDbId;
          criteriaRatings[critCode] = val.rating;
          if (val.note) criteriaNotes[critCode] = val.note;
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
          completenessScore: rInfo ? Math.round(rInfo.total_score) : 0,
          notes: rInfo?.admin_notes || '',
          contactEmail: u.contact_email ? String(u.contact_email) : undefined,
          contactPhone: u.contact_phone ? String(u.contact_phone) : undefined,
        };
      });

      // Map doc sections
      const sections: DocSectionItem[] = (secData || []).map((s: Record<string, unknown>) => ({
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
      const phases: ProjectPhase[] = (phaseData || []).map((p: Record<string, unknown>) => ({
        phaseId: Number(p.phase_number),
        title: String(p.title),
        timeFrame: String(p.time_frame || ''),
        target: String(p.target_description || ''),
        status: p.status as ProjectPhase['status'],
        completionRate: Number(p.completion_rate || 0),
      }));

      return { sections, criteria, units, phases, periodId, fromDatabase: true };
    } catch {
      return this.getFallbackSeedData();
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
      // 1. Resolve unit UUID
      const { data: unit } = await supabase
        .from('organizational_units')
        .select('id')
        .eq('legacy_id', unitLegacyId)
        .maybeSingle();
      if (!unit) return false;

      // 2. Resolve active period
      const { data: period } = await supabase
        .from('evaluation_periods')
        .select('id')
        .eq('is_active', true)
        .maybeSingle();
      if (!period) return false;

      // 3. Resolve rating ID
      const { data: ratingRow } = await supabase
        .from('unit_ratings')
        .select('id')
        .eq('unit_id', unit.id)
        .eq('period_id', period.id)
        .maybeSingle();
      if (!ratingRow) return false;

      // 4. Resolve criterion UUID
      const { data: crit } = await supabase
        .from('evaluation_criteria')
        .select('id')
        .eq('code', criterionCode)
        .maybeSingle();
      if (!crit) return false;

      // 5. Upsert item
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

  async updateDocSection(section: DocSectionItem): Promise<boolean> {
    const supabase = getBrowserClient();
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
