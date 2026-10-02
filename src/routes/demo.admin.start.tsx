import { createFileRoute } from "@tanstack/react-router";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useGuidedDemo } from "@/components/fs/guided-demo";
import { Btn } from "@/components/fs/ui";
import { Chips, Field, GuidedFormShell, RadioCards, RoleJourneyHeader, inputClass, useDemoForm } from "@/components/fs/forms";

export const Route = createFileRoute("/demo/admin/start")({
  head: () => ({
    meta: [
      { title: "Admin demo — Food Saarthi" },
      { name: "description", content: "Pick a campus pilot and dashboard view to start the admin guided demo." },
      { property: "og:title", content: "Admin demo — Food Saarthi" },
      { property: "og:description", content: "Start the admin journey." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminStart,
});

const views = [
  { v: "0", label: "Partner verification" },
  { v: "2", label: "Listing moderation" },
  { v: "3", label: "Complaints" },
  { v: "4", label: "Impact dashboard" },
];
const schema = z.object({
  name: z.string().trim().min(2, "Enter a display name").max(40),
  campus: z.string().min(1, "Choose a campus pilot"),
  view: z.string().min(1, "Choose where to start"),
});
type V = z.infer<typeof schema>;

function AdminStart() {
  const { start } = useGuidedDemo();
  const { form, saved } = useDemoForm<V>("admin", schema, { name: "", campus: "", view: "" }, [["name", "campus", "view"]]);
  const { register, control, handleSubmit, formState: { errors } } = form;
  const go = handleSubmit((v) => start("admin", { from: Number(v.view) }));

  return (
    <GuidedFormShell
      header={<RoleJourneyHeader eyebrow="Admin journey" title="Run the campus pilot." subtitle="Verify partners, moderate listings and resolve complaints." />}
      steps={["Admin setup"]}
      current={0}
      percent={100}
      saved={saved}
      footer={<Btn type="button" onClick={go}>Open admin console</Btn>}
    >
      <Field label="Admin display name" htmlFor="an" error={errors.name?.message}><input id="an" className={inputClass} aria-invalid={!!errors.name} {...register("name")} /></Field>
      <Field label="Campus pilot" error={errors.campus?.message}>
        <Controller control={control} name="campus" render={({ field }) => <Chips options={["North Campus", "South Campus (planned)"]} value={field.value} onChange={field.onChange} />} />
      </Field>
      <Field label="Preferred dashboard view" error={errors.view?.message}>
        <Controller control={control} name="view" render={({ field }) => <RadioCards options={views} value={field.value} onChange={field.onChange} />} />
      </Field>
    </GuidedFormShell>
  );
}
