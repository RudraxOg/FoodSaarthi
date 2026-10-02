import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bike, ShieldCheck, ShoppingBag, Store } from "lucide-react";
import { useGuidedDemo } from "@/components/fs/guided-demo";
import { DemoDataNotice } from "@/components/fs/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Guided demo — Food Saarthi" },
      { name: "description", content: "Experience Food Saarthi as a customer, food partner or admin with a step-by-step guided tour." },
      { property: "og:title", content: "Guided demo — Food Saarthi" },
      { property: "og:description", content: "Pick a role and walk through the real product." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DemoHub,
});

function DemoHub() {
  const { start } = useGuidedDemo();
  const roles = [
    { id: "customer", t: "I'm a customer", d: "Find a rescued meal, reserve it and collect with a pickup ticket.", i: ShoppingBag, tone: "bg-primary text-primary-foreground", ready: true },
    { id: "partner", t: "I'm a food partner", d: "Get verified, list surplus safely and verify pickups.", i: Store, tone: "bg-saffron text-saffron-foreground", ready: false },
    { id: "delivery", t: "I'm exploring future delivery support", d: "Future pilot concept — not active in the current pickup-first service.", i: Bike, tone: "bg-coral text-coral-foreground", ready: false },
    { id: "admin", t: "I'm an admin", d: "Verify partners, moderate listings and resolve complaints.", i: ShieldCheck, tone: "bg-secondary text-secondary-foreground", ready: false },
  ] as const;
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-widest text-coral">Guided demo</p>
      <h1 className="mt-2 text-4xl md:text-6xl">Choose how you'd like to explore.</h1>
      <p className="mt-3 max-w-lg text-muted-foreground">Each tour walks through real screens with highlighted steps. Use arrow keys to move, Esc to exit.</p>
      <div className="mt-5"><DemoDataNotice /></div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {roles.map((r) => (
          <div key={r.id} className={cn("flex flex-col rounded-[2rem] p-7 shadow-soft", r.tone, r.ready && "card-lift")}>
            <r.i className="size-9" aria-hidden />
            <h2 className="mt-8 text-2xl">{r.t}</h2>
            <p className="mt-2 flex-1 text-sm opacity-80">{r.d}</p>
            {r.ready ? (
              <button onClick={() => start("customer")} className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-saffron px-5 py-2.5 text-sm font-semibold text-saffron-foreground">
                Start guided demo <ArrowRight className="size-4" />
              </button>
            ) : (
              <span className="mt-6 self-start rounded-full border border-current/30 px-4 py-2 text-xs font-semibold opacity-70">Tour coming in next phase</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
