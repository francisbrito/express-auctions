import { DateTime } from "luxon";
import { beforeEach, describe, expect, it } from "vitest";

import { Auction, AuctionClosed } from "./model";

describe("Auction", () => {
  let goodId: string;
  let openingTime: DateTime;
  let closingTime: DateTime;
  let referenceTime: DateTime;

  beforeEach(() => {
    goodId = crypto.randomUUID().toString();
    referenceTime = DateTime.utc();
    openingTime = referenceTime;
    closingTime = referenceTime.plus({ minutes: 30 });
  });

  describe(".calculateRemainingTime()", () => {
    it("should return the remaining time for the auction", () => {
      const auction = new Auction({ goodId, openingTime, closingTime });
      const remainingTime = auction.calculateRemainingTime(referenceTime);
      expect(remainingTime).toBeDefined();
      expect(remainingTime.as("minutes")).toBe(30);
    });

    it("should throw an error if the auction is closed", () => {
      openingTime = referenceTime.minus({ hours: 1 });
      closingTime = referenceTime.minus({ minutes: 30 });
      const auction = new Auction({ goodId, openingTime, closingTime });
      expect(() => auction.calculateRemainingTime(referenceTime)).toThrowError(
        AuctionClosed,
      );
    });
  });
});
