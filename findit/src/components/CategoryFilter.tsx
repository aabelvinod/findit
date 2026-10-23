import { CATEGORIES } from "../types";
import { getCategoryIcon } from "../utils/categoryIcons";

interface CategoryFilterProps {
  value: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      <button
        type="button"
        className={`chip ${value === "" ? "active" : ""}`}
        onClick={() => onChange("")}
      >
        All categories
      </button>
      {CATEGORIES.map((category) => {
        const Icon = getCategoryIcon(category);
        return (
          <button
            key={category}
            type="button"
            className={`chip ${value === category ? "active" : ""}`}
            onClick={() => onChange(category)}
          >
            <Icon size={13} />
            {category}
          </button>
        );
      })}
    </div>
  );
}
