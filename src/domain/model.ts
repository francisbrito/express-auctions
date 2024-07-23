import { DateTime, Duration } from "luxon";
import { ulid } from "ulid";

export class AuctionClosed extends Error {}

export interface AuctionConstructorParameters {
  goodId: string;
  openingTime: DateTime;
  closingTime: DateTime;
}

export class Auction {
  public readonly id: string;
  public readonly goodId: string;
  public readonly openingTime: DateTime;
  public readonly closingTime: DateTime;
  public readonly bids: Bid[];

  constructor(parameters: AuctionConstructorParameters) {
    this.id = ulid();
    this.goodId = parameters.goodId;
    this.openingTime = parameters.openingTime;
    this.closingTime = parameters.closingTime;
    this.bids = [];
  }

  public calculateRemainingTime(currentTime: DateTime): Duration {
    const remainingTime = this.closingTime.diff(currentTime);
    if (remainingTime.as("seconds") <= 0) {
      throw new AuctionClosed();
    }
    return remainingTime;
  }

  public placeBid(amount: BigInt, bidder: string): void {
    if (this.bids.length > 0) {
      const highestBid = this.bids[this.bids.length - 1];
      if (highestBid.amount <= amount) {
        throw new InvalidBid();
      }
    }
    const bid = new Bid(amount, bidder);
    this.bids.push(bid);
  }
}

export class InvalidBid extends Error {}

export class Bid {
  constructor(
    public readonly amount: BigInt,
    public readonly bidder: string,
  ) {}
}
