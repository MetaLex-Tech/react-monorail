import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Monorail, MonorailCar } from "react-monorail";
import { describe, expect, it, vi } from "vitest";
import { augRightClipVars } from "../src/components/Monorail";

function railButtons(container: HTMLElement) {
  return within(container).getAllByRole("button");
}

describe("Monorail", () => {
  it("renders cars and marks the first as active by default", () => {
    const { container } = render(
      <Monorail>
        <MonorailCar>{() => "Alpha"}</MonorailCar>
        <MonorailCar>{() => "Beta"}</MonorailCar>
      </Monorail>,
    );

    const buttons = railButtons(container);
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveAttribute("data-active", "true");
    expect(buttons[1]).toHaveAttribute("data-active", "false");
    expect(
      within(container).getByRole("button", { name: "Alpha" }),
    ).toBeInTheDocument();
    expect(
      within(container).getByRole("button", { name: "Beta" }),
    ).toBeInTheDocument();
  });

  it("moves the active car on click when uncontrolled", async () => {
    const user = userEvent.setup();
    const onActiveIndexChange = vi.fn();

    const { container } = render(
      <Monorail onActiveIndexChange={onActiveIndexChange}>
        <MonorailCar>{() => "Alpha"}</MonorailCar>
        <MonorailCar>{() => "Beta"}</MonorailCar>
      </Monorail>,
    );

    await user.click(within(container).getByRole("button", { name: "Beta" }));

    expect(
      within(container).getByRole("button", { name: "Alpha" }),
    ).toHaveAttribute("data-active", "false");
    expect(
      within(container).getByRole("button", { name: "Beta" }),
    ).toHaveAttribute("data-active", "true");
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
  });

  it("defers selection to the parent when controlled", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [activeIndex, setActiveIndex] = useState(0);
      return (
        <Monorail activeIndex={activeIndex}>
          <MonorailCar onClick={setActiveIndex}>{() => "Alpha"}</MonorailCar>
          <MonorailCar onClick={setActiveIndex}>{() => "Beta"}</MonorailCar>
        </Monorail>
      );
    }

    const { container } = render(<Controlled />);

    await user.click(within(container).getByRole("button", { name: "Beta" }));

    expect(
      within(container).getByRole("button", { name: "Beta" }),
    ).toHaveAttribute("data-active", "true");
  });

  it("calls onClick but does not self-update when controlled without a state update", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    const { container } = render(
      <Monorail activeIndex={0}>
        <MonorailCar onClick={onClick}>{() => "Alpha"}</MonorailCar>
        <MonorailCar onClick={onClick}>{() => "Beta"}</MonorailCar>
      </Monorail>,
    );

    await user.click(within(container).getByRole("button", { name: "Beta" }));

    expect(onClick).toHaveBeenCalledWith(1);
    expect(
      within(container).getByRole("button", { name: "Alpha" }),
    ).toHaveAttribute("data-active", "true");
    expect(
      within(container).getByRole("button", { name: "Beta" }),
    ).toHaveAttribute("data-active", "false");
  });

  it("renders a div instead of a button when isButton is false", () => {
    const { container } = render(
      <Monorail>
        <MonorailCar isButton={false}>{() => "Static"}</MonorailCar>
      </Monorail>,
    );

    expect(within(container).queryByRole("button")).not.toBeInTheDocument();
    expect(within(container).getByText("Static")).toBeInTheDocument();
    expect(
      within(container).getByText("Static").closest("[data-active]"),
    ).toHaveAttribute("data-active", "true");
  });

  it("selects no car when activeIndex is -1", () => {
    const { container } = render(
      <Monorail activeIndex={-1}>
        <MonorailCar>{() => "Alpha"}</MonorailCar>
        <MonorailCar>{() => "Beta"}</MonorailCar>
      </Monorail>,
    );

    for (const button of railButtons(container)) {
      expect(button).toHaveAttribute("data-active", "false");
    }
  });

  it("sets hovered state on mouse enter", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Monorail>
        <MonorailCar>{() => "Alpha"}</MonorailCar>
        <MonorailCar>{() => "Peek"}</MonorailCar>
      </Monorail>,
    );

    expect(railButtons(container)[1]).toHaveAttribute("data-hovered", "false");

    await user.hover(railButtons(container)[1]);

    expect(railButtons(container)[1]).toHaveAttribute("data-hovered", "true");
  });

  it("still renders when transitions are disabled", () => {
    const { container } = render(
      <Monorail disableTransitions>
        <MonorailCar>{() => "Alpha"}</MonorailCar>
        <MonorailCar>{() => "Beta"}</MonorailCar>
      </Monorail>,
    );

    expect(
      within(container).getByRole("button", { name: "Alpha" }),
    ).toBeInTheDocument();
    expect(
      within(container).getByRole("button", { name: "Beta" }),
    ).toBeInTheDocument();
  });

  it("defaults to the monorail-car class", () => {
    const { container } = render(
      <Monorail>
        <MonorailCar>{() => "Car"}</MonorailCar>
      </Monorail>,
    );

    expect(railButtons(container)[0].className).toContain("monorail-car");
  });

  it("defaults colors to the --monorail-* tokens", () => {
    const { container } = render(
      <Monorail>
        <MonorailCar>{() => "Car"}</MonorailCar>
        <MonorailCar>{() => "Other"}</MonorailCar>
      </Monorail>,
    );

    const [active, inactive] = railButtons(container);
    expect(active.className).toContain("monorail-car--active");
    expect(inactive.className).not.toContain("monorail-car--active");
  });

  it("lets className override height and type size", () => {
    const { container } = render(
      <Monorail>
        <MonorailCar className="h-[38px] text-sm">{() => "Tall"}</MonorailCar>
      </Monorail>,
    );

    expect(railButtons(container)[0].className).toContain("h-[38px]");
    expect(railButtons(container)[0].className).toContain("text-sm");
  });

  it("sets augmented-ui mixins for first, middle, last, and single cars", () => {
    const { container, rerender } = render(
      <Monorail>
        <MonorailCar>{() => "A"}</MonorailCar>
        <MonorailCar>{() => "B"}</MonorailCar>
        <MonorailCar>{() => "C"}</MonorailCar>
      </Monorail>,
    );

    const [first, middle, last] = railButtons(container);
    expect(first.getAttribute("data-augmented-ui")).toContain("tr-clip-y");
    expect(first.getAttribute("data-augmented-ui")).toContain("tl-round");
    expect(middle.getAttribute("data-augmented-ui")).toContain("l-clip-y");
    expect(middle.getAttribute("data-augmented-ui")).toContain("tr-clip-y");
    expect(last.getAttribute("data-augmented-ui")).toContain("l-clip-y");
    expect(last.getAttribute("data-augmented-ui")).toContain("tr-round");
    expect(last.getAttribute("data-augmented-ui")).not.toContain("tr-clip-y");

    rerender(
      <Monorail>
        <MonorailCar>{() => "Only"}</MonorailCar>
      </Monorail>,
    );

    const single =
      railButtons(container)[0].getAttribute("data-augmented-ui") ?? "";
    expect(single).not.toContain("tr-clip-y");
    expect(single).not.toContain("l-clip-y");
    expect(single).not.toContain("tl-round");
  });

  it("is keyboard activatable as a native button", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Monorail>
        <MonorailCar>{() => "Alpha"}</MonorailCar>
        <MonorailCar>{() => "Beta"}</MonorailCar>
      </Monorail>,
    );

    const [alpha, beta] = railButtons(container);
    alpha.focus();
    expect(alpha).toHaveFocus();

    await user.tab();
    expect(beta).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(beta).toHaveAttribute("data-active", "true");
  });

  it("respects initialActiveIndex in uncontrolled mode", () => {
    const { container } = render(
      <Monorail initialActiveIndex={1}>
        <MonorailCar>{() => "Alpha"}</MonorailCar>
        <MonorailCar>{() => "Beta"}</MonorailCar>
      </Monorail>,
    );

    expect(
      within(container).getByRole("button", { name: "Beta" }),
    ).toHaveAttribute("data-active", "true");
  });
});

