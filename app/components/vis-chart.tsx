import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { isVisSyntax, VisChartTheme } from "../utils/vis";

/**
 * Renders a ```vis code block as a chart with GPT-Vis.
 * The library is loaded on demand, so it only costs bandwidth when a chart is shown.
 */
export function VisChart(props: { code: string; theme: VisChartTheme }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const container = ref.current;
    if (!container || !isVisSyntax(props.code)) return;

    let disposed = false;
    let chart: { destroy: () => void } | undefined;

    import("@antv/gpt-vis")
      .then(({ GPTVis }) => {
        if (disposed) return;
        const vis = new GPTVis({ container, theme: props.theme });
        chart = vis;
        vis.render(props.code);
      })
      .catch((e) => {
        if (disposed) return;
        setHasError(true);
        console.error("[Vis] ", e?.message ?? e);
      });

    return () => {
      disposed = true;
      try {
        chart?.destroy();
      } catch {}
    };
  }, [props.code, props.theme]);

  if (hasError || !isVisSyntax(props.code)) {
    return null;
  }

  return <div className={clsx("no-dark", "vis-chart")} ref={ref} />;
}
