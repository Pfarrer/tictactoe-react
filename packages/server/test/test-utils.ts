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

export async function waitUntil(condition: () => void | Promise<void>, timeout = 100, interval = 2): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      await condition();
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }

  // If it still fails, let it throw the error for better debugability
  await condition();
}

export async function waitFor<T>(
  condition: () => (T | null | undefined | false) | Promise<T | null | undefined | false>,
  timeout = 100,
  interval = 2,
): Promise<T> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const ret = await condition();
    if (ret) return ret;

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Condition not met within ${timeout}ms`);
}
