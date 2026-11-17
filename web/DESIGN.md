# Historical design reference

This file previously documented the Greffe4IA visual system. That direction is
archived and must not override Ariane's current brand.

## Current source of truth

Use the following references for new interface work:

1. [`../BRAND.md`](../BRAND.md) for brand identity and core colors;
2. [`doc/rigueur-calme.md`](doc/rigueur-calme.md) for the product's “calm
   rigor” direction, components, and screen behavior;
3. the existing shadcn-based primitives in `frontend/src/components/ui/`;
4. the implemented design tokens in the frontend styles.

## Principles retained from the earlier system

- dense information must remain readable;
- status colors must support text labels, never replace them;
- warning states use restrained amber rather than alarmist red;
- cards, tables, and timelines use consistent spacing and hierarchy;
- professional validation and uncertainty remain visible at every decision
  point;
- the interface must work on laptop screens and preserve keyboard focus,
  contrast, and reduced-motion preferences.

Do not copy the former Greffe4IA name, teal palette, sidebar, or generated-image
prompts into Ariane. Preserve Ariane's indigo identity and the visual language
already implemented in the landing page, pitch materials, and demonstrator.
