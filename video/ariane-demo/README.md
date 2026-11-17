# Ariane demo video

Standalone Remotion project used to produce Ariane's short presentation video.

## Preview

```bash
npm ci
npm run dev -- --no-open
```

Then open <http://localhost:3000/ArianeDemo>.

## Composition

The `ArianeDemo` composition is 44 seconds long, rendered at 1920 × 1080 and
30 frames per second. It contains four editable scenes:

1. the accumulated backlog;
2. the operational target of moving from six months to one month;
3. the demonstrator's actual workflow;
4. human validation and the award received.

The six-to-one-month target is explicitly presented as an ambition that must be
validated through a pilot.

## Verify

```bash
npm run lint
npm run build
```

The `out/` directory is reserved for exports and is not version-controlled.
