import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { brandConfig, gitConfig } from './app.config';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2.5 font-bold text-base tracking-tight">
          <img src={brandConfig.logoUrl} alt="HCM-UTE Logo" className="w-7 h-7 object-contain" />
          <span className="text-[#0072BC] dark:text-sky-400">HCMUTE</span>
          <span className="text-slate-800 dark:text-slate-200">TechDoc</span>
        </span>
      ),
    },
    githubUrl: 'https://github.com/' + gitConfig.user + '/' + gitConfig.repo,
  };
}
