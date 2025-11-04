export function merge(target: any, source: any) {
  Object.keys(source).forEach(function (key) {
    if (key === "__proto__" || key === "constructor") return; // skip unsafe keys

    if (
      source.hasOwnProperty(key) &&
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      merge((target[key] = target[key] || {}), source[key]);
    } else {
      target[key] = source[key];
    }
  });
}
