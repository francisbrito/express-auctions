import { beforeEach, describe, expect, it } from "vitest";

import { DateTime } from "luxon";

import { Auction, AuctionClosed, InvalidBid } from "./model";

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

  describe(".placeBid()", () => {
    it("should add a bid to the auction", () => {
      const auction = new Auction({ goodId, openingTime, closingTime });
      auction.placeBid(1000_00n, "bidder@domain.test");
      expect(auction.bids).toHaveLength(1);

      const bid = auction.bids[0];
      expect(bid.amount).toBe(1000_00n);
      expect(bid.bidder).toBe("bidder@domain.test");
    });

    it("should throw an error if amount is lower than the amount of the highest bid", () => {
      const auction = new Auction({ goodId, openingTime, closingTime });
      auction.placeBid(1000_00n, "bidder1@domain.test");

      expect(() =>
        auction.placeBid(1000_00n, "bidder2@domain.test"),
      ).toThrowError(InvalidBid);
    });
  });
});
