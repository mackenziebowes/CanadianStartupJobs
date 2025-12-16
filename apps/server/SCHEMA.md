# Database Schema Documentation

This document is auto-generated. Do not edit manually.

## experience_levels (`experienceLevels`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Yes | - |
| `name` | `string` | Yes | - |

## industries (`industries`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Yes | - |
| `name` | `string` | Yes | - |

## job_board_caches (`jobBoardCaches`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Yes | - |
| `url` | `string` | Yes | - |
| `fresh_til` | `date` | No | - |
| `last_hash` | `string` | No | - |
| `last_scraped_at` | `date` | Yes | `[object Object]` |
| `last_checked_at` | `date` | Yes | `[object Object]` |

## job_caches (`jobCaches`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Yes | - |
| `url` | `string` | Yes | - |
| `fresh_til` | `date` | No | - |
| `last_hash` | `string` | No | - |
| `last_scraped_at` | `date` | Yes | `[object Object]` |
| `last_checked_at` | `date` | Yes | `[object Object]` |

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

## jobs_experience_levels (`jobsExperienceLevels`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `job_id` | `number` | Yes | - |
| `experience_level_id` | `number` | Yes | - |

## jobs_industries (`jobsIndustries`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `job_id` | `number` | Yes | - |
| `industry_id` | `number` | Yes | - |

## jobs_job_caches (`jobsJobsCaches`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `job_id` | `number` | Yes | - |
| `job_cache_id` | `number` | Yes | - |

## jobs_job_types (`jobsJobTypes`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `job_id` | `number` | Yes | - |
| `job_type_id` | `number` | Yes | - |

## jobs_provinces (`jobsProvinces`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `job_id` | `number` | Yes | - |
| `province_id` | `number` | Yes | - |

## jobs_roles (`jobsRoles`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `job_id` | `number` | Yes | - |
| `role_id` | `number` | Yes | - |

## job_types (`jobTypes`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Yes | - |
| `name` | `string` | Yes | - |

## organizations (`organizations`)

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

## orgs_industries (`orgsIndustries`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `org_id` | `number` | Yes | - |
| `industry_id` | `number` | Yes | - |

## orgs_jobs (`orgsJobs`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `org_id` | `number` | Yes | - |
| `job_id` | `number` | Yes | - |

## orgs_provinces (`orgsProvinces`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `org_id` | `number` | Yes | - |
| `province_id` | `number` | Yes | - |

## orgs_sizes (`orgsSizes`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `org_id` | `number` | Yes | - |
| `team_size_id` | `number` | Yes | - |

## orgs_stages (`orgsStages`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `org_id` | `number` | Yes | - |
| `raising_stage_id` | `number` | Yes | - |

## portfolio_caches (`portfolioCaches`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Yes | - |
| `url` | `string` | Yes | - |
| `fresh_til` | `date` | No | - |
| `last_hash` | `string` | No | - |
| `last_scraped_at` | `date` | Yes | `[object Object]` |
| `last_checked_at` | `date` | Yes | `[object Object]` |

## provinces (`provinces`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Yes | - |
| `name` | `string` | Yes | - |
| `code` | `string` | Yes | - |

## raising_stages (`raisingStage`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Yes | - |
| `name` | `string` | Yes | - |

## roles (`roles`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Yes | - |
| `name` | `string` | Yes | - |

## sources (`sources`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Yes | - |
| `name` | `string` | Yes | - |
| `description` | `string` | Yes | - |
| `website` | `string` | No | - |
| `portfolio` | `string` | No | - |
| `created_at` | `date` | Yes | `[object Object]` |
| `updated_at` | `date` | Yes | `[object Object]` |

## sources_portfolio_caches (`sourcesPortfolioCaches`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `source_id` | `number` | Yes | - |
| `portfolio_cache_id` | `number` | Yes | - |

## team_sizes (`teamSize`)

| Column | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| `id` | `number` | Yes | - |
| `name` | `string` | Yes | - |


*Generated on 2025-12-11T18:45:24.878Z*
