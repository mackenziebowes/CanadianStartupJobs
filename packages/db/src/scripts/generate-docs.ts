import { getTableName, getTableColumns } from "drizzle-orm";
import * as schema from "../schema/index";
import { join } from "node:path";
import { z } from "zod";

const OUTPUT_FILE = "SCHEMA.md";

// List of paths to copy the generated docs to (for other agents/projects)
// Add relative or absolute paths here
const COPY_TO_PATHS: string[] = [
  "../backend/server/",
  "../backend/scraper-cron/",
];

// Zod schema to validate the structure of a Drizzle column
const columnSchema = z.object({
  name: z.string(),
  dataType: z.string(),
  notNull: z.boolean(),
  default: z.any().optional(),
});

async function generateDocs() {
  let md = "# Database Schema Documentation\n\n";
  md += "This document is auto-generated. Do not edit manually.\n\n";

  const tables = Object.entries(schema).filter(([key, value]) => {
    try {
      return !!getTableName(value as any);
    } catch {
      return false;
    }
  });

  tables.sort((a, b) => a[0].localeCompare(b[0]));

  for (const [exportName, table] of tables) {
    const tableName = getTableName(table as any);
    md += `## ${tableName} (\`${exportName}\`)\n\n`;

    md += "| Column | Type | Required | Default |\n";
    md += "| :--- | :--- | :--- | :--- |\n";

    const columns = getTableColumns(table as any);

    for (const [, col] of Object.entries(columns)) {
      const parsedCol = columnSchema.safeParse(col);

      if (parsedCol.success) {
        const {
          name,
          dataType,
          notNull,
          default: defaultValue,
        } = parsedCol.data;
        const defaultString =
          defaultValue !== undefined ? `\`${String(defaultValue)}\`` : "-";
        md += `| \`${name}\` | \`${dataType}\` | ${notNull ? "Yes" : "No"} | ${defaultString} |\n`;
      } else {
        // console.error(`Failed to parse column in ${tableName}:`, parsedCol.error);
        // Fallback for columns that don't match the schema, like relations
        // We can add a more robust check here if needed. For now, we just skip.
      }
    }
    md += "\n";
  }

  md += `\n*Generated on ${new Date().toISOString()}*\n`;

  console.log(`Writing schema docs to ${OUTPUT_FILE}...`);
  await Bun.write(OUTPUT_FILE, md);

  for (const target of COPY_TO_PATHS) {
    const path = join(target, OUTPUT_FILE);
    try {
      console.log(`Copying to ${path}...`);
      await Bun.write(path, md);
    } catch (e) {
      console.error(`Failed to copy to ${path}:`, e);
    }
  }

  console.log("Done!");
}

generateDocs();
