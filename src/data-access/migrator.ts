import * as fs from "node:fs/promises";
import path from "node:path";

import { Database } from "better-sqlite3";

export async function migrate(db: Database, directory: string): Promise<void> {
  const entries = await fs.opendir(directory, { encoding: "utf-8" });
  const migrations: { sequence: number; sql: string }[] = [];
  for await (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".sql")) {
      const fileName = entry.name;
      const filePath = path.join(entry.parentPath, fileName);
      const sequence = fileName
        .split("_")
        .filter((part, index) => index === 0)
        .map(parseInt)[0];
      const fileContent = await fs.readFile(filePath, { encoding: "utf-8" });
      const [sql, _] = fileContent.split("-- DIVIDER --");
      migrations.push({ sequence, sql });
    }
  }
  migrations.sort((m1, m2) => m1.sequence - m2.sequence);
  for (const { sql } of migrations) {
    db.exec(sql);
  }
}
