export const discoverNewJob = (markdown: string, links: string[], url: string) => `
## Context:

Investigate a careers page or job posting at this URL:
---
${url}

### Page Markdown:
${markdown}

### Links found:
${JSON.stringify(links)}

<!-- /Context -->
---

## Goal:

Find any pages or sections relevant to the specific job posting(s) on this site. Use the provided tools to fetch pages or search the site map when needed. Return concise notes about candidate-facing job details you find and the best URL to extract structured data from.
`;
