"use client";

import {
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  getGlossaryDefinition,
  type GlossaryTermKey,
} from "@/lib/glossary";

type GlossaryTermProps = {
  children?: ReactNode;
  term: GlossaryTermKey;
};

type GlossaryTextProps = {
  terms: GlossaryTermKey[];
  text: string;
};

type PopoverPosition = {
  left: number;
  top: number;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function GlossaryTerm({ children, term }: GlossaryTermProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [popoverPosition, setPopoverPosition] =
    useState<PopoverPosition | null>(null);
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const definitionId = useId();
  const definition = getGlossaryDefinition(term);
  const visible = open || hovered || focused;

  useEffect(() => {
    if (!visible) return;

    function updatePosition() {
      const rect = wrapperRef.current?.getBoundingClientRect();

      if (!rect) return;

      setPopoverPosition({
        left: Math.min(Math.max(rect.left + rect.width / 2, 16), window.innerWidth - 16),
        top: rect.top,
      });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [visible]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const popover =
    typeof document !== "undefined" && visible && popoverPosition
      ? createPortal(
          <span
            className="glossary-popover glossary-popover--visible"
            id={definitionId}
            role="tooltip"
            style={{
              left: `${popoverPosition.left}px`,
              top: `${popoverPosition.top}px`,
            }}
          >
            <span className="glossary-popover__label">{term}</span>
            <span className="glossary-popover__body">{definition}</span>
          </span>,
          document.body,
        )
      : null;

  return (
    <span
      ref={wrapperRef}
      className="glossary-term-wrap"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        aria-describedby={visible ? definitionId : undefined}
        aria-expanded={visible}
        className="glossary-term"
        onBlur={() => setFocused(false)}
        onClick={() => setOpen((current) => !current)}
        onFocus={() => setFocused(true)}
        type="button"
      >
        {children ?? term}
      </button>
      {popover}
    </span>
  );
}

export function GlossaryText({ terms, text }: GlossaryTextProps) {
  const sortedTerms = useMemo(
    () => [...terms].sort((a, b) => b.length - a.length),
    [terms],
  );
  const parts = useMemo(() => {
    if (sortedTerms.length === 0) return [text];

    const pattern = new RegExp(
      `(^|[^A-Za-z0-9])(${sortedTerms.map((term) => escapeRegExp(term)).join("|")})(?![A-Za-z0-9])`,
      "gi",
    );
    const nextParts: Array<string | { display: string; term: GlossaryTermKey }> =
      [];
    let lastIndex = 0;

    for (const match of text.matchAll(pattern)) {
      const fullMatchIndex = match.index ?? 0;
      const prefix = match[1] ?? "";
      const display = match[2] ?? "";
      const termStart = fullMatchIndex + prefix.length;
      const matchedTerm = sortedTerms.find(
        (term) => term.toLowerCase() === display.toLowerCase(),
      );

      if (!matchedTerm) continue;

      if (termStart > lastIndex) {
        nextParts.push(text.slice(lastIndex, termStart));
      }

      nextParts.push({ display, term: matchedTerm });
      lastIndex = termStart + display.length;
    }

    if (lastIndex < text.length) {
      nextParts.push(text.slice(lastIndex));
    }

    return nextParts;
  }, [sortedTerms, text]);

  return (
    <>
      {parts.map((part, index) => {
        if (typeof part === "string") {
          return part;
        }

        return (
          <GlossaryTerm key={`${part.display}-${index}`} term={part.term}>
            {part.display}
          </GlossaryTerm>
        );
      })}
    </>
  );
}
