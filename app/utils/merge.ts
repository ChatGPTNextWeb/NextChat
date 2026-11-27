export function merge(target: any, source: any) {
  Object.keys(source).forEach(function (key) {
    if (key === "__proto__" || key === "constructor") return;
    if (
      source.hasOwnProperty(key) && // Check if the property is not inherited
      source[key] &&
      typeof source[key] === "object"
    ) {
      merge((target[key] = target[key] || {}), source[key]);
      return;
    }
    target[key] = source[key];
  });
} 