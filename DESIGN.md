# Design Brief — MSTC GLOBAL Luxury Gold/Black System

**Purpose:** Premium AI-powered business operating system with 50+ internal apps and 2,000+ AI agents. Dark luxury aesthetic with deep obsidian backgrounds (#06090f) and gold accents (#c9a84c). Every app responsive, fully interactive, real-time.

**Differentiation:** Unified design language, color-coded risk/status systems, frosted glass panels, smooth push-layout navigation.

## Palette

| Usage | Token | OKLCH | Hex Equiv |
|-------|-------|-------|----------|
| Background | Obsidian | 0.10 0.01 60 | #06090f |
| Primary Accent | Gold-500 | 0.72 0.18 76 | #c9a84c |
| Sidebar | Obsidian-700 | 0.12 0.015 62 | #0a0d14 |
| Foreground | Cream | 0.95 0.03 82 | #f5f5f0 |
| CRM New Lead | Blue | 0.65 0.15 220 | — |
| CRM Qualified | Green | 0.70 0.18 148 | — |
| Security Critical | Red | 0.704 0.191 22.216 | — |
| Security Clear | Green | 0.70 0.18 148 | — |

## Typography

| Font | Role |
|------|------|
| Playfair Display | Headings, titles (all h1–h6) |
| Inter | Body text, labels, forms |
| Cormorant Garamond | Quotes, premium callouts |

## Structural Zones

| Zone | Behavior |
|------|----------|
| **Sidebar** | Push-layout flex sibling: 280px expanded, 56px collapsed icon strip, smooth 300ms transition, X/close always works, no content overlap |
| **Content** | Flex child, shifts left when sidebar expands, full-width on mobile, scrollable |
| **Header** | Fixed top, gold border-bottom, obsidian background |
| **Chat Icon** | Bottom-right, pulsing gold, 56px, z-index 9000 |
| **Tutorial "?"** | Bottom-left, 44px minimum, auto-hide when menu open, z-index 8990 |
| **Modals** | Centered, scrollable inside, background scroll-locked |

## Tokens & Customization

- **Sidebar widths:** `--sidebar-width-open: 280px`, `--sidebar-width-collapsed: 56px`
- **Push layout transition:** `margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms`
- **Security tiers:** 7 color-coded bands (critical red → clear green)
- **AI agent statuses:** Active (green), Idle (purple), Processing (yellow), Error (red)
- **CRM pipeline:** New (blue) → Qualified (green) → Negotiation (gold) → Deal (green) → Post-Sale (teal)
- **Frosted glass:** `backdrop-filter: blur(12px); background: oklch(0.1 0.01 60 / 0.45);`
- **Skeleton loaders:** Animated gradient, pulsing background effect
- **Branded spinner:** Gold ring rotating 60ms cycle

## Constraints

- **No overlapping elements:** Sidebar has X/close, floating buttons stacked in separate zones
- **Responsive:** Mobile ≤767px uses full-screen drawer; desktop ≥768px shows sidebar alongside content
- **Tap targets:** All buttons, links ≥44×44px
- **Scrollable overlays:** `max-height: 85vh`, `-webkit-overflow-scrolling: touch`
- **Color only:** All OKLCH raw values, no hex/rgb literals in component code
- **Z-index ladder:** content (20) < sidebar (40) < chat/tutorial (9000) < modals (9999)

## Patterns

- **Gold gradient text:** Used on hero titles, section headers
- **Micro-interactions:** Hover lifts buttons 2px, shadow expands
- **Animation:** 0.3s cubic-bezier(0.4, 0, 0.2, 1) for all transitions
- **Loading state:** Skeleton pulse + branded gold spinner during async
- **Success/error feedback:** Toast via chat panel, not inline alerts

## Anti-Patterns

- No overlapping sidebars, menus, or chat icons
- No placeholder or demo data — all real or properly seeded
- No janky animations or scattered effects
- No untuned Tailwind defaults or Bootstrap colors
