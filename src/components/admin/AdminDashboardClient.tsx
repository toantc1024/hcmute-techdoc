'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  DocSectionItem,
  EvaluationCriterion,
  UnitWebsiteItem,
  ProjectPhase,
  AdminTab,
  CriterionRating,
} from '@/models/admin.model';
import { techdocsDbService } from '@/services/techdocs-db.service';
import { computeUnitScore } from '@/services/admin.service';
import { getBrowserClient } from '@/lib/supabase/client';
import { AdminTopBar } from './AdminTopBar';
import { AdminOverviewView } from './AdminOverviewView';
import { AdminUnitDashboard } from './AdminUnitDashboard';
import { AdminAnalyticsView } from './AdminAnalyticsView';
import { AdminProgressManager } from './AdminProgressManager';
import { AdminContentManager } from './AdminContentManager';
import { AdminSecurityModal } from './AdminSecurityModal';
import { AdminStatusConfirmModal, StatusConfirmData } from './AdminStatusConfirmModal';

interface AdminDashboardClientProps {
  user: { id: string; email: string };
  role: 'admin' | 'evaluator';
}

export const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({ user, role }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState<StatusConfirmData | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const initial = techdocsDbService.getInstantData();
  const [isLoading, setIsLoading] = useState(!initial.fromDatabase && (!initial.units || initial.units.length === 0));

  const [sections, setSections] = useState<DocSectionItem[]>(Array.isArray(initial?.sections) ? initial.sections : []);
  const [criteria, setCriteria] = useState<EvaluationCriterion[]>(Array.isArray(initial?.criteria) ? initial.criteria : []);
  const [units, setUnits] = useState<UnitWebsiteItem[]>(Array.isArray(initial?.units) ? initial.units : []);
  const [phases, setPhases] = useState<ProjectPhase[]>(Array.isArray(initial?.phases) ? initial.phases : []);

  const loadData = useCallback(async () => {
    try {
      const data = await techdocsDbService.fetchDashboardData();
      if (data) {
        if (data.sections?.length) setSections(data.sections);
        if (data.criteria?.length) setCriteria(data.criteria);
        if (data.units?.length) setUnits(data.units);
        if (data.phases?.length) setPhases(data.phases);
      }
    } catch {} finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    let channel: any = null;
    try {
      const supabase = getBrowserClient();
      if (supabase?.channel) {
        channel = supabase.channel('techdocs_realtime_sync');
        ['doc_sections', 'unit_ratings', 'unit_rating_items', 'organizational_units'].forEach((tbl) => {
          channel.on('postgres_changes', { event: '*', schema: 'public', table: tbl }, () => loadData());
        });
        channel.on('broadcast', { event: 'view_sync' }, (p: any) => {
          if (p?.payload?.sections && Array.isArray(p.payload.sections)) setSections(p.payload.sections);
        }).subscribe();
      }
    } catch {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'hcmute_techdoc_views_is_reset' || e.key === 'hcmute_techdoc_live_views' || e.key?.includes('cache')) loadData();
    };
    const handleViewUpdate = (e: Event) => {
      const ce = e as CustomEvent<{ updated: DocSectionItem[] }>;
      if (ce.detail?.updated && Array.isArray(ce.detail.updated)) setSections(ce.detail.updated);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('hcmute_techdoc_view_increment', handleViewUpdate);
    window.addEventListener('hcmute_techdoc_view_reset', handleViewUpdate);

    return () => {
      try { if (channel) getBrowserClient()?.removeChannel(channel); } catch {}
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('hcmute_techdoc_view_increment', handleViewUpdate);
      window.removeEventListener('hcmute_techdoc_view_reset', handleViewUpdate);
    };
  }, [loadData]);

  const handleLogout = async () => {
    try { await getBrowserClient()?.auth.signOut(); } catch {}
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('hcmute_techdoc_admin_auth_session');
      localStorage.removeItem('hcmute_techdoc_admin_auth_session');
    }
    router.replace('/login');
  };

  const handleUpdateUnitRating = (unitId: number, criterionId: string, rating: CriterionRating) => {
    const target = units.find((u) => u.id === unitId);
    if (!target) return;
    const crit = criteria.find((c) => c.id === criterionId || c.code === criterionId);
    const cur = target.criteriaRatings?.[criterionId] || target.criteriaRatings?.[crit?.id || ''] || 'warning';
    if (cur === rating) return;

    const ratingMap: Record<CriterionRating, string> = {
      pass: '✓ Đạt (100% điểm)',
      warning: '◐ Cần sửa (50% điểm)',
      fail: '✕ Chưa đạt (0% điểm)',
      none: '— Chưa chấm',
    };

    setPendingConfirm({
      type: 'unit_rating',
      id: unitId,
      criterionId: crit?.code || criterionId,
      ratingValue: rating,
      name: target.name,
      subText: crit ? `Tiêu chí [${crit.code}] ${crit.name} (${crit.weight}%)` : `Tiêu chí ${criterionId}`,
      currentLabel: ratingMap[cur || 'none'] || (cur || '— Chưa chấm'),
      nextLabel: ratingMap[rating] || rating,
      isPositive: rating === 'pass',
    });
  };

  const handleUpdateUnitNote = async (unitId: number, criterionId: string, note: string) => {
    setUnits((prev) =>
      prev.map((u) => (u.id !== unitId ? u : { ...u, criteriaNotes: { ...(u.criteriaNotes || {}), [criterionId]: note } }))
    );
    const target = units.find((u) => u.id === unitId);
    await techdocsDbService.updateUnitRatingItem(unitId, criterionId, target?.criteriaRatings[criterionId] || 'warning', note);
  };

  const handleToggleUnitServerStatus = (unitId: number) => {
    const target = units.find((u) => u.id === unitId);
    if (!target) return;
    setPendingConfirm({
      type: 'unit_server',
      id: unitId,
      name: target.name,
      subText: target.domain,
      currentLabel: target.isNewWeb ? 'Web mới (.189)' : 'Web cũ (.181)',
      nextLabel: target.isNewWeb ? 'Web cũ (.181)' : 'Web mới (.189)',
      isPositive: !target.isNewWeb,
    });
  };

  const handleToggleDocSectionVisibility = (id: string) => {
    const target = sections.find((s) => s.id === id);
    if (!target) return;
    setPendingConfirm({
      type: 'section_visibility',
      id,
      name: target.pageTitle,
      subText: `${target.chapterTitle} • ID: ${target.id}`,
      currentLabel: target.isVisible ? 'Đang hiển thị' : 'Đang tạm ẩn',
      nextLabel: target.isVisible ? 'Tạm ẩn' : 'Hiển thị',
      isPositive: !target.isVisible,
    });
  };

  const handleExecuteConfirmedStatus = async (overrideRating?: CriterionRating) => {
    if (!pendingConfirm) return;
    setIsConfirming(true);
    try {
      if (pendingConfirm.type === 'unit_server') {
        const unitId = Number(pendingConfirm.id);
        let nextVal = false;
        setUnits((prev) =>
          prev.map((u) => {
            if (u.id !== unitId) return u;
            nextVal = !u.isNewWeb;
            return { ...u, isNewWeb: nextVal };
          })
        );
        await techdocsDbService.updateUnitServerStatus(unitId, nextVal);
      } else if (pendingConfirm.type === 'unit_rating') {
        const unitId = Number(pendingConfirm.id);
        const critId = pendingConfirm.criterionId!;
        const rating: CriterionRating = overrideRating || pendingConfirm.ratingValue || 'pass';
        setUnits((prev) =>
          prev.map((u) => {
            if (u.id !== unitId) return u;
            const nextRatings = { ...u.criteriaRatings };
            if (rating === 'none') {
              delete nextRatings[critId];
            } else {
              nextRatings[critId] = rating;
            }
            return { ...u, criteriaRatings: nextRatings, completenessScore: computeUnitScore(nextRatings, criteria) };
          })
        );
        await techdocsDbService.updateUnitRatingItem(unitId, critId, rating);
      } else if (pendingConfirm.type === 'section_visibility') {
        const sectionId = String(pendingConfirm.id);
        let updatedTarget: DocSectionItem | undefined;
        setSections((prev) => {
          const nextList = prev.map((s) => (s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s));
          updatedTarget = nextList.find((s) => s.id === sectionId);
          return nextList;
        });
        if (updatedTarget) await techdocsDbService.updateDocSection(updatedTarget);
      }
    } catch (e) {
      console.error('Execute status change error:', e);
    } finally {
      setIsConfirming(false);
      setPendingConfirm(null);
    }
  };

  const handleUpdateDocSection = async (updated: DocSectionItem) => {
    setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    await techdocsDbService.updateDocSection(updated);
  };

  const safeSections = Array.isArray(sections) ? sections : [];
  const safeUnits = Array.isArray(units) ? units : [];
  const safeCriteria = Array.isArray(criteria) ? criteria : [];
  const safePhases = Array.isArray(phases) ? phases : [];

  const totalViews = safeSections.reduce((sum, s) => sum + (s?.viewCount || 0), 0);
  const totalChapters = new Set(safeSections.map((s) => s?.chapterNumber || 1)).size || 8;
  const avgScore = safeUnits.length > 0 ? Math.round(safeUnits.reduce((sum, u) => sum + (u?.completenessScore || 0), 0) / safeUnits.length) : 72;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1525] text-foreground flex flex-col">
      <AdminTopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
        onLogout={handleLogout}
        userEmail={user.email}
        userRole={role}
        totalViews={totalViews}
        avgScore={avgScore}
      />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-5 lg:px-6 py-6 pb-20">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="animate-spin size-10 border-4 border-[#0072BC] border-t-transparent rounded-full" />
            <p className="text-base text-muted-foreground font-semibold">Đang đồng bộ dữ liệu thời gian thực từ Supabase Cloud...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <AdminOverviewView
                units={safeUnits} criteria={safeCriteria} totalViews={totalViews} totalChapters={totalChapters}
                onUpdateRating={handleUpdateUnitRating} onUpdateNote={handleUpdateUnitNote}
                onToggleServerStatus={handleToggleUnitServerStatus} onSwitchToUnitsTab={() => setActiveTab('units')}
              />
            )}
            {activeTab === 'units' && (
              <AdminUnitDashboard
                units={safeUnits} criteria={safeCriteria}
                onUpdateRating={handleUpdateUnitRating} onUpdateNote={handleUpdateUnitNote}
                onToggleServerStatus={handleToggleUnitServerStatus}
              />
            )}
            {activeTab === 'analytics' && (
              <AdminAnalyticsView sections={safeSections} onUpdateSections={setSections} />
            )}
            {activeTab === 'progress' && (
              <AdminProgressManager
                phases={safePhases} criteria={safeCriteria}
                onAddCriterion={(c) => setCriteria((prev) => [...prev, { ...c, id: `crit_${Date.now()}` }])}
                onUpdateCriterion={(c) => setCriteria((prev) => prev.map((item) => (item.id === c.id ? c : item)))}
                onDeleteCriterion={(id) => setCriteria((prev) => prev.filter((item) => item.id !== id))}
              />
            )}
            {activeTab === 'content' && (
              <AdminContentManager
                sections={safeSections} onToggleVisibility={handleToggleDocSectionVisibility} onUpdateSection={handleUpdateDocSection}
              />
            )}
          </>
        )}
      </main>

      <AdminSecurityModal isOpen={isSecurityModalOpen} onClose={() => setIsSecurityModalOpen(false)} />
      <AdminStatusConfirmModal
        data={pendingConfirm}
        onConfirm={handleExecuteConfirmedStatus}
        onCancel={() => setPendingConfirm(null)}
        isLoading={isConfirming}
      />
    </div>
  );
};
