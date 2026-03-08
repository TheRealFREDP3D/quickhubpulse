import { describe, it, expect } from "vitest";
import { env } from "./env";

describe("Environment Configuration", () => {
  it("should have a valid GITHUB_API_URL", () => {
    expect(env.GITHUB_API_URL).toBeDefined();
    expect(env.GITHUB_API_URL).toMatch(/^https?:\/\//);
  });

  it("should have a default GITHUB_API_VERSION", () => {
    expect(env.GITHUB_API_VERSION).toBe("2022-11-28");
  });

  it("should have boolean flags defined", () => {
    expect(typeof env.DEBUG).toBe("boolean");
    expect(typeof env.ENABLE_DARK_MODE).toBe("boolean");
  });

  it("should have number values defined", () => {
    expect(typeof env.CACHE_DURATION).toBe("number");
    expect(typeof env.REPOS_PER_PAGE).toBe("number");
  });
});
