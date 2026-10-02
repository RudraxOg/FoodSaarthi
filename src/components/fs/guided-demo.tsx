import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type TourStep = { title: string; body: string; path: string; target: string };
export type TourRole = "customer";

export const tours: Record<TourRole, TourStep[]> = {
  customer: [
    { title: "Discover nearby rescued meals", body: "Verified outlets near campus list surplus meals before closing. Every card shows the deadline and how many are left.", path: "/explore", target: "meal-cards" },
    { title: "Read safety and pickup details", body: "Veg status, preparation time, allergens, packaging and partner confirmation are always visible before you reserve.", path: "/listing/l1", target: "safety-fields" },
    { title: "See the saving clearly", body: "The original price sits beside the rescued price, so you know exactly what you save.", path: "/listing/l1", target: "price" },
    { title: "Reserve before the timer ends", body: "Pick a quantity — you can never reserve more than what's left. The final total appears before payment.", path: "/listing/l1", target: "reserve" },
    { title: "Collect with a pickup ticket", body: "After the simulated payment, you get a short code and QR to show at the counter within the pickup window.", path: "/orders/FS-DEMO1", target: "ticket" },
    { title: "Track your impact", body: "Your order history keeps count of meals rescued and money saved.", path: "/orders", target: "impact" },
  ],
};

type Ctx = { start: (r: TourRole) => void; active: boolean };
const GuidedDemoContext = createContext<Ctx>({ start: () => {}, active: false });
export const useGuidedDemo = () => useContext(GuidedDemoContext);

const KEY = (r: TourRole) => `fs_demo_progress_${r}`;

export function GuidedDemoProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<TourRole | null>(null);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const go = useCallback(
    (r: TourRole, i: number) => {
      setStep(i);
      localStorage.setItem(KEY(r), String(i));
      navigate({ to: tours[r][i].path as never });
    },
    [navigate],
  );

  const start = (r: TourRole) => {
    setRole(r);
    const saved = Number(localStorage.getItem(KEY(r)) || 0);
    go(r, saved >= tours[r].length ? 0 : saved);
  };
  const close = () => setRole(null);

  useEffect(() => {
    if (!role) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" && step < tours[role].length - 1) go(role, step + 1);
      if (e.key === "ArrowLeft" && step > 0) go(role, step - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [role, step, go]);

  return (
    <GuidedDemoContext.Provider value={{ start, active: !!role }}>
      {children}
      {role && (
        <TourOverlay
          steps={tours[role]}
          step={step}
          onNext={() => (step < tours[role].length - 1 ? go(role, step + 1) : (localStorage.setItem(KEY(role), String(tours[role].length)), close()))}
          onPrev={() => step > 0 && go(role, step - 1)}
          onRestart={() => go(role, 0)}
          onClose={close}
        />
      )}
    </GuidedDemoContext.Provider>
  );
}

function TourOverlay({ steps, step, onNext, onPrev, onRestart, onClose }: { steps: TourStep[]; step: number; onNext: () => void; onPrev: () => void; onRestart: () => void; onClose: () => void }) {
  const s = steps[step];
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    setRect(null);
    if (pathname !== s.path) return;
    let tries = 0;
    let el: Element | null = null;
    const find = () => {
      el = document.querySelector(`[data-tour="${s.target}"]`);
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        setTimeout(() => el && setRect(el.getBoundingClientRect()), 350);
      } else if (tries++ < 20) setTimeout(find, 100);
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
        className={cn(
          "pointer-events-auto fixed rise-in bg-card text-card-foreground shadow-lift",
          "inset-x-0 bottom-0 rounded-t-3xl p-5 pb-7",
          "md:inset-x-auto md:bottom-6 md:right-6 md:w-[380px] md:rounded-3xl",
        )}
        key={step}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted md:hidden" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step {step + 1} of {steps.length}</span>
          <button onClick={onClose} aria-label="Skip tour" className="rounded-full p-1 hover:bg-muted"><X className="size-4" /></button>
        </div>
        <div className="mt-2 flex gap-1" aria-hidden>
          {steps.map((_, i) => (
            <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors duration-500", i <= step ? "bg-primary" : "bg-muted")} />
          ))}
        </div>
        <h2 className="mt-4 text-xl font-semibold">{s.title}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
        <div className="mt-5 flex items-center gap-2">
          <button onClick={onRestart} className="rounded-full p-2 text-muted-foreground hover:bg-muted" aria-label="Restart tour"><RotateCcw className="size-4" /></button>
          <button onClick={onPrev} disabled={step === 0} className="ml-auto inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold hover:bg-muted disabled:opacity-40"><ChevronLeft className="size-4" />Back</button>
          <button onClick={onNext} className="inline-flex items-center gap-1 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-forest-deep">
            {step === steps.length - 1 ? "Finish" : "Next"} <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
