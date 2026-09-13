# Cosmix Engineering — project context

Last updated: 2026-09-10.

## Purpose and team

Cosmix Engineering is a company in Pakistan. The project manager reports that departments currently work manually without a company management system. The team interviews department staff, records their current working methods, proposes required system flows, and prepares mockups, requirements, ERDs, flowcharts and data structures.

Current deliverable: reviewable HTML mockups. Management approval comes before production execution. Planned project duration is six months with a four-person team. The user is project manager; Codex assists as a senior development collaborator.

HR and Accounts mockups have been prepared; Inventory is the current focus. Existing screen content is not automatically a confirmed company policy.

## Confirmed mobile / web boundaries (latest clarification, 2026-09-10)

- The mobile application serves employees/workers and clients with role-specific views and access.
- Employee mobile views cover office staff and site staff. All staff can access their own salary, attendance, deductions, overtime, leave information/requests, salary advance requests and loan requests.
- The Site Supervisor is a role within site staff. Material/tool request permission belongs to the Supervisor; ordinary workers must not automatically receive it. Other requested capabilities may be added to appropriate roles as staff interviews confirm them.
- Clients have their own client-facing mobile view. Do not give clients employee self-service or departmental management permissions by implication.
- Inventory and other departmental management panels are part of the web application, used by authorized staff for management work. The current Inventory HTML panel is this web surface.
- Previously described mobile purchaser/rider operational updates are workflow handoffs, not a mandate to replicate departmental management panels on mobile. Existing mobile InventoryDashboard code is prototype material, not approved scope for mobile stock administration.
- This clarification records access intent; it does not claim that production authorization or these mobile self-service features are already implemented.

## Confirmed inventory flow (user clarification, 2026-09-10)

1. The Site Supervisor submits a material/tool request using the mobile application.
2. The request goes directly to Inventory; there is NO Project Manager approval step.
3. Inventory checks warehouse availability.
4. Available material is handed to the company's internal office rider for delivery to the site.
5. If stock is unavailable, Inventory sends a purchase request to ONE chosen recipient: Administrator OR Director.
6. That recipient approves the request; the company's purchaser then obtains the material from a vendor and delivers or arranges delivery.
7. Warehouse-to-site dispatch has no purchasing, payment or vendor billing step.
8. Mobile receiving includes material photo and signed challan photo. Broken, missing, wrong or damaged deliveries require reason/comments and photo evidence.

The supplied mobile reference describes purchaser bill photo, material photo, payment status where applicable, self-delivery or third-party rider, exact rider charges and `GOING FOR DELIVERY`. Internal warehouse dispatch uses `OUT FOR DELIVERY`. Supervisor verification results in `RECEIVED` or `DAMAGED`.

## Reference precedence and files

Latest explicit user instructions take precedence over older mockup text and documents. In particular, the supplied reference's generic 'approved requests' must not reintroduce PM approval; the user specifies a company purchaser even though the reference also mentions outsourced purchasers.

- `inventory/documentation/Mobile_Application_Workflows_Reference.md`: verbatim user-supplied mobile workflow reference.
- `inventory/documentation/Inventory_Workflows.md`: confirmed flow, proposed exception behavior, review guide and open business decisions.
- `hr/warehouse/`: current desktop Inventory mockup routes.
- `mobile_app/cosmix-app/`: existing React Native mobile mockup, reviewed as a workflow reference. Desktop HTML changes do not make this mobile app connected or production ready.

## Collaboration preferences

Master-item clarification: the user objected to the original form being replaced during flow work. Preserve its code/SKU, description, category, unit, per-piece/unit purchase price, minimum stock, bin and opening stock. Add optional variations through an ON/OFF toggle, with add/remove rows for variation code, specification and per-unit price. Every material/variation code must be unique. Do not simplify by deleting existing business fields or changing unrelated forms.

Latest UI correction: Inventory must look as compact and minimal as existing HR/Accounts panels, including the exact shared sidebar style (navy active item, small labels/icons). Do not introduce oversized headings/cards or repeated explanatory banners. Keep the request flow simple with visible per-item purchase selection and editable quantities, automatic stock checks and clear dispatch / chosen-approver actions. The user opens HTML files directly in Chrome; do not assume they use the preview server. Preserve local mock state through normal navigation and make actions visibly work.

Analyze existing screens and real work deeply. Complete authorized mockup changes without repeatedly asking permission for routine decisions. Match the existing interface and connect relevant flows. Preserve HR/Accounts behavior. Use local project documentation to retain context for future sessions; this is not a guarantee of permanent assistant memory outside this repository.

The user explicitly requested parallel sub-agent work for speed and wants clear explanations of visible progress. In the 2026-09-10 Inventory pass, two agents implemented request/dispatch and purchase/delivery modules while the main agent integrated the shell, stock, GRN, tools, vendors and documentation. The completed desktop pass and validation are recorded in `inventory/documentation/Inventory_Workflows.md`. Mobile issues are documented there for a later mobile-specific pass.

Refresh correction (2026-09-10): keep direct HTML startup resilient to denied browser storage. Shared sidebar preferences must never abort page rendering. The small shared.js guard is documented in Inventory_Workflows.md; this does not authorize changing HR/Accounts UI or workflows.

Master-item update (2026-09-10): the user confirmed a preferred-vendor dropdown, a comprehensive unit-of-measure selector and selectable variation type/value controls. Save the active vendor ID. Variation rows retain unique code and per-unit price and add type plus selectable/common or custom specification values. Do not infer separate variation stock from this form metadata.
