import { DateTime, Duration } from "luxon";

export class AuctionClosed extends Error {}

export interface AuctionConstructorParameters {
  goodId: string;
  openingTime: DateTime;
  closingTime: DateTime;
}

export class Auction {
  public readonly goodId: string;
  public readonly openingTime: DateTime;
  public readonly closingTime: DateTime;

  constructor(parameters: AuctionConstructorParameters) {
    this.goodId = parameters.goodId;
    this.openingTime = parameters.openingTime;
    this.closingTime = parameters.closingTime;
  }

  public calculateRemainingTime(currentTime: DateTime): Duration {
    const remainingTime = this.closingTime.diff(currentTime);
    if (remainingTime.as("seconds") <= 0) {
      throw new AuctionClosed();
    }
    return remainingTime;
  }
}
