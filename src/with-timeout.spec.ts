import timeout from "./timeout";
import { withTimeout } from "./with-timeout";

describe("withTimeout", () => {
  it("rejects with OperationTimeoutError if promise take too long time to resolve", async () => {
    const PROMISE_TIMEOUT = 1000;
    const OPERATION_TIMEOUT = 100;

    await expect(withTimeout(timeout(PROMISE_TIMEOUT), OPERATION_TIMEOUT)).rejects.toThrowError();
  });

  it("resolves if promise resolved in time", async () => {
    const PROMISE_TIMEOUT = 100;
    const OPERATION_TIMEOUT = 1000;

    await expect(withTimeout(timeout(PROMISE_TIMEOUT), OPERATION_TIMEOUT)).resolves.not.toThrow();
  });
});
