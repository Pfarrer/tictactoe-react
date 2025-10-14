import type { ClientMessage, ServerMessage } from "@tic-tac-toe/shared/types";
import { waitFor } from "./test-utils";

export class TestClient {
  ws: WebSocket;
  receivedMessages: ServerMessage[] = [];

  constructor(serverUrl: string) {
    this.ws = new WebSocket(serverUrl);
    this.registerCallbacks();
  }

  static async newAndReady<T extends number>(
    serverUrl: string,
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
    const promises = Array.from({ length: n }, () => new TestClient(serverUrl).waitUntilReady());
    return Promise.all(promises) as Promise<
      T extends 1
        ? [TestClient]
        : T extends 2
          ? [TestClient, TestClient]
          : T extends 3
            ? [TestClient, TestClient, TestClient]
            : TestClient[]
    >;
  }

  private registerCallbacks() {
    this.ws.addEventListener("message", ({ data }) => {
      const message = JSON.parse(data.toString()) as ServerMessage;
      this.receivedMessages.push(message);
    });
  }

  async waitUntilReady(): Promise<this> {
    await new Promise<void>((resolve) => {
      if (this.ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }
      this.ws.addEventListener("open", () => resolve(), { once: true });
    });
    return this;
  }

  sendMessage(message: ClientMessage) {
    this.ws.send(JSON.stringify(message));
  }

  sendRaw(data: string) {
    this.ws.send(data);
  }

  async waitForNextMessage(filter: (message: ServerMessage) => boolean): Promise<ServerMessage> {
    return new Promise((resolve, reject) => {
      const messageHandler = ({ data }: { data: string }) => {
        try {
          const message = JSON.parse(data.toString()) as ServerMessage;
          if (filter(message)) {
            this.ws.removeEventListener("message", messageHandler);
            resolve(message);
          }
        } catch (error) {
          this.ws.removeEventListener("message", messageHandler);
          reject(error);
        }
      };

      this.ws.addEventListener("message", messageHandler);
      this.ws.addEventListener("error", reject);
    });
  }

  async waitForMessages(filter: (message: ServerMessage) => boolean): Promise<ServerMessage[]> {
    return waitFor(() => {
      const hits = this.receivedMessages.reverse().filter(filter);
      return hits.length > 0 ? hits : null;
    });
  }

  async waitForMessage(filter: (message: ServerMessage) => boolean): Promise<ServerMessage> {
    const messages = await this.waitForMessages(filter);
    if (messages.length === 1) return messages[0]!;
    else throw new Error(`Expected single message, but found: ${messages}`);
  }

  clearReceivedMessages() {
    this.receivedMessages = [];
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null!;
    }
  }

  onError(handler: (error: Event) => void) {
    this.ws.addEventListener("error", handler);
  }
}
