'use client';

import React, { useState, useEffect } from 'react';
import { brandConfig } from '@/configs/app.config';
import { securityService } from '@/services/security.service';

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@hcmute.edu.vn');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lockSeconds, setLockSeconds] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState(5);

  useEffect(() => {
    const checkLock = () => {
      const remaining = securityService.getLockRemainingSeconds();
      setLockSeconds(remaining);
      const failed = securityService.getFailedAttempts();
      setRemainingAttempts(Math.max(0, 5 - failed));
    };

    checkLock();
    const timer = setInterval(checkLock, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockSeconds > 0) return;

    setErrorMsg('');
    setIsLoading(true);

    try {
      const isValid = await securityService.verifyPassword(password);
      if (isValid) {
        securityService.createSession(email);
        onLoginSuccess();
      } else {
        const { remainingAttempts: left, isLocked, lockSeconds: sec } = securityService.recordFailedAttempt();
        setRemainingAttempts(left);
        if (isLocked) {
          setLockSeconds(sec);
          setErrorMsg(`Bạn đã nhập sai 5 lần. Hệ thống tạm khóa trong ${sec} giây để bảo vệ an ninh!`);
        } else {
          setErrorMsg(`Mật khẩu không chính xác! Bạn còn ${left} lần thử trước khi bị khóa.`);
        }
      }
    } catch {
      setErrorMsg('Đã xảy ra lỗi trong quá trình xác thực an ninh.');
    } finally {
      setIsLoading(false);
    }
  };

  const isLocked = lockSeconds > 0;

  return (
    <div className="w-full flex items-center justify-center py-6">
      <div className="w-full max-w-md bg-white dark:bg-[#132238] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 relative z-20">
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
            Cổng điều hành tài liệu kỹ thuật & Giám sát tiến độ 51 website HCM-UTE
          </p>
        </div>

        {/* Lockout or Error Banner */}
        {isLocked ? (
          <div className="p-4 rounded-lg border border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 text-xs font-medium space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <span className="animate-spin">⏳</span>
              <span>Tài khoản tạm thời bị khóa bảo vệ</span>
            </div>
            <p>
              Vui lòng chờ <strong className="font-mono text-sm">{lockSeconds}s</strong> trước khi thử lại để chống dò quét mật khẩu.
            </p>
          </div>
        ) : errorMsg ? (
          <div className="p-3.5 rounded-lg border border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
            <svg className="size-4 shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        ) : null}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#004776] dark:text-foreground mb-1.5">
              Tài khoản quản trị / Email công vụ
            </label>
            <input
              type="text"
              required
              disabled={isLocked}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3.5 rounded-lg border border-border bg-background text-[#004776] dark:text-foreground leading-[2.05] focus:outline-hidden focus:ring-2 focus:ring-[#0072BC]/30 focus:border-[#0072BC] disabled:opacity-60 text-sm"
              placeholder="admin@hcmute.edu.vn"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#004776] dark:text-foreground">
                Mật khẩu truy cập
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-[#0072BC] dark:text-sky-400 hover:underline"
              >
                {showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLocked}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu quản trị..."
                className="w-full h-10 pl-3.5 pr-10 rounded-lg border border-border bg-background text-[#004776] dark:text-foreground leading-[2.05] focus:outline-hidden focus:ring-2 focus:ring-[#0072BC]/30 focus:border-[#0072BC] disabled:opacity-60 text-sm"
              />
              <button
                type="button"
                disabled={isLocked}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-[#004776]"
                title={showPassword ? 'Ẩn' : 'Hiện'}
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

          <button
            type="submit"
            disabled={isLoading || isLocked}
            className="w-full min-h-[42px] px-4 rounded-lg text-sm font-semibold bg-[#0072BC] hover:bg-[#005a96] text-white transition-all shadow-sm hover:shadow disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <span>Xác thực & Vào quản trị</span>
            )}
          </button>
        </form>

        <div className="pt-3 border-t border-border text-center">
          <a
            href="/"
            className="inline-block text-xs font-medium text-[#0072BC] dark:text-sky-400 hover:underline"
          >
            ← Về trang chủ TechDoc
          </a>
        </div>
      </div>
    </div>
  );
};
