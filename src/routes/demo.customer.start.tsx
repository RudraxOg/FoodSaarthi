import { createFileRoute } from "@tanstack/react-router";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { Leaf } from "lucide-react";
import { useGuidedDemo } from "@/components/fs/guided-demo";
import { Btn } from "@/components/fs/ui";
import { Chips, Field, FormSummaryPanel, GuidedFormShell, RadioCards, RoleJourneyHeader, inputClass, useDemoForm } from "@/components/fs/forms";
import { outlets } from "@/lib/demo-data";

export const Route = createFileRoute("/demo/customer/start")({
  head: () => ({
    meta: [
      { title: "Customer demo setup — Food Saarthi" },
      { name: "description", content: "Set your pickup point, food preferences and budget before exploring rescued meals." },
      { property: "og:title", content: "Customer demo setup — Food Saarthi" },
      { property: "og:description", content: "A three-step guided start for the customer journey." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CustomerStart,
});

const schema = z.object({
  firstName: z.string().trim().min(1, "Tell us what to call you").max(40),
  campus: z.string().min(1, "Choose a campus or neighbourhood"),
  pickup: z.string().min(1, "Choose a nearby pickup point"),
  diet: z.string().min(1, "Pick a food preference"),
  allergies: z.string().max(120).optional(),
  meals: z.array(z.string()).min(1, "Pick at least one meal time"),
  budget: z.number().min(20).max(150),
});
type V = z.infer<typeof schema>;
const steps = ["Welcome & location", "Food preferences", "Ready to explore"];

function CustomerStart() {
  const { start } = useGuidedDemo();
  const { form, step, setStep, next, back, saved, percent } = useDemoForm<V>("customer", schema, { firstName: "", campus: "", pickup: "", diet: "", allergies: "", meals: [], budget: 80 }, [["firstName", "campus", "pickup"], ["diet", "meals", "budget", "allergies"], []]);
  const { register, control, formState: { errors }, watch } = form;
  const v = watch();

  return (
    <GuidedFormShell
      header={<RoleJourneyHeader eyebrow="Customer journey" title={step === 2 ? `You're set, ${v.firstName || "friend"}.` : "Let's find meals near you."} />}
      steps={steps}
      current={step}
      percent={percent}
      saved={saved}
      footer={
        step < 2 ? (
          <>
            {step > 0 && <Btn type="button" variant="ghost" onClick={back}>Back</Btn>}
            <Btn type="button" onClick={next}>Continue</Btn>
          </>
        ) : (
          <>
            <Btn type="button" variant="ghost" onClick={() => setStep(0)}>Edit preferences</Btn>
            <Btn type="button" variant="saffron" onClick={() => start("customer", { fresh: true })}>Start exploring meals</Btn>
          </>
        )
      }
    >
      {step === 0 && (
        <>
          <Field label="First name" htmlFor="fn" error={errors.firstName?.message}>
            <input id="fn" className={inputClass} aria-invalid={!!errors.firstName} autoComplete="given-name" {...register("firstName")} />
          </Field>
          <Field label="Campus / neighbourhood" error={errors.campus?.message}>
            <Controller control={control} name="campus" render={({ field }) => <Chips options={["North Campus", "South Campus", "Hostel Zone"]} value={field.value} onChange={field.onChange} />} />
          </Field>
          <Field label="Preferred pickup point" error={errors.pickup?.message} hint="Choose a nearby pickup point. Food Saarthi is pickup-first, so you collect your meal yourself.">
            <Controller control={control} name="pickup" render={({ field }) => (
              <RadioCards value={field.value} onChange={field.onChange} options={outlets.map((o) => ({ v: o.pickupPoint, label: o.pickupPoint, desc: `${o.name} · ${o.distance}` }))} />
            )} />
          </Field>
        </>
      )}
      {step === 1 && (
        <>
          <Field label="Food preference" error={errors.diet?.message}>
            <Controller control={control} name="diet" render={({ field }) => <Chips options={["Vegetarian", "Non-vegetarian", "Both"]} value={field.value} onChange={field.onChange} />} />
          </Field>
          <Field label="Allergies or ingredient alerts (optional)" htmlFor="al" hint="e.g. peanuts, gluten">
            <input id="al" className={inputClass} {...register("allergies")} />
          </Field>
          <Field label="Meal preference" error={errors.meals?.message}>
            <Controller control={control} name="meals" render={({ field }) => <Chips multi options={["Breakfast", "Lunch", "Snacks", "Dinner"]} value={field.value} onChange={field.onChange} />} />
          </Field>
          <Field label={`Budget up to ₹${v.budget}`} htmlFor="bud">
            <Controller control={control} name="budget" render={({ field }) => (
              <input id="bud" type="range" min={20} max={150} step={5} value={field.value} onChange={(e) => field.onChange(+e.target.value)} className="h-11 w-full accent-[var(--primary)]" />
            )} />
            <div className="flex justify-between text-xs text-muted-foreground"><span>₹20</span><span>₹150</span></div>
          </Field>
        </>
      )}
      {step === 2 && (
        <FormSummaryPanel title="Your demo profile" rows={[["Pickup point", v.pickup], ["Food preference", v.diet], ["Meal times", v.meals.join(", ")], ["Budget", `Up to ₹${v.budget}`]]}>
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-card p-3 text-sm"><Leaf className="size-4 text-primary" /> Estimated demo impact: You could help rescue 1–3 meals this week.</p>
        </FormSummaryPanel>
      )}
    </GuidedFormShell>
  );
}
