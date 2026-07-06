import { getOperationId } from "../app/utils";

describe("getOperationId", () => {
  test("prefers an explicit operationId when provided", () => {
    expect(
      getOperationId({
        operationId: "listPets",
        method: "get",
        path: "/pets",
      }),
    ).toBe("listPets");
  });

  test("derives an id from method and path when operationId is missing", () => {
    expect(
      getOperationId({
        method: "get",
        path: "/pets/list",
      }),
    ).toBe("GET_pets_list");
  });

  test("uppercases the method and replaces every slash in the path", () => {
    expect(
      getOperationId({
        method: "post",
        path: "/v1/users/create",
      }),
    ).toBe("POST_v1_users_create");
  });

  test("produces an id matching the allowed pattern ^[a-zA-Z0-9_-]+$", () => {
    const id = getOperationId({ method: "delete", path: "/a/b/c" });
    expect(id).toMatch(/^[a-zA-Z0-9_-]+$/);
  });
});
