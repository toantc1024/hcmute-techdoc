/**
 * Supabase Service - HCMUTE TechDoc
 * 
 * Provides connectivity verification and cloud state helpers.
 * Replaced legacy techdoc_admin_state with normalized schema tables.
 * 
 * Rule 15: Strictly under 300 lines (< 300).
 */
import { getBrowserClient } from '@/lib/supabase/client';
import { DocSectionItem, EvaluationCriterion, UnitWebsiteItem, ProjectPhase } from '@/models/admin.model';
import { techdocsDbService } from './techdocs-db.service';

export interface RemoteAdminState {
  units?: UnitWebsiteItem[];
  criteria?: EvaluationCriterion[];
  sections?: DocSectionItem[];
  phases?: ProjectPhase[];
  viewsStartDate?: string;
}

export const supabaseService = {
  isConfigured(): boolean {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return Boolean(url && key);
  },

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    if (!this.isConfigured()) {
      return { ok: false, message: 'Chưa cấu hình biến môi trường NEXT_PUBLIC_SUPABASE_URL hoặc Key.' };
    }

    try {
      const client = getBrowserClient();
      const { data, error } = await client
        .from('organizational_units')
        .select('id')
        .limit(1);

      if (error) {
        return { ok: false, message: `Lỗi kết nối cơ sở dữ liệu: ${error.message}` };
      }

      return {
        ok: true,
        message: `Kết nối thành công! Đã kết nối Supabase Cloud với bảng organizational_units (${data?.length || 0} bản ghi).`,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, message: `Lỗi kết nối: ${msg}` };
    }
  },

  async fetchAllRemote(): Promise<RemoteAdminState | null> {
    try {
      const data = await techdocsDbService.fetchDashboardData();
      if (!data.fromDatabase) return null;
      return {
        units: data.units,
        criteria: data.criteria,
        sections: data.sections,
        phases: data.phases,
      };
    } catch {
      return null;
    }
  },

  async saveRemoteValue(_key: string, _value: unknown): Promise<boolean> {
    // Legacy single-document upsert replaced by normalized table mutations in techdocsDbService
    return true;
  },

  async syncAllToRemote(_state: {
    units: UnitWebsiteItem[];
    criteria: EvaluationCriterion[];
    sections: DocSectionItem[];
    phases: ProjectPhase[];
    viewsStartDate: string;
  }): Promise<{ ok: boolean; message: string }> {
    return { ok: true, message: 'Dữ liệu được đồng bộ trực tiếp qua bảng chuẩn hóa.' };
  },
};
