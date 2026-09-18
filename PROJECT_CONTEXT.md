# Cosmix Engineering — project context

Last updated: 2026-09-17.

## Purpose and team

Cosmix Engineering is a company in Pakistan. The project manager reports that departments currently work manually without a company management system. The team interviews department staff, records their current working methods, proposes required system flows, and prepares mockups, requirements, ERDs, flowcharts and data structures.

Current deliverable: reviewable HTML mockups. Management approval comes before production execution. Planned project duration is six months with a four-person team. The user is project manager; Codex assists as a senior development collaborator.

HR, Accounts and Inventory mockups have been prepared. Sales discovery is now active. Existing screen content is not automatically a confirmed company policy.

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

Reports and documents update (2026-09-17): the client requested one compact Inventory page for operational reports and document-style records across Inventory work. Vendor bills are shown as financial invoices only when invoice evidence exists. Site requests, internal dispatches, purchase requests/orders, receiving, GRNs, damage reports, tool custody and site/tool returns use their correct non-financial notes, slips and receiving documents. A site/tool return is complete only after Inventory physically receives it; each warehouse receipt is retained in receipt history. The implemented page and open decisions are documented in inventory/documentation/Inventory_Workflows.md.

## Sales discovery (confirmed 2026-09-17)

- AUX produces the supplied Excel workbook as its selection/report export. The complete exported workbook is the known integration format; the exact AUX product/version and any API are still unconfirmed.
- Staff manually enter commercial prices after selection. Their reference material includes a printed rate book for units, wires and other items. Some rates may be entered in USD and converted to PKR; the approved exchange-rate source and landed-cost formula remain open.
- Boss/management decides profit, final discount and commercial approval. The system may calculate resulting profit/margin and variance, but must not invent or automatically choose the discount.
- Boss/management also decides and approves model consolidation or substitution after AUX selection.
- Freight, tax, duty, installation, overhead and profit do not follow one universal formula; their procedure can differ by item, category, supplier, project or deal. Sales costing therefore requires configurable cost components with manual override reasons and approval, not a single hard-coded percentage chain.
- For market/non-catalogue items, the team obtains the best available vendor price and enters it. There is no fixed vendor-comparison count yet.
- Rates may change at any time and tenders can be accepted months after submission. A submitted quotation must retain its original price snapshot. Expired or late-accepted offers require commercial revalidation and a new controlled revision rather than silently updating the old quotation.
- Sales is the current department scope. Procurement has no panel yet; Sales may record pre-sale vendor rate enquiries and create a future procurement handoff after acceptance, but this does not authorize building the Procurement module now.
- Sales/Inventory integration uses a shared product/model identity and availability lookup. Draft quotations do not reserve or reduce stock. Reservation or shortage purchasing starts only at the confirmed post-acceptance trigger, which still requires staff confirmation.
- Post-acceptance values and requirements can move up or down. The accepted quotation remains an immutable commercial baseline; later scope, quantity, rate, tax, FX and actual-cost differences are recorded as approved change orders/revisions and departmental actuals instead of editing the accepted record.
- Detailed evidence, workflow proposal and open decisions are recorded in `sales/documentation/Sales_Workflows.md`.
- Deep Sales audit (2026-09-17): the direct-file mock now uses append-only quotation revisions, issue-gated selection validation, a frozen commercial approval snapshot, expired-quotation revalidation, item/specification-scoped vendor-rate selection, all 28 source costing rows, editable manual/PKR/USD line pricing, a full quotation detail page, and a Rate Book & Setup page. The HTML upload remains file-metadata simulation for the known reference mapping; it is not a generic AUX parser or retained file store. Remaining production/open requirements are listed in `sales/documentation/Sales_Workflows.md`.
- Cassette pricing clarification (2026-09-17): the Rs. 33,000 visible beside the cassette unit calculations is the per-unit cassette grille add-on. The workbook totals Rs. 207,900 as Rs. 174,900 + Rs. 33,000 and Rs. 223,740 as Rs. 190,740 + Rs. 33,000. Show the breakdown without double-counting it. Separate Inventory SKU treatment remains to be confirmed.
- Quotation Builder (2026-09-17): Sales has an Excel-style draft page with category/model search and one package row per selected equipment model. Base unit, linked cassette grille, remote/controller and the explicitly selected Y-joint are columns within the same row, each with quantity and price; the Y-joint is never added as a separate automatic line. The worksheet is wide/tall with its own horizontal and vertical scrolling, actions sit below it, and output includes totals, local draft save, `.xlsx` export with fallback and A4 landscape print. The exact Y-joint compatibility formula remains unconfirmed and must not be auto-inferred.
- Quotation Builder format correction (2026-09-18): the browser worksheet and Excel export now use the same explicit 21-column commercial structure. Equipment, Remote/Controller, Cassette Grille and Y-Joint each have visible model, quantity, unit-price and total columns; Equipment also keeps category, description and unit. The `.xlsx` output includes grouped headers, fixed widths, wrapped descriptions, number/date formats, line formulas, totals, notes and compact page margins. Do not replace this with a plain array/CSV-style sheet.
- Sales catalogue update (2026-09-17): `sales/catalog.html` is the master-data mockup behind Quotation Builder search. It supports searchable product listing, direct add/edit, active/inactive control, CSV template download, Excel/CSV import, duplicate-model updates and optional controller/grille mappings. Active browser-local catalogue records appear immediately in Quotation Builder; this is not a production database or server upload.
- Sales UI correction (2026-09-18): Dashboard, Inquiries & Tenders, and BOQ & Costing now use a compact operational layout. The large yellow mockup banner, marketing-style eyebrow headings, repeated KPI cards and verbose explanatory copy were replaced by a small `Local mock data` indicator, one clear page header, a four-value summary strip and table-first work areas. Existing Sales calculations, filters, links, approvals and department boundaries remain unchanged.
- Selection pricing handoff (2026-09-18): the AUX Equipment Quotation List opens a separate Selection Pricing Sheet with all 32 source model rows and quantities. Exact active catalogue rates fill automatically; unmatched source models remain explicit and can use a staff-selected catalogue/reference model through the Fill Rates dialog or a directly entered unit price. The sheet keeps the AUX model separate from the applied rate model, exports a styled Excel workbook and downloadable document, and supports print/PDF. It does not overwrite the general Quotation Builder draft.

