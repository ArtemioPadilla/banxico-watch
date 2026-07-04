import type { APIRoute } from 'astro';
import { SITE, REPO_URL } from '@/lib/site-meta';

/**
 * /llms.txt — agent-first index (llmstxt.org). Keep this in sync as routes
 * grow; an agent reads this before crawling anything else.
 */
export const GET: APIRoute = () => {
  const body = `# ${SITE.name}

> ${SITE.description}

Source: ${REPO_URL} (${SITE.license}). Agent/contributor context:
${REPO_URL}/blob/main/CLAUDE.md

## Pages

- [Home](/): TODO(agent): describe the landing page
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
