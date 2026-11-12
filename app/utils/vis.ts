import type { Theme } from "../store/config";

export type VisChartTheme = "default" | "dark";

/**
 * Whether a code block contains GPT-Vis syntax, e.g. "vis line\ndata ...".
 * Kept dependency-free so the chart library is only loaded when needed.
 */
export function isVisSyntax(code: string): boolean {
  return /^vis[ \t]+[\w-]+/.test(code.trimStart());
}

/** Map the app theme setting to a GPT-Vis built-in theme. */
export function getVisTheme(
  theme: `${Theme}`,
  prefersDark: boolean,
): VisChartTheme {
  if (theme === "dark") return "dark";
  if (theme === "light") return "default";
  return prefersDark ? "dark" : "default";
}
