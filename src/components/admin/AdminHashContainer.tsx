'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  DocSectionItem,
  EvaluationCriterion,
  UnitWebsiteItem,
  ProjectPhase,
  AdminTab,
  CriterionRating,
} from '@/models/admin.model';
import { adminService } from '@/services/admin.service';
import { securityService } from '@/services/security.service';
import { brandConfig } from '@/configs/app.config';
import { AdminLoginForm } from './AdminLoginForm';
import { AdminHeader } from './AdminHeader';
import { AdminContentManager } from './AdminContentManager';
import { AdminAnalyticsView } from './AdminAnalyticsView';
import { AdminProgressManager } from './AdminProgressManager';
import { AdminUnitDashboard } from './AdminUnitDashboard';
import { AdminSecurityModal } from './AdminSecurityModal';

export const AdminHashContainer: React.FC = () => {
  const [isAdminHash, setIsAdminHash] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('content');
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  const [sections, setSections] = useState<DocSectionItem[]>([]);
  const [criteria, setCriteria] = useState<EvaluationCriterion[]>([]);
  const [units, setUnits] = useState<UnitWebsiteItem[]>([]);
  const [phases, setPhases] = useState<ProjectPhase[]>([]);

  // Lắng nghe thay đổi hash #/admin
  const checkHash = useCallback(() => {
    if (typeof window === 'undefined') return;
    const h = window.location.hash;
    const match = h === '#/admin' || h === '#admin';
    setIsAdminHash(match);
    if (match) {
      setIsAuthenticated(securityService.isValidSession());
    }
  }, []);

  useEffect(() => {
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [checkHash]);

  // Tải dữ liệu ban đầu
  const loadData = useCallback(() => {
    setSections(adminService.getDocSections());
    setCriteria(adminService.getCriteria());
    setUnits(adminService.getUnits());
    setPhases(adminService.getPhases());
  }, []);

  useEffect(() => {
    if (isAdminHash) {
      loadData();
    }
  }, [isAdminHash, loadData]);

  // Quản lý hết hạn phiên do bất hoạt (30 phút)
  useEffect(() => {
    if (!isAdminHash || !isAuthenticated) return;

    const handleUserActivity = () => {
      securityService.touchSession();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    const interval = setInterval(() => {
      if (!securityService.isValidSession()) {
        setIsAuthenticated(false);
        securityService.clearSession('Hết hạn phiên do bất hoạt 30 phút');
      }
    }, 15000);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      clearInterval(interval);
    };
  }, [isAdminHash, isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    loadData();
  };

  const handleLogout = () => {
    securityService.clearSession('Đăng xuất chủ động');
    setIsAuthenticated(false);
  };

  const handleCloseToHome = () => {
    window.location.hash = '';
  };

  const handleResetData = () => {
    if (confirm('Bạn có chắc chắn muốn khôi phục toàn bộ dữ liệu mặc định ban đầu theo biên bản rà soát?')) {
      adminService.resetToDefault();
      loadData();
      securityService.addAuditLog('UNIT_UPDATE', 'admin', 'Khôi phục dữ liệu hệ thống về mặc định', 'warning');
    }
  };

  if (!isAdminHash) return null;

  const totalViews = sections.reduce((acc, s) => acc + s.viewCount, 0);
  const avgScore = units.length > 0
    ? Math.round(units.reduce((acc, u) => acc + u.completenessScore, 0) / units.length)
    : 0;

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto bg-[#fafbfc] dark:bg-[#0b1523] text-[#004776] dark:text-foreground min-h-screen">
      {/* Top Floating Exit Bar */}
      <div className="sticky top-0 z-40 bg-[#004776] text-white px-4 py-2 text-xs flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 font-semibold">
          <img
            src={brandConfig.logoUrl}
            alt="HCM-UTE"
            className="size-5 object-contain"
          />
          <span className="tracking-wide">HCM-UTE TECH DOC</span>
        </div>
        <button
          type="button"
          onClick={handleCloseToHome}
          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium text-white flex items-center gap-1"
        >
          <span>✕ Thoát về trang chủ</span>
        </button>
      </div>

      {!isAuthenticated ? (
        <div className="min-h-[calc(100vh-45px)] bg-[#f8fafc] dark:bg-[#0b1523] flex items-center justify-center p-4">
          <AdminLoginForm onLoginSuccess={handleLoginSuccess} />
        </div>
      ) : (
        <div className="pb-16">
          <AdminHeader
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onReset={handleResetData}
            onLogout={handleLogout}
            onOpenSecurity={() => setIsSecurityModalOpen(true)}
            totalViews={totalViews}
            totalUnits={units.length}
            avgScore={avgScore}
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-6">
            {activeTab === 'content' && (
              <AdminContentManager
                sections={sections}
                onToggleVisibility={(id) => {
                  const updated = adminService.toggleDocSectionVisibility(id);
                  setSections(updated);
                  securityService.addAuditLog('CONTENT_TOGGLE', 'admin', `Đổi trạng thái hiển thị mục ${id}`);
                }}
                onUpdateSection={(updated) => {
                  const list = adminService.updateDocSection(updated);
                  setSections(list);
                  securityService.addAuditLog('CONTENT_TOGGLE', 'admin', `Chỉnh sửa nội dung mục ${updated.pageTitle}`);
                }}
              />
            )}

            {activeTab === 'analytics' && (
              <AdminAnalyticsView sections={sections} onUpdateSections={setSections} />
            )}

            {activeTab === 'progress' && (
              <AdminProgressManager
                phases={phases}
                criteria={criteria}
                onAddCriterion={(data) => {
                  const updated = adminService.addCriterion(data);
                  setCriteria(updated);
                  setUnits(adminService.getUnits());
                  securityService.addAuditLog('CRITERIA_CHANGE', 'admin', `Thêm tiêu chí mới: ${data.name}`);
                }}
                onUpdateCriterion={(c) => {
                  const updated = adminService.updateCriterion(c);
                  setCriteria(updated);
                  setUnits(adminService.getUnits());
                  securityService.addAuditLog('CRITERIA_CHANGE', 'admin', `Cập nhật tiêu chí: ${c.name}`);
                }}
                onDeleteCriterion={(id) => {
                  const updated = adminService.deleteCriterion(id);
                  setCriteria(updated);
                  setUnits(adminService.getUnits());
                  securityService.addAuditLog('CRITERIA_CHANGE', 'admin', `Xóa tiêu chí ${id}`, 'warning');
                }}
              />
            )}

            {activeTab === 'units' && (
              <AdminUnitDashboard
                units={units}
                criteria={criteria}
                onUpdateRating={(unitId, critId, rating) => {
                  const updated = adminService.updateUnitRating(unitId, critId, rating);
                  setUnits(updated);
                  securityService.addAuditLog('UNIT_UPDATE', 'admin', `Đơn vị #${unitId}: ${critId} -> ${rating}`);
                }}
                onUpdateNote={(unitId, critId, note) => {
                  const updated = adminService.updateUnitCriterionNote(unitId, critId, note);
                  setUnits(updated);
                }}
              />
            )}
          </main>

          <AdminSecurityModal
            isOpen={isSecurityModalOpen}
            onClose={() => setIsSecurityModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};
