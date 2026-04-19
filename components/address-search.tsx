"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/slug";
import type { GeocodeSuggestion } from "@/lib/types/geocode";

export function AddressSearch({
  placeholder = "Entrez une adresse...",
}: {
  placeholder?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
      if (!res.ok) return;
      const data: GeocodeSuggestion[] = await res.json();
      setSuggestions(data);
      setOpen(data.length > 0);
      setActiveIndex(-1);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const navigate = (suggestion: GeocodeSuggestion) => {
    setOpen(false);
    setQuery(suggestion.label);
    const slug = slugify(suggestion.label);
    const params = new URLSearchParams({
      lon: String(suggestion.lon),
      lat: String(suggestion.lat),
      citycode: suggestion.citycode,
    });
    router.push(`/adresse/${slug}?${params}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          navigate(suggestions[activeIndex]);
        }
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  };

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const el = listRef.current.children[activeIndex] as
        | HTMLElement
        | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <Input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls="address-listbox"
        aria-activedescendant={
          activeIndex >= 0 ? `address-option-${activeIndex}` : undefined
        }
        placeholder={placeholder}
        className="h-12 text-base"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
      />
      {loading && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          <div className="border-muted-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      )}
      {open && (
        <ul
          id="address-listbox"
          role="listbox"
          ref={listRef}
          className="bg-popover absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-md border shadow-lg"
        >
          {suggestions.map((s, i) => (
            <li
              key={`${s.lon}-${s.lat}-${i}`}
              id={`address-option-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              className={`cursor-pointer px-4 py-3 text-sm ${
                i === activeIndex ? "bg-accent text-accent-foreground" : ""
              }`}
              onMouseDown={() => navigate(s)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span className="font-medium">{s.label}</span>
              <span className="text-muted-foreground block text-xs">
                {s.context}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
