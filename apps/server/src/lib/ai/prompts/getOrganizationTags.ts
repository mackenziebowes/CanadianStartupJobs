
export const getOrganizationTags = (org: string, markdown: string, links: string[], url: string) => `
## Context:

Currently Investigating the organization associated with the following URL:
---
${url}

### Home Page Markdown Content:
${markdown}

### Array of Links on Home Page:
${JSON.stringify(links)}

### Currently collected data:
${org}

<!-- /Context -->
---

## Goal:

Use the provided tools to select and apply appropriate tags for the following joins:
---
**orgsProvinces:** organizations <> provinces,
**orgsIndustries:** organizations <> industries,
**orgsSizes:** organizations <> teamSizes,
**orgsStages:** organizations <> raisingStages,

<!-- /Goal -->
`;
