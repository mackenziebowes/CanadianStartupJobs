
/*

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

*/

import { ERROR_CODES } from "@/lib/errors";

type Tag = { tag: string; singles: string[] };

const tags = [
  { tag: "orgsIndustries", singles: ["org", "industry"] },
  { tag: "orgsJobs", singles: ["org","job"] },
  { tag: "orgsProvinces", singles: ["org","province"] },
  { tag: "orgsSizes", singles: ["org","teamSize"] },
  { tag: "orgsStages", singles: ["org","raisingStage"] },
];


const createImportStatement = () => {
  return `
import { and, eq, asc, desc } from "drizzle-orm";
import {
  db,
${tags.map((tag) => `\t${tag.tag},`).join("\n")}
} from "@canadian-startup-jobs/db";
import { AppError, ERROR_CODES } from "@/lib/errors";
`;
};

const createCreateStatement = (tag: Tag) => {
  return `
const add_${tag.tag} = async (
  ${tag.singles[0]}Id: number,
  ${tag.singles[1]}Id: number,
) => {
  const result = await db
    .insert(${tag.tag})
    .values({ ${tag.singles[0]}Id, ${tag.singles[1]}Id })
    .onConflictDoNothing()
    .returning({ ${tag.singles[0]}Id: ${tag.tag}.${tag.singles[0]}Id });
  if (result.length == 0) throw new AppError(ERROR_CODES.DB_INSERT_FAILED, \`Failed to add ${tag.singles[1]} to ${tag.singles[0]}\`, {
    ${tag.singles[0]}Id,
    ${tag.singles[1]}Id
  })
  return result;
};
`;
};

const createDeleteStatement = (tag: Tag) => {
  return `
const remove_${tag.tag} = async (
  ${tag.singles[0]}Id: number,
  ${tag.singles[1]}Id: number,
) => {
  const result = await db
    .delete(${tag.tag})
    .where(
      and(
        eq(${tag.tag}.${tag.singles[0]}Id, ${tag.singles[0]}Id),
        eq(${tag.tag}.${tag.singles[1]}Id, ${tag.singles[1]}Id),
      ),
    ).returning({ ${tag.singles[0]}Id: ${tag.tag}.${tag.singles[0]}Id });
  if (result.length == 0) throw new AppError(ERROR_CODES.DB_QUERY_FAILED, \`Failed to delete ${tag.singles[1]} to ${tag.singles[0]} pivot\`, {
    ${tag.singles[0]}Id,
    ${tag.singles[1]}Id
  })
  return result;
};
`;
};

const createOrderingStatements = (tag: Tag) => {
  return `
const orderAsc_${tag.tag} = asc(${tag.tag}.${tag.singles[1]}Id);
const orderDesc_${tag.tag} = desc(
${tag.tag}.${tag.singles[1]}Id,
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
const get_${tag.tag}_by_${tag.singles[0]} = async (
  ${tag.singles[0]}Id: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(${tag.tag})
    .where(eq(${tag.tag}.${tag.singles[0]}Id, ${tag.singles[0]}Id))
    .orderBy(orderStatement_${tag.tag}(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};

const get_${tag.tag}_by_${tag.singles[1]} = async (
${tag.singles[1]}Id: number,
  skip?: number,
  take?: number,
  order?: "asc" | "desc",
) => {
  const result = await db
    .select()
    .from(${tag.tag})
    .where(eq(${tag.tag}.${tag.singles[1]}Id, ${tag.singles[1]}Id))
    .orderBy(orderStatement_${tag.tag}(order))
    .limit(skip ?? 10)
    .offset(take ?? 10);
  return result;
};
`;
};


const createExportStatementPart = (tag: Tag) => {
  return `
const ${tag.singles[1]} = {
  add: add_${tag.tag},
  remove: remove_${tag.tag},
  get_by_${tag.singles[0]}: get_${tag.tag}_by_${tag.singles[0]},
  get_by_${tag.singles[1]}: get_${tag.tag}_by_${tag.singles[1]},
};`;
};

const createExportStatement = (parts: string[]) => {
  return `
${parts.join("\n")}

const orgPivots = {
${tags.map((tag) => `\t${tag.singles[1]},`).join("\n")}
};

export {
  orgPivots
};
`;
};

export const createOrgPivots = () => {
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
