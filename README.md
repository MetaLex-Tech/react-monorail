# Monorail

A React component for a segmented, overlapping rail of expandable “cars.” The active car grows to show its content; inactive cars collapse to an icon or a sliver. Hover previews a collapsed car without committing to it.

Monorail is for compact step indicators, phase selectors, and status strips where several items share one row and only one (or none) should take up space.

![Monorail demo](./demo/screenshot.png)

## Demo

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`). The gallery covers hover-to-reveal, icons, controlled mode, CSS height, status-only rails, and CSS theming.

## Features

- Uncontrolled or controlled active index
- Hover preview that can reveal collapsed labels
- Width animation via measured content (`ResizeObserver` + Motion)
- Clipped, overlapping car shapes (via [augmented-ui](https://augmented-ui.com/))
- Height and type size via CSS on the car; colors via CSS variables or Tailwind
- Optional non-button cars for display-only status
- Per-rail state isolation (multiple rails on one page do not share selection)

## Installation

```bash
npm install react-monorail
```

Peer dependencies: `react`, `react-dom`, and `tailwindcss` v3.

Import the CSS once in your app entry (or layout):

```ts
import "react-monorail/styles.css";
```

Point Tailwind at the package and the bundled preset so utility classes resolve:

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";
import monorailPreset from "react-monorail/tailwind-preset";

const config: Config = {
  presets: [monorailPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/react-monorail/src/**/*.{ts,tsx}",
  ],
};

export default config;
```

## Usage

`MonorailCar` children must be **direct** children of `Monorail`. Do not wrap a car in another component; `Monorail` clones each child to inject index and theme props.

Each car’s `children` is a `ReactNode`. Cars set `data-active` and `data-hovered` so you can show or hide labels with CSS.

```tsx
import { Monorail, MonorailCar } from "react-monorail";
import "react-monorail/styles.css";

export function Example() {
  return (
    <Monorail>
      <MonorailCar>Research</MonorailCar>
      <MonorailCar childrenWrapperClassName="[[data-active=false][data-hovered=false]_&]:hidden">
        Design
      </MonorailCar>
      <MonorailCar>Launch</MonorailCar>
    </Monorail>
  );
}
```

## API

### `Monorail`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `MonorailCar` element(s) | — | Direct `MonorailCar` children. |
| `activeIndex` | `number` | — | Controlled active car. Pass `-1` for none selected. |
| `initialActiveIndex` | `number` | `0` | Uncontrolled initial selection. |
| `onActiveIndexChange` | `(index: number) => void` | — | Fired when an uncontrolled car is activated. |
| `disableTransitions` | `boolean` | `false` | Snap width changes instead of animating. |
| `className` | `string` | — | Extra classes on the rail container. Override `--monorail-*` tokens here. |

### `MonorailCar`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | Label or content inside the car. |
| `icon` | `ReactNode` | — | Optional leading icon; stays visible when the label collapses. |
| `isButton` | `boolean` | `true` | When `false`, renders a `div` instead of a `button`. |
| `isActive` | `boolean` | `false` | Force this car active (ORed with the rail index). |
| `hasHoverEffect` | `boolean` | `false` | Apply the active background while hovered. |
| `onClick` | `(index: number) => void` | — | Used in controlled mode; the parent should update `activeIndex`. |
| `disableTransitions` | `boolean` | inherited | Override the rail transition setting. |
| `className` | `string` | — | Extra classes on the car element. Override height (`h-[38px]`), type size, and `--monorail-*` tokens here. |
| `activeClassName` | `string` | — | Extra classes when active or hover-highlighted. |
| `contentClassName` | `string` | — | Classes on the animated width wrapper. |
| `iconClassName` | `string` | — | Classes on the icon wrapper. |
| `childrenWrapperClassName` | `string` | — | Classes on the label wrapper. |
| `style` | `CSSProperties` | — | Inline styles on the car element. |

`index`, `totalItems`, `activeIndex`, and `onActiveIndexChange` on `MonorailCar` are injected by `Monorail`. You do not need to set them unless you are doing something unusual.

## Examples

**Hover to reveal** — keep a short label on the first and last cars; hide middle labels unless the car is `data-active` or `data-hovered`.

**Icons and labels** — pass `icon` so collapsed cars still have a hit target; hide the text unless the car is `data-active`.

**Controlled** — pass `activeIndex` and handle `onClick` on cars that should change the selection. Cars with `isButton={false}` are display-only.

**Status only** — `activeIndex={-1}` and `isButton={false}` for a non-interactive strip.

**Trailing action** — append a last car with `hasHoverEffect` and an `onClick` that does not have to select that car (for example, “Add phase”).

See `demo/Gallery.tsx` for complete examples of each pattern.

## Accessibility

- Cars default to `<button type="button">`, so they are in the tab order and activate with Enter and Space.
- `isButton={false}` renders a non-interactive `div`. Use it only for status/display rails, not for selectable cars.
- There is no `role="tablist"` / `aria-pressed` / roving tabindex today. If you need a tab or radio pattern, wrap the rail and set ARIA on your own labels, or treat the default buttons as a toolbar of actions.
- Focus styles are not bundled; the demo adds `:focus-visible` outlines. Add an equivalent in the host app.

## Development

```bash
npm install
npm run dev      # Vite gallery
npm test         # Vitest
npm run lint     # Biome + tsc
npm run build    # ESM + types via tsup
```

`npm run format` applies Biome fixes.

## Architecture

- **Direct children + `cloneElement`.** `Monorail` injects `index`, `totalItems`, and control props. Nested wrappers around `MonorailCar` will not receive those props.
- **Jotai per rail.** Each `Monorail` mounts a Jotai `Provider` so hover and selection state stay local. `ActiveIndexUpdater` (inside the provider) is what syncs `activeIndex` / `initialActiveIndex` into that store.
- **Measured width.** `MonorailContent` keeps an off-flow `w-max` row, observes it with `ResizeObserver`, and animates the outer width with Motion so labels can appear and disappear without jumping.
- **Clipped overlaps.** Adjacent cars use `data-augmented-ui` mixins (`tr-clip-y`, `l-clip-y`, rounded corners on the ends) plus `--aug-*` CSS variables. Right-side clip insets scale from the car’s measured height (28px base). The first/middle/last/single variants are driven by CVA.
- **Tailwind classes in source.** The package ships the tokens it needs (`--highlight-500`, `--neutral-500`, `--brand-white`) and a small Tailwind preset. Host apps must scan the package source so those utilities are generated.

## License

MIT. See [LICENSE](./LICENSE).
