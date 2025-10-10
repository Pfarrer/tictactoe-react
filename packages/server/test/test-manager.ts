import { afterEach, beforeEach } from "bun:test";
import { TestClient } from "./test-client";
import { startServerWorker } from "./test-utils";

export class TestManager {
  private serverUrl: string | null = null;
  private stopServer: (() => void) | null = null;
  private clients: TestClient[] = [];

  private constructor() {}

  async startServer() {
    if (this.stopServer) {
      throw new Error("Test Server already running, cleanup first!");
    }

    const server = await startServerWorker();
    this.stopServer = server.stopServer;
    this.serverUrl = server.serverUrl;
  }

  static async initialize(): Promise<TestManager> {
    const tm = new TestManager();
    await tm.startServer();
    return tm;
  }

  static async registerTestHooks(): Promise<TestManager> {
    const tm = new TestManager();

    beforeEach(async () => {
      await tm.startServer();
    });

    afterEach(() => {
      tm.cleanup();
    });

    return tm;
  }

  async createClient(): Promise<TestClient> {
    if (!this.serverUrl) {
      throw new Error("Test Server not running, start a server first!");
    }

    const client = new TestClient(this.serverUrl);
    await client.waitUntilReady();
    this.clients.push(client);
    return client;
  }

  async createClients<T extends number>(
    n: T,
  ): Promise<
    T extends 1
      ? [TestClient]
      : T extends 2
        ? [TestClient, TestClient]
        : T extends 3
          ? [TestClient, TestClient, TestClient]
          : TestClient[]
  > {
    if (!this.serverUrl) {
      throw new Error("Test Server not running, start a server first!");
    }

    const clients = await TestClient.newAndReady(this.serverUrl, n);
    this.clients.push(...clients);
    return clients;
  }

  cleanup(): void {
    this.clients.forEach((client) => {
      client.close();
    });
    this.clients = [];

    if (this.stopServer) {
      this.stopServer();
      this.stopServer = null;
      this.serverUrl = null;
    }
  }
}
