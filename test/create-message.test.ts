import { createMessage } from "../app/store/chat";

describe("createMessage", () => {
  test("fills sensible defaults", () => {
    const msg = createMessage({});
    expect(msg.role).toBe("user");
    expect(msg.content).toBe("");
    expect(typeof msg.id).toBe("string");
    expect(msg.id.length).toBeGreaterThan(0);
    expect(typeof msg.date).toBe("string");
  });

  test("applies overrides on top of the defaults", () => {
    const msg = createMessage({ role: "assistant", content: "hi" });
    expect(msg.role).toBe("assistant");
    expect(msg.content).toBe("hi");
  });

  test("gives each message a unique id", () => {
    expect(createMessage({}).id).not.toBe(createMessage({}).id);
  });
});
