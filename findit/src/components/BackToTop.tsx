import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Floating glass button that appears once the reader is past the first screen. */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 620);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      className="glass-float anim-pop fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center"
      style={{ color: "var(--color-primary)" }}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <ArrowUp size={18} />
    </button>
  );
}
