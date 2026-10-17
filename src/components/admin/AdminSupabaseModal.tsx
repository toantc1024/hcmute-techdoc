'use client';

import React, { useState, useEffect } from 'react';
import { brandConfig } from '@/configs/app.config';
import { getSupabaseCredentials, saveSupabaseCredentials } from '@/lib/supabase';
import { supabaseService, SUPABASE_SQL_INIT } from '@/services/supabase.service';
import { adminService } from '@/services/admin.service';

interface AdminSupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataSynced?: () => void;
}

export const AdminSupabaseModal: React.FC<AdminSupabaseModalProps> = ({
  isOpen,
  onClose,
  onDataSynced,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showSql, setShowSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setUrl(creds.url);
      setAnonKey(creds.anonKey);
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfigured = Boolean(url.trim() && anonKey.trim());

  const handleSave = () => {
    saveSupabaseCredentials(url, anonKey);
    setStatusType('success');
    setStatusMessage('Đã lưu thông tin cấu hình Supabase vào trình duyệt!');
  };

  const handleTestConnection = async () => {
    saveSupabaseCredentials(url, anonKey);
    setIsLoading(true);
    setStatusMessage('Đang kết nối đến cơ sở dữ liệu Supabase...');
    setStatusType('info');

    const res = await supabaseService.testConnection();
    setIsLoading(false);
    setStatusType(res.ok ? 'success' : 'error');
    setStatusMessage(res.message);
  };

  const handlePushToCloud = async () => {
    saveSupabaseCredentials(url, anonKey);
    setIsLoading(true);
    setStatusMessage('Đang tải dữ liệu hiện tại lên Supabase Cloud...');
    setStatusType('info');

    const res = await supabaseService.syncAllToRemote({
      units: adminService.getUnits(),
      criteria: adminService.getCriteria(),
      sections: adminService.getDocSections(),
      phases: adminService.getPhases(),
      viewsStartDate: adminService.getViewsStartDate(),
    });

    setIsLoading(false);
    setStatusType(res.ok ? 'success' : 'error');
    setStatusMessage(res.message);
  };

  const handlePullFromCloud = async () => {
    saveSupabaseCredentials(url, anonKey);
    setIsLoading(true);
    setStatusMessage('Đang tải dữ liệu mới nhất từ Supabase Cloud về...');
    setStatusType('info');

    const remote = await supabaseService.fetchAllRemote();
    setIsLoading(false);

    if (!remote || !remote.units) {
      setStatusType('error');
      setStatusMessage('Không tìm thấy dữ liệu trên Supabase hoặc chưa tạo bảng.');
      return;
    }

    if (remote.units) adminService.saveUnits(remote.units);
    if (remote.criteria) adminService.saveCriteria(remote.criteria);
    if (remote.sections) adminService.saveDocSections(remote.sections);
    if (remote.viewsStartDate) {
      localStorage.setItem('hcmute_techdoc_views_start_date', remote.viewsStartDate);
    }

    setStatusType('success');
    setStatusMessage('Đã cập nhật dữ liệu từ Supabase Cloud về máy thành công!');
    if (onDataSynced) onDataSynced();
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_INIT);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white dark:bg-[#132238] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white dark:bg-blue-950/60 p-1 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-center">
              <img src={brandConfig.logoUrl} alt="HCM-UTE Logo" className="size-7 object-contain" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#004776] dark:text-foreground">
                Kết nối Cơ sở dữ liệu Supabase Cloud
              </h2>
              <p className="text-xs text-muted-foreground">
                Đồng bộ hóa 51 website, tiêu chí và lượt xem giữa các máy tính thời gian thực
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-muted-foreground text-xs font-semibold"
          >
            ✕
          </button>
        </div>

        {/* Status Card */}
        <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
          isConfigured
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
            : 'bg-amber-50/70 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200'
        }`}>
          <div className="flex items-center gap-2 font-bold mb-1">
            <span className={`size-2.5 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{isConfigured ? 'Đã thiết lập thông số Supabase' : 'Chưa thiết lập kết nối Supabase (Đang lưu cục bộ localStorage)'}</span>
          </div>
          <p>
            Khi kết nối Supabase, các cán bộ quản trị mở web trên các thiết bị khác nhau đều sẽ tự động thấy điểm chấm và ghi chú mới nhất của nhau.
          </p>
        </div>

        {/* Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#004776] dark:text-foreground mb-1">
              Supabase Project URL *
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-xs font-mono text-[#004776] dark:text-foreground focus:ring-2 focus:ring-[#0072BC]/20 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#004776] dark:text-foreground mb-1">
              Supabase Anon / Public Key *
            </label>
            <input
              type="text"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-background text-xs font-mono text-[#004776] dark:text-foreground focus:ring-2 focus:ring-[#0072BC]/20 outline-none"
            />
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div className={`p-3 rounded-lg border text-xs ${
            statusType === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' :
            statusType === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300' :
            'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
          }`}>
            {statusMessage}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleSave}
            className="h-9 px-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-xs font-semibold text-[#004776] dark:text-sky-300 transition-colors"
          >
            💾 Lưu cấu hình
          </button>
          <button
            type="button"
            disabled={isLoading || !isConfigured}
            onClick={handleTestConnection}
            className="h-9 px-3.5 rounded-lg bg-[#0072BC] hover:bg-[#005a96] text-white text-xs font-semibold disabled:opacity-50 transition-colors shadow-2xs"
          >
            {isLoading ? 'Đang kiểm tra...' : '🔌 Kiểm tra kết nối'}
          </button>
          <button
            type="button"
            disabled={isLoading || !isConfigured}
            onClick={handlePushToCloud}
            className="h-9 px-3.5 rounded-lg border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold disabled:opacity-50 transition-colors"
            title="Tải toàn bộ số liệu 51 website, tiêu chí và lượt xem từ máy này lên Supabase"
          >
            ⬆ Đẩy dữ liệu lên Cloud
          </button>
          <button
            type="button"
            disabled={isLoading || !isConfigured}
            onClick={handlePullFromCloud}
            className="h-9 px-3.5 rounded-lg border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 text-xs font-semibold disabled:opacity-50 transition-colors"
            title="Đồng bộ dữ liệu mới nhất từ Supabase về máy này"
          >
            ⬇ Tải từ Cloud về máy
          </button>
        </div>

        {/* Collapsible SQL Setup */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowSql(!showSql)}
              className="text-xs font-semibold text-[#0072BC] dark:text-sky-400 hover:underline inline-flex items-center gap-1"
            >
              <span>{showSql ? '▲ Ẩn hướng dẫn SQL' : '▼ Hướng dẫn tạo bảng trên Supabase (Click để xem)'}</span>
            </button>
            <button
              type="button"
              onClick={handleCopySql}
              className="text-xs text-muted-foreground hover:text-[#004776] underline"
            >
              {isCopied ? '✓ Đã sao chép SQL!' : 'Sao chép mã SQL'}
            </button>
          </div>

          {showSql && (
            <div className="mt-2 p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed space-y-2">
              <div className="text-slate-400">// Copy đoạn mã sau dán vào tab "SQL Editor" trên trang Supabase của bạn rồi bấm "Run":</div>
              <pre>{SUPABASE_SQL_INIT}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
