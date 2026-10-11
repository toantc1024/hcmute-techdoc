import { llms, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { docsRoute } from '@/configs/app.config';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema.extend({
      status: z.string().optional(),
      version: z.string().optional(),
      updatedAt: z.string().optional(),
      changelog: z.array(z.object({
        version: z.string(),
        date: z.string(),
        description: z.string(),
        highlights: z.array(z.string()).optional(),
      })).optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const docsLlms = llms(source, {
  renderPage: async (page) => '# ' + page.data.title + ' (' + page.url + ')\n\n' + (await page.data.getText('processed')),
});
