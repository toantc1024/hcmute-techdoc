import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { brandConfig } from './app.config';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="flex items-center gap-2.5 font-bold text-base tracking-tight">
          <img src={brandConfig.logoUrl} alt="HCM-UTE Logo" className="w-7 h-7 object-contain" />
          <span className="text-[#0072BC] dark:text-sky-400">HCM-UTE</span>
          <span className="text-foreground">TechDoc</span>
        </span>
      ),
    },
  };
}
