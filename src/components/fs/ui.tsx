import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Clock, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { getOutlet, type Listing } from "@/lib/demo-data";

export function VegMark({ veg }: { veg: boolean }) {
  return (
    <span
      role="img"
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
      className={cn("inline-flex size-4 items-center justify-center rounded-[3px] border-2 bg-card", veg ? "border-veg" : "border-nonveg")}
    >
      <span className={cn("size-1.5 rounded-full", veg ? "bg-veg" : "bg-nonveg")} />
    </span>
  );
}

export function DemoModeBadge({ label = "Demo data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-saffron/60 bg-saffron/20 px-2.5 py-0.5 text-xs font-semibold text-saffron-foreground">
      <FlaskConical className="size-3" aria-hidden /> {label}
    </span>
  );
}

export function DemoDataNotice({ children }: { children?: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-saffron/50 bg-saffron/10 px-4 py-3 text-sm text-saffron-foreground">
      <FlaskConical className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>{children ?? "You're viewing synthetic demo data. Outlets, meals and payments are simulated."}</p>
    </div>
  );
}

/** Minutes remaining, computed client-side only to avoid hydration mismatch. */
export function useMinutesLeft(endsInMin: number) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const end = Date.now() + endsInMin * 60_000;
    const tick = () => setLeft(Math.max(0, Math.round((end - Date.now()) / 1000)));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [endsInMin]);
  return left; // seconds
}

export function fmt(secs: number | null) {
  if (secs === null) return "--:--";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return h ? `${h}h ${m}m` : `${m}:${String(s).padStart(2, "0")}`;
}

export function DeadlineChip({ endsInMin, soldOut }: { endsInMin: number; soldOut?: boolean }) {
  const secs = useMinutesLeft(endsInMin);
  if (soldOut) return <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">Sold out</span>;
  const urgent = secs !== null && secs < 20 * 60;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums",
        urgent ? "pulse-urgent bg-coral text-coral-foreground" : "bg-primary text-primary-foreground",
      )}
    >
      <Clock className="size-3" aria-hidden /> {urgent ? "Closing " : "Ends in "}
      {fmt(secs)}
    </span>
  );
}

export function CountdownRing({ endsInMin, total = 120 }: { endsInMin: number; total?: number }) {
  const secs = useMinutesLeft(endsInMin);
  const pct = secs === null ? 1 : Math.min(1, secs / (total * 60));
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-28">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" className="stroke-muted" />
        <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} className={cn("transition-all", secs !== null && secs < 1200 ? "stroke-coral" : "stroke-primary")} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold tabular-nums">{fmt(secs)}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">left</span>
      </div>
    </div>
  );
}

export function MealCard({ l, className }: { l: Listing; className?: string }) {
  const o = getOutlet(l.outletId);
  const soldOut = l.quantityLeft === 0;
  const off = Math.round((1 - l.price / l.originalPrice) * 100);
  return (
    <Link
      to="/listing/$id"
      params={{ id: l.id }}
      className={cn("group block overflow-hidden rounded-2xl border bg-card shadow-soft card-lift", soldOut && "opacity-70", className)}
    >
      <div className="relative aspect-[5/4] overflow-hidden">
        <img src={l.image} alt={l.name} loading="lazy" width={912} height={736} className={cn("size-full object-cover transition-transform duration-500 group-hover:scale-105", soldOut && "grayscale")} />
        <div className="absolute left-3 top-3"><DeadlineChip endsInMin={l.endsInMin} soldOut={soldOut} /></div>
        <span className="absolute right-3 top-3 rounded-full bg-saffron px-2 py-0.5 text-xs font-bold text-saffron-foreground">-{off}%</span>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <VegMark veg={l.veg} /> <span className="truncate">{o.name}</span> · <span>{o.distance}</span>
        </div>
        <h3 className="text-lg font-semibold leading-tight">{l.name}</h3>
        <div className="flex items-end justify-between">
          <p className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">₹{l.price}</span>
            <span className="text-sm text-muted-foreground line-through">₹{l.originalPrice}</span>
          </p>
          <span className={cn("text-xs font-medium", l.quantityLeft <= 2 && !soldOut ? "text-coral" : "text-muted-foreground")}>
            {soldOut ? "All rescued" : `${l.quantityLeft} left`}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function Btn({ variant = "primary", className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "saffron" | "ghost" }) {
  return <button {...p} className={cn(btnClass(variant), className)} />;
}

export function btnClass(variant: "primary" | "saffron" | "ghost" | "outline" = "primary") {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    variant === "primary" && "bg-primary text-primary-foreground hover:bg-forest-deep shadow-soft",
    variant === "saffron" && "bg-saffron text-saffron-foreground hover:brightness-95 shadow-soft",
    variant === "ghost" && "text-foreground hover:bg-muted",
    variant === "outline" && "border border-foreground/20 bg-card text-foreground hover:bg-muted",
  );
}