describe("augRightClipVars", () => {
  it("matches the 28px base clip", () => {
    expect(augRightClipVars(28)).toMatchObject({
      "--aug-tr-inset1": "4px",
      "--aug-br-inset2": "4px",
      "--aug-tr1-width": "6px",
      "--aug-br1-width": "6px",
      "--aug-br1-height": "5px",
      "--aug-tr1-height": "5px",
    });
  });

  it("matches the 38px clip", () => {
    expect(augRightClipVars(38)).toMatchObject({
      "--aug-tr-inset1": "9px",
      "--aug-br-inset2": "9px",
      "--aug-tr1-width": "6px",
      "--aug-br1-width": "6px",
      "--aug-br1-height": "5px",
      "--aug-tr1-height": "5px",
    });
  });

  it("extrapolates inset at 50px and keeps clip height at 5px", () => {
    expect(augRightClipVars(50)).toMatchObject({
      "--aug-tr-inset1": "15px",
      "--aug-br-inset2": "15px",
      "--aug-tr1-width": "6px",
      "--aug-br1-width": "6px",
      "--aug-br1-height": "5px",
      "--aug-tr1-height": "5px",
    });
  });

  it("falls back to the 28px base when height is 0", () => {
    expect(augRightClipVars(0)).toEqual(augRightClipVars(28));
  });
});
