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
import { AdminHeader } from './AdminHeader';
import { AdminContentManager } from './AdminContentManager';
import { AdminAnalyticsView } from './AdminAnalyticsView';
import { AdminProgressManager } from './AdminProgressManager';
import { AdminUnitDashboard } from './AdminUnitDashboard';
import { AdminSecurityModal } from './AdminSecurityModal';

interface AdminDashboardClientProps {
  user: { id: string; email: string };
  role: 'admin' | 'evaluator';
}

export const AdminDashboardClient: React.FC<AdminDashboardClientProps> = ({ user, role }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('units');
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [sections, setSections] = useState<DocSectionItem[]>([]);
  const [criteria, setCriteria] = useState<EvaluationCriterion[]>([]);
  const [units, setUnits] = useState<UnitWebsiteItem[]>([]);
  const [phases, setPhases] = useState<ProjectPhase[]>([]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
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
    // 1. Optimistic UI update
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id !== unitId) return u;
        const nextRatings = { ...u.criteriaRatings, [criterionId]: rating };
        return { ...u, criteriaRatings: nextRatings };
      })
    );

    // 2. Persist to Supabase under RLS
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
  const totalUnits = units.length;
  const avgScore = units.length > 0 ? Math.round(units.reduce((sum, u) => sum + u.completenessScore, 0) / units.length) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1525] text-foreground pb-16">
      <AdminHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReset={loadData}
        onLogout={handleLogout}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
        userEmail={user.email}
        userRole={role}
        totalViews={totalViews}
        totalUnits={totalUnits}
        avgScore={avgScore}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 space-y-4">
            <div className="animate-spin size-8 border-3 border-[#0072BC] border-t-transparent rounded-full" />
            <p className="text-sm text-muted-foreground font-medium">Đang tải dữ liệu từ Supabase Cloud...</p>
          </div>
        ) : (
          <>
            {activeTab === 'content' && (
              <AdminContentManager
                sections={sections}
                onToggleVisibility={handleToggleDocSectionVisibility}
                onUpdateSection={handleUpdateDocSection}
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

            {activeTab === 'units' && (
              <AdminUnitDashboard
                units={units}
                criteria={criteria}
                onUpdateRating={handleUpdateUnitRating}
                onUpdateNote={handleUpdateUnitNote}
              />
            )}
          </>
        )}
      </main>

      <AdminSecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </div>
  );
};
