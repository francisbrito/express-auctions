import * as crypto from "node:crypto";
import path from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

import Database, { Database as DatabaseType } from "better-sqlite3";
import { DateTime } from "luxon";

import * as migrator from "../data-access/migrator";
import { Auction } from "../domain/model";
import { Repository } from "./repository";

const migrationsDirectory = path.resolve(__dirname, "../../data/migrations");

describe("Repository", () => {
  let db: DatabaseType;
  let referenceTime: DateTime;

  beforeEach(async () => {
    db = new Database(":memory:");
    referenceTime = DateTime.utc();

    await migrator.migrate(db, migrationsDirectory);
  });

  describe(".add()", () => {
    it("should insert an auction record", async () => {
      const repository = new Repository(db);
      const auction = new Auction({
        goodId: crypto.randomUUID().toString(),
        openingTime: referenceTime,
        closingTime: referenceTime.plus({ minutes: 30 }),
      });
      await repository.add(auction);

      const auctionRecord = db
        .prepare<
          unknown[],
          { id: string; openingTime: number; closingTime: number }
        >(
          `SELECT "id", "opening_time" as "openingTime", "closing_time" as "closingTime"
           FROM "auctions"
           LIMIT 1`,
        )
        .get();

      expect(auctionRecord).toBeDefined();
      expect(auctionRecord!.id).toBe(auction.id);
      expect(auctionRecord!.openingTime).toBe(auction.openingTime.toSeconds());
      expect(auctionRecord!.closingTime).toBe(auction.closingTime.toSeconds());
    });
  });
});
