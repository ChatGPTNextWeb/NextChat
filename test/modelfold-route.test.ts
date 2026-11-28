/** @jest-environment node */
import { jest } from "@jest/globals";
import { NextRequest } from "next/server";
import { handle } from "../app/api/modelfold";

const outbound = jest.mocked(global.fetch);
function send(path: string, method: string, authorization: string) {
  const request = new NextRequest(`http://localhost/api/modelfold/${path}`, {
    method,
    headers: { Authorization: authorization, Cookie: "site=session" },
    body: method === "POST" ? JSON.stringify({ model: "gpt-5-2" }) : undefined,
  });
  return handle(request, { params: { path: path.split("/") } });
}

beforeEach(() => {
  outbound.mockClear();
});
test.each(["", "Bearer nk-site-fixture"])(
  "rejects absent credentials and site codes locally",
  async (authorization) => {
    expect((await send("v1/models", "GET", authorization)).status).toBe(401);
    expect(outbound).not.toHaveBeenCalled();
  },
);
test.each([
  ["GET", "v1/models"],
  ["POST", "v1/chat/completions"],
])("forwards only the dedicated credential for %s %s", async (method, path) => {
  outbound.mockResolvedValueOnce(
    new Response("ok", { headers: { "Content-Type": "text/plain" } }),
  );
  expect(
    await (await send(path, method, "Bearer provider-fixture")).text(),
  ).toBe("ok");
  expect(outbound).toHaveBeenCalledWith(
    `https://modelfold.ai/${path}`,
    expect.objectContaining({
      method,
      redirect: "error",
      headers: {
        Authorization: "Bearer provider-fixture",
        "Content-Type": "application/json",
      },
    }),
  );
});
test("rejects unrelated routes", async () => {
  expect(
    (await send("v1/other", "GET", "Bearer provider-fixture")).status,
  ).toBe(404);
  expect(outbound).not.toHaveBeenCalled();
});
