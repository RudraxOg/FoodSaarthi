import { Link } from "@tanstack/react-router";
import { Compass, Home, Receipt, Sparkles, Leaf } from "lucide-react";
import { DemoModeBadge } from "./ui";
import { DEMO_MODE } from "@/lib/demo-data";

const nav = [
  { to: "/explore", label: "Explore" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/safety", label: "Safety" },
  { to: "/partner-with-us", label: "For partners" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="Food Saarthi home">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-saffron"><Leaf className="size-5" /></span>
      <span className="font-display text-xl font-semibold tracking-tight">Food Saarthi</span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Logo />
        {DEMO_MODE && <span className="hidden sm:inline"><DemoModeBadge /></span>}
        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Main">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground bg-muted" }}>
              {n.label}
            </Link>
          ))}
          <Link to="/orders" className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">My orders</Link>
          <Link to="/demo" className="ml-2 rounded-full bg-saffron px-4 py-2 text-sm font-semibold text-saffron-foreground hover:brightness-95">Try demo</Link>
        </nav>
        <Link to="/demo" className="ml-auto rounded-full bg-saffron px-3 py-1.5 text-xs font-semibold text-saffron-foreground md:hidden">Try demo</Link>
      </div>
    </header>
  );
}

export function MobileTabBar() {
  const tabs = [
    { to: "/", label: "Home", icon: Home },
    { to: "/explore", label: "Explore", icon: Compass },
    { to: "/orders", label: "Orders", icon: Receipt },
    { to: "/demo", label: "Demo", icon: Sparkles },
  ] as const;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden" aria-label="Tabs">
      {tabs.map((t) => (
        <Link key={t.to} to={t.to} activeOptions={{ exact: t.to === "/" }} className="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-muted-foreground" activeProps={{ className: "text-primary" }}>
          <t.icon className="size-5" aria-hidden />
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-forest-deep pb-24 text-primary-foreground md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">Food Saarthi</p>
          <p className="mt-2 text-sm opacity-75">Campus-first, pickup-first surplus meal rescue.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm opacity-85">
          <Link to="/explore">Explore meals</Link>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/safety">Food safety</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm opacity-85">
          <Link to="/partner-with-us">Partner with us</Link>
          <Link to="/demo">Guided demo</Link>
          <p className="opacity-70">Pilot prototype · demo data only</p>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <MobileTabBar />
    </div>
  );
}
