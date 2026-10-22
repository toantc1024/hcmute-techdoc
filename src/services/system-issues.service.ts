import { getBrowserClient } from '@/lib/supabase/client';
import { SystemIssueItem, IssueStatus, IssuePriority } from '@/models/admin.model';

const STORAGE_KEY = 'hcmute_techdoc_system_issues_v1';

export const INITIAL_ISSUES_SEED: SystemIssueItem[] = [
  {
    id: 'issue-seed-1',
    stt: 1,
    status: 'dang_xu_ly',
    priority: 1,
    content: 'Thanh tìm kiếm tài liệu (Cmd + K) bị vỡ giao diện khi xoay ngang trên iPad mini.',
    images: [],
    solutionPlan: 'Kiểm tra container Flexbox, đặt max-w-[640px] và thêm responsive media query sm:w-[90vw].',
    notes: 'Ưu tiên khắc phục trước đợt tập huấn cán bộ đơn vị tuần tới.',
    reporterName: 'Đội Kỹ thuật CNTT',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'issue-seed-2',
    stt: 2,
    status: 'da_xu_ly',
    priority: 2,
    content: 'Cần cập nhật bộ Favicon và Web Clip Icon chuẩn kích thước 512x512 cho các trang đơn vị.',
    images: [],
    solutionPlan: 'Đã xuất file SVG vector từ logo HCMUTE và tích hợp sẵn vào file Layout chung của toàn bộ mẫu theme.',
    notes: 'Đã hoàn tất nghiệm thu và đồng bộ lên server 189.',
    reporterName: 'Ban Biên tập',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'issue-seed-3',
    stt: 3,
    status: 'khong_xu_ly',
    priority: 3,
    content: 'Đề xuất hiệu ứng 3D lật trang khi chuyển qua lại giữa các chương tài liệu kỹ thuật.',
    images: [],
    solutionPlan: 'Giữ thiết kế phẳng tối giản (Flat Design) chuẩn giáo dục để tăng tốc độ tải và giảm giật lag trên máy cấu hình yếu.',
    notes: 'Thống nhất trong cuộc họp kỹ thuật: không áp dụng.',
    reporterName: 'Quản trị viên',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

export const systemIssuesService = {
  getInstantIssues(): SystemIssueItem[] {
    if (typeof window === 'undefined') return INITIAL_ISSUES_SEED;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ISSUES_SEED;
  },

  setLocalIssues(issues: SystemIssueItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
      window.dispatchEvent(new CustomEvent('hcmute_techdoc_issues_updated', { detail: issues }));
    } catch (e) {
      console.warn('LocalStorage save error (likely image storage quota):', e);
    }
  },

  async fetchIssues(): Promise<SystemIssueItem[]> {
    const local = this.getInstantIssues();
    try {
      const supabase = getBrowserClient();
      const { data, error } = await supabase
        .from('system_issues')
        .select('*')
        .order('stt', { ascending: true });

      if (error || !data || data.length === 0) {
        return local;
      }

      const mapped: SystemIssueItem[] = data.map((d: any, idx: number) => ({
        id: String(d.id),
        stt: Number(d.stt || idx + 1),
        status: (d.status as IssueStatus) || 'dang_xu_ly',
        content: String(d.content || ''),
        images: Array.isArray(d.images) ? d.images : [],
        solutionPlan: String(d.solution_plan || ''),
        priority: (Number(d.priority) as IssuePriority) || 2,
        notes: String(d.notes || ''),
        reporterName: String(d.reporter_name || ''),
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));

      this.setLocalIssues(mapped);
      return mapped;
    } catch {
      return local;
    }
  },

  async saveIssue(
    issueData: Partial<SystemIssueItem> & { content: string }
  ): Promise<SystemIssueItem> {
    const current = this.getInstantIssues();
    const isEdit = Boolean(issueData.id && current.some((i) => i.id === issueData.id));

    let savedItem: SystemIssueItem;
    if (isEdit) {
      savedItem = {
        ...current.find((i) => i.id === issueData.id)!,
        ...issueData,
        updatedAt: new Date().toISOString(),
      } as SystemIssueItem;

      const nextList = current.map((i) => (i.id === savedItem.id ? savedItem : i));
      this.setLocalIssues(nextList);
    } else {
      const nextStt = current.length > 0 ? Math.max(...current.map((i) => i.stt || 0)) + 1 : 1;
      savedItem = {
        id: issueData.id || `issue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        stt: issueData.stt || nextStt,
        status: issueData.status || 'dang_xu_ly',
        content: issueData.content,
        images: issueData.images || [],
        solutionPlan: issueData.solutionPlan || '',
        priority: issueData.priority || 2,
        notes: issueData.notes || '',
        reporterName: issueData.reporterName || 'Cán bộ quản trị',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const nextList = [...current, savedItem];
      this.setLocalIssues(nextList);
    }

    try {
      const supabase = getBrowserClient();
      const payload = {
        id: savedItem.id.startsWith('issue-') ? undefined : savedItem.id,
        stt: savedItem.stt,
        status: savedItem.status,
        content: savedItem.content,
        images: savedItem.images,
        solution_plan: savedItem.solutionPlan,
        priority: savedItem.priority,
        notes: savedItem.notes,
        reporter_name: savedItem.reporterName,
      };

      if (isEdit) {
        await supabase.from('system_issues').update(payload).eq('id', savedItem.id);
      } else {
        const { data } = await supabase.from('system_issues').insert(payload).select().single();
        if (data?.id) {
          savedItem.id = data.id;
          const updatedList = this.getInstantIssues().map((i) => (i.stt === savedItem.stt ? savedItem : i));
          this.setLocalIssues(updatedList);
        }
      }
    } catch (e) {
      console.warn('Supabase issue sync warning (using localStorage):', e);
    }

    return savedItem;
  },

  async updateStatus(id: string, status: IssueStatus): Promise<void> {
    const current = this.getInstantIssues();
    const nextList = current.map((i) => (i.id === id ? { ...i, status, updatedAt: new Date().toISOString() } : i));
    this.setLocalIssues(nextList);

    try {
      const supabase = getBrowserClient();
      await supabase.from('system_issues').update({ status }).eq('id', id);
    } catch {}
  },

  async deleteIssue(id: string): Promise<void> {
    const current = this.getInstantIssues();
    const filtered = current.filter((i) => i.id !== id);
    // Re-index STT sequentially
    const reindexed = filtered.map((item, idx) => ({ ...item, stt: idx + 1 }));
    this.setLocalIssues(reindexed);

    try {
      const supabase = getBrowserClient();
      await supabase.from('system_issues').delete().eq('id', id);
    } catch {}
  },
};
