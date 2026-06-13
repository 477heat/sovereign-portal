"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatedFrame } from "@/components/command/AnimatedFrame";
import { AssemblingPanel } from "@/components/command/AssemblingPanel";
import { MovingLines } from "@/components/command/MovingLines";
import { PuffField } from "@/components/command/PuffField";
import { GlossaryText } from "@/components/GlossaryTerm";
import TunnelBackdrop from "@/components/TunnelBackdrop";
import type { GlossaryTermKey } from "@/lib/glossary";

const vanguardGlossaryTerms: GlossaryTermKey[] = [
  "Access Token",
  "Artifact Item",
  "Base network gas",
  "Genesis",
  "Genesis Mint",
  "Full Natal Chart",
  "Kindred Creature",
  "Launch Day",
  "Marketplace",
  "Royalty",
  "Sovereign Engine",
  "Token",
  "Traceable",
  "Vanguard",
  "Wallet",
  "wallet-linked",
];

type DrawerBasePanel = {
  id: string;
  number: string;
  label: string;
  value: string;
  title: string;
  body: string;
  link?: {
    href: string;
    label: string;
  };
};

type DrawerPanelGroup = {
  label: string;
  eyebrow: string;
  panels: DrawerBasePanel[];
};

type DrawerPanel = DrawerBasePanel & {
  groupLabel: string;
  eyebrow: string;
};

const statusPanels: DrawerBasePanel[] = [
  {
    id: "rail-origin",
    number: "01",
    label: "Initial Supporters",
    value: "Origin",
    title: "Vanguard Origin",
    body: "Pre-launch supporters enter as Vanguards, the first public access class for the Engine.",
  },
  {
    id: "rail-wallet",
    number: "02",
    label: "Wallet",
    value: "Linked",
    title: "Wallet Linked",
    body: "Recognition is designed around the wallet-linked Genesis mint, not anonymous mint farming.",
  },
  {
    id: "rail-legacy",
    number: "03",
    label: "Legacy",
    value: "Carry-forward",
    title: "Carry-forward Status",
    body: "Vanguard status carries into Progeny drops, early rate classes, and future project systems.",
  },
  {
    id: "rail-routing",
    number: "04",
    label: "Routing",
    value: "Conditional",
    title: "Royalty Routing",
    body: "Royalty participation depends on contract rules, marketplace support, and published terms.",
  },
];

const policyPanels = [
  {
    id: "initial-supporters",
    number: "01",
    title: "Launch Day Progeny",
    body: "The first Progeny mint is the Kindred Creature Mint on Launch Day. Pre-launch supporters receive it for $0.02 plus Base network gas, currently estimated around $0.04-$0.06 but subject to network conditions.",
    link: { href: "/whitepaper#vanguard", label: "Read Vanguard" },
  },
  {
    id: "wallet-linked",
    number: "02",
    title: "Included Engine Mints",
    body: "Vanguards receive the Full Natal Chart Mint when the Engine is ready, plus an Artifact Item Mint at the same early-supporter rate.",
    link: { href: "/whitepaper#genesis-access", label: "Open Access" },
  },
  {
    id: "legacy",
    number: "03",
    title: "Future Progeny Rates",
    body: "Future Progeny mints use a Vanguard rate class when a project supports it, with final pricing set by each project's published specs. In-house Progeny will publish its own launch terms before each release.",
    link: { href: "/economics#developer-access", label: "Builder Use" },
  },
  {
    id: "royalty-routing",
    number: "04",
    title: "Third-party Progeny",
    body: "Third-party Progeny pricing will be set by the developer building that project. Vanguard access may still apply, but each outside launch will publish its own pricing, access rules, and mint details.",
    link: { href: "/economics#royalty-routing", label: "Open Routing" },
  },
];

const drawerGroups: DrawerPanelGroup[] = [
  {
    label: "Vanguard Rail",
    eyebrow: "Initial Supporter Layer",
    panels: statusPanels,
  },
  {
    label: "Privilege Queue",
    eyebrow: "Launch Access Layer",
    panels: policyPanels.map((panel) => ({
      ...panel,
      label: panel.title,
      value: panel.link.label,
    })),
  },
];

const drawerPanels: DrawerPanel[] = drawerGroups.flatMap((group) =>
  group.panels.map((panel) => ({
    ...panel,
    groupLabel: group.label,
    eyebrow: group.eyebrow,
  })),
);

