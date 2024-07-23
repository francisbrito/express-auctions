import type { Database } from "better-sqlite3";

import { Auction } from "../domain/model";

export interface RepositoryAdapter {
  add(auction: Auction): Promise<void>;
}

export class Repository implements RepositoryAdapter {
  constructor(private readonly db: Database) {}

  async add(auction: Auction): Promise<void> {
    const insert = this.db.prepare<{
      id: string;
      closingTime: number;
      openingTime: number;
    }>(`
        INSERT INTO "auctions" ("id", "opening_time", "closing_time")
        VALUES (:id, :openingTime, :closingTime);
    `);
    insert.run({
      id: auction.id,
      closingTime: auction.closingTime.toSeconds(),
      openingTime: auction.openingTime.toSeconds(),
    });
  }
}
