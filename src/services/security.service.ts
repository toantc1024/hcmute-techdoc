/**
 * Security Service - HCMUTE TechDoc
 * 
 * NOTICE: Legacy client-side pseudo-authentication (sessionStorage, SHA-256 password hash)
 * has been decommissioned. Real authentication is handled authoritatively by Supabase Auth
 * and Server Components via HttpOnly SSR cookie sessions.
 * 
 * Rule 15: Strictly under 300 lines (< 300).
 */

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'SESSION_TIMEOUT' | 'CONTENT_TOGGLE' | 'CRITERIA_CHANGE' | 'UNIT_UPDATE';
  actor: string;
  detail: string;
  status: 'info' | 'warning' | 'danger';
}

const STORAGE_KEYS = {
  AUDIT_LOGS: 'hcmute_techdoc_admin_audit_logs',
};

export async function hashSha256(plainText: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const securityService = {
  /**
   * @deprecated Decommissioned. Supabase Auth handles password verification server-side.
   */
  async verifyPassword(): Promise<boolean> {
    return false;
  },

  /**
   * @deprecated Decommissioned. SSR cookie session is now authoritative.
   */
  isValidSession(): boolean {
    return false;
  },

  /**
   * @deprecated Decommissioned.
   */
  createSession(): void {},

  /**
   * @deprecated Decommissioned.
   */
  clearSession(): void {},

  /**
   * @deprecated Decommissioned.
   */
  touchSession(): void {},

  /**
   * @deprecated Decommissioned.
   */
  getLockRemainingSeconds(): number {
    return 0;
  },

  /**
   * @deprecated Decommissioned.
   */
  getFailedAttempts(): number {
    return 0;
  },

  getAuditLogs(): AuditLogItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addAuditLog(action: AuditLogItem['action'], detail: string, status: AuditLogItem['status'] = 'info'): void {
    if (typeof window === 'undefined') return;
    try {
      const logs = this.getAuditLogs();
      const newLog: AuditLogItem = {
        id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toLocaleString('vi-VN'),
        action,
        actor: 'authenticated_user',
        detail,
        status,
      };
      const updated = [newLog, ...logs].slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
    } catch {
      // Non-blocking fallback
    }
  },
};
