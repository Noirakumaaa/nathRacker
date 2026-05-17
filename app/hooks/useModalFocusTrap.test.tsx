import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useModalFocusTrap } from "./useModalFocusTrap";
import React from "react";

function TestDialog({ onClose }: { onClose: () => void }) {
  const ref = useModalFocusTrap(onClose);
  return (
    <div ref={ref} tabIndex={-1} data-testid="dialog">
      <button>Close</button>
    </div>
  );
}

describe("useModalFocusTrap", () => {
  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(React.createElement(TestDialog, { onClose }));

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does not call onClose for other keys", () => {
    const onClose = vi.fn();
    render(React.createElement(TestDialog, { onClose }));

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("removes event listener on unmount", () => {
    const onClose = vi.fn();
    const { unmount } = render(React.createElement(TestDialog, { onClose }));
    unmount();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("renders dialog element with ref", () => {
    const onClose = vi.fn();
    render(React.createElement(TestDialog, { onClose }));
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });
});
