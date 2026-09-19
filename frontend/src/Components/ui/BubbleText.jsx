import { useState } from "react";

export function BubbleText({
  text = "Speak. Learn. Thrive.",
  headingClassName = "text-center font-cormorant font-light text-indigo-300",
  style = {},
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <h2
      onMouseLeave={() => setHoveredIndex(null)}
      className={headingClassName}
      style={style}
    >
      {text.split("").map((char, idx) => {
        const distance = hoveredIndex !== null ? Math.abs(hoveredIndex - idx) : null;
        let classes = "transition-all duration-300 ease-in-out cursor-default";
        switch (distance) {
          case 0:
            classes += " font-black text-white";
            break;
          case 1:
            classes += " font-medium text-indigo-100";
            break;
          case 2:
            classes += " font-light";
            break;
          default:
            break;
        }
        return (
          <span
            key={idx}
            onMouseEnter={() => setHoveredIndex(idx)}
            className={classes}
          >
            {char === " " ? " " : char}
          </span>
        );
      })}
    </h2>
  );
}
