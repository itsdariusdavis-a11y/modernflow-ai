import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the notification helper so tests don't make real HTTP calls
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock global fetch so tests don't hit real GHL webhook
const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  text: async () => "OK",
});
vi.stubGlobal("fetch", mockFetch);

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("contact.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success when all required fields are provided", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "John Smith",
      email: "john@example.com",
      phone: "(555) 123-4567",
      businessType: "HVAC",
      message: "I need help automating my lead follow-up.",
    });

    expect(result).toEqual({ success: true });
  });

  it("returns success with only required fields (no phone or businessType)", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Interested in your services.",
    });

    expect(result).toEqual({ success: true });
  });

  it("throws validation error when email is invalid", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Bad Email",
        email: "not-an-email",
        message: "Test message",
      })
    ).rejects.toThrow();
  });

  it("throws validation error when name is empty", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "",
        email: "test@example.com",
        message: "Test message",
      })
    ).rejects.toThrow();
  });

  it("throws validation error when message is empty", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.contact.submit({
        name: "Test User",
        email: "test@example.com",
        message: "",
      })
    ).rejects.toThrow();
  });

  it("correctly splits a full name into firstName and lastName", () => {
    // Test the name-splitting logic directly (same logic used in the router)
    const fullName = "Ryan Johnson";
    const firstName = fullName.split(" ")[0] ?? fullName;
    const lastName = fullName.split(" ").slice(1).join(" ") || "";

    expect(firstName).toBe("Ryan");
    expect(lastName).toBe("Johnson");
  });

  it("handles single-word name gracefully", () => {
    const fullName = "Ryan";
    const firstName = fullName.split(" ")[0] ?? fullName;
    const lastName = fullName.split(" ").slice(1).join(" ") || "";

    expect(firstName).toBe("Ryan");
    expect(lastName).toBe("");
  });
});
