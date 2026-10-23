import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  size?: "lg" | "md";
  autoFocus?: boolean;
}

/** A debounced search input so we never run search logic on every keystroke. */
export default function SearchBar({ value = "", onSearch, placeholder, size = "md", autoFocus }: SearchBarProps) {
  const [text, setText] = useState(value);
  const timeoutRef = useRef<number | undefined>(undefined);
  const searchedRef = useRef(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    // Only search when the text actually moves. Firing on mount would call
    // onSearch("") and bounce visitors off the page they just opened.
    if (searchedRef.current === text) return;
    searchedRef.current = text;

    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      onSearch(text);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, 280);
    return () => window.clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const isLarge = size === "lg";

  return (
    <div
      className={`glass-float flex w-full items-center gap-2.5 ${isLarge ? "px-5 py-3.5" : "px-4 py-2.5"}`}
    >
      <Search size={isLarge ? 20 : 18} style={{ color: "var(--color-text-soft)" }} aria-hidden="true" />
      <input
        type="search"
        value={text}
        autoFocus={autoFocus}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder || "Search by item, category, or location..."}
        aria-label="Search items"
        className={`w-full min-w-0 bg-transparent outline-none placeholder:[color:var(--color-text-soft)] ${isLarge ? "text-base" : "text-sm"}`}
        style={{ color: "var(--color-text)" }}
      />
      {text && (
        <button
          type="button"
          onClick={() => setText("")}
          aria-label="Clear search"
          className="shrink-0 rounded-full p-1 opacity-60 transition hover:opacity-100"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