export default function VanguardPrivilegesPage() {
  const [activePanelId, setActivePanelId] = useState(drawerPanels[0].id);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activePanel =
    drawerPanels.find((panel) => panel.id === activePanelId) ?? drawerPanels[0];

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    const scrollY = window.scrollY;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyWidth = document.body.style.width;
    const previousHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.width = previousBodyWidth;
      document.documentElement.style.overscrollBehavior = previousHtmlOverscroll;
      window.scrollTo(0, scrollY);
    };
  }, [drawerOpen]);

  return (
    <main className="info-control-page command-room-page relative isolate min-h-screen overflow-x-hidden bg-black px-4 py-5 font-mono text-white max-sm:!px-2 md:px-8">
      <TunnelBackdrop layer="page" variant="diffused" rings />

      <div className="command-room relative z-10 mx-auto flex min-h-screen max-w-[96rem] flex-col">
        <section className="command-room__grid command-room__grid--drawer grid flex-1 gap-5 py-5">
          <section className="command-room__console-body">
            <div className="command-room__console-screen">
              <AnimatedFrame
                className="command-room__viewport command-room__viewport--fullscreen"
                label={activePanel.groupLabel}
              >
            <MovingLines />
            <PuffField />
            <div className="engine-screen-grid absolute inset-0 opacity-45" aria-hidden="true" />
            <div className="engine-sweep absolute inset-x-0 top-0 h-28" aria-hidden="true" />
            <div className="command-room__beacon" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <div className="command-room__viewport-content command-room__viewport-content--fullscreen relative z-10 grid content-start gap-8 p-5 md:p-8">
              <div className="command-room__active-panel" key={activePanel.id}>
                <div
                  className="command-room__signal-row"
                  style={{
                    background: "rgba(3, 17, 23, 0.78)",
                    border: "1px solid rgba(165, 243, 252, 0.2)",
                    boxShadow: "0 0 18px rgba(125, 211, 252, 0.1)",
                    clipPath:
                      "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                    flexWrap: "nowrap",
                    fontSize: "0.42rem",
                    gap: "0.24rem",
                    justifySelf: "start",
                    letterSpacing: "0.06em",
                    marginBottom: "-0.75rem",
                    marginLeft: "-0.35rem",
                    maxWidth: "100%",
                    padding: "0.36rem 0.5rem",
                    transform: "translateY(-1.22rem)",
                    whiteSpace: "nowrap",
                    width: "fit-content",
                  }}
                >
                  <b style={{ fontWeight: 500 }}>{activePanel.groupLabel}</b>
                  <i
                    aria-hidden="true"
                    style={{
                      background: "rgba(165, 243, 252, 0.24)",
                      display: "block",
                      flex: "0 0 0.34rem",
                      height: "1px",
                    }}
                  />
                  <b style={{ fontWeight: 500 }}>{activePanel.number}</b>
                  <i
                    aria-hidden="true"
                    style={{
                      background: "rgba(165, 243, 252, 0.24)",
                      display: "block",
                      flex: "0 0 0.34rem",
                      height: "1px",
                    }}
                  />
                  <b style={{ fontWeight: 500 }}>{activePanel.eyebrow}</b>
                </div>
                <p className="mt-3 text-[0.68rem] uppercase tracking-[0.32em] text-cyan-100/58">
                  {activePanel.eyebrow}
                </p>
                <h1 className="command-lab__headline mt-3 max-w-3xl text-3xl uppercase leading-tight text-cyan-50 max-sm:!text-[1.75rem] max-sm:!leading-[1.15] md:text-5xl">
                  {activePanel.title}
                </h1>
                <p className="command-room__active-value mt-3 text-sm uppercase tracking-[0.24em] text-yellow-100/78">
                  {activePanel.value}
                </p>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-cyan-50/72 md:text-base">
                  <GlossaryText
                    terms={vanguardGlossaryTerms}
                    text={activePanel.body}
                  />
                </p>
                {activePanel.link ? (
                  <Link
                    className="chamfer-nav-link chamfer-nav-link--compact mt-6"
                    href={activePanel.link.href}
                  >
                    {activePanel.link.label}
                  </Link>
                ) : null}
              </div>
            </div>
              </AnimatedFrame>
            </div>

            <div className="command-room__console-dock" aria-hidden="true">
              <div className="command-room__console-dock-cell" />
              <div className="command-room__console-dock-cell" />
              <div className="command-room__console-dock-cell" />
              <div className="command-room__console-dock-cell" />
            </div>
          </section>

          <div
            className={`command-room__drawer-shell ${
              drawerOpen
                ? "command-room__drawer-shell--open"
                : "command-room__drawer-shell--closed"
            }`}
          >
            <button
              aria-controls="vanguard-drawer"
              aria-expanded={drawerOpen}
              className="command-room__drawer-tab"
              onClick={() => setDrawerOpen((open) => !open)}
              type="button"
            >
              {drawerOpen ? "Stow Vanguard Drawer" : "Open"}
            </button>

            <AssemblingPanel
              className="command-room__drawer border border-cyan-200/15 bg-black/50 p-4"
              delay="medium"
            >
              <div className="command-room__drawer-content" id="vanguard-drawer">
                <div className="command-room__drawer-groups">
                  {drawerGroups.map((group) => (
                    <section className="command-room__drawer-group" key={group.label}>
                      <div className="command-room__drawer-label">{group.label}</div>
                      <div className="command-room__drawer-button-grid">
                        {group.panels.map((panel, index) => (
                          <button
                            aria-pressed={activePanelId === panel.id}
                            className={`chamfer-hero-link command-room__drawer-button ${
                              index % 2 === 1 ? "chamfer-hero-link--opposite" : ""
                            } ${
                              activePanelId === panel.id
                                ? "command-room__drawer-button--active"
                                : ""
                            }`}
                            key={panel.id}
                            onClick={() => {
                              setActivePanelId(panel.id);
                              setDrawerOpen(false);
                            }}
                            type="button"
                          >
                            <span>{panel.label}</span>
                            <small>{panel.value}</small>
                          </button>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                <div className="command-room__drawer-actions">
                  <Link href="/" className="chamfer-nav-link chamfer-nav-link--compact">
                    Home
                  </Link>
                  <Link href="/engine-lab" className="chamfer-nav-link chamfer-nav-link--compact chamfer-nav-link--opposite">
                    Engine Lab
                  </Link>
                  <Link href="/economics" className="chamfer-nav-link chamfer-nav-link--compact chamfer-nav-link--opposite">
                    Access
                  </Link>
                  <Link href="/whitepaper#vanguard" className="chamfer-nav-link chamfer-nav-link--compact">
                    Whitepaper
                  </Link>
                  <Link href="/portal" className="chamfer-nav-link chamfer-nav-link--compact command-room__drawer-action--primary">
                    Portal
                  </Link>
                </div>
              </div>
            </AssemblingPanel>
          </div>
        </section>
      </div>
    </main>
  );
}
