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

interface AdminDashboardClientProps {
  user: { id: string; email: string };
  role: 'admin' | 'evaluator';
}

export const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({ user, role }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  const initial = techdocsDbService.getInstantData();
  const [isLoading, setIsLoading] = useState(!initial.fromDatabase && initial.units.length === 0);

  const [sections, setSections] = useState<DocSectionItem[]>(initial.sections);
  const [criteria, setCriteria] = useState<EvaluationCriterion[]>(initial.criteria);
  const [units, setUnits] = useState<UnitWebsiteItem[]>(initial.units);
  const [phases, setPhases] = useState<ProjectPhase[]>(initial.phases);

  const loadData = useCallback(async () => {
    const data = await techdocsDbService.fetchDashboardData();
    setSections(data.sections);
    setCriteria(data.criteria);
    setUnits(data.units);
    setPhases(data.phases);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = async () => {
    try {
      const supabase = getBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('hcmute_techdoc_admin_auth_session');
      localStorage.removeItem('hcmute_techdoc_admin_auth_session');
    }
    router.replace('/login');
  };

  const handleUpdateUnitRating = async (unitId: number, criterionId: string, rating: CriterionRating) => {
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id !== unitId) return u;
        const nextRatings = { ...u.criteriaRatings, [criterionId]: rating };
        return { ...u, criteriaRatings: nextRatings };
      })
    );
    await techdocsDbService.updateUnitRatingItem(unitId, criterionId, rating);
  };

  const handleUpdateUnitNote = async (unitId: number, criterionId: string, note: string) => {
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id !== unitId) return u;
        const nextNotes = { ...(u.criteriaNotes || {}), [criterionId]: note };
        return { ...u, criteriaNotes: nextNotes };
      })
    );
    const targetUnit = units.find((u) => u.id === unitId);
    const currentRating = targetUnit?.criteriaRatings[criterionId] || 'warning';
    await techdocsDbService.updateUnitRatingItem(unitId, criterionId, currentRating, note);
  };

  const handleToggleUnitServerStatus = async (unitId: number) => {
    let nextVal = false;
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id !== unitId) return u;
        nextVal = !u.isNewWeb;
        return { ...u, isNewWeb: nextVal };
      })
    );
    await techdocsDbService.updateUnitServerStatus(unitId, nextVal);
  };

  const handleToggleDocSectionVisibility = async (id: string) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, isVisible: !s.isVisible } : s));
    setSections(updated);
    const target = updated.find((s) => s.id === id);
    if (target) await techdocsDbService.updateDocSection(target);
  };

  const handleUpdateDocSection = async (updated: DocSectionItem) => {
    const list = sections.map((s) => (s.id === updated.id ? updated : s));
    setSections(list);
    await techdocsDbService.updateDocSection(updated);
  };

  const totalViews = sections.reduce((sum, s) => sum + s.viewCount, 0);
  const totalChapters = new Set(sections.map((s) => s.chapterNumber)).size || 8;
  const avgScore = units.length > 0 ? Math.round(units.reduce((sum, u) => sum + u.completenessScore, 0) / units.length) : 72;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1525] text-foreground flex flex-col">
      {/* Top Header Bar with Edge-to-Edge Navigation */}
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

      {/* Main Content Workspace - Institutional Layout max-w-[1440px] */}
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
                units={units}
                criteria={criteria}
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
                units={units}
                criteria={criteria}
                onUpdateRating={handleUpdateUnitRating}
                onUpdateNote={handleUpdateUnitNote}
                onToggleServerStatus={handleToggleUnitServerStatus}
              />
            )}

            {activeTab === 'analytics' && (
              <AdminAnalyticsView
                sections={sections}
                onUpdateSections={setSections}
              />
            )}

            {activeTab === 'progress' && (
              <AdminProgressManager
                phases={phases}
                criteria={criteria}
                onAddCriterion={(c) => setCriteria((prev) => [...prev, { ...c, id: `crit_${Date.now()}` }])}
                onUpdateCriterion={(c) => setCriteria((prev) => prev.map((item) => (item.id === c.id ? c : item)))}
                onDeleteCriterion={(id) => setCriteria((prev) => prev.filter((item) => item.id !== id))}
              />
            )}

            {activeTab === 'content' && (
              <AdminContentManager
                sections={sections}
                onToggleVisibility={handleToggleDocSectionVisibility}
                onUpdateSection={handleUpdateDocSection}
              />
            )}
          </>
        )}
      </main>

      {/* Security & RLS Modal */}
      <AdminSecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </div>
  );
};