- Quotation naming correction (2026-09-18): the Sales navigation label is Quotation Builder, the page/export title is Equipment Quotation Worksheet, downloaded files use Equipment-Quotation, and the default project is HVAC Equipment Quotation. Existing browser-local drafts are migrated without losing lines; the former HTML path is redirect-only for bookmark compatibility.

- Quotation group separators (2026-09-18): the browser worksheet and exported Excel workbook use strong vertical boundaries between Equipment, Remote/Controller, Cassette Grille, Y-Joint and Line Total. The separators continue through grouped headers, column headers and equipment rows so each price block is visually distinct.

- Sales sidebar colour correction (2026-09-18): Sales navigation counters and capability badges use one muted slate treatment instead of unrelated blue, cyan, amber, green, indigo and purple colours. Red is reserved for the actionable overdue rate count; an active row uses the existing navy selection with a neutral white badge. Connected-module badges are muted to keep the sidebar visually quiet.
- Management decision boundary (2026-09-18): commercial approval is performed from a separate future Administrator/Director panel. Management records the decision comment, approved discount, any price increase/decrease, final quotation amount and validity. Sales must not enter or impersonate this decision. The current Sales mock therefore provides a `Management Decisions` receiving inbox where staff can view the returned instruction, acknowledge it, and apply it to the controlled BOQ/quotation revision. Requests awaiting management remain read-only in Sales, and applying a revision instruction preserves the original submitted quotation.
- Tender document workspace (2026-09-18): Sales requires reusable tender soft-copy templates where repeated content stays controlled and only designated tender fields change. The direct-file Sales demonstration now generates a real tender PDF from those fields, merges browser-selected PDFs in the displayed order, applies Light object optimization or Balanced/Maximum image recompression, reports progress and downloads the final PDF without altering source files. Seeded attachment records generate clearly labelled placeholder pages until staff select their real PDFs; selected File objects and the generated Blob remain in browser memory and must be rebuilt after refresh. Reliable 250–300 MB production processing still requires a server/background document worker with progress recovery, resource limits and secure temporary storage after management approves production execution.
- PDF text replacement workspace (2026-09-18): Sales has a separate local-browser PDF Editor. Staff upload a PDF, navigate/zoom pages, click detected text or draw a rectangle over scanned content, cover the old area and paint replacement text at the same PDF coordinates with font size, alignment, text colour and background controls. Export creates a new PDF and never overwrites the source. This is visual replacement rather than Word-style rewriting; OCR, embedded-font reconstruction, signed-document preservation and collaborative storage remain production concerns.
- PDF Editor upload correction (2026-09-18): the upload surface uses an explicit file-picker control plus drag-and-drop instead of nesting a passive button inside a file-input label. The bundled matching PDF.js worker is preloaded so direct `file://` Chrome use can fall back to the in-page worker when local Web Worker creation is restricted. Loading, rendering and edited export remain fully local in the browser.
- PDF Editor preview quality correction (2026-09-18): PDF pages render to an internal canvas at a minimum 2x output scale (up to 2.5x for higher-density displays) while retaining the correct CSS page dimensions. Selection, edit overlays and PDF-coordinate conversion use the display dimensions rather than the enlarged backing canvas, preserving exact replacement placement while producing a sharper on-screen preview.
- Management decision review (2026-09-18): every Sales `Review` action opens a wide read-only decision popup instead of adding a detail block below the register. It separates the original Sales request from the Administrator/Director response, shows management comment, price instruction, approved final value, validity, decision authority and the complete submitted/received/acknowledged/applied trail, then presents the exact Sales next action. Pending requests show no invented decision values; received decisions must be acknowledged before Sales can apply them or create a controlled revision.
