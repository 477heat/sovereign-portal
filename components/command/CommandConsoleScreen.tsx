"use client";

import type { ReactNode } from "react";
import { AnimatedFrame } from "@/components/command/AnimatedFrame";
import { GlossaryText } from "@/components/GlossaryTerm";
import type { GlossaryTermKey } from "@/lib/glossary";
import type { CommandShellPanel } from "@/components/command/types";

type CommandConsoleScreenProps = {
  activePanel: CommandShellPanel;
  drawerTabSlot: ReactNode;
  glossaryTerms: GlossaryTermKey[];
  renderPanelBackdrop?: (panel: CommandShellPanel) => ReactNode;
};

export function CommandConsoleScreen({
  activePanel,
  drawerTabSlot,
  glossaryTerms,
  renderPanelBackdrop,
}: CommandConsoleScreenProps) {
  const activePanelBody = Array.isArray(activePanel.body)
    ? activePanel.body
    : [activePanel.body];
  const activePanelTitleWords = activePanel.title.split(/\s+/).filter(Boolean);

  return (
    <div className="command-room__console-screen">
      <AnimatedFrame
        className="command-room__viewport command-room__viewport--fullscreen"
        chromeOverlay={drawerTabSlot}
        label={activePanel.groupLabel}
      >
        <div
          className="engine-screen-grid absolute inset-0 opacity-45"
          aria-hidden="true"
        />
        <div
          className="engine-sweep absolute inset-x-0 top-0 h-28"
          aria-hidden="true"
        />

        <div className="command-room__viewport-content command-room__viewport-content--fullscreen relative z-10 grid content-start gap-8 p-5 md:p-8">
          <div
            className="command-room__active-panel"
            data-panel-id={activePanel.id}
            key={activePanel.id}
          >
            {renderPanelBackdrop?.(activePanel)}
            <h1
              aria-label={activePanel.title}
              className="command-lab__headline mt-3 max-w-3xl uppercase text-cyan-50"
            >
              {activePanelTitleWords.map((word, index) => (
                <span
                  aria-hidden="true"
                  className="command-lab__headline-word"
                  key={`${activePanel.id}-title-${word}-${index}`}
                >
                  {word}
                </span>
              ))}
            </h1>
            <p className="command-room__active-value mt-3 text-sm uppercase tracking-[0.24em] text-yellow-100/78">
              {activePanel.value}
            </p>
            <div className="mt-4 grid max-w-3xl gap-3 text-sm leading-7 text-cyan-50/72 md:text-base">
              {activePanelBody.map((paragraph, index) => (
                <p key={`${activePanel.id}-${index}`}>
                  {glossaryTerms.length > 0 ? (
                    <GlossaryText terms={glossaryTerms} text={paragraph} />
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>
      </AnimatedFrame>
    </div>
  );
}
