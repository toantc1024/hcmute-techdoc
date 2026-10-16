/**
 * Dịch vụ an ninh & Xác thực HCM-UTE TechDoc
 * Tuân thủ quy chuẩn bảo mật và giới hạn < 300 dòng mã
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
  AUTH_SESSION: 'hcmute_techdoc_admin_auth_session',
  ATTEMPTS: 'hcmute_techdoc_admin_failed_attempts',
  LOCK_UNTIL: 'hcmute_techdoc_admin_locked_until',
  AUDIT_LOGS: 'hcmute_techdoc_admin_audit_logs',
};

// SHA-256 băm của mật khẩu 'Hcmute@2026*#'
const REQUIRED_PASSWORD_HASH = '0a5de87db3d6c7d52645c1581269a880b1bbc613abc8e4c8e0f51c99753f8909';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 giây khóa
const SESSION_INACTIVITY_MS = 30 * 60 * 1000; // 30 phút tự động đăng xuất

export async function hashSha256(plainText: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const securityService = {
  async verifyPassword(inputPassword: string): Promise<boolean> {
    const hashed = await hashSha256(inputPassword);
    return hashed === REQUIRED_PASSWORD_HASH;
  },

  getFailedAttempts(): number {
    if (typeof window === 'undefined') return 0;
    return Number(sessionStorage.getItem(STORAGE_KEYS.ATTEMPTS) || '0');
  },

  getLockRemainingSeconds(): number {
    if (typeof window === 'undefined') return 0;
    const lockUntil = Number(sessionStorage.getItem(STORAGE_KEYS.LOCK_UNTIL) || '0');
    const remaining = Math.ceil((lockUntil - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
  },

  isAccountLocked(): boolean {
    return this.getLockRemainingSeconds() > 0;
  },

  recordFailedAttempt(): { remainingAttempts: number; isLocked: boolean; lockSeconds: number } {
    if (typeof window === 'undefined') return { remainingAttempts: 5, isLocked: false, lockSeconds: 0 };
    const current = this.getFailedAttempts() + 1;
    sessionStorage.setItem(STORAGE_KEYS.ATTEMPTS, String(current));

    if (current >= MAX_FAILED_ATTEMPTS) {
      const lockUntil = Date.now() + LOCKOUT_DURATION_MS;
      sessionStorage.setItem(STORAGE_KEYS.LOCK_UNTIL, String(lockUntil));
      this.addAuditLog('LOGIN_FAILED', 'admin', `Nhập sai mật khẩu ${current} lần. Hệ thống tự động khóa 60s`, 'danger');
      return { remainingAttempts: 0, isLocked: true, lockSeconds: 60 };
    }

    this.addAuditLog('LOGIN_FAILED', 'admin', `Nhập sai mật khẩu lần ${current}/${MAX_FAILED_ATTEMPTS}`, 'warning');
    return { remainingAttempts: MAX_FAILED_ATTEMPTS - current, isLocked: false, lockSeconds: 0 };
  },

  resetFailedAttempts(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
      sessionStorage.removeItem(STORAGE_KEYS.LOCK_UNTIL);
    }
  },

  createSession(email: string): void {
    if (typeof window === 'undefined') return;
    this.resetFailedAttempts();
    const session = {
      authenticated: true,
      email,
      lastActive: Date.now(),
      created: Date.now()
    };
    sessionStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
    this.addAuditLog('LOGIN_SUCCESS', email, 'Đăng nhập thành công vào cổng quản trị TechDoc', 'info');
  },

  isValidSession(): boolean {
    if (typeof window === 'undefined') return false;
    const raw = sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    if (!raw) return false;
    try {
      const session = JSON.parse(raw);
      if (!session.authenticated) return false;
      const inactiveTime = Date.now() - (session.lastActive || 0);
      if (inactiveTime > SESSION_INACTIVITY_MS) {
        this.clearSession('Hết hạn phiên do không hoạt động (30 phút)');
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  touchSession(): void {
    if (typeof window === 'undefined') return;
    const raw = sessionStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    if (!raw) return;
    try {
      const session = JSON.parse(raw);
      session.lastActive = Date.now();
      sessionStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
    } catch {
      // Ignored
    }
  },

  clearSession(reason: string = 'Đăng xuất chủ động'): void {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
      this.addAuditLog('LOGOUT', 'admin', reason, 'info');
    }
  },

  getAuditLogs(): AuditLogItem[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  addAuditLog(
    action: AuditLogItem['action'],
    actor: string,
    detail: string,
    status: AuditLogItem['status'] = 'info'
  ): void {
    if (typeof window === 'undefined') return;
    const logs = this.getAuditLogs();
    const newLog: AuditLogItem = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN'),
      action,
      actor,
      detail,
      status
    };
    // Giữ tối đa 50 sự kiện gần nhất
    const updated = [newLog, ...logs].slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
  },

  sanitizeInput(val: string): string {
    return val
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
};
