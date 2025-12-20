export const getJobTags = (job: string, markdown: string, links: string[], url: string) => `
## Context:

Investigating a job posting at:
---
${url}

### Job Markdown Content:
${markdown}

### Links on page:
${JSON.stringify(links)}

### Collected job object:
${job}

<!-- /Context -->
---

## Goal:

Use the provided tools to select and apply appropriate tags for this job posting, choosing from Experience Level, Role, Job Type, Province, Industry. Return actions you took.

`;