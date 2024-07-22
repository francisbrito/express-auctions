import { describe, it } from "vitest";

describe("app", () => {
  describe("GET /auctions/", () => {
    it("should return a list of open auctions", async () => {
      throw new Error("not implemented");
    });
  });

  describe("GET /auctions/:id/", () => {
    it("should return details of an open auction", async () => {
      throw new Error("not implemented");
    });

    it("should return an error if auction is not opened", async () => {
      throw new Error("not implemented");
    });

    it("should return an error if auction does not exist", async () => {
      throw new Error("not implemented");
    });
  });

  describe("POST /auctions/:id/bids/", () => {
    it("should place a bid to a given auction", async () => {
      throw new Error("not implemented");
    });

    it("should return an error if amount is lower than highest bid", async () => {
      throw new Error("not implemented");
    });

    it("should return an error if auction is closed", async () => {
      throw new Error("not implemented");
    });
  });
});
