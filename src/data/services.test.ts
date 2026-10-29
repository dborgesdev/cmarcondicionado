import { describe, it, expect } from "vitest";
import { services } from "./services";
describe("seis intenções de atendimento", () => {
  it("separa preventiva, corretiva e conserto com conteúdo e mensagens próprios", () => {
    expect(services.map((s) => s.id)).toEqual([
      "instalacao",
      "preventiva",
      "corretiva",
      "conserto",
      "chiller",
      "hospitalar",
    ]);
    expect(new Set(services.map((s) => s.message)).size).toBe(6);
    expect(new Set(services.map((s) => s.text)).size).toBe(6);
    expect(new Set(services.map((s) => s.cta)).size).toBe(6);
  });
});
