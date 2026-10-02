import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, PartyPopper, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type TourStep = { title: string; body: string; path: string; target: string };
export type TourRole = "customer" | "partner" | "admin" | "delivery";

export const roleNames: Record<TourRole, string> = { customer: "customer", partner: "food partner", admin: "admin", delivery: "future delivery support" };

export const tours: Record<TourRole, TourStep[]> = {
  customer: [
    { title: "Search and filter meals", body: "Filter by veg, price, closing time and outlet to find what fits you.", path: "/explore", target: "filters" },
    { title: "Spot a safe-surplus meal", body: "Every card shows the deadline, how many are left and the saving.", path: "/explore", target: "meal-cards" },
    { title: "Read every safety detail", body: "Veg label, preparation time, allergens, packaging and pickup point — always before you reserve.", path: "/listing/l1", target: "safety-fields" },
    { title: "Reserve and check out", body: "Pick a quantity (never more than what's left). The final total shows before the simulated payment.", path: "/listing/l1", target: "reserve" },
    { title: "Collect with a pickup ticket", body: "Show the short code or QR at the counter within the pickup window.", path: "/orders/FS-DEMO1", target: "ticket" },
    { title: "Track your impact", body: "Meals rescued, money saved and waste avoided add up here.", path: "/orders", target: "impact" },
  ],
  partner: [
    { title: "Verification comes first", body: "Only approved outlets can list food. Your status is always visible here.", path: "/partner", target: "verification" },
    { title: "Create a compliant listing", body: "Mandatory safety fields — veg status, prep time, allergens, packaging and your confirmation.", path: "/partner/listings/new", target: "listing-form" },
    { title: "Live inventory and auto-close", body: "Quantities drop as customers reserve. Listings close automatically at pickup end.", path: "/partner", target: "inventory" },
    { title: "Verify pickups", body: "Enter the customer's 6-digit code, run the handover checklist and confirm once.", path: "/partner", target: "pickup-queue" },
    { title: "See recovered value", body: "Gross sales, platform commission, refunds and your net payout in one statement.", path: "/partner", target: "payouts" },
  ],
  admin: [
    { title: "Partner verification queue", body: "New outlets wait here until documents and safety declarations are reviewed.", path: "/admin", target: "verify-queue" },
    { title: "Document & safety checklist", body: "Check licence status, packaging and declarations before approving.", path: "/admin", target: "doc-review" },
    { title: "Moderate listings", body: "Approve, request a correction or pause any listing that looks unsafe.", path: "/admin", target: "moderation" },
    { title: "Resolve complaints", body: "Each complaint has a timeline. Issue a demo refund and close the case.", path: "/admin", target: "complaints" },
    { title: "Campus impact dashboard", body: "Meals rescued, customers served, partner participation and waste prevented.", path: "/admin", target: "impact" },
  ],
  delivery: [
    { title: "A future concept only", body: "Assisted collection would only start if a campus approves it later. Nothing here is live.", path: "/demo/delivery-partner/preview", target: "concept-banner" },
    { title: "Fictional task list", body: "These tasks are invented to show how support might look. No real order is assigned.", path: "/demo/delivery-partner/preview", target: "tasks" },
    { title: "Static route illustration", body: "A drawing — not live tracking, not a routing engine.", path: "/demo/delivery-partner/preview", target: "route" },
    { title: "Safe handover checklist", body: "Sealed pack, deadline check and handover record would be mandatory.", path: "/demo/delivery-partner/preview", target: "handover" },
    { title: "Not active in the MVP", body: "This service is not active in the Food Saarthi MVP. Food Saarthi stays pickup-first.", path: "/demo/delivery-partner/preview", target: "not-active" },
  ],
};

type Ctx = { start: (r: TourRole, opts?: { from?: number; fresh?: boolean }) => void; active: boolean };
const GuidedDemoContext = createContext<Ctx>({ start: () => {}, active: false });
export const useGuidedDemo = () => useContext(GuidedDemoContext);

const KEY = (r: TourRole) => `fs_demo_progress_${r}`;

