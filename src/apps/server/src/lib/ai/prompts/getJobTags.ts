export const getJobTags = (org: string, markdown: string, url: string) => `
## Context:

Currently Investigating the job associated with the following URL:
---
${url}

### Job Page Markdown Content:
${markdown}

### Currently collected data:
${org}

<!-- /Context -->
---

## Goal:

Use the provided tools to select and apply appropriate tags for the following joins:
---
**jobsExperienceLevels:** job <> experienceLevel,
**jobsIndustries:** job <> industries,
**jobsJobTypes:** job <> jobType,
**jobsRoles:** jobs <> roles,
**jobsProvinces:** jobs <> provinces,

<!-- /Goal -->
`;
