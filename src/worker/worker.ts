import Redis from "ioredis";

import { RepositoryAdapter } from "../adapters/repository";

export interface OpenAuctionParameters {
  goodId: string;
  openingTime: number;
  closingTime: number;
}

export interface WorkerAdapter {
  openAuction(parameters: OpenAuctionParameters): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export interface RedisConnectionParameters {
  host: string;
  port: number;
}
export interface WorkerConstructorParameters {
  connection: RedisConnectionParameters;
  repository: RepositoryAdapter;
}

export class AlreadyStarted extends Error {}
export class AlreadyStopped extends Error {}

export class Worker implements WorkerAdapter {
  private readonly connectionParameters: RedisConnectionParameters;
  private redis: Redis | null;

  constructor(parameters: WorkerConstructorParameters) {
    this.connectionParameters = parameters.connection;
    this.redis = null;
  }

  async start(): Promise<void> {
    if (this.redis === null) {
      this.redis = new Redis({
        host: this.connectionParameters.host,
        port: this.connectionParameters.port,
      });
    } else {
      throw new AlreadyStarted();
    }
  }

  async stop(): Promise<void> {
    if (this.redis) {
      this.redis.disconnect();
      this.redis = null;
    } else {
      throw new AlreadyStopped();
    }
  }

  async openAuction(parameters: OpenAuctionParameters): Promise<void> {
    throw new Error("not implemented");
  }
}
