'use client';

import React, { useState, useEffect } from 'react';
import { getBrowserClient } from '@/lib/supabase/client';
import { securityService, AuditLogItem } from '@/services/security.service';

interface AdminSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSecurityModal: React.FC<AdminSecurityModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const supabase = getBrowserClient();
        const { data: dbLogs, error } = await supabase
          .from('audit_logs')
          .select('id, created_at, action, detail, status_level, source, actor_id')
          .order('created_at', { ascending: false })
          .limit(25);

        if (!error && dbLogs && dbLogs.length > 0) {
          const mapped: AuditLogItem[] = (dbLogs as Array<Record<string, unknown>>).map((l) => ({
            id: String(l.id),
            timestamp: new Date(String(l.created_at)).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
            }),
            action: String(l.action) as AuditLogItem['action'],
            actor: l.source === 'system' ? 'system' : l.actor_id ? 'authenticated_user' : 'anon',
            detail: String(l.detail || ''),
            status: (l.status_level as AuditLogItem['status']) || 'info',
          }));
          setLogs(mapped);
        } else {
          setLogs(securityService.getAuditLogs());
        }
      } catch {
        setLogs(securityService.getAuditLogs());
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-50 text-[#0072BC] dark:bg-blue-950 dark:text-sky-300">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#004776] dark:text-foreground">
                Trung tâm giám sát & Biện pháp an ninh
              </h3>
              <p className="text-xs text-muted-foreground">
                Tiêu chuẩn an toàn dữ liệu & Row Level Security (RLS) HCMUTE TechDoc
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-[#004776]"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Security Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-emerald-200/60 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20">
              <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <span>✓ Supabase SSR Session Cookie</span>
              </div>
              <p className="text-muted-foreground mt-1">
                Xác thực máy chủ với JWT HttpOnly cookie, loại bỏ hoàn toàn mật mã tĩnh client hay sessionStorage.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-blue-200/60 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20">
              <div className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                <span>✓ Row Level Security (RLS)</span>
              </div>
              <p className="text-muted-foreground mt-1">
                Mặc định từ chối (Default Deny) trên toàn bộ 10 bảng dữ liệu TechDocs, cách ly tuyệt đối với ứng dụng khác.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-indigo-200/60 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20">
              <div className="font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5">
                <span>✓ RBAC Phân quyền Vai trò</span>
              </div>
              <p className="text-muted-foreground mt-1">
                Phân quyền độc lập (Admin / Evaluator). Chống tự nâng quyền và chống can thiệp trạng thái xuất bản.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-purple-200/60 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20">
              <div className="font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                <span>✓ Nhật ký kiểm toán bất biến</span>
              </div>
              <p className="text-muted-foreground mt-1">
                Bảo vệ bởi Database Triggers: cấm sửa, cấm xóa nhật ký và cưỡng chế thời gian authoritative server now().
              </p>
            </div>
          </div>

          {/* Audit Trail Log */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#004776] dark:text-foreground">
                Nhật ký kiểm toán an ninh (Audit Logs - {logs.length} sự kiện)
              </h4>
              {isLoading && <span className="text-xs text-muted-foreground animate-pulse">Đang tải...</span>}
            </div>

            <div className="border border-border rounded-xl divide-y divide-border/60 max-h-56 overflow-y-auto bg-background text-xs">
              {logs.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Chưa có sự kiện an ninh nào được ghi nhận.
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="p-3 flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-2 rounded-full ${
                            log.status === 'danger'
                              ? 'bg-rose-500'
                              : log.status === 'warning'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <span className="font-semibold text-[#004776] dark:text-foreground">
                          {log.action}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          [{log.actor}]
                        </span>
                      </div>
                      <p className="text-muted-foreground">{log.detail}</p>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                      {log.timestamp}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-border/80 bg-muted/20">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 rounded-xl text-sm font-semibold bg-[#0072BC] text-white hover:bg-[#005a96] transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
