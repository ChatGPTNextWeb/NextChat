import { jest } from "@jest/globals";
import { ChatGPTApi } from "../app/client/platforms/openai";
import Locale from "../app/locales";
import { createMessage, useChatStore } from "../app/store/chat";
import { getMessageTextContent } from "../app/utils";

// summarizeSession(false, target) runs when a reply in `target` finishes,
// which can be after the user has opened another chat. The summary request
// must carry the target chat's own memory, not the open chat's.
describe("summarizeSession", () => {
  test("uses the memory of the chat being summarized, not of the chat on screen", () => {
    const calls: any[] = [];
    const chat = jest
      .spyOn(ChatGPTApi.prototype, "chat")
      .mockImplementation(async (options: any) => {
        calls.push(options);
      });

    const store = useChatStore.getState();
    store.newSession();
    store.newSession();
    const [chatB, chatA] = useChatStore.getState().sessions;
    chatA.topic = "Chat A";
    chatA.memoryPrompt = "earlier summary of chat A";
    chatA.messages = [
      createMessage({ role: "user", content: "question in chat A" }),
      createMessage({ role: "assistant", content: "a".repeat(5000) }),
    ];
    chatB.topic = "Chat B";
    chatB.memoryPrompt = "earlier summary of chat B";

    // chat A's reply finished while the user is looking at chat B
    useChatStore.getState().selectSession(0);
    expect(useChatStore.getState().currentSession().id).toBe(chatB.id);
    useChatStore.getState().summarizeSession(false, chatA);

    const summarize = calls.find(
      (o) =>
        getMessageTextContent(o.messages.at(-1)) ===
        Locale.Store.Prompt.Summarize,
    );
    expect(summarize).toBeDefined();
    const sent = summarize.messages.map(getMessageTextContent).join("\n");
    expect(sent).toContain("earlier summary of chat A");
    expect(sent).not.toContain("earlier summary of chat B");

    chat.mockRestore();
  });
});
