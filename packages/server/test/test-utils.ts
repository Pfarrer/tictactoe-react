export async function startServerWorker() {
  const worker = new Worker("./test/server-worker.ts");

  const port = new Promise(
    (resolve) =>
      (worker.onmessage = (event) => {
        resolve(event.data);
      }),
  );
  const serverUrl = "ws://localhost:" + (await port);

  return {
    stopServer: () => worker.terminate(),
    serverUrl,
  };
}

export async function waitFor(condition: () => void | Promise<void>, timeout = 100, interval = 2): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      await condition();
      return;
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}
