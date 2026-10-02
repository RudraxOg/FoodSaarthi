import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useForm, type DefaultValues, type FieldValues, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import { Check, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DemoModeBadge } from "./ui";

/** RHF + Zod multi-step form with localStorage autosave (demo only). */
export function useDemoForm<T extends FieldValues>(key: string, schema: ZodType<T>, defaults: T, steps: Path<T>[][]) {
  const form = useForm<T>({ resolver: zodResolver(schema as never), mode: "onTouched", defaultValues: defaults as DefaultValues<T> });
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`fs_form_${key}`);
      if (raw) {
        const { values, step: s } = JSON.parse(raw);
        form.reset({ ...defaults, ...values });
        setStep(Math.min(s ?? 0, steps.length - 1));
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const sub = form.watch((values) => {
      localStorage.setItem(`fs_form_${key}`, JSON.stringify({ values, step }));
      setSaved(true);
    });
    localStorage.setItem(`fs_form_${key}`, JSON.stringify({ values: form.getValues(), step }));
    return () => sub.unsubscribe();
  }, [form, key, step]);

  const next = async () => {
    const ok = await form.trigger(steps[step] as never, { shouldFocus: true });
    if (ok) setStep((s) => Math.min(s + 1, steps.length - 1));
    return ok;
  };
  const back = () => setStep((s) => Math.max(0, s - 1));
  return { form, step, setStep, next, back, saved, percent: Math.round(((step + 1) / steps.length) * 100) };
}

export function FormStepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex gap-2 md:flex-col md:gap-0" aria-label="Form progress">
      {steps.map((s, i) => (
        <li key={s} className="flex flex-1 items-center gap-3 md:flex-none md:py-3">
          <span
            aria-current={i === current ? "step" : undefined}
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
              i < current ? "bg-primary text-primary-foreground" : i === current ? "bg-saffron text-saffron-foreground" : "bg-muted text-muted-foreground",
            )}
          >
            {i < current ? <Check className="size-4" /> : i + 1}
          </span>
          <span className={cn("hidden text-sm md:block", i === current ? "font-semibold" : "text-muted-foreground")}>{s}</span>
        </li>
      ))}
    </ol>
  );
}

export function RoleJourneyHeader({ eyebrow, title, subtitle, banner }: { eyebrow: string; title: string; subtitle?: string; banner?: ReactNode }) {
  return (
    <div className="mb-8">
      {banner}
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-coral">{eyebrow}</p>
        <DemoModeBadge />
      </div>
      <h1 className="mt-2 text-3xl md:text-5xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-xl text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function GuidedFormShell({
  header, steps, current, percent, saved, children, aside, footer,
}: { header: ReactNode; steps: string[]; current: number; percent: number; saved: boolean; children: ReactNode; aside?: ReactNode; footer: ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      {header}
      <div className="grid gap-8 md:grid-cols-[200px_1fr]">
        <div className="md:sticky md:top-24 md:self-start">
          <FormStepIndicator steps={steps} current={current} />
          <div className="mt-4 hidden md:block">
            <div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all duration-500" style={{ width: `${percent}%` }} /></div>
            <p className="mt-2 text-xs text-muted-foreground">{percent}% complete</p>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
          <div className="rounded-[1.75rem] border bg-card p-5 shadow-soft md:p-8">
            <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:hidden">Step {current + 1} of {steps.length} · {steps[current]} · {percent}%</p>
            <div key={current} className="rise-in space-y-5">{children}</div>
            <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {saved && <span className="inline-flex items-center gap-1"><CheckCircle2 className="size-3.5 text-primary" /> Demo progress saved</span>}
                <Link to="/demo" className="underline underline-offset-2 hover:text-foreground">Save & exit</Link>
              </div>
              <div className="flex gap-3 sm:ml-auto">{footer}</div>
            </div>
          </div>
          {aside}
        </div>
      </div>
    </div>
  );
}

export function FormSummaryPanel({ title, rows, children }: { title: string; rows: [string, ReactNode][]; children?: ReactNode }) {
  return (
    <div className="rounded-2xl bg-secondary p-5">
      <p className="font-display text-xl">{title}</p>
      <dl className="mt-3 divide-y divide-foreground/10">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2 text-sm"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v || "—"}</dd></div>
        ))}
      </dl>
      {children}
    </div>
  );
}

/* ---------- Field primitives ---------- */

export function Field({ label, error, hint, children, htmlFor }: { label: string; error?: string; hint?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && <p role="alert" className="mt-1 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

export const inputClass = "h-11 w-full rounded-xl border bg-background px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30 aria-[invalid=true]:border-destructive";

export function Chips({ options, value, onChange, multi }: { options: string[]; value: string | string[]; onChange: (v: never) => void; multi?: boolean }) {
  const isOn = (o: string) => (multi ? (value as string[]).includes(o) : value === o);
  return (
    <div className="flex flex-wrap gap-2" role={multi ? "group" : "radiogroup"}>
      {options.map((o) => (
        <button
          type="button"
          key={o}
          role={multi ? "checkbox" : "radio"}
          aria-checked={isOn(o)}
          onClick={() => onChange((multi ? (isOn(o) ? (value as string[]).filter((x) => x !== o) : [...(value as string[]), o]) : o) as never)}
          className={cn("min-h-11 rounded-full border px-4 text-sm font-medium transition-colors", isOn(o) ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-muted")}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function RadioCards({ options, value, onChange }: { options: { v: string; label: string; desc?: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2" role="radiogroup">
      {options.map((o) => (
        <button
          type="button"
          key={o.v}
          role="radio"
          aria-checked={value === o.v}
          onClick={() => onChange(o.v)}
          className={cn("min-h-11 rounded-2xl border p-3.5 text-left transition-colors", value === o.v ? "border-primary bg-accent" : "bg-background hover:bg-muted")}
        >
          <span className="block text-sm font-semibold">{o.label}</span>
          {o.desc && <span className="text-xs text-muted-foreground">{o.desc}</span>}
        </button>
      ))}
    </div>
  );
}

export function CheckRow({ checked, onChange, children, error }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; error?: boolean }) {
  return (
    <label className={cn("flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm", checked ? "border-primary bg-accent/60" : error ? "border-destructive" : "bg-background")}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 size-4 accent-[var(--primary)]" />
      <span>{children}</span>
    </label>
  );
}
