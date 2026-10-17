import { getSupabaseClient, getSupabaseCredentials } from '@/lib/supabase';
import { DocSectionItem, EvaluationCriterion, UnitWebsiteItem, ProjectPhase } from '@/models/admin.model';

export const SUPABASE_SQL_INIT = `-- Tạo bảng lưu trạng thái quản trị HCM-UTE TechDoc
CREATE TABLE IF NOT EXISTS techdoc_admin_state (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kích hoạt Row Level Security (RLS)
ALTER TABLE techdoc_admin_state ENABLE ROW LEVEL SECURITY;

-- Cho phép đọc & ghi công khai (qua anon key)
DROP POLICY IF EXISTS "Allow anon read-write" ON techdoc_admin_state;
CREATE POLICY "Allow anon read-write"
  ON techdoc_admin_state
  FOR ALL
  USING (true)
  WITH CHECK (true);
`;

export interface RemoteAdminState {
  units?: UnitWebsiteItem[];
  criteria?: EvaluationCriterion[];
  sections?: DocSectionItem[];
  phases?: ProjectPhase[];
  viewsStartDate?: string;
}

export const supabaseService = {
  isConfigured(): boolean {
    const { url, anonKey } = getSupabaseCredentials();
    return Boolean(url && anonKey);
  },

  async testConnection(): Promise<{ ok: boolean; message: string }> {
    const client = getSupabaseClient();
    if (!client) {
      return { ok: false, message: 'Chưa cấu hình URL hoặc Anon Key của Supabase.' };
    }

    try {
      const { data, error } = await client
        .from('techdoc_admin_state')
        .select('key')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          return {
            ok: false,
            message: 'Đã kết nối được Supabase nhưng bảng `techdoc_admin_state` chưa được tạo. Vui lòng chạy lệnh SQL khởi tạo bên dưới.',
          };
        }
        return { ok: false, message: `Lỗi Supabase: ${error.message}` };
      }

      return {
        ok: true,
        message: `Kết nối thành công! Đã tìm thấy bảng \`techdoc_admin_state\` (${data?.length || 0} bản ghi).`,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, message: `Lỗi kết nối: ${msg}` };
    }
  },

  async getRemoteValue<T>(key: string): Promise<T | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('techdoc_admin_state')
        .select('value')
        .eq('key', key)
        .maybeSingle();

      if (error || !data) return null;
      return data.value as T;
    } catch {
      return null;
    }
  },

  async saveRemoteValue(key: string, value: unknown): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const { error } = await client
        .from('techdoc_admin_state')
        .upsert(
          {
            key,
            value,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );

      if (error) {
        console.warn(`[Supabase] Upsert ${key} error:`, error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn(`[Supabase] Upsert ${key} exception:`, err);
      return false;
    }
  },

  async fetchAllRemote(): Promise<RemoteAdminState | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from('techdoc_admin_state')
        .select('key, value');

      if (error || !data) return null;

      const result: RemoteAdminState = {};
      for (const row of data) {
        if (row.key === 'units') result.units = row.value;
        if (row.key === 'criteria') result.criteria = row.value;
        if (row.key === 'sections') result.sections = row.value;
        if (row.key === 'phases') result.phases = row.value;
        if (row.key === 'views_start_date') result.viewsStartDate = row.value;
      }
      return result;
    } catch {
      return null;
    }
  },

  async syncAllToRemote(state: {
    units: UnitWebsiteItem[];
    criteria: EvaluationCriterion[];
    sections: DocSectionItem[];
    phases: ProjectPhase[];
    viewsStartDate: string;
  }): Promise<{ ok: boolean; message: string }> {
    const client = getSupabaseClient();
    if (!client) return { ok: false, message: 'Chưa cấu hình Supabase.' };

    try {
      const now = new Date().toISOString();
      const rows = [
        { key: 'units', value: state.units, updated_at: now },
        { key: 'criteria', value: state.criteria, updated_at: now },
        { key: 'sections', value: state.sections, updated_at: now },
        { key: 'phases', value: state.phases, updated_at: now },
        { key: 'views_start_date', value: state.viewsStartDate, updated_at: now },
      ];

      const { error } = await client
        .from('techdoc_admin_state')
        .upsert(rows, { onConflict: 'key' });

      if (error) {
        return { ok: false, message: error.message };
      }

      return { ok: true, message: 'Đã đồng bộ toàn bộ 51 website, tiêu chuẩn và lượt xem lên Supabase!' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, message: msg };
    }
  },
};
