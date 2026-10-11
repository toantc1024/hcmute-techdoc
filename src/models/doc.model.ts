/**
 * Model definitions for HCM-UTE Documentation Platform
 */

export interface DocMetadata {
  title: string;
  description?: string;
  full?: boolean;
  order?: number;
  luong?: 'A' | 'B' | 'C' | 'TONG_QUAN';
  screenUrl?: string;
  tags?: string[];
}

export interface NavigationNode {
  title: string;
  url: string;
  icon?: string;
  children?: NavigationNode[];
}

export interface DocSearchResult {
  id: string;
  title: string;
  content: string;
  url: string;
}
