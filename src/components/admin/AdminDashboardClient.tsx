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
        if (Array.isArray(data.sections) && data.sections.length > 0) setSections(data.sections);
        if (Array.isArray(data.criteria) && data.criteria.length > 0) setCriteria(data.criteria);
        if (Array.isArray(data.units) && data.units.length > 0) setUnits(data.units);
        if (Array.isArray(data.phases) && data.phases.length > 0) setPhases(data.phases);
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
      if (supabase && typeof supabase.channel === 'function') {
        channel = supabase.channel('techdocs_realtime_sync');
        channel
          .on('postgres_changes', { event: '*', schema: 'public', table: 'doc_sections' }, () => loadData())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'unit_ratings' }, () => loadData())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'unit_rating_items' }, () => loadData())
          .on('postgres_changes', { event: '*', schema: 'public', table: 'organizational_units' }, () => loadData())
          .on('broadcast', { event: 'view_sync' }, (payload: any) => {
            if (payload?.payload?.sections && Array.isArray(payload.payload.sections)) setSections(payload.payload.sections);
          })
          .subscribe();
      }
    } catch {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'hcmute_techdoc_views_is_reset' || e.key === 'hcmute_techdoc_live_views' || e.key?.includes('cache')) {
        loadData();
      }
    };
    const handleViewUpdate = (e: Event) => {
      const ce = e as CustomEvent<{ updated: DocSectionItem[] }>;
      if (ce.detail?.updated && Array.isArray(ce.detail.updated)) setSections(ce.detail.updated);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('hcmute_techdoc_view_increment', handleViewUpdate);
    window.addEventListener('hcmute_techdoc_view_reset', handleViewUpdate);

    return () => {
      try {
        if (channel) {
          const supabase = getBrowserClient();
          supabase.removeChannel(channel);
        }
      } catch {}
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('hcmute_techdoc_view_increment', handleViewUpdate);
      window.removeEventListener('hcmute_techdoc_view_reset', handleViewUpdate);
    };
  }, [loadData]);

  const handleLogout = async () => {
    try {
      const supabase = getBrowserClient();
      await supabase.auth.signOut();
    } catch {}
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('hcmute_techdoc_admin_auth_session');
      localStorage.removeItem('hcmute_techdoc_admin_auth_session');
    }
    router.replace('/login');
  };

  const handleUpdateUnitRating = async (unitId: number, criterionId: string, rating: CriterionRating) => {
    setUnits((prev) =>
      prev.map((u) => (u.id !== unitId ? u : { ...u, criteriaRatings: { ...u.criteriaRatings, [criterionId]: rating } }))
    );
    await techdocsDbService.updateUnitRatingItem(unitId, criterionId, rating);
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

  const handleExecuteConfirmedStatus = async () => {
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
                units={safeUnits}
                criteria={safeCriteria}
                totalViews={totalViews}
                totalChapters={totalChapters}
                onUpdateRating={handleUpdateUnitRating}
                onUpdateNote={handleUpdateUnitNote}
                onToggleServerStatus={handleToggleUnitServerStatus}
                onSwitchToUnitsTab={() => setActiveTab('units')}
              />
            )}
            {activeTab === 'units' && (
              <AdminUnitDashboard
                units={safeUnits}
                criteria={safeCriteria}
                onUpdateRating={handleUpdateUnitRating}
                onUpdateNote={handleUpdateUnitNote}
                onToggleServerStatus={handleToggleUnitServerStatus}
              />
            )}
            {activeTab === 'analytics' && (
              <AdminAnalyticsView sections={safeSections} onUpdateSections={setSections} />
            )}
            {activeTab === 'progress' && (
              <AdminProgressManager
                phases={safePhases}
                criteria={safeCriteria}
                onAddCriterion={(c) => setCriteria((prev) => [...prev, { ...c, id: `crit_${Date.now()}` }])}
                onUpdateCriterion={(c) => setCriteria((prev) => prev.map((item) => (item.id === c.id ? c : item)))}
                onDeleteCriterion={(id) => setCriteria((prev) => prev.filter((item) => item.id !== id))}
              />
            )}
            {activeTab === 'content' && (
              <AdminContentManager
                sections={safeSections}
                onToggleVisibility={handleToggleDocSectionVisibility}
                onUpdateSection={handleUpdateDocSection}
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
