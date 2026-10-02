import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, ClipboardList, Clock, LifeBuoy, MapPin, Package, ShoppingBag, Store } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { listings, DEMO_MODE } from "@/lib/demo-data";
import { MealCard, btnClass, DemoModeBadge } from "@/components/fs/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Food Saarthi — Good food deserves a second chance" },
      { name: "description", content: "Discover safe surplus meals from nearby verified campus outlets at student-friendly prices. Reserve, pay and pick up on time." },
      { property: "og:title", content: "Food Saarthi — Good food deserves a second chance" },
      { property: "og:description", content: "Safe, sealed surplus meals from verified campus outlets — reserved and collected within a pickup window." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-[1.1fr_1fr] md:pt-16">
        <div className="rise-in">
          <label className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm shadow-soft">
            <MapPin className="size-4 text-coral" aria-hidden />
            <span className="sr-only">Campus</span>
            <select className="bg-transparent font-medium outline-none" defaultValue="north">
              <option value="north">North Campus · Pilot</option>
              <option value="south" disabled>South Campus · Soon</option>
            </select>
          </label>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.02] md:text-7xl">
            Good food deserves a <em className="text-coral not-italic md:italic">second chance.</em>
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted-foreground">Discover safe surplus meals from nearby verified outlets, at prices that fit student life.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/explore" className={btnClass("primary")}>Explore rescued meals <ArrowRight className="size-4" /></Link>
            <Link to="/how-it-works" className={btnClass("outline")}>See how Food Saarthi works</Link>
          </div>
        </div>
        <div className="relative">
          <img src={hero} alt="A student collecting a sealed meal box at a campus canteen counter" width={1280} height={1280} className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-lift" />
          <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl bg-card p-3 pr-5 shadow-lift md:-left-8">
            <span className="flex size-11 items-center justify-center rounded-xl bg-saffron text-saffron-foreground"><Clock className="size-5" /></span>
            <div>
              <p className="text-xs text-muted-foreground">Pickup window</p>
              <p className="font-semibold">9:15 – 10:00 PM · Block C</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12" aria-labelledby="live">
        <div className="mx-auto flex max-w-6xl items-end justify-between px-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-coral"><span className="size-2 animate-pulse rounded-full bg-coral" /> Live near you</p>
            <h2 id="live" className="mt-1 text-3xl md:text-4xl">Tonight's rescued meals</h2>
          </div>
          <Link to="/explore" className="hidden text-sm font-semibold text-primary md:block">View all →</Link>
        </div>
        <div className="mx-auto mt-6 flex max-w-6xl snap-x gap-4 overflow-x-auto px-4 pb-4">
          {listings.slice(0, 5).map((l) => (
            <MealCard key={l.id} l={l} className="w-[260px] shrink-0 snap-start" />
          ))}
        </div>
      </section>

      <HowItWorksStory />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="max-w-lg text-3xl md:text-4xl">Built on trust, not just discounts.</h2>
        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { i: BadgeCheck, t: "Verified outlets", d: "Every partner is reviewed with licence documents before listing." },
            { i: ClipboardList, t: "Clear food information", d: "Veg status, allergens, prep time and packaging on every listing." },
            { i: Clock, t: "Timed pickup", d: "Fixed windows keep food fresh and handovers predictable." },
            { i: LifeBuoy, t: "Support path", d: "Raise a complaint from any order; refunds are tracked end-to-end." },
          ].map((x) => (
            <div key={x.t} className="border-t-2 border-primary pt-4">
              <x.i className="size-6 text-primary" aria-hidden />
              <h3 className="mt-3 font-sans text-base font-semibold">{x.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-[2rem] bg-secondary p-8 md:p-12">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl md:text-4xl">Pilot impact</h2>
            {DEMO_MODE && <DemoModeBadge label="Demo metrics — not verified outcomes" />}
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[["1,284", "Meals rescued"], ["₹78,900", "Customer savings"], ["₹52,300", "Partner value recovered"], ["14", "Active outlets"]].map(([v, k]) => (
              <div key={k}>
                <dt className="text-sm text-muted-foreground">{k}</dt>
                <dd className="font-display text-4xl font-semibold text-primary md:text-5xl">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid items-center gap-8 rounded-[2rem] bg-primary p-8 text-primary-foreground md:grid-cols-[1.5fr_1fr] md:p-14">
          <div>
            <h2 className="text-3xl md:text-5xl">Turn end-of-day surplus into value.</h2>
            <p className="mt-3 max-w-md opacity-80">List sealed, unserved meals in under a minute. Customers come to you within your pickup window.</p>
          </div>
          <Link to="/partner-with-us" className={btnClass("saffron") + " justify-self-start md:justify-self-end"}>Become a partner <ArrowRight className="size-4" /></Link>
        </div>
      </section>
    </>
  );
}

export function HowItWorksStory() {
  const steps = [
    { i: Store, t: "Partner lists", d: "A verified mess or café lists sealed, unserved surplus with a pickup window." },
    { i: ShoppingBag, t: "You reserve", d: "See the final price and deadline, reserve your quantity and pay." },
    { i: Package, t: "Sealed pickup", d: "Show your code at the counter and collect your sealed meal." },
  ];
  return (
    <section className="bg-forest-deep py-20 text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-saffron">How it works</p>
        <h2 className="mt-2 max-w-xl text-3xl md:text-5xl">From closing counter to your hands in three moves.</h2>
        <ol className="relative mt-12 grid gap-10 md:grid-cols-3">
          <span className="absolute left-6 top-6 hidden h-px w-[calc(100%-3rem)] border-t border-dashed border-primary-foreground/30 md:block" aria-hidden />
          {steps.map((s, i) => (
            <li key={s.t} className="relative">
              <span className="relative flex size-12 items-center justify-center rounded-full bg-saffron text-saffron-foreground"><s.i className="size-5" /></span>
              <p className="mt-5 font-display text-5xl text-primary-foreground/20">0{i + 1}</p>
              <h3 className="text-2xl">{s.t}</h3>
              <p className="mt-2 text-sm opacity-75">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
