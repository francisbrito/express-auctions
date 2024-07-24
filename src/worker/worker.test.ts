import { afterEach, beforeEach, describe, expect, it } from "vitest";

import Redis from "ioredis";
import RedisMemoryServer from "redis-memory-server";

import { RepositoryAdapter } from "../adapters/repository";
import { Auction } from "../domain/model";
import { AlreadyStarted, AlreadyStopped, Worker } from "./worker";

class FakeRepository implements RepositoryAdapter {
  public readonly auctions: Auction[];

  constructor(initialAuctions: Auction[] = []) {
    this.auctions = initialAuctions ?? [];
  }

  async add(auction: Auction): Promise<void> {
    this.auctions.push(auction);
  }
}

describe("Worker", () => {
  let redisServer: RedisMemoryServer;
  let redisHost: string;
  let redisPort: number;
  let fakeRepository: FakeRepository;
  let worker: Worker;

  beforeEach(async () => {
    redisServer = new RedisMemoryServer();
    redisHost = await redisServer.getHost();
    redisPort = await redisServer.getPort();
    fakeRepository = new FakeRepository();
    worker = new Worker({
      connection: {
        host: redisHost,
        port: redisPort,
      },
      repository: fakeRepository,
    });
  });

  afterEach(async () => {
    if (redisServer) {
      await redisServer.stop();
    }
  });

  describe("start()", () => {
    it("should opens a new connection to redis", async () => {
      await worker.start();
      await expect(connectionCount(redisServer)).resolves.toBe(2);
      await worker.stop();
    });

    it("should throw if worker already started", async () => {
      await worker.start();
      await expect(() => worker.start()).rejects.toThrowError(AlreadyStarted);
      await worker.stop();
    });
  });

  describe("stop()", () => {
    it("should close open connections to redis", async () => {
      await worker.start();
      await worker.stop();
      await expect(connectionCount(redisServer)).resolves.toBe(1);
    });

    it("should throw if worker already stopped", async () => {
      await worker.start();
      await worker.stop();
      await expect(() => worker.stop()).rejects.toThrowError(AlreadyStopped);
    });
  });
});

async function connectionCount(server: RedisMemoryServer): Promise<number> {
  const redis = new Redis({
    host: await server.getHost(),
    port: await server.getPort(),
  });
  const response = (await redis.call("CLIENT", ["LIST"])) as string;
  redis.disconnect();
  return response.split("\n").filter((c) => c !== "").length;
}
