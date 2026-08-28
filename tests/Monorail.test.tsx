import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Monorail, MonorailCar } from "react-monorail";
import { describe, expect, it, vi } from "vitest";

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

  it("reveals hover-gated content on mouse enter", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Monorail>
        <MonorailCar>{() => "Alpha"}</MonorailCar>
        <MonorailCar>
          {(state) => (state.isActive || state.isHovered ? "Peek" : null)}
        </MonorailCar>
      </Monorail>,
    );

    expect(within(container).queryByText("Peek")).not.toBeInTheDocument();

    await user.hover(railButtons(container)[1]);

    expect(within(container).getByText("Peek")).toBeInTheDocument();
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

  it("applies highlight and neutral color tokens", () => {
    const { container, rerender } = render(
      <Monorail color="highlight">
        <MonorailCar>{() => "Car"}</MonorailCar>
      </Monorail>,
    );

    expect(railButtons(container)[0].className).toContain(
      "[--monorail-color:var(--highlight-500)]",
    );

    rerender(
      <Monorail color="neutral">
        <MonorailCar>{() => "Car"}</MonorailCar>
      </Monorail>,
    );

    expect(railButtons(container)[0].className).toContain(
      "[--monorail-color:var(--neutral-500)]",
    );
  });

  it("applies large size classes", () => {
    const { container } = render(
      <Monorail>
        <MonorailCar size="large">{() => "Large"}</MonorailCar>
      </Monorail>,
    );

    expect(railButtons(container)[0].className).toContain("h-[34px]");
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
