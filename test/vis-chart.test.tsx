import { jest } from "@jest/globals";
import { act, render } from "@testing-library/react";

const renderMock = jest.fn<(code: string) => void>();
const destroyMock = jest.fn();
const ctorMock = jest.fn();

jest.unstable_mockModule("@antv/gpt-vis", () => ({
  GPTVis: class {
    constructor(options: unknown) {
      ctorMock(options);
    }
    render = renderMock;
    destroy = destroyMock;
  },
}));

const { VisChart } = await import("../app/components/vis-chart");

const flush = () => act(() => new Promise((r) => setTimeout(r, 0)));

const code = "vis line\ndata\n  - time 2020\n    value 100";

describe("VisChart", () => {
  beforeEach(() => {
    renderMock.mockReset();
    destroyMock.mockReset();
    ctorMock.mockReset();
  });

  test("renders the code with the requested theme", async () => {
    const { container } = render(<VisChart code={code} theme="dark" />);
    await flush();

    const chartEl = container.querySelector(".vis-chart");
    expect(chartEl).not.toBeNull();
    expect(ctorMock).toHaveBeenCalledWith({
      container: chartEl,
      theme: "dark",
    });
    expect(renderMock).toHaveBeenCalledWith(code);
  });

  test("destroys the chart on unmount", async () => {
    const { unmount } = render(<VisChart code={code} theme="default" />);
    await flush();
    unmount();
    expect(destroyMock).toHaveBeenCalledTimes(1);
  });

  test("hides itself when rendering fails", async () => {
    renderMock.mockImplementation(() => {
      throw new Error("bad syntax");
    });
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const { container } = render(<VisChart code={code} theme="default" />);
    await flush();

    expect(container.querySelector(".vis-chart")).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  test("does not load the library for non-vis code", async () => {
    const { container } = render(
      <VisChart code="graph TD; A-->B" theme="default" />,
    );
    await flush();

    expect(container.querySelector(".vis-chart")).toBeNull();
    expect(ctorMock).not.toHaveBeenCalled();
  });
});
