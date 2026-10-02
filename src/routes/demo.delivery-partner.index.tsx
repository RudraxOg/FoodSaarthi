import { createFileRoute } from "@tanstack/react-router";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useGuidedDemo } from "@/components/fs/guided-demo";
import { DeliveryDashboard, FutureBanner } from "@/components/fs/delivery";
import { Btn } from "@/components/fs/ui";
import { CheckRow, Chips, Field, GuidedFormShell, RoleJourneyHeader, inputClass, useDemoForm } from "@/components/fs/forms";

export const Route = createFileRoute("/demo/delivery-partner/")({
  head: () => ({
    meta: [
      { title: "Future delivery support (simulation) — Food Saarthi" },
      { name: "description", content: "Future pilot concept — not active in the current pickup-first service. A product simulation only." },
      { property: "og:title", content: "Future delivery support (simulation) — Food Saarthi" },
      { property: "og:description", content: "Future pilot concept — not active." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DeliverySim,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter a name").max(40),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit mobile number"),
  zone: z.string().min(1, "Choose a zone"),
  vehicle: z.string().min(1, "Choose how you'd move"),
  availability: z.array(z.string()).min(1, "Pick at least one slot"),
  areas: z.array(z.string()).min(1, "Pick at least one area"),
  distance: z.string().min(1, "Choose a distance"),
  emergency: z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit mobile number"),
  understand: z.boolean().refine((b) => b, "Please confirm this is only a simulation"),
});
type V = z.infer<typeof schema>;

function DeliverySim() {
  const { start } = useGuidedDemo();
  const { form, step, next, back, saved, percent } = useDemoForm<V>(
    "delivery",
    schema,
    { name: "", mobile: "", zone: "", vehicle: "", availability: [], areas: [], distance: "", emergency: "", understand: false },
    [["name", "mobile", "zone", "vehicle", "availability"], ["areas", "distance", "emergency", "understand"], []],
  );
  const { register, control, formState: { errors } } = form;

  return (
    <GuidedFormShell
      header={<RoleJourneyHeader banner={<FutureBanner />} eyebrow="Future delivery support · Simulation" title="Imagine assisted collection." subtitle="Nothing you enter is submitted. No tasks, tracking or payments exist." />}
      steps={["Future pilot profile", "Future pilot preferences", "Simulation preview"]}
      current={step}
      percent={percent}
      saved={saved}
      footer={
        step < 2 ? (
          <>{step > 0 && <Btn type="button" variant="ghost" onClick={back}>Back</Btn>}<Btn type="button" onClick={next}>Continue</Btn></>
        ) : (
          <><Btn type="button" variant="ghost" onClick={back}>Back</Btn><Btn type="button" variant="saffron" onClick={() => start("delivery", { fresh: true })}>Take the simulation tour</Btn></>
        )
      }
    >
      {step === 0 && (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" htmlFor="dn" error={errors.name?.message}><input id="dn" className={inputClass} aria-invalid={!!errors.name} {...register("name")} /></Field>
            <Field label="Mobile" htmlFor="dm" error={errors.mobile?.message}><input id="dm" inputMode="numeric" className={inputClass} aria-invalid={!!errors.mobile} {...register("mobile")} /></Field>
          </div>
          <Field label="Preferred support zone" error={errors.zone?.message}><Controller control={control} name="zone" render={({ field }) => <Chips options={["North Campus", "Hostel Zone", "Library belt"]} value={field.value} onChange={field.onChange} />} /></Field>
          <Field label="Vehicle type" error={errors.vehicle?.message}><Controller control={control} name="vehicle" render={({ field }) => <Chips options={["Bicycle", "Walking", "E-bike"]} value={field.value} onChange={field.onChange} />} /></Field>
          <Field label="Availability" error={errors.availability?.message}><Controller control={control} name="availability" render={({ field }) => <Chips multi options={["Morning", "Afternoon", "Evening"]} value={field.value} onChange={field.onChange} />} /></Field>
        </>
      )}
      {step === 1 && (
        <>
          <Field label="Preferred campus areas" error={errors.areas?.message}><Controller control={control} name="areas" render={({ field }) => <Chips multi options={["Hostels", "Library", "Academic blocks", "Sports complex"]} value={field.value} onChange={field.onChange} />} /></Field>
          <Field label="Maximum support distance" error={errors.distance?.message}><Controller control={control} name="distance" render={({ field }) => <Chips options={["Up to 500 m", "Up to 1 km", "Up to 2 km"]} value={field.value} onChange={field.onChange} />} /></Field>
          <Field label="Emergency contact" htmlFor="ec" error={errors.emergency?.message}><input id="ec" inputMode="numeric" className={inputClass} aria-invalid={!!errors.emergency} {...register("emergency")} /></Field>
          <Controller control={control} name="understand" render={({ field }) => <CheckRow checked={field.value} onChange={field.onChange} error={!!errors.understand}>I understand this is only a product simulation.</CheckRow>} />
          {errors.understand && <p role="alert" className="text-xs font-medium text-destructive">{errors.understand.message}</p>}
        </>
      )}
      {step === 2 && <DeliveryDashboard />}
    </GuidedFormShell>
  );
}
