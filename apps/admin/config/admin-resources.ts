/**
 # Key Resources

 ## sources (`sources`) (aka VCs)

 | Column | Type | Required | Default |
 | :--- | :--- | :--- | :--- |
 | `id` | `number` | Yes | - |
 | `name` | `string` | Yes | - |
 | `description` | `string` | Yes | - |
 | `website` | `string` | No | - |
 | `portfolio` | `string` | No | - |
 | `created_at` | `date` | Yes | `[object Object]` |
 | `updated_at` | `date` | Yes | `[object Object]` |

 ## portfolio_caches (`portfolioCaches`) (aka VC Portfolios)

 | Column | Type | Required | Default |
 | :--- | :--- | :--- | :--- |
 | `id` | `number` | Yes | - |
 | `url` | `string` | Yes | - |
 | `fresh_til` | `date` | No | - |
 | `last_hash` | `string` | No | - |
 | `last_scraped_at` | `date` | Yes | `[object Object]` |
 | `last_checked_at` | `date` | Yes | `[object Object]` |

 ## organizations (`organizations`) (aka Companies)

 | Column | Type | Required | Default |
 | :--- | :--- | :--- | :--- |
 | `id` | `number` | Yes | - |
 | `name` | `string` | Yes | - |
 | `city` | `string` | Yes | - |
 | `province` | `string` | Yes | - |
 | `description` | `string` | Yes | - |
 | `website` | `string` | No | - |
 | `industry` | `string` | No | - |
 | `created_at` | `date` | Yes | `[object Object]` |
 | `updated_at` | `date` | Yes | `[object Object]` |

 ## jobs (`jobs`)

 | Column | Type | Required | Default |
 | :--- | :--- | :--- | :--- |
 | `id` | `number` | Yes | - |
 | `title` | `string` | Yes | - |
 | `city` | `string` | Yes | - |
 | `province` | `string` | Yes | - |
 | `remote_ok` | `boolean` | Yes | - |
 | `salary_min` | `number` | No | - |
 | `salary_max` | `number` | No | - |
 | `description` | `string` | Yes | - |
 | `company` | `string` | Yes | - |
 | `job_board_url` | `string` | No | - |
 | `posting_url` | `string` | No | - |
 | `is_at_a_startup` | `boolean` | No | - |
 | `last_scraped_markdown` | `string` | No | - |
 | `created_at` | `date` | Yes | `[object Object]` |
 | `updated_at` | `date` | Yes | `[object Object]` |

 */

const sources = {
  label: "Sources",
  api: "/sources",
  fields: [
    {
      label: "name",
      type: "string",
      elements: {
        display: "h2",
        edit: "input.text",
      },
      order: 0,
    },
    {
      label: "description",
      type: "string",
      elements: {
        display: "md",
        edit: "textarea",
      },
      order: 1,
    },
    {
      label: "website",
      type: "string",
      elements: {
        display: "link",
        edit: "custom.link",
      },
      order: 2,
    },
    {
      label: "portfolio",
      type: "string",
      elements: {
        display: "link",
        edit: "custom.link",
      },
      order: 3,
    },
  ],
};

const organizations = {
  label: "Organizations",
  api: "/organizations",
  fields: [
    {
      label: "name",
      type: "string",
      elements: {
        display: "h2",
        edit: "input.text",
      },
      order: 0,
    },
    {
      label: "description",
      type: "string",
      elements: {
        display: "md",
        edit: "textarea",
      },
      order: 1,
    },
    {
      label: "city",
      type: "string",
      elements: {
        display: "custom.location.city",
        edit: "input.text",
      },
      order: 2,
    },
    {
      label: "province",
      type: "enum.provinces",
      elements: {
        display: "custom.location.province",
        edit: "input.select",
      },
      order: 3,
    },
    {
      label: "website",
      type: "string",
      elements: {
        display: "link",
        edit: "custom.link",
      },
      order: 4,
    },
  ],
};

const jobs = {
  label: "Jobs",
  api: "/jobs",
  fields: [
    {
      label: "title",
      type: "string",
      elements: {
        display: "h2",
        edit: "input.text",
      },
      order: 0,
    },
    {
      label: "description",
      type: "string",
      elements: {
        display: "md",
        edit: "textarea",
      },
      order: 1,
    },
    {
      label: "city",
      type: "string",
      elements: {
        display: "custom.location.city",
        edit: "input.text",
      },
      order: 2,
    },
    {
      label: "province",
      type: "enum.provinces",
      elements: {
        display: "custom.location.province",
        edit: "input.select",
      },
      order: 3,
    },
    {
      label: "remote",
      type: "enum.remote",
      elements: {
        display: "custom.remote",
        edit: "input.select",
      },
      order: 4,
    },
    {
      label: "salary_min",
      type: "number",
      elements: {
        display: "custom.salary",
        edit: "custom.input.salary",
      },
      order: 5,
    },
    {
      label: "salary_max",
      type: "number",
      elements: {
        display: "custom.salary",
        edit: "custom.input.salary",
      },
      order: 6,
    },
    {
      label: "job_board_url",
      type: "string",
      elements: {
        display: "link",
        edit: "custom.link",
      },
      order: 7,
    },
    {
      label: "posting_url",
      type: "string",
      elements: {
        display: "link",
        edit: "custom.link",
      },
      order: 8,
    },
  ],
};
