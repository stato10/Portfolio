---
name: STATO OS
description: A bright, colorful personal desktop for exploring real work.
colors:
  primary: "#0069d9"
  action: "#087aee"
  selection: "#d8e7fb"
  paper: "#ffffff"
  panel: "#f7f8fb"
  sidebar: "#eff1f5"
  ink: "#20232a"
  muted: "#59616e"
  line: "#dce0e6"
  terminal: "#1b2028"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-.03em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
    lineHeight: 1.65
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "13px"
  mono:
    fontFamily: "'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace"
rounded:
  control: "7px"
  navigation: "9px"
  window: "12px"
  icon: "14px"
  dock: "22px"
spacing:
  control-gap: "8px"
  card-gap: "12px"
  mobile-content: "24px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "10px 13px"
    typography: "{typography.label}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "10px 13px"
    typography: "{typography.label}"
  search:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "32px"
    padding: "0 10px"
  navigation-selected:
    backgroundColor: "{colors.selection}"
    rounded: "{rounded.navigation}"
    padding: "7px 9px"
  project-card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.window}"
  window:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.window}"
---

# Design System: STATO OS

## Overview

**Creative North Star: "A bright personal macOS desktop"**

Friendly, colorful operating-system navigation surrounds calm reading surfaces. The user explicitly chose native operating-system typography, light windows, vibrant app icons and a glass Dock, and rejected the dark dashboard appearance. STATO OS is a personal portfolio, not an Apple product.

This captures the implemented code-first world (contract seed d0af258f), not an approved image comp. Existing project layouts and content remain intact; the macOS stylesheet supplies their light presentation.

**Key Characteristics:**

- Bright coral, violet and ocean-blue SVG wallpaper.
- Translucent system chrome around white and pale-gray content.
- Blue selection, colorful icons and a dismissible Welcome window.

## Colors

### Primary

Native blue identifies interactive states; action blue fills primary buttons and selected filters. Pale blue marks selected sidebar rows without overwhelming their text.

### Neutral

Paper is the reading canvas; panel and sidebar tones organize supporting content. Ink carries headings, muted gray carries prose, and fine gray lines separate regions. The terminal deliberately retains its dark interior inside light window chrome.

Wallpaper and app-icon gradients supply the expressive coral, violet, orange and blue range. They are illustration treatments, not a replacement for the restrained content palette.

**The Light Reading Rule.** Keep portfolio reading surfaces white or pale gray; the intentional dark terminal is not a template for other apps.

## Typography

The display, body and interface labels use the native system stack in the frontmatter. This is an explicit user choice, not a placeholder for a future brand font. IBM Plex Mono remains for terminal and existing technical metadata.

The Welcome headline uses the display role, reducing to 35px on mobile. Its introductory copy uses the body role. Menu, titlebar and button labels sit at 13px; desktop icon labels use 12px semibold. Existing app-specific hierarchies remain; do not normalize every content screen to Welcome sizing. The light-window heading override resolves tracking to -.03em.

## Layout

The desktop fills the viewport: a 32px menu bar above floating, overlapping windows, two columns of desktop icons at right and a centered Dock 12px above the lower edge. The initial Welcome composition is a centered 740px window; inside, a 225px profile rail sits beside the main introduction.

At the 760px breakpoint, the existing mobile launcher, stage and bottom navigation replace desktop navigation. Welcome becomes one column, its portrait shrinks from 116px to 76px, content padding becomes 24px and buttons gain a 44px minimum height. Preserve internal scrolling and existing project grids, list mode, search and content routes.

## Elevation & Depth

Depth distinguishes window focus and system navigation. Active windows use the two-layer window shadow; inactive windows use a softer single shadow. The menu bar and Dock blur the wallpaper through translucent pale surfaces. Reading panels remain tonal and mostly flat; project cards retain their existing elevation behavior with a lighter hover shadow.

The Dock uses 30px blur and 150% saturation; the menu bar uses 28px blur and 160% saturation. Short inherited control and window transitions support focus, minimize and restore. Reduced-motion handling disables the documented shell transitions.

## Shapes

Windows and project cards use softly rounded rectangular frames. Controls are tighter, navigation rows slightly rounder, and the glass Dock forms a larger rounded tray. App icons are colorful rounded squares; the profile portrait and traffic-light controls are circles. Fine borders separate surfaces without luminous outlines.

## Components

- **Welcome:** A pale blue/lilac portrait rail and white introduction, primary Projects action, secondary Resume action, compact reel and search shortcut. It is a real dismissible window; Projects and Resume actions close Welcome before opening their destination.
- **Buttons:** Primary blue with white text; secondary white with a fine gray border. Welcome buttons darken subtly on hover. Light-window links, buttons and inputs use a visible blue 3px focus outline with 2px offset.
- **Search:** Compact white rounded field with a fine gray border; Spotlight is a larger translucent light system panel with pale-blue active results.
- **Navigation:** Finder-like gray sidebar, blue icons and pale-blue selected rows. Mobile navigation uses the same light chrome and blue active-state vocabulary.
- **Filters and cards:** Light-gray filter buttons become blue with white text when pressed. White project cards retain real project media, pale stack labels, subtle borders and a light footer; preserve the existing grid/list behavior.
- **Window chrome:** A light-gray gradient titlebar, centered title and red/yellow/green close, minimize and maximize controls. Focus is communicated through depth rather than a neon accent.
- **Dock and icons:** Glass tray, colorful app-specific gradients, small running indicators, readable tooltips and existing hover lift. Terminal alone uses a dark icon and dark content surface.

## Do's and Don'ts

### Do:

- Do keep native system typography and familiar window controls.
- Do use wallpaper and colorful app icons for personality, with light content surfaces for reading.
- Do preserve dismissible Welcome behavior, keyboard focus and reduced-motion support.
- Do retain existing content, layouts, project evidence and navigation paths.

### Don't:

- Don't return the desktop or portfolio apps to a dark dashboard appearance.
- Don't turn the intentional terminal exception into a global dark theme.
- Don't imply Apple affiliation or an approved visual comp.
