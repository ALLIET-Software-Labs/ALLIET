---
name: ALLIET
colors:
  primary: "#0F1115"
  secondary: "#6B7280"
  background: "#F9FAFB"
  surface: "#FFFFFF"
  surface-alt: "#F3F4F6"
  text-primary: "#111827"
  text-secondary: "#4B5563"
  accent: "#1D4ED8"
  border: "#E5E7EB"
typography:
  font-family-body: "Inter, sans-serif"
  font-family-heading: "Inter, sans-serif"
  body-sm:
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.5"
  body-md:
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "1.6"
  heading-sm:
    fontSize: "24px"
    fontWeight: 600
    lineHeight: "1.3"
  heading-md:
    fontSize: "32px"
    fontWeight: 600
    lineHeight: "1.2"
  heading-lg:
    fontSize: "48px"
    fontWeight: 700
    lineHeight: "1.1"
  heading-xl:
    fontSize: "64px"
    fontWeight: 700
    lineHeight: "1.1"
    letterSpacing: "-0.02em"
shapes:
  rounded-none: "0px"
  rounded-sm: "4px"
  rounded-md: "8px"
  rounded-lg: "16px"
  rounded-full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{shapes.rounded-full}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    borderColor: "{colors.border}"
    borderWidth: "1px"
    rounded: "{shapes.rounded-full}"
---

## Overview
Editorial technology studio aesthetic. Architectural minimalism meets intelligent engineering. It focuses on a highly restrained, almost monochromatic core palette with deliberate, vibrant accent colors. Generous whitespace, asymmetric layouts, and crisp typography are foundational.

## Colors
- **Primary (`#0F1115`):** Deep navy-black used for primary text headings, dark backgrounds, and strong structural elements.
- **Background (`#F9FAFB`):** A soft off-white to provide a premium, editorial paper-like feel rather than a stark white.
- **Surface (`#FFFFFF`):** Pure white for cards and elevated sections to contrast subtly with the background.
- **Accent (`#1D4ED8`):** The signature vibrant blue from the ALLIET logo. Used very sparingly for primary CTAs, active states, and key visual accents.
- **Text Primary (`#111827`):** High contrast text for body copy.
- **Text Secondary (`#4B5563`):** Muted gray for captions, meta information, and secondary descriptions.

## Typography
- **Headings:** `Inter` (Bold/Semibold) with tight letter-spacing (`-0.02em`) on large display sizes to give a confident, modern technical feel.
- **Body:** `Inter` (Regular, 16px base, 1.6 line height) for exceptional readability.

## Layout
- 8pt grid system.
- Focus on large, intentional whitespace (macro-whitespace) between sections.
- Asymmetric 12-column grid layouts for editorial presentation rather than standard symmetrical card grids.

## Elevation & Depth
- Minimal use of shadows. Prefer 1px borders (`#E5E7EB`) to define boundaries.
- When shadows are used, they should be extremely diffused and soft, never harsh.

## Shapes
- Buttons and pills typically use `rounded-full` for a modern, approachable touch.
- Cards, images, and structural containers use `rounded-lg` or `rounded-none` depending on the architectural feel of the specific section.
- Micro-interactions use `rounded-sm`.

## Components
- **Primary Buttons:** High contrast dark background (`{colors.primary}`) with white text and `rounded-full`. Hover states slightly lift or lighten.
- **Cards:** White surface with a 1px border.
- **Images:** Treated as architectural elements. Often clipped or masked to fit the grid.

## Do's and Don'ts
- ✅ **DO** rely on typography and whitespace to create hierarchy.
- ✅ **DO** use the accent blue sparingly to guide the user's eye.
- ❌ **DON'T** use glowing effects, heavy drop shadows, or gradient backgrounds.
- ❌ **DON'T** rely on generic symmetrically-sized 3-column layouts everywhere.