export function GuidedDemoProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<TourRole | null>(null);
  const [done, setDone] = useState<TourRole | null>(null);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const go = useCallback(
    (r: TourRole, i: number) => {
      setStep(i);
      localStorage.setItem(KEY(r), String(i));
      navigate({ to: tours[r][i]!.path as never });
    },
    [navigate],
  );

  const start: Ctx["start"] = (r, opts) => {
    setDone(null);
    setRole(r);
    const saved = opts?.fresh ? 0 : opts?.from ?? Number(localStorage.getItem(KEY(r)) || 0);
    go(r, saved >= tours[r].length ? 0 : saved);
  };
  const close = () => setRole(null);
  const finish = () => {
    if (!role) return;
    localStorage.setItem(KEY(role), "0");
    setDone(role);
    setRole(null);
  };

  useEffect(() => {
    if (!role && !done) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { close(); setDone(null); }
      if (!role) return;
      if (e.key === "ArrowRight") step < tours[role].length - 1 ? go(role, step + 1) : finish();
      if (e.key === "ArrowLeft" && step > 0) go(role, step - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <GuidedDemoContext.Provider value={{ start, active: !!role }}>
      {children}
      {role && (
        <TourOverlay
          role={role}
          steps={tours[role]}
          step={step}
          onNext={() => (step < tours[role].length - 1 ? go(role, step + 1) : finish())}
          onPrev={() => step > 0 && go(role, step - 1)}
          onRestart={() => go(role, 0)}
          onClose={close}
        />
      )}
      {done && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-forest-deep/50 p-4 md:items-center" role="dialog" aria-modal aria-label="Tour complete">
          <div className="rise-in w-full max-w-md rounded-[1.75rem] bg-card p-7 text-center shadow-lift">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-saffron text-saffron-foreground"><PartyPopper className="size-6" /></span>
            <h2 className="mt-4 text-2xl">You have completed the {roleNames[done]} journey.</h2>
            <div className="mt-6 grid gap-2">
              <button autoFocus onClick={() => start(done, { fresh: true })} className="min-h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">Restart demo</button>
              <button onClick={() => { setDone(null); navigate({ to: "/demo" }); }} className="min-h-11 rounded-full border px-5 text-sm font-semibold hover:bg-muted">Explore another role</button>
              <button onClick={() => setDone(null)} className="min-h-11 rounded-full px-5 text-sm font-semibold text-muted-foreground hover:bg-muted">Exit demo</button>
            </div>
          </div>
        </div>
      )}
    </GuidedDemoContext.Provider>
  );
}

function TourOverlay({ role, steps, step, onNext, onPrev, onRestart, onClose }: { role: TourRole; steps: TourStep[]; step: number; onNext: () => void; onPrev: () => void; onRestart: () => void; onClose: () => void }) {
  const s = steps[step]!;
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [vw, setVw] = useState(0);

  useEffect(() => {
    const f = () => setVw(window.innerWidth);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);

  useLayoutEffect(() => {
    setRect(null);
    if (pathname !== s.path) return;
    let tries = 0;
    let el: Element | null = null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const find = () => {
      el = document.querySelector(`[data-tour="${s.target}"]`);
      if (el) {
        el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
        setTimeout(() => el && setRect(el.getBoundingClientRect()), reduce ? 50 : 400);
      } else if (tries++ < 25) setTimeout(find, 100);
    };
    find();
    const update = () => el && setRect(el.getBoundingClientRect());
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [s, pathname]);

  // Desktop: place the card beside the highlighted element when there's room.
  let pos: CSSProperties | undefined;
  if (rect && vw >= 768) {
    const W = 380;
    const top = Math.min(Math.max(80, rect.top), window.innerHeight - 340);
    if (rect.right + 24 + W < vw) pos = { top, left: rect.right + 24 };
    else if (rect.left - 24 - W > 0) pos = { top, left: rect.left - 24 - W };
  }

  const pad = 8;
  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-live="polite">
      {rect ? (
        <div
          className="absolute rounded-2xl ring-4 ring-saffron transition-all duration-300"
          style={{ top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2, boxShadow: "0 0 0 9999px oklch(0.2 0.04 155 / 0.55)" }}
        />
      ) : (
        <div className="absolute inset-0 bg-forest-deep/40" />
      )}
      <div
        role="dialog"
        aria-label={`Guided demo step ${step + 1} of ${steps.length}`}
        style={pos}
        className={cn(
          "pointer-events-auto fixed rise-in bg-card text-card-foreground shadow-lift transition-[top,left] duration-300",
          "inset-x-0 bottom-0 rounded-t-3xl p-5 pb-7",
          "md:inset-x-auto md:w-[380px] md:rounded-3xl",
          pos ? "md:bottom-auto" : "md:bottom-6 md:right-6",
        )}
        key={step}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted md:hidden" aria-hidden />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {role === "delivery" ? "Simulation · " : ""}Step {step + 1} of {steps.length}
          </span>
          <button onClick={onClose} className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted">Skip tour <X className="size-3.5" /></button>
        </div>
        <div className="mt-2 flex gap-1" aria-hidden>
          {steps.map((_, i) => (
            <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors duration-500", i <= step ? "bg-primary" : "bg-muted")} />
          ))}
        </div>
        <h2 className="mt-4 text-xl font-semibold">{s.title}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
        <div className="mt-5 flex items-center gap-2">
          <button onClick={onRestart} className="inline-flex min-h-10 items-center gap-1 rounded-full px-3 text-xs font-semibold text-muted-foreground hover:bg-muted" aria-label="Restart tour"><RotateCcw className="size-3.5" /> Restart</button>
          <button onClick={onPrev} disabled={step === 0} className="ml-auto inline-flex min-h-10 items-center gap-1 rounded-full px-4 text-sm font-semibold hover:bg-muted disabled:opacity-40"><ChevronLeft className="size-4" />Previous</button>
          <button autoFocus onClick={onNext} className="inline-flex min-h-10 items-center gap-1 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-forest-deep">
            {step === steps.length - 1 ? "Finish" : "Next"} <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
