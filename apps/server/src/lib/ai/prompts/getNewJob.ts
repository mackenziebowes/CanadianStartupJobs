export const getNewJob = (primaryText: string, url: string) => `
## Context:

Primary discovery output:
---
${primaryText}

URL: ${url}

<!-- /Context -->
---

## Goal:

Extract a single job posting object with these fields matching our DB schema:
- title (string)
- city (string)
- province (string)
- remote_ok (boolean)
- salary_min (number | null)
- salary_max (number | null)
- description (string)
- company (string)
- job_board_url (string | null)
- posting_url (string | null)
- is_at_a_startup (boolean | null)
- last_scraped_markdown (string | null)

Return only a JSON object matching the schema.
`;