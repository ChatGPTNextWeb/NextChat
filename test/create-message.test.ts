import { createMessage } from "../app/store/chat";

describe("createMessage", () => {
  test("fills in default role, content, id and date", () => {
    const m = createMessage({});
    expect(m.role).toBe("user");
    expect(m.content).toBe("");
    expect(typeof m.id).toBe("string");
    expect(m.id.length).toBeGreaterThan(0);
    expect(typeof m.date).toBe("string");
  });

  test("lets overrides win over the defaults", () => {
    const m = createMessage({ role: "assistant", content: "hi there" });
    expect(m.role).toBe("assistant");
    expect(m.content).toBe("hi there");
  });

  test("assigns a unique id to each message", () => {
    expect(createMessage({}).id).not.toBe(createMessage({}).id);
  });

  test("preserves an explicitly provided id", () => {
    const m = createMessage({ id: "fixed-id" });
    expect(m.id).toBe("fixed-id");
  });
});
