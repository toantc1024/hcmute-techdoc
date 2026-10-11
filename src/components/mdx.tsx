import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Steps, Step } from 'fumadocs-ui/components/steps';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Diagram } from './Diagram';
import { Mermaid } from './Mermaid';
import { QuickAccessDirectory } from './QuickAccessDirectory';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Steps,
    Step,
    Tabs,
    Tab,
    Accordion,
    Accordions,
    Diagram,
    Mermaid,
    QuickAccessDirectory,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
