import { createFileRoute, Link } from "@tanstack/react-router";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { BadgeCheck, Info, MapPin } from "lucide-react";
import { Btn, btnClass } from "@/components/fs/ui";
import { CheckRow, Chips, Field, FormSummaryPanel, GuidedFormShell, RoleJourneyHeader, inputClass, useDemoForm } from "@/components/fs/forms";

export const Route = createFileRoute("/demo/partner/onboarding")({
  head: () => ({
    meta: [
      { title: "Partner onboarding demo — Food Saarthi" },
      { name: "description", content: "Set up an outlet profile, pickup point and food-safety declaration in four guided steps." },
      { property: "og:title", content: "Partner onboarding demo — Food Saarthi" },
      { property: "og:description", content: "Guided four-step partner verification (demo)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PartnerOnboarding,
});

const mustTick = (msg: string) => z.boolean().refine((b) => b, msg);
const schema = z
  .object({
    outlet: z.string().trim().min(2, "Enter your outlet or mess name").max(60),
    type: z.string().min(1, "Choose an outlet type"),
    contact: z.string().trim().min(2, "Who should we contact?").max(50),
    mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number"),
    email: z.string().trim().email("That email doesn't look right"),
    area: z.string().min(1, "Choose your campus or area"),
    address: z.string().trim().min(5, "Describe where customers collect").max(120),
    pin: z.object({ x: z.number(), y: z.number() }),
    winStart: z.string().min(1, "Set a start time"),
    winEnd: z.string().min(1, "Set an end time"),
    surplus: z.string().min(1, "Choose a typical quantity"),
    packaging: z.string().min(1, "Choose your packaging"),
    c1: mustTick("Required to list food"),
    c2: mustTick("Required to list food"),
    c3: mustTick("Required to list food"),
    c4: mustTick("Required to list food"),
    fssai: z.string().min(1, "Choose your FSSAI status"),
    fssaiNo: z.string().optional(),
  })
  .refine((v) => !v.winStart || !v.winEnd || v.winEnd > v.winStart, { path: ["winEnd"], message: "End time must be after start time" })
  .refine((v) => v.fssai !== "Available" || /^\d{14}$/.test(v.fssaiNo ?? ""), { path: ["fssaiNo"], message: "FSSAI numbers have 14 digits" });
type V = z.infer<typeof schema>;
const steps = ["Business profile", "Pickup setup", "Food-safety declaration", "Demo approval"];

function PartnerOnboarding() {
  const { form, step, next, back, saved, percent } = useDemoForm<V>(
    "partner",
    schema as never,
    { outlet: "", type: "", contact: "", mobile: "", email: "", area: "", address: "", pin: { x: 50, y: 50 }, winStart: "21:00", winEnd: "22:00", surplus: "", packaging: "", c1: false, c2: false, c3: false, c4: false, fssai: "", fssaiNo: "" },
    [["outlet", "type", "contact", "mobile", "email", "area"], ["address", "winStart", "winEnd", "surplus", "packaging"], ["c1", "c2", "c3", "c4", "fssai", "fssaiNo"], []],
  );
  const { register, control, formState: { errors }, watch } = form;
  const v = watch();

  return (
    <GuidedFormShell
      header={<RoleJourneyHeader eyebrow="Food partner journey" title="Get your outlet verified." subtitle="Four short steps. Only verified partners can list food." />}
      steps={steps}
      current={step}
      percent={percent}
      saved={saved}
      footer={
        step < 3 ? (
          <>
            {step > 0 && <Btn type="button" variant="ghost" onClick={back}>Back</Btn>}
            <Btn type="button" onClick={next}>Continue</Btn>
          </>
        ) : (
          <>
            <Btn type="button" variant="ghost" onClick={back}>Back</Btn>
            <Link to="/partner/listings/new" className={btnClass("saffron")}>Create my first surplus listing</Link>
          </>
        )
      }
    >
      {step === 0 && (
        <>
          <Field label="Outlet / mess name" htmlFor="o" error={errors.outlet?.message}><input id="o" className={inputClass} aria-invalid={!!errors.outlet} {...register("outlet")} /></Field>
          <Field label="Outlet type" error={errors.type?.message}>
            <Controller control={control} name="type" render={({ field }) => <Chips options={["Mess", "Café", "Bakery", "Stall", "Restaurant", "Shop"]} value={field.value} onChange={field.onChange} />} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Contact person" htmlFor="c" error={errors.contact?.message}><input id="c" className={inputClass} aria-invalid={!!errors.contact} {...register("contact")} /></Field>
            <Field label="Mobile number" htmlFor="m" error={errors.mobile?.message}><input id="m" inputMode="numeric" className={inputClass} aria-invalid={!!errors.mobile} {...register("mobile")} /></Field>
          </div>
          <Field label="Email" htmlFor="e" error={errors.email?.message}><input id="e" type="email" className={inputClass} aria-invalid={!!errors.email} {...register("email")} /></Field>
          <Field label="Campus / area" error={errors.area?.message}>
            <Controller control={control} name="area" render={({ field }) => <Chips options={["North Campus", "South Campus", "Hostel Zone"]} value={field.value} onChange={field.onChange} />} />
          </Field>
        </>
      )}
      {step === 1 && (
        <>
          <Field label="Pickup address" htmlFor="ad" error={errors.address?.message}><input id="ad" className={inputClass} placeholder="e.g. Block C counter, ground floor" aria-invalid={!!errors.address} {...register("address")} /></Field>
          <Field label="Pickup pin" hint="Tap the map to move the pin (illustrative map, demo only).">
            <Controller control={control} name="pin" render={({ field }) => (
              <button
                type="button"
                aria-label="Set pickup pin"
                onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); field.onChange({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
                className="relative block h-44 w-full overflow-hidden rounded-2xl bg-accent"
              >
                <span className="absolute inset-0 opacity-50 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:24px_24px]" />
                <span className="absolute left-[10%] top-[40%] h-3 w-[80%] rounded-full bg-card/80" />
                <span className="absolute left-[55%] top-[5%] h-[90%] w-3 rounded-full bg-card/80" />
                <MapPin className="absolute size-8 -translate-x-1/2 -translate-y-full fill-coral text-coral-foreground transition-all" style={{ left: `${field.value.x}%`, top: `${field.value.y}%` }} />
              </button>
            )} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Pickup window start" htmlFor="ws" error={errors.winStart?.message}><input id="ws" type="time" className={inputClass} {...register("winStart")} /></Field>
            <Field label="Pickup window end" htmlFor="we" error={errors.winEnd?.message}><input id="we" type="time" className={inputClass} aria-invalid={!!errors.winEnd} {...register("winEnd")} /></Field>
          </div>
          <Field label="Typical daily surplus" error={errors.surplus?.message}>
            <Controller control={control} name="surplus" render={({ field }) => <Chips options={["1–5 meals", "6–15 meals", "16–30 meals", "30+ meals"]} value={field.value} onChange={field.onChange} />} />
          </Field>
          <Field label="Packaging available" error={errors.packaging?.message}>
            <Controller control={control} name="packaging" render={({ field }) => <Chips options={["Sealed container", "Food box", "Bag", "Other"]} value={field.value} onChange={field.onChange} />} />
          </Field>
        </>
      )}
      {step === 2 && (
        <>
          <div className="flex gap-3 rounded-2xl bg-saffron/15 p-4 text-sm">
            <Info className="mt-0.5 size-4 shrink-0" />
            <p>Only list food that was never served, is packed properly and still within its safe time. When in doubt, don't list it.</p>
          </div>
          {([
            ["c1", "Food is safe, unserved and suitable for resale."],
            ["c2", "Food is correctly labelled and packed."],
            ["c3", "I will show ingredients/allergen alerts where relevant."],
            ["c4", "I understand expired or unsafe food cannot be listed."],
          ] as const).map(([k, t]) => (
            <Controller key={k} control={control} name={k} render={({ field }) => <CheckRow checked={field.value} onChange={field.onChange} error={!!errors[k]}>{t}</CheckRow>} />
          ))}
          {(errors.c1 || errors.c2 || errors.c3 || errors.c4) && <p role="alert" className="text-xs font-medium text-destructive">All four confirmations are needed before you can list food.</p>}
          <Field label="FSSAI status" error={errors.fssai?.message}>
            <Controller control={control} name="fssai" render={({ field }) => <Chips options={["Available", "Applied", "Campus verification pending"]} value={field.value} onChange={field.onChange} />} />
          </Field>
          {v.fssai === "Available" && (
            <Field label="FSSAI number" htmlFor="fn" error={errors.fssaiNo?.message}><input id="fn" inputMode="numeric" maxLength={14} className={inputClass} aria-invalid={!!errors.fssaiNo} {...register("fssaiNo")} /></Field>
          )}
        </>
      )}
      {step === 3 && (
        <FormSummaryPanel
          title="Approval summary"
          rows={[["Outlet", `${v.outlet} · ${v.type}`], ["Contact", `${v.contact} · ${v.mobile}`], ["Pickup point", v.address], ["Pickup window", `${v.winStart} – ${v.winEnd}`], ["Safety confirmations", "4 of 4"], ["FSSAI", v.fssai]]}
        >
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground"><BadgeCheck className="size-4" /> Demo verification approved</span>
        </FormSummaryPanel>
      )}
    </GuidedFormShell>
  );
}
