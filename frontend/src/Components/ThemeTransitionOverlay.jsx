import { useTheme } from "../contexts/ThemeContext";

// CSS keyframe animation — always starts from `from:` keyframe on first render,
// unlike CSS transitions which need a pre-existing "from" state. This is why
// the previous clip-path transition just blinked (no initial state to transition from).
const WIPE_STYLE = `
  @keyframes theme-corner-wipe {
    0%   { clip-path: circle(0% at 100% 0%); opacity: 1; }
    60%  { clip-path: circle(150% at 100% 0%); opacity: 1; }
    100% { clip-path: circle(150% at 100% 0%); opacity: 0; }
  }
`;

export default function ThemeTransitionOverlay() {
  const { transitioning, nextIsDark } = useTheme();
  if (!transitioning) return null;

  // Overlay fills with the TARGET theme color and sweeps across the page
  const targetBg = nextIsDark ? "#050714" : "#f4efe8";

  return (
    <>
      <style>{WIPE_STYLE}</style>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          pointerEvents: "none",
          background: targetBg,
          animation: "theme-corner-wipe 1.05s cubic-bezier(0.4, 0, 0.15, 1) forwards",
          // Soft feathered leading edge
          WebkitMaskImage:
            "radial-gradient(ellipse 95% 95% at 100% 0%, black 55%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 95% 95% at 100% 0%, black 55%, transparent 100%)",
        }}
      />
    </>
  );
}
