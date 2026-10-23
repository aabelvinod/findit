import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  direction?: "up" | "left" | "right" | "zoom";
  delay?: number;
  style?: CSSProperties;
  id?: string;
}

/**
 * Fades content in the first time it enters the viewport. The observer
 * disconnects after firing so long lists never keep live listeners.
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  direction = "up",
  delay = 0,
  style,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    const reduce =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (!node || reduce || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    // Anything already on screen shows immediately — waiting for the observer
    // would leave the hero blank for a frame or two on slower devices.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      id={id}
      ref={ref}
      data-reveal={direction}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ ...style, ...(delay ? { "--reveal-delay": `${delay}ms` } : {}) } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
