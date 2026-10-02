import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bike, ChevronDown, ShieldCheck, ShoppingBag, Store } from "lucide-react";
import { useGuidedDemo } from "@/components/fs/guided-demo";
import { DemoModeBadge } from "@/components/fs/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/demo/")({
  head: () => ({
    meta: [
      { title: "Interactive demo — Food Saarthi" },
      { name: "description", content: "See Food Saarthi through every role: customer, food partner, admin and a future delivery concept." },
      { property: "og:title", content: "Interactive demo — Food Saarthi" },
      { property: "og:description", content: "Choose a guided journey from partner to pickup." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DemoHub,
});

const cardBase = "group flex flex-col rounded-[1.875rem] p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift md:p-9";
const iconAnim = "size-10 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110";
const btn = "mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all sm:w-auto sm:self-start";

function DemoHub() {
  const { start } = useGuidedDemo();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">Food Saarthi • Interactive demo</p>
          <DemoModeBadge label="Demo mode" />
        </div>
        <h1 className="mx-auto mt-4 max-w-2xl text-4xl md:text-6xl">See Food Saarthi through every role.</h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">Choose a guided journey and explore how safe surplus food moves from partner to pickup.</p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <div className={cn(cardBase, "bg-primary text-primary-foreground")}>
          <ShoppingBag className={iconAnim} strokeWidth={1.5} aria-hidden />
          <h2 className="mt-10 text-3xl">I'm a customer</h2>
          <p className="mt-2 flex-1 opacity-85">Find a rescued meal, reserve it and collect it with a pickup ticket.</p>
          <button onClick={() => start("customer", { fresh: true })} className={cn(btn, "bg-saffron text-saffron-foreground hover:brightness-95")}>Start guided demo <ArrowRight className="size-4" /></button>
          <Link to="/demo/customer/start" className="mt-3 text-center text-xs font-semibold underline underline-offset-4 opacity-80 hover:opacity-100 sm:text-left">Or set your preferences first</Link>
        </div>

        <div className={cn(cardBase, "bg-saffron text-saffron-foreground")}>
          <Store className={iconAnim} strokeWidth={1.5} aria-hidden />
          <h2 className="mt-10 text-3xl">I'm a food partner</h2>
          <p className="mt-2 flex-1 opacity-85">Get verified, list surplus safely and verify pickups.</p>
          <Link to="/demo/partner/onboarding" className={cn(btn, "bg-forest-deep text-primary-foreground hover:bg-primary")}>Explore partner demo <ArrowRight className="size-4" /></Link>
        </div>

        <div className={cn(cardBase, "bg-coral text-coral-foreground")}>
          <Bike className={iconAnim} strokeWidth={1.5} aria-hidden />
          <h2 className="mt-10 text-3xl">I'm exploring future delivery support</h2>
          <p className="mt-2 flex-1 opacity-90">A future pilot concept — not active in the current pickup-first service.</p>
          <Link to="/demo/delivery-partner" className={cn(btn, "bg-card text-foreground hover:bg-background")}>View future simulation <ArrowRight className="size-4" /></Link>
        </div>

        <div className={cn(cardBase, "border border-primary/10 bg-secondary text-secondary-foreground")}>
          <ShieldCheck className={cn(iconAnim, "text-primary")} strokeWidth={1.5} aria-hidden />
          <h2 className="mt-10 text-3xl">I'm an admin</h2>
          <p className="mt-2 flex-1 opacity-85">Verify partners, moderate listings and resolve complaints.</p>
          <Link to="/demo/admin/start" className={cn(btn, "bg-primary text-primary-foreground hover:bg-forest-deep")}>Explore admin demo <ArrowRight className="size-4" /></Link>
        </div>
      </div>

      <details className="group mt-8 rounded-2xl border bg-card p-5 [&_summary::-webkit-details-marker]:hidden">
        <summary className="flex cursor-pointer items-center justify-between font-semibold">What will I see? <ChevronDown className="size-4 transition-transform group-open:rotate-180" /></summary>
        <ul className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <li><strong className="text-foreground">Customer:</strong> preferences, explore, meal safety details, simulated checkout, pickup ticket, impact.</li>
          <li><strong className="text-foreground">Food partner:</strong> onboarding, safety declaration, listing creation, live inventory, pickup verification, payouts.</li>
          <li><strong className="text-foreground">Admin:</strong> partner verification, listing moderation, complaint timeline, campus impact.</li>
          <li><strong className="text-foreground">Future delivery:</strong> a labelled simulation only — no real tasks, tracking or payments.</li>
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">All records are fictional demo data. Progress is saved on this device only.</p>
      </details>

      <p className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm font-semibold text-primary">
        <span>Affordable meals</span><span aria-hidden className="text-saffron">•</span><span>Less food waste</span><span aria-hidden className="text-saffron">•</span><span>Safer pickup</span>
      </p>
    </div>
  );
}
