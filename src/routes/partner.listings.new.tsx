import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, ImagePlus } from "lucide-react";
import thali from "@/assets/meal-thali.jpg";
import { Btn, DemoModeBadge, VegMark, btnClass } from "@/components/fs/ui";
import { CheckRow, Chips, Field, inputClass } from "@/components/fs/forms";

export const Route = createFileRoute("/partner/listings/new")({
  head: () => ({
    meta: [
      { title: "Create a surplus listing — Food Saarthi" },
      { name: "description", content: "List a sealed, unserved surplus meal with all required safety fields." },
      { property: "og:title", content: "Create a surplus listing — Food Saarthi" },
      { property: "og:description", content: "Fast, compliant listing creation for partners (demo)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewListing,
});

const schema = z
  .object({
    name: z.string().trim().min(3, "Give the meal a clear name").max(60),
    category: z.string().min(1, "Choose a category"),
    diet: z.string().min(1, "Mark veg or non-veg"),
    original: z.coerce.number().positive("Enter the original price"),
    price: z.coerce.number().positive("Enter the rescue price"),
    qty: z.coerce.number().int().min(1, "At least 1").max(100),
    preparedAt: z.string().min(1, "When was it prepared?"),
    pickupEnd: z.string().min(1, "Set the pickup end / consume-by time"),
    allergens: z.string().trim().min(2, "Add ingredients or write 'No common allergens'").max(200),
    packaging: z.string().min(1, "Choose packaging"),
    confirm: z.boolean().refine((b) => b, "You must confirm the food is safe, unserved and sealed"),
  })
  .refine((v) => v.price < v.original, { path: ["price"], message: "Rescue price must be lower than the original" })
  .refine((v) => !v.preparedAt || !v.pickupEnd || v.pickupEnd > v.preparedAt, { path: ["pickupEnd"], message: "Pickup end must be after preparation time" });
type V = z.input<typeof schema>;

function NewListing() {
  const [img, setImg] = useState<string>(thali);
  const [published, setPublished] = useState(false);
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<V>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { name: "", category: "", diet: "", original: "" as never, price: "" as never, qty: 5, preparedAt: "19:30", pickupEnd: "22:00", allergens: "", packaging: "", confirm: false },
  });
  const v = watch();
  const save = Number(v.original) - Number(v.price);

  if (published)
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <CheckCircle2 className="rise-in mx-auto size-14 text-primary" />
        <h1 className="mt-4 text-3xl">Listing published</h1>
        <p className="mt-2 text-muted-foreground">{v.name} is live in demo mode and closes automatically at {v.pickupEnd}.</p>
        <Link to="/partner" className={btnClass("primary") + " mt-6"}>Go to partner workspace</Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center gap-2"><h1 className="text-4xl">New surplus listing</h1><DemoModeBadge /></div>
      <form data-tour="listing-form" onSubmit={handleSubmit(() => setPublished(true))} className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]" noValidate>
        <div className="space-y-5 rounded-[1.75rem] border bg-card p-5 shadow-soft md:p-8">
          <Field label="Food photo">
            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-dashed p-3 text-sm hover:bg-muted">
              <ImagePlus className="size-5 text-muted-foreground" /> Upload a photo of the sealed pack
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) setImg(URL.createObjectURL(f)); }} />
            </label>
          </Field>
          <Field label="Food name" htmlFor="n" error={errors.name?.message}><input id="n" className={inputClass} aria-invalid={!!errors.name} {...register("name")} /></Field>
          <Field label="Category" error={errors.category?.message}>
            <Controller control={control} name="category" render={({ field }) => <Chips options={["Meal box", "Snack", "Bakery", "Beverage"]} value={field.value} onChange={field.onChange} />} />
          </Field>
          <Field label="Veg / non-veg" error={errors.diet?.message}>
            <Controller control={control} name="diet" render={({ field }) => <Chips options={["Veg", "Non-veg"]} value={field.value} onChange={field.onChange} />} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Original price (₹)" htmlFor="op" error={errors.original?.message}><input id="op" inputMode="numeric" className={inputClass} aria-invalid={!!errors.original} {...register("original")} /></Field>
            <Field label="Rescue price (₹)" htmlFor="rp" error={errors.price?.message}><input id="rp" inputMode="numeric" className={inputClass} aria-invalid={!!errors.price} {...register("price")} /></Field>
            <Field label="Quantity" htmlFor="q" error={errors.qty?.message}><input id="q" type="number" min={1} className={inputClass} {...register("qty")} /></Field>
          </div>
          <div className="grid gap-5 rounded-2xl bg-secondary/60 p-4 sm:grid-cols-2">
            <Field label="Prepared at" htmlFor="pa" error={errors.preparedAt?.message}><input id="pa" type="time" className={inputClass} {...register("preparedAt")} /></Field>
            <Field label="Pickup end / consume-by" htmlFor="pe" error={errors.pickupEnd?.message} hint="Listing auto-closes at this time."><input id="pe" type="time" className={inputClass} aria-invalid={!!errors.pickupEnd} {...register("pickupEnd")} /></Field>
          </div>
          <Field label="Ingredients & allergen note" htmlFor="al" error={errors.allergens?.message}><textarea id="al" rows={2} className={inputClass + " h-auto py-2.5"} aria-invalid={!!errors.allergens} {...register("allergens")} /></Field>
          <Field label="Packaging type" error={errors.packaging?.message}>
            <Controller control={control} name="packaging" render={({ field }) => <Chips options={["Sealed container", "Food box", "Sealed bag"]} value={field.value} onChange={field.onChange} />} />
          </Field>
          <Controller control={control} name="confirm" render={({ field }) => <CheckRow checked={field.value} onChange={field.onChange} error={!!errors.confirm}>I confirm this food is safe, unserved, correctly packed and labelled.</CheckRow>} />
          {errors.confirm && <p role="alert" className="text-xs font-medium text-destructive">{errors.confirm.message}</p>}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-semibold text-muted-foreground">Preview</p>
          <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
            <img src={img} alt="" className="aspect-[5/4] w-full object-cover" />
            <div className="space-y-2 p-4">
              <p className="flex items-center gap-2 text-xs text-muted-foreground">{v.diet && <VegMark veg={v.diet === "Veg"} />} Annapurna Hostel Mess · ends {v.pickupEnd}</p>
              <p className="font-display text-lg">{v.name || "Meal name"}</p>
              <p className="flex items-baseline gap-2"><span className="text-2xl font-bold text-primary">₹{v.price || "—"}</span>{v.original ? <span className="text-sm text-muted-foreground line-through">₹{v.original}</span> : null}</p>
              {save > 0 && <p className="text-xs font-semibold text-saffron-foreground">Customer saves ₹{save}</p>}
              <p className="text-xs text-muted-foreground">{v.qty} available · {v.packaging || "packaging"}</p>
            </div>
          </div>
          <Btn type="submit" className="w-full">Publish listing</Btn>
        </aside>
      </form>
    </div>
  );
}
