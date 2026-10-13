import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Steps, Step } from 'fumadocs-ui/components/steps';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Diagram } from './Diagram';
import { Mermaid } from './Mermaid';
import { QuickAccessDirectory } from './QuickAccessDirectory';
import { PosterBlueprintGuide } from './PosterBlueprintGuide';

import { Callout as BaseCallout } from 'fumadocs-ui/components/callout';

export function Callout({ title, ...props }: React.ComponentProps<typeof BaseCallout>) {
  return (
    <BaseCallout
      {...props}
      title={typeof title === 'string' ? <strong className="font-bold text-foreground">{title.replace(/^⚡\s*/, '')}</strong> : title}
    />
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Callout,
    Steps,
    Step,
    Tabs,
    Tab,
    Accordion,
    Accordions,
    Diagram,
    Mermaid,
    QuickAccessDirectory,
    PosterBlueprintGuide,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
