// ## jobs_experience_levels (`jobsExperienceLevels`)

// | Column | Type | Required | Default |
// | :--- | :--- | :--- | :--- |
// | `job_id` | `number` | Yes | - |
// | `experience_level_id` | `number` | Yes | - |

// ## jobs_industries (`jobsIndustries`)

// | Column | Type | Required | Default |
// | :--- | :--- | :--- | :--- |
// | `job_id` | `number` | Yes | - |
// | `industry_id` | `number` | Yes | - |

// ## jobs_job_caches (`jobsJobsCaches`)

// | Column | Type | Required | Default |
// | :--- | :--- | :--- | :--- |
// | `job_id` | `number` | Yes | - |
// | `job_cache_id` | `number` | Yes | - |

// ## jobs_job_types (`jobsJobTypes`)

// | Column | Type | Required | Default |
// | :--- | :--- | :--- | :--- |
// | `job_id` | `number` | Yes | - |
// | `job_type_id` | `number` | Yes | - |

// ## jobs_provinces (`jobsProvinces`)

// | Column | Type | Required | Default |
// | :--- | :--- | :--- | :--- |
// | `job_id` | `number` | Yes | - |
// | `province_id` | `number` | Yes | - |

// ## jobs_roles (`jobsRoles`)

// | Column | Type | Required | Default |
// | :--- | :--- | :--- | :--- |
// | `job_id` | `number` | Yes | - |
// | `role_id` | `number` | Yes | - |

type Tag = { tag: string; single: string };

const tags = [
  { tag: "jobsExperienceLevels", single: "experienceLevel" },
  { tag: "jobsIndustries", single: "industry" },
  { tag: "jobsJobsCaches", single: "jobCache" },
  { tag: "jobsJobTypes", single: "jobType" },
  { tag: "jobsProvinces", single: "province" },
  { tag: "jobsRoles", single: "role" },
];

const createImportStatement = () => {
  return `
import { and, eq, asc, desc } from "drizzle-orm";
import {
  db,
${tags.map((tag) => `\t${tag.tag},`).join("\n")}
} from "@canadian-startup-jobs/db";
`;
};

const createCreateStatement = (tag: Tag) => {
  return `
const add_${tag.tag} = async (
  jobId: number,
  ${tag.single}Id: number,
): Promise<boolean> => {
  const result = await db
    .insert(${tag.tag})
    .values({ jobId, ${tag.single}Id })
    .onConflictDoNothing()
    .returning({ jobId: ${tag.tag}.jobId });
  return result.length > 0;
};
`;
};

const createDeleteStatement = (tag: Tag) => {
  return `
const remove_${tag.tag} = async (
  jobId: number,
  ${tag.single}Id: number,
): Promise<boolean> => {
  const result = await db
    .delete(${tag.tag})
    .where(
      and(
        eq(${tag.tag}.jobId, jobId),
        eq(${tag.tag}.${tag.single}Id, ${tag.single}Id),
      ),
    );
  return result.length > 0;
};
`;
};

const createOrderingStatements = (tag: Tag) => {
  return `
const orderAsc_${tag.tag} = asc(${tag.tag}.jobId);
const orderDesc_${tag.tag} = desc(
${tag.tag}.${tag.single}Id,
);
const orderStatement_${tag.tag} = (
  order?: "asc" | "desc",
): typeof orderAsc_${tag.tag} => {
  const direction = order ?? "asc";
  if (direction === "asc") return orderAsc_${tag.tag};
  return orderDesc_${tag.tag};
};
`;
};

const createGetStatements = (tag: Tag) => {
  return `
const get_${tag.tag}_by_job = async (
  jobId: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(${tag.tag})
    .where(eq(${tag.tag}.jobId, jobId))
    .orderBy(orderStatement_${tag.tag}(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const get_${tag.tag}_by_${tag.single} = async (
${tag.single}Id: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(${tag.tag})
    .where(eq(${tag.tag}.${tag.single}Id, ${tag.single}Id))
    .orderBy(orderStatement_${tag.tag}(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};
`;
};

const createExportStatementPart = (tag: Tag) => {
  return `
  add_${tag.tag},
  remove_${tag.tag},
  get_${tag.tag}_by_job,
  get_${tag.tag}_by_${tag.single},
`;
};

const createExportStatement = (parts: string[]) => {
  return `
export {
${parts.join("\n")}
};
`;
};

export const createJobs = () => {
  let content = "";
  let exportParts: string[] = [];
  content += createImportStatement();
  for (const tag of tags) {
    content += createCreateStatement(tag) + "\n";
    content += createDeleteStatement(tag) + "\n";
    content += createOrderingStatements(tag) + "\n";
    content += createGetStatements(tag) + "\n";
    exportParts.push(createExportStatementPart(tag));
  }
  content += createExportStatement(exportParts);
  return content;
};
