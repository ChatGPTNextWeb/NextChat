export function prettyObject(msg: any) {
  const obj = msg;
  if (typeof msg !== "string") {
    msg = JSON.stringify(msg, null, "  ");
  }
  if (msg === "{}") {
    return obj.toString();
  }
  if (msg.startsWith("```json")) {
    return msg;
  }
  return ["```json", msg, "```"].join("\n");
}

export function* chunks(s: string, maxBytes = 1000 * 1000) {
  const decoder = new TextDecoder("utf-8", { ignoreBOM: true });
  let buf = new TextEncoder().encode(s);
  while (buf.length) {
    let i = Math.min(buf.length, Math.floor(maxBytes));
    // UTF-8 continuation bytes cannot start the next chunk.
    while (i > 0 && (buf[i] & 0xc0) === 0x80) i -= 1;
    if (!(i > 0)) {
      throw new RangeError("maxBytes is too small for a UTF-8 character");
    }
    yield decoder.decode(buf.subarray(0, i));
    buf = buf.subarray(i);
  }
}
