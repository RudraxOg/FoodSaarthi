import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";
import { listings, outlets } from "@/lib/demo-data";
import { MealCard, DemoDataNotice } from "@/components/fs/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore rescued meals — Food Saarthi" },
      { name: "description", content: "Browse live surplus meals from verified campus outlets. Filter by veg, price, pickup time and outlet." },
      { property: "og:title", content: "Explore rescued meals — Food Saarthi" },
      { property: "og:description", content: "Live surplus meals near campus with clear pickup deadlines." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Explore,
});

type Diet = "all" | "veg" | "nonveg";

function Explore() {
  const [diet, setDiet] = useState<Diet>("all");
  const [maxPrice, setMaxPrice] = useState(100);
  const [soon, setSoon] = useState(false);
  const [outlet, setOutlet] = useState("all");

  const items = useMemo(
    () =>
      listings
        .filter((l) => l.partnerConfirmed && l.endsInMin > 0)
        .filter((l) => diet === "all" || (diet === "veg" ? l.veg : !l.veg))
        .filter((l) => l.price <= maxPrice)
        .filter((l) => !soon || l.endsInMin <= 45)
        .filter((l) => outlet === "all" || l.outletId === outlet)
        .sort((a, b) => Number(a.quantityLeft === 0) - Number(b.quantityLeft === 0) || a.endsInMin - b.endsInMin),
    [diet, maxPrice, soon, outlet],
  );

  const chip = (on: boolean) => cn("rounded-full border px-4 py-2 text-sm font-medium transition-colors", on ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl md:text-5xl">Rescued meals near you</h1>
      <p className="mt-2 text-muted-foreground">Sealed, unserved surplus — sorted by what closes first.</p>
      <div className="mt-5"><DemoDataNotice /></div>

      <div className="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filters" data-tour="filters">
        {(["all", "veg", "nonveg"] as Diet[]).map((d) => (
          <button key={d} className={chip(diet === d)} onClick={() => setDiet(d)} aria-pressed={diet === d}>
            {d === "all" ? "All" : d === "veg" ? "Veg" : "Non-veg"}
          </button>
        ))}
        <button className={chip(soon)} onClick={() => setSoon(!soon)} aria-pressed={soon}>Closing in 45 min</button>
        <select aria-label="Outlet" value={outlet} onChange={(e) => setOutlet(e.target.value)} className="rounded-full border bg-card px-4 py-2 text-sm font-medium">
          <option value="all">All outlets</option>
          {outlets.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
        <label className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm">
          Up to <strong className="tabular-nums">₹{maxPrice}</strong>
          <input type="range" min={20} max={100} step={5} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="accent-[var(--primary)]" />
        </label>
      </div>

      {items.length ? (
        <div data-tour="meal-cards" className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((l, i) => (
            <div key={l.id} className="rise-in" style={{ animationDelay: `${i * 50}ms` }}><MealCard l={l} /></div>
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center text-center">
          <SearchX className="size-10 text-muted-foreground" />
          <p className="mt-3 text-lg font-semibold">No meals match these filters</p>
          <p className="text-sm text-muted-foreground">Try widening the price or outlet filters.</p>
        </div>
      )}
    </div>
  );
}
