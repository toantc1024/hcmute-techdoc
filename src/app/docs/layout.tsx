import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { SidebarOverviewBanner } from '@/components/SidebarOverviewBanner';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      sidebar={{
        defaultOpenLevel: 0,
        banner: <SidebarOverviewBanner />,
      }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
