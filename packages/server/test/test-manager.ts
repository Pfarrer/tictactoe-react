import { TestClient } from "./test-client";
import { startServerWorker } from "./test-utils";

export class TestManager {
  private serverUrl: string;
  private stopServer: () => void;
  private clients: TestClient[] = [];

  private constructor(serverUrl: string, stopServer: () => void) {
    this.stopServer = stopServer;
    this.serverUrl = serverUrl;
  }

  static async initialize(): Promise<TestManager> {
    const server = await startServerWorker();
    return new TestManager(server.serverUrl, server.stopServer);
  }

  async createClient(): Promise<TestClient> {
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
    const clients = await TestClient.newAndReady(this.serverUrl, n);
    this.clients.push(...clients);
    return clients;
  }

  cleanup(): void {
    this.clients.forEach((client) => {
      client.close();
    });
    this.clients = [];
    this.stopServer();
  }
}
