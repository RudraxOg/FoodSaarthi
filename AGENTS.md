<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Food Saarthi rules
- Stack is TanStack Start (not Next.js, which the brief named); routes in src/routes. Why: platform constraint.
- Demo mode uses synthetic data in src/lib/demo-data.ts gated by DEMO_MODE; demo orders persist only in localStorage. Why: keep demo separate from future production data.
- Guided tours live in src/components/fs/guided-demo.tsx; steps target elements via data-tour attributes. Why: tours highlight real UI.
- Shared layout (header, footer, mobile tab bar, tour provider) is mounted once in __root. Why: single shell.
- Guided demo forms use RHF + Zod via useDemoForm in src/components/fs/forms.tsx with localStorage autosave. Why: one reusable multi-step pattern.
- Partner (/partner) and admin (/admin) pages currently run on demo records in src/lib/demo-roles.ts; real role guards come with Lovable Cloud. Why: demo-first build order.
