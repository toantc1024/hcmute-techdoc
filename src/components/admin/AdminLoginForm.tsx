'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { brandConfig } from '@/configs/app.config';
import { getBrowserClient } from '@/lib/supabase/client';
import { hashSha256 } from '@/services/security.service';

const ADMIN_PASSKEY_HASH = '0a5de87db3d6c7d52645c1581269a880b1bbc613abc8e4c8e0f51c99753f8909';

/**
 * AdminLoginForm - Supabase Auth Powered Login Component.
 *
 * Architecture Principles:
 * - Uses real Supabase Auth (signInWithPassword).
 * - Verified admin passkey fallback for seamless management.
 * - Rule 15: Strictly under 300 lines (< 300).
 */
interface AdminLoginFormProps {
  onLoginSuccess?: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@hcmute.edu.vn');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    setIsLoading(true);

    try {
      const isMasterPasskey = (await hashSha256(password)) === ADMIN_PASSKEY_HASH;
      const supabase = getBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (isMasterPasskey) {
          const sessionPayload = JSON.stringify({
            authenticated: true,
            email: email.trim() || 'admin@hcmute.edu.vn',
            role: 'admin',
            lastActive: Date.now(),
          });
          sessionStorage.setItem('hcmute_techdoc_admin_auth_session', sessionPayload);
          localStorage.setItem('hcmute_techdoc_admin_auth_session', sessionPayload);
          if (onLoginSuccess) {
            onLoginSuccess();
          } else {
            window.location.href = '/admin';
          }
          return;
        }

        if (error.message.includes('Invalid login credentials')) {
          setErrorMsg('Tài khoản hoặc mật khẩu không chính xác.');
        } else if (error.message.includes('Email not confirmed')) {
          setErrorMsg('Tài khoản Supabase đang chờ xác nhận email. Nếu là quản trị viên hệ thống, vui lòng nhập mật khẩu quản trị nội bộ.');
        } else {
          setErrorMsg(`Đăng nhập thất bại: ${error.message}`);
        }
        return;
      }

      if (data?.user) {
        const sessionPayload = JSON.stringify({
          authenticated: true,
          email: data.user.email || email.trim() || 'admin@hcmute.edu.vn',
          role: 'admin',
          lastActive: Date.now(),
        });
        sessionStorage.setItem('hcmute_techdoc_admin_auth_session', sessionPayload);
        localStorage.setItem('hcmute_techdoc_admin_auth_session', sessionPayload);
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          window.location.href = '/admin';
        }
      }
    } catch (err: unknown) {
      const isMasterPasskey = (await hashSha256(password)) === ADMIN_PASSKEY_HASH;
      if (isMasterPasskey) {
        const sessionPayload = JSON.stringify({
          authenticated: true,
          email: email.trim() || 'admin@hcmute.edu.vn',
          role: 'admin',
          lastActive: Date.now(),
        });
        sessionStorage.setItem('hcmute_techdoc_admin_auth_session', sessionPayload);
        localStorage.setItem('hcmute_techdoc_admin_auth_session', sessionPayload);
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          window.location.href = '/admin';
        }
        return;
      }
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(`Lỗi kết nối xác thực: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center py-6">
      <div className="w-full max-w-md bg-white dark:bg-[#132238] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6 relative z-10">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 mb-2">
            <img
              src={brandConfig.logoUrl}
              alt="HCM-UTE Logo"
              className="size-12 object-contain"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#004776] dark:text-foreground">
            Đăng nhập hệ thống quản trị
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Cổng quản trị HCMUTE TechDoc & Giám sát tiến độ 51 website
          </p>
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
            <svg className="size-4 shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Tài khoản Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@utehub.vn"
              required
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-[#0072BC]/20 focus:border-[#0072BC] outline-hidden transition-all disabled:opacity-60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-[#0072BC]/20 focus:border-[#0072BC] outline-hidden transition-all disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center min-h-[46px] px-4 rounded-xl text-sm font-semibold bg-[#0072BC] hover:bg-[#005a96] text-white transition-all shadow-md shadow-blue-500/10 focus:ring-2 focus:ring-[#0072BC]/20 outline-hidden disabled:opacity-60"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang xác thực an toàn...</span>
                </div>
              ) : (
                'Đăng nhập quản trị'
              )}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-border/60">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-[#0072BC] transition-colors inline-flex items-center gap-1"
          >
            ← Quay lại Cổng tài liệu TechDoc
          </Link>
        </div>
      </div>
    </div>
  );
};
