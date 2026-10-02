Food Saarthi — Implementation Tracker
Status key: [ ] Not started · [-] In progress · [x] Verified complete · [!] Blocked
Rule: Mark [x] only after the evidence table contains changed files and a passing verification command.
Control source: Food_Saarthi_Master_Blueprint.md and Food_Saarthi_Master_Implementation_Prompt.md
Current implementation state
Field	Value
Current phase	0 — Planning complete; implementation not started
Active task	None
Last updated	2026-10-01
Production status	Not ready
Pilot status	Not started


Phase 0 — Repository, planning and product controls
- Create product blueprint.
- Create master implementation prompt.
- Create this tracker.
- Inspect the existing repository and document the current framework, scripts, routes and database state.
- Add .env.example with no real secrets.
- Add README.md setup instructions and architecture summary.
- Confirm the pilot campus, initial pickup locations and first partner-outlet list.
- Finalize food-safety, refund, cancellation and partner-verification SOPs with relevant authority review.
Phase gate: Repository baseline and pilot operating assumptions documented.
Phase 1 — App foundation and design system
- Create or validate Next.js App Router + TypeScript setup.
- Configure Tailwind CSS and global design tokens.
- Build typography, colour, spacing, radius, shadow and elevation tokens.
- Build reusable Button, Input, Select, Badge, Alert, Dialog, Drawer, Tabs, Skeleton and Empty State primitives.
- Implement mobile-first navigation and desktop navigation.
- Implement public layout, customer layout, partner layout and admin layout.
- Build homepage hero, live-offer strip, how-it-works, trust and impact sections.
- Add loading, error and empty states for each root layout.
- Validate keyboard navigation, focus handling and colour contrast.
Phase gate: Responsive public shell works on phone and desktop with no visual overflow.
Phase 1A — Interactive guided demo and visual journeys
- Add explicit demo_mode configuration and seed synthetic demo-only data.
- Create /demo role selector for customer, food partner, future delivery support, and admin.
- Build reusable guided demo provider, spotlight, tooltip/card, progress, actions, and launcher components.
- Add desktop floating-card and mobile bottom-sheet tour presentation with keyboard and reduced-motion support.
- Implement customer tour across Explore, listing detail, demo checkout, pickup ticket, and impact history.
- Implement partner tour across verification, create listing, inventory, pickup queue, and payout summary.
- Implement admin tour across verification, moderation, order timeline, complaint, and impact dashboard.
- Implement delivery-partner demo only journey labelled Future pilot concept — not active in current pickup-first service.
- Ensure no demo persona can access production customer data, payment records, partner documents, or admin actions.
- Add restart, skip, and persist-progress behavior plus guided-demo Playwright tests.
- Confirm every seeded number and payment carries a Demo data or Simulation label.
Phase gate: A judge can complete each role-specific demo without an account, dead end, or misleading real-world claim.
Phase 2 — Authentication, profiles and role routing
- Configure Supabase project connection and SSR-safe client/server helpers.
- Implement email or phone sign-up and sign-in.
- Create profiles record on new user creation.
- Add roles: customer, partner, admin.
- Implement post-login redirect by role.
- Implement protected server-side route guards.
- Build customer account page.
- Build partner onboarding entry page.
- Build admin dashboard shell.
- Test signed-out, customer, partner and admin route access.
Phase gate: Each user reaches only the correct area after authentication.
Phase 3 — Database, storage and Row Level Security
- Create versioned migration for enums, timestamps and helper functions.
- Create profiles table and RLS policies.
- Create partner_outlets and outlet_documents tables with RLS.
- Create food_listings and listing_allergens with constraints and indexes.
- Create orders, order_items, payments and pickups tables.
- Create payouts, refunds, complaints and audit_events tables.
- Configure private partner-document storage bucket and policy.
- Configure listing-image storage bucket and policy.
- Add active listing, outlet and order query indexes.
- Create SQL tests for RLS allow / deny rules.
- Create seed data for local demo mode only.
Phase gate: Migrations apply cleanly; RLS tests prove data isolation.
Phase 4 — Public listing discovery
- Implement public active-listing query.
- Build /explore listing feed.
- Add filters: veg/non-veg, price, pickup time and outlet.
- Add location / campus selector.
- Build listing card with original price, discounted price, availability and countdown.
- Build /listing/[slug-or-id] detail page.
- Display food name, ingredients/allergens, preparation time, quantity, pickup location and pickup deadline.
- Prevent display of paused, expired or sold-out listings as purchasable.
- Add MapLibre pickup-point preview.
- Add query, filter and empty-state tests.
Phase gate: A signed-out user can reliably discover only active, compliant listings.
Phase 5 — Partner onboarding and listing management
- Build partner application form.
- Implement document upload with private storage path.
- Build admin verification status workflow.
- Build partner outlet profile form.
- Build listing creation form with Zod validation.
- Require food name, veg type, preparation time, pickup window, quantity, prices, allergen info, package state and partner confirmation.
- Enforce discounted_price > 0 and discounted_price <= original_price.
- Build partner listings table with draft, active, paused, sold-out and expired states.
- Implement listing pause and unpublish.
- Implement auto-close at pickup end time.
- Add partner ownership and form-validation tests.
Phase gate: A verified partner can publish and manage only their own compliant listings.
Phase 6 — Reservation, inventory and payment
- Implement transaction-safe order reservation.
- Hold / decrement inventory only when a valid reservation begins.
- Release inventory on payment failure, timeout or cancellation.
- Prevent quantity from becoming negative under concurrent requests.
- Build cart / order-review page with final price clearly shown.
- Create Razorpay order on the server.
- Implement Razorpay Standard Checkout client launch.
- Implement server-side webhook signature verification.
- Make webhook event processing idempotent.
- Mark orders paid only from verified webhook result.
- Generate pickup code / QR only after payment success.
- Build customer order-history and order-detail pages.
- Add payment, reservation and concurrency tests.
Phase gate: A successful verified payment produces exactly one paid order and one pickup credential.
Phase 7 — Pickup, support, refunds and payouts
- Build partner pickup queue.
- Implement pickup-code / QR validation.
- Complete pickup with partner identity and timestamp.
- Prevent duplicate pickup completion.
- Build customer complaint form.
- Build admin complaint review and resolution flow.
- Implement refund request and refund status model.
- Build partner payout calculation for completed orders.
- Add payout status workflow and statement view.
- Write audit event for pickup, complaint, refund and payout events.
- Add end-to-end customer purchase and pickup test.
Phase gate: The platform can trace a paid order through handover, support and settlement.
Phase 8 — Administration and impact dashboard
- Build admin partner-verification queue.
- Build admin listing moderation and emergency pause action.
- Build admin order, payment and refund console.
- Build complaint queue with evidence timeline.
- Build impact dashboard with completed pickups, active partners, repeat buyers, food value recovered and safety metrics.
- Add date and campus filters.
- Ensure admin actions create audit events.
- Add admin authorization and moderation tests.
Phase gate: Admin can safely operate the controlled pilot without direct database edits.
Phase 9 — PWA, monitoring, security and release readiness
- Add PWA manifest, icons and install prompt.
- Validate offline-friendly shell and helpful offline state.
- Add error monitoring integration boundary.
- Add rate limits for authentication, reservation, payment and support actions.
- Validate all environment variables and server-only secrets.
- Run dependency security review.
- Add privacy policy, terms, safety policy, refund policy and support contact pages.
- Add analytics events that do not expose sensitive personal data.
- Run full Playwright customer, partner and admin smoke tests.
- Run production build and deployment preview.
- Complete manual mobile QA at common screen sizes.
Phase gate: App is technically ready for a controlled pilot, pending real-world safety and campus approval.
Mandatory verification matrix
Scenario	Required proof
Customer sees active listings	Integration test + manual mobile check
Customer cannot view another customer’s order	RLS deny test
Partner cannot access another outlet	RLS deny test
Unverified outlet cannot publish	Server + RLS test
Inventory cannot oversell	Concurrent reservation test
Expired listing cannot be paid	Integration test
Payment redirect cannot mark paid	Integration test
Verified webhook is idempotent	Webhook test
Pickup cannot happen twice	Integration test
Admin pause removes public listing	End-to-end test
Payout excludes cancelled / refunded orders	Unit test


Evidence log
Add one row whenever a tracker item is marked complete.
Date	Tracker item	Changed files	Verification command / method	Result	Notes
2026-10-01	Phase 0 control documents	Food_Saarthi_Master_Blueprint.md, Food_Saarthi_Master_Implementation_Prompt.md, tracker.md	Manual review	Pass	Implementation has not started


Session log
Date	Goal	Status	Summary / blocker
2026-10-01	Create master plan and tracker	Complete	Ready for repository inspection and Phase 0 implementation