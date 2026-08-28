import { Gallery } from "./Gallery";

export default function App() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-5 py-12 md:px-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-brand-white/40">
          react-monorail
        </p>
        <h1 className="text-3xl font-medium tracking-tight text-brand-white">
          Monorail
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-brand-white/60">
          A segmented rail of overlapping cars. The active car expands; inactive
          cars collapse to an icon or a sliver. Hover to preview, click to
          select.
        </p>
      </header>
      <Gallery />
    </div>
  );
}
