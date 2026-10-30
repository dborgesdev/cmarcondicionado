import { afterEach, expect, it, vi } from "vitest";
import { useResource } from "./useResource";

// Exercise the effect's scheduling and cleanup without adding a DOM runtime.
const harness = vi.hoisted(() => ({
  effect: undefined as undefined | (() => () => void),
  setState: vi.fn(),
}));
vi.mock("react", () => ({
  useState: (initial: unknown) => [initial, harness.setState],
  useEffect: (effect: () => () => void) => {
    harness.effect = effect;
  },
}));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  vi.clearAllMocks();
});

it("revalida enquanto visível, ao voltar à aba e à conexão; limpa listeners ao desmontar", async () => {
  vi.useFakeTimers();
  const win = new EventTarget();
  const doc = Object.assign(new EventTarget(), { visibilityState: "visible" });
  vi.stubGlobal("window", Object.assign(win, { setInterval, clearInterval }));
  vi.stubGlobal("document", doc);
  const loader = vi
    .fn()
    .mockResolvedValueOnce(["antiga"])
    .mockResolvedValue(["recente", "antiga"]);
  useResource(loader, "pieces", 60_000);
  const cleanup = harness.effect!();
  await vi.advanceTimersByTimeAsync(0);
  expect(harness.setState).toHaveBeenLastCalledWith({
    data: ["antiga"],
    loading: false,
  });
  await vi.advanceTimersByTimeAsync(60_000);
  expect(harness.setState).toHaveBeenLastCalledWith({
    data: ["recente", "antiga"],
    loading: false,
  });
  doc.visibilityState = "hidden";
  await vi.advanceTimersByTimeAsync(60_000);
  expect(loader).toHaveBeenCalledTimes(2);
  doc.visibilityState = "visible";
  doc.dispatchEvent(new Event("visibilitychange"));
  await vi.advanceTimersByTimeAsync(0);
  win.dispatchEvent(new Event("online"));
  await vi.advanceTimersByTimeAsync(0);
  win.dispatchEvent(new Event("focus"));
  await vi.advanceTimersByTimeAsync(0);
  expect(loader).toHaveBeenCalledTimes(5);
  cleanup();
  win.dispatchEvent(new Event("focus"));
  await vi.advanceTimersByTimeAsync(120_000);
  expect(loader).toHaveBeenCalledTimes(5);
});
