# Cosmix Engineering Sales workflow discovery

Last updated: 2026-09-19.

## Scope and evidence status

This document separates confirmed staff information, evidence from supplied files, proposed mockup behavior and open decisions. It covers pre-sales inquiry, AUX selection, BOQ/costing, rate collection, approval, quotation and the boundary after acceptance. Procurement implementation is outside the current Sales scope.

Evidence reviewed:

- `INDUS MOTOR, ADMIN BUILDING--- (1).xlsx`
- `Quotation-Grand Monarch Residency.pdf`
- the project manager's handwritten Sales flow
- the current repository's Sales, Engineering, Accounts and Inventory boundaries

## Confirmed current-working facts

1. The complete supplied Excel workbook is exported from the AUX selection software. Its `SELECTION` sheet is the known export/report format. The exact product name/version, API availability and alternative stable exports are not yet confirmed.
2. Staff add commercial prices themselves after the selection export.
3. Staff have a printed rate book covering units, wires and other items.
4. Some prices may be entered in USD and converted to PKR. The exact exchange-rate source, effective-date rule and extra landed-cost formula are still open.
5. Boss/management decides model consolidation/substitution, calculates the intended profit and discount, and gives commercial approval.
6. For other or market-sourced products, staff seek the best available vendor price and enter it. No mandatory number of vendor quotations is confirmed.
7. Market prices can rise or fall at any time. A tender may be submitted and accepted several months later, so submitted pricing may be stale at acceptance.
8. Sales is being designed now. A Procurement panel has not yet been designed.
9. Freight, tax, duty, installation, overhead and profit can each follow a different procedure. There is no confirmed universal formula across all products and projects.
10. After acceptance, commercial quantities and values can still move up or down. The exact Project, Procurement and Accounts procedures remain separate discovery work.

## BOQ rate-filling clarification (2026-09-19)

The staff meaning of BOQ is the client's or company's requirement sheet. It contains the required items, descriptions/specifications, quantities and units. Sales prepares the commercial response by filling a traceable unit rate against each requirement row; BOQ work does not begin as a profit dashboard.

Each requirement rate can come from one of these practical sources:

- the company's available Rate Book;
- an existing written/reference rate, retained with its source reference;
- a vendor phone response or written quotation, retained with vendor/contact, validity and evidence;
- a staff-entered price or later market revalidation where the source is recorded.

The primary BOQ screen therefore shows the received requirement rows, completion status, rate source, unit rate and line amount. Missing rates remain visibly pending and block management submission. Deal-specific additions, model changes and management review remain separate tabs after item rates are completed. Stock is reference information only and does not replace rate filling or reserve Inventory.

## Evidence from the AUX workbook

### Technical selection layer

`SELECTION` is an AUX-generated air-conditioning design report. It contains project/design parameters, 13 system sections, indoor and outdoor model selections, capacities, performance values, controllers/accessories, 43 embedded report images and an aggregated quotation list. Its displayed price and subtotal values are zero. It contains no Excel formulas.

The quotation list contains 127 pieces. This supports treating AUX as the technical-selection source rather than the commercial price source.

### Manual costing layer

`COSTING` is a compact commercial sheet with description, quantity, unit, entered price, formula subtotal, nominal TR and total TR. It contains 80 formulas. Its current total is Rs. 22,777,260 and approximately Rs. 247,481 per TR.

The two Rs. 33,000 helper calculations are confirmed as the per-unit cassette grille add-on. They produce Rs. 207,900 from Rs. 174,900 + Rs. 33,000 and Rs. 223,740 from Rs. 190,740 + Rs. 33,000. The source total already includes these grille amounts, so the ERP breakdown must not add them again.

The technical and costing lists use an unrecorded consolidation/substitution step:

- `ARVCA-H45/NR1DYBA` quantity 1 is absent in costing while `ARVCA-H45/NR3DQB` increases from 1 to 2.
- `ARVMD-H112/NR1DM` quantity 1 is absent while `ARVMD-H112/4R1M` increases from 3 to 4.
- `ARVWM-H015/NR1DJA` quantity 2 is absent while `ARVWM-H022/NR1DJA` increases from 2 to 4.
- Four air-flow panels are omitted from costing.

These are deliberate commercial decisions controlled by management. The future system must record the original model, replacement/grouped model, quantity impact, reason, author and Administrator/Director approval.

## Current flow reconstructed from evidence

```text
Inquiry / tender / referral
        |
        v
Sales or application-engineering assignment
        |
        v
Receive drawings, room/load information and client scope
        |
        v
AUX technical selection
        |
        v
Export and retain original AUX Excel file
        |
        v
Validate systems, models, quantities and accessories
        |
        v
Create commercial BOQ and document substitutions/grouping
        |
        +------------------------------+
        |                              |
        v                              v
Rate-book pricing              Vendor market-rate enquiry
(unit/wire/catalogue)          (non-catalogue or stale items)
        |                              |
        +---------------+--------------+
                        v
Costing in PKR + traceable exchange-rate snapshot
                        |
                        v
Boss sets profit/discount and approves
                        |
                        v
Generate controlled quotation revision
                        |
                        v
Send by email/WhatsApp and log recipient/date
                        |
                        v
Follow-up / negotiation / revision
                        |
            +-----------+-----------+
            |                       |
         Accepted                  Lost
            |                       |
            v                       v
Commercial revalidation       Record reason
if price validity expired
            |
            v
Freeze accepted BOQ and create future Project,
Inventory, Accounts and Procurement handoffs
```

## Required price model

### Rate-book price

Each rate-book entry should retain:

- item/model/SKU and specification
- brand and category
- source document/version and page/reference
- currency: PKR or USD
- entered source amount
- selected USD-to-PKR exchange rate where applicable
- exchange-rate source and effective date
- calculated PKR base amount
- any separately confirmed freight, duty, tax or other charge
- effective-from date and validity/next-review date
- entered by, reviewed by and status

The system may perform the arithmetic conversion. It must not silently fetch or replace the approved exchange rate until management confirms the source and rule.

### Vendor market rate

Each vendor response should retain:

- vendor and contact
- requested item/specification and quantity
- enquiry and response dates
- rate, currency and unit
- tax and freight treatment
- availability and lead time
- validity date
- attached vendor evidence
- selected/not-selected state and selection reason

Sales can maintain this pre-sale rate evidence before a Procurement module exists. It is not a purchase order and does not receive stock.

### Internal costing and commercial approval

The internal worksheet should separate:

- selected technical quantity
- base/reference or vendor rate
- confirmed landed additions
- internal cost
- proposed profit or markup
- gross proposed selling amount
- boss-entered discount or final negotiated amount
- final selling amount
- resulting profit amount and margin percentage

Only authorized users can see cost, profit and margin. Boss/management chooses the profit/discount. The system calculates consequences and records approval; it does not decide the discount.

### Management decision boundary and Sales receipt

Commercial decisions belong to a separate Administrator/Director approval panel. That future panel is responsible for recording:

- the management comment and decision outcome
- the approved discount
- any required price increase or decrease
- the final approved quotation amount
- revised validity or resubmission instruction where applicable

Sales sends a controlled request and receives the result in `sales/approvals.html`. Sales can read and acknowledge the instruction, open its source BOQ/quotation, and apply the approved result. Sales cannot create or edit the management decision. An `Awaiting Management` request remains read-only; a `Decision Received` record may update an unsubmitted quotation or create the required controlled revision; a `Revision Required` instruction must create a new revision and preserve the submitted snapshot. This page is the Sales receiving side only and does not represent the future Administrator/Director panel.

### Configurable cost components

There must not be one hard-coded formula for every quotation. A quotation or individual BOQ line can add the cost components that apply to that deal:

- freight/logistics
- tax
- customs duty/import charge
- installation material
- installation labour
- overhead
- contingency/provisional allowance
- profit/markup
- discount
- another authorized custom component

Each component supports `fixed amount`, `percentage` or `manual calculated amount`, plus its calculation base, notes, evidence, author and approval status. Components may apply to one line, one section/category or the complete quotation. A reusable template can provide defaults, but an authorized user may change it with a reason. Administrator/Director approval freezes the selected components and calculated result for that revision.

The costing view should show three separate values:

1. `Reference/Base Cost`
2. `Approved Internal Cost` after applicable charges
3. `Approved Selling Price` after profit and discount

This design supports different procedures without hiding commercial judgment inside an unexplained formula.

## Tender and stale-price control

Every quotation/tender revision stores an immutable commercial snapshot:

- quotation number and revision
- AUX selection revision
- BOQ revision
- rate-book/vendor-rate versions
- currency and exchange-rate snapshot
- cost, profit, discount and approved selling price
- submission date
- validity-until date
- approver and approval timestamp

Required states:

`Draft -> Technical Validation -> Rate Collection -> Commercial Review -> Approved -> Submitted -> Follow-up`

Submitted offers then move to one of:

- `Accepted within validity`
- `Commercial revalidation required`
- `Revised and resubmitted`
- `Lost/Rejected`

If a tender is accepted after validity or after material rate/FX changes:

1. Keep the originally submitted quotation unchanged.
2. Mark the acceptance `Commercial revalidation required`; do not yet promise stock or final price.
3. Copy the accepted revision into a revalidation worksheet.
4. Refresh expired catalogue/vendor rates and the approved FX snapshot.
5. Show old versus current cost and variance by line and total.
6. Boss chooses to honor the old price, revise the price, reduce margin, substitute an item or decline/renegotiate.
7. Record the decision and generate a new revision or commercial confirmation.

No draft or submitted quotation should change because a master rate later changes.

## Tender template, merge and compression workspace

Sales prepares tenders from controlled templates because most wording and document sections repeat. A tender workspace stores the selected template revision and exposes only designated fields such as tender reference, submission date, validity, attention, delivery, payment, bid security, contact and cover note. Locked template wording is visible as controlled content; approved quotations remain linked records instead of copied editable text.

The final tender package has an explicit top-to-bottom PDF merge order. Generated tender pages, the approved commercial quotation, client instructions, technical data sheets, drawings, company profile, certificates and later addenda can be included. Required generated/quotation files cannot be silently removed. Uploaded source files remain preserved even when a compressed output version is prepared.

Compression supports `Light`, `Balanced` and `Maximum` profiles plus image resolution, image quality and optional metadata cleanup. The system must show original size, estimated/final output size, reduction, processing status and package history. Compression must not change page order or overwrite source evidence. Digitally signed PDFs require signature-validity review after merge or compression.

The direct-file demonstration performs real local browser processing for normal review files. It generates tender pages from the editable fields, merges selected PDFs in the displayed order, applies object optimization for `Light`, raster image recompression for `Balanced`/`Maximum`, reports page progress and creates a downloadable final PDF. The original File objects are read-only and remain untouched. Seeded demonstration attachment records become clearly labelled placeholder pages until staff select their real PDFs. Selected File objects and the generated download Blob exist only in browser memory, so the package must be rebuilt after a page refresh. Balanced/Maximum preserves visible page order and appearance but does not preserve selectable text or digital signatures.

For production, 250–300 MB inputs must be uploaded and processed by a server/background document worker with progress reporting, job recovery, resource limits, malware scanning, secure temporary storage and retention cleanup. The browser demonstration deliberately states this limit and does not promise reliable processing of files at that scale.

## PDF text replacement workspace

The Sales PDF Editor processes an uploaded PDF locally in the browser. PDF.js renders each page and exposes detected text areas. Staff can click a detected text area or draw a manual rectangle, which also supports scanned/image pages, then enter replacement text, font size, alignment, text colour and cover/background colour. The exported file is a new PDF created from the original pages with replacement rectangles painted at the mapped PDF coordinates. Page count and source evidence remain intact.

This is visual same-position replacement, not unrestricted Word-style editing of internal PDF objects. It does not perform OCR, reconstruct an unavailable embedded font, preserve a digital signature after content changes, or persist the uploaded bytes after refresh. Edited output can be downloaded and then included in Tender Documents. Production should retain the original, edited revision, operator, timestamp and reason for change.

## Product and Inventory boundary

Sales and Inventory should share the identity of physical items:

- SKU/material code
- category, brand and model
- technical specification/capacity
- unit of measure and variations
- serialized/warranty-tracked flag
- stock item, special-order item or service

Sales may display `On hand`, `Reserved` and `Available` as informational values while costing. Creating or editing a quotation must not reduce or reserve stock.

Proposed post-acceptance boundary, pending staff confirmation:

1. Freeze accepted BOQ.
2. Create Sales Order/Project handoff.
3. Ask Inventory to reserve available physical items.
4. Convert shortages into a future procurement requirement.
5. Allow vendor-direct-to-site or warehouse-receipt routes when confirmed.
6. Pass accepted amount and payment/milestone terms to Accounts; Accounts creates invoices only at its valid billing trigger.

## Accepted baseline and later up/down changes

Acceptance does not authorize editing the original quotation. The system creates an immutable `Accepted Commercial Baseline` containing:

- accepted client/project/site identity
- accepted selection and BOQ revision
- models, specifications, quantities and units
- accepted scope, exclusions and assumptions
- approved selling values and taxes
- payment/delivery milestones
- quotation validity and acceptance evidence
- approved substitutions and commercial approver

Later movement is recorded separately:

- `Client Scope Change` for requested additions/removals
- `Quantity Variation` for approved quantity up/down
- `Model Substitution` for an approved technical/commercial replacement
- `Rate/FX/Tax Revalidation` for market changes allowed by the commercial terms
- `Procurement Cost Variance` for actual supplier cost versus the Sales target
- `Project Actual Cost` for installation/site expenditure
- `Credit/Debit or Billing Adjustment` only through the later Accounts procedure

Every change records old value, proposed value, difference, reason, evidence, requester, approver and effective date. Client-impacting changes create a quotation/addendum/change-order revision. Internal procurement or project cost variance does not automatically change the client price.

Departmental values remain distinct:

| Record | Purpose |
| --- | --- |
| Accepted Sales baseline | What Cosmix promised and at what approved selling value |
| Procurement target/actual | What was expected and actually paid to obtain goods |
| Inventory movement | What quantity was received, reserved, issued or returned |
| Project actual | What was consumed/performed at site |
| Accounts billing | What became invoiceable, invoiced, received or outstanding |

This preserves traceability when amounts move up or down. The precise approval roles, accounting treatment and client-facing rules still require separate Project, Procurement and Accounts interviews.

Fan, ventilation, wire and other equipment categories remain open. Staff must confirm which are stocked, special-order, serialized, separately warranted, component-level items or vendor-direct deliveries.

## Compact Sales web-module proposal

1. Dashboard
2. Inquiries & Tenders
3. Technical Selection Imports
4. BOQ & Costing
5. Product Catalogue & Data Import
6. Quotation Builder
7. Vendor Rate Enquiries
8. Quotations & Follow-ups

Product/rate books, clients, vendor contacts, commercial clauses and approval rules belong in settings/master data rather than additional large operational pages.

## Open decisions for the next staff interview

1. Exact AUX product/version; whether an API or another export exists.
2. Who performs AUX selection and who validates it.
3. Meaning of the entered `Price`: cost, list, dealer or selling price.
4. Exact USD-to-PKR source/date and landed-cost formula.
5. Detailed Boss criteria for model substitution/consolidation; the approver is confirmed as Boss/management.
6. Quotation validity rule and approval thresholds for discount/margin.
7. Exact quotation numbering, revision and dispatch authority.
8. Stock-reservation trigger: client acceptance, client PO, advance receipt or another event.
9. Exact post-acceptance handoff to Project, Inventory, Accounts and future Procurement.

## Implemented HTML mockup (2026-09-17)

The Sales folder now contains compact direct-file HTML screens matching the shared HR/Accounts shell:

- `sales/index.html` — Sales dashboard and attention queue
- `sales/inquiries.html` — inquiries and tenders register
- `sales/selection.html` — AUX selection import/validation
- `sales/selection-detail.html` — structured AUX report detail with project data, design parameters, equipment list and all system sections
- `sales/costing.html` — BOQ, flexible cost components, substitutions and submission for management review
- `sales/approvals.html` — Sales receiving inbox for Administrator/Director decisions, comments, discount, price adjustment and final approved quotation amount
- `sales/catalog.html` — searchable Sales product catalogue, Excel/CSV data import, manual product entry, linked controller/grille mapping and active/inactive control
- `sales/quotation-builder.html` — Excel-style quotation preparation with category/model search, price snapshots, linked accessories, quantity editing, Excel export and print layout
- `sales/rates.html` — pre-sale vendor rate enquiries
- `sales/quotations.html` — quotation revisions, dispatch, acceptance and revalidation
- `sales/quotation-detail.html` — full quotation document, commercial control, revision history, dispatch and acceptance evidence
- `sales/tender-documents.html` — reusable tender template fields, controlled sections, PDF merge order, compression profile, package checks and output history
- `sales/pdf-editor.html` — local PDF page preview, detected/manual text-area replacement, change list and edited PDF export
- `sales/settings.html` — rate book references, USD/PKR snapshots and commercial clause templates
- `sales/workflow.html` — end-to-end workflow map and department boundaries

`assets/js/sales-store.js` provides versioned local demonstration state with guarded browser storage and Sales-only reset. `assets/js/sales-pages.js` renders the screens and working mock actions. `assets/css/sales.css` keeps cards, tables, forms and badges compact. `assets/js/shared.js` now recognizes Sales as a full department with Sales navigation, quick links, notifications and workflow shortcut.

Implemented controls include new inquiry, AUX file-metadata selection, full report review, issue-gated technical validation, persisted accessory decision, editable per-line currency/rate/source, all 28 workbook costing rows, flexible fixed/percentage/manual cost components, a Sales request/receipt boundary for management decisions, item/specification-scoped vendor selection, quotation dispatch log, append-only quotation revision, immutable accepted-baseline snapshot, late-tender commercial revalidation and a controlled tender template/merge/compression workspace. The Indus Motor reference opens as a dedicated structured detail page showing Project Information, Air-conditioning Design Parameters, the 127-piece Equipment Quotation list, and all 13 `GF-CU` / `1F-CU` system sections with system information and indoor-unit tables.

The Management Decisions register uses a read-only review popup. It presents the submitted Sales request beside the Administrator/Director response, including management comment, discount/increase, approved final, validity and decision authority. A separate action block tells Sales whether to wait, acknowledge and apply the final instruction, create a controlled revision, or take no further action because the decision is already applied. The popup retains submitted, decided, acknowledged and applied timestamps and never allows Sales to edit management values.

The PDF Editor upload control opens the browser file picker from its visible button and also accepts a dropped PDF. Its matching bundled PDF.js worker is loaded locally before the viewer library so the direct-file Chrome mock can parse and render PDFs without depending on a remote worker. The source file and edited bytes stay in browser memory.

The page preview uses a high-density backing canvas at a minimum 2x render scale and keeps selection/edit coordinates tied to the visible page dimensions. This improves screen sharpness without changing the source PDF or shifting exported replacement positions.

Clicking a detected text item also carries its PDF font name, family, weight/italic style and decimal point size into the replacement form. Text and background colours are sampled from the rendered source pixels. Typing or changing a format control updates an in-place draft preview; Apply commits it to the replacement list. Export renders a 4x transparent text layer with the detected browser font and embeds it at the original PDF coordinates, with a matching standard PDF font fallback when canvas font rendering is unavailable.

The HTML mock records selected upload metadata and a known supplied-workbook mapping; it does not retain or parse arbitrary workbook bytes. This limitation is stated in the UI. Actions do not call AUX, Inventory, Procurement, Accounts, email or WhatsApp services.

Validation completed:

- JavaScript syntax checks pass for shared and Sales scripts.
- Nineteen Sales/PDF tests pass, covering the 28-row workbook reconciliation, quotation snapshot isolation, append-only revision, issue-gated management approval, Sales receipt/application of a management decision, request de-duplication, tender fields/merge order/compression/package history, PDF replacement export, editor controls, item-specific vendor selection, expired-quotation revalidation, reset, denied-storage fallback and runtime rendering of all fifteen store-driven Sales screens.
- All local file references in the sixteen Sales HTML entry points resolve.
- `git diff --check` reports no whitespace errors in the Sales changes.

## Deep audit outcome (2026-09-17)

The compact shell, department boundary, AUX hierarchy and direct-file navigation are suitable for staff walkthrough. The audit corrected the highest-risk contradictions: submitted quotation overwrites, cross-item rate deselection, unresolved accessory validation, incomplete 7/28 costing display, repeatable approval mutation, expired acceptance and missing rate-book/quotation-detail surfaces.

Items intentionally left open for staff confirmation are not represented as final policy: workbook `Price` meaning, FX source, quotation validity defaults, tax/freight/duty formulas, approval thresholds and the exact post-acceptance departmental handoff. Procurement remains a future boundary only.

Confirmed pricing clarification (2026-09-17): the Rs. 33,000 entries beside the cassette models are the per-unit cassette grille add-on. For `ARVCA-H45/NR3DQB`, Rs. 174,900 equipment + Rs. 33,000 grille = Rs. 207,900 per unit. For `ARVCA-H71/NR3DQB`, Rs. 190,740 equipment + Rs. 33,000 grille = Rs. 223,740 per unit. The commercial BOQ displays this breakdown while preserving the source total and must not add the grille twice. Whether the grille receives a separate Inventory SKU remains an Inventory/Sales mapping decision.

Further production design will need generic workbook parsing/storage, role-based internal-cost visibility, inquiry/BOQ/vendor detail records for every project, client contact and attachment evidence, full activity audit events, SKU mapping to Inventory, and responsive/accessibility hardening. These are not implied as completed backend behavior by this HTML mockup.

## Quotation Builder update (2026-09-17)

Sales staff can prepare a local draft from the rate-book catalogue without repeatedly reading the printed book. Category and model/description search returns the current stored price snapshot. Adding a model copies its description, unit and price into an editable worksheet line, so later master-price changes do not silently rewrite the draft.

Confirmed sample relationships auto-add as separate visible rows:

- `ARVCA-H45/NR3DQB` and `ARVCA-H71/NR3DQB` → `MB10` cassette grille at Rs. 33,000 per parent unit and suggested `YK-H` remote at Rs. 6,600.
- `ARVMD-*` duct units → suggested `XK-05A` wired controller.
- `ARVWM-*` wall units → suggested `YK-H` remote controller.

The Rs. 33,000 grille is applied to the cassette base rate and not added to the already-combined amount. Each selected equipment model occupies one worksheet row. Base equipment, remote/controller, grille and the engineering-selected Y-joint appear as columns in that same row with their own quantity and price. Changing the equipment quantity updates non-overridden controller and grille quantities; removing the row removes the complete package.

Y-joint compatibility is not inferred from model prefixes because the supplied workbook does not prove a safe engineering formula. The builder shows `AFG-00B` (Rs. 9,900) and `AFG-12B` (Rs. 13,200) in an explicit engineering-selection dropdown with editable quantity. This satisfies fast price entry without silently choosing an unsafe joint.

The manual page intentionally omits the generic mockup banner and introductory command card. Its worksheet has a wide/tall internal Excel-style canvas with independent horizontal and vertical scrolling, while New, Save, Excel Export and Print actions sit below the worksheet.

## Product catalogue and import update (2026-09-17)

Sales has a dedicated catalogue page for the data used by Quotation Builder search. It lists reference and user-maintained products with code/SKU, category, brand, model, specification, unit, PKR unit price, rate source, effective date, status and optional controller/grille model-price mappings. Staff can add or edit one product, activate/deactivate it, search/filter the complete register, download a CSV template, or upload `.xlsx`, `.xls` and `.csv` data. Duplicate model numbers update the existing user-maintained record. Active additions become available in Quotation Builder immediately through the same local browser store.

This remains an HTML mockup with browser-local demonstration persistence. Excel parsing uses the SheetJS browser library already used for quotation export; if it is unavailable, staff can use the CSV template/import path.

The worksheet stores draft metadata and lines separately from approved/submitted quotations. It calculates subtotal, freight, tax/duty, discount and grand total, downloads a real `.xlsx` workbook when SheetJS is available (with an Excel-compatible CSV fallback), and prints a clean A4 landscape quotation while hiding application controls.

## Quotation Builder spreadsheet correction (2026-09-18)

The earlier Excel export was a raw 21-value row with minimal widths and only two title merges, which opened like an unformatted data dump. The corrected browser worksheet and `.xlsx` export share this structure:

- Equipment: serial number, category, model, description, quantity, unit, unit price and base total.
- Remote / Controller: model, quantity, unit price and total.
- Cassette Grille: model, quantity, unit price and total.
- Y-Joint: model, quantity, unit price and total.
- Final line total: formula-driven sum of the four component totals.

The workbook uses grouped column bands, a dark column-header row, fixed readable widths, wrapped descriptions, dates and numeric formats, cached formulas, quotation metadata, a separate totals block, notes and compact margins. The browser worksheet exposes the same columns inside a bounded horizontal/vertical scroll area. Excel styling is generated with the browser-compatible `xlsx-js-style` build; CSV remains a warning fallback only when the library cannot load.

Empty linked-component cells are explicit: Grille shows `Not applicable` when the chosen equipment has no cassette grille mapping, Controller shows `Not linked` when no controller mapping exists, and Y-Joint shows `Not selected` until Sales chooses the engineering-approved joint and quantity. These labels explain the state without inventing a component or price.

## Sales operational UI update (2026-09-18)

The Dashboard, Inquiries & Tenders, and BOQ & Costing screens were simplified for the staff walkthrough without changing the confirmed workflow:

- The large yellow `HTML MOCKUP` banner is replaced by a quiet `Local mock data` status and reset control.
- Each page now has one compact title/action row followed by a single four-value summary strip.
- Dashboard prioritizes the work queue, recent activity, sales progress and active records instead of five separate presentation cards.
- Inquiries keeps stage tabs, search and priority filtering inside the register so staff can filter and act in one place.
- BOQ keeps all commercial tabs, price calculations, FX snapshot, stock reference, cost components, substitutions and management approval, with the financial summary compressed into one row.
- Primary actions use the shared navy treatment; secondary actions, table density and responsive behavior remain consistent with HR/Accounts sizing.

Validation: JavaScript syntax check and all 12 Sales store/render tests pass. Browser automation could not open the local `file://` preview because that surface blocks local-file navigation, so direct-file behavior remains covered by the existing render/runtime tests and the user can review the visual result in Chrome.

## Rate Book wording correction (2026-09-18)

Sales catalogue, BOQ pricing, workflow, settings, import sample and documentation now use the neutral label `Rate Book`. Existing browser-local records carrying the earlier label are migrated in place without resetting saved Sales data. JavaScript syntax checks and all 13 Sales store/render tests pass.


## Sales terminology correction (2026-09-18)

The Dashboard stage summary uses `Sales Progress` and `In progress` so staff see direct operational wording. The earlier generic terminology was removed from the Sales module without changing its records or stage logic.

## AUX formula summary clarification (2026-09-18)

The Selection Detail summary now reports `80 in Costing` as the workbook formula count and separately states `Selection: 0 · fixed AUX values`. This prevents the Selection sheet's zero formula cells from being mistaken for a formula-free workbook. The supplied workbook evidence remains unchanged: AUX exports fixed values in `SELECTION`, while `COSTING` contains 80 formula cells.

## AUX Selection Pricing Sheet (2026-09-18)

The Equipment Quotation List now opens `sales/selection-pricing.html` instead of copying rows into the unrelated general Quotation Builder draft. The new sheet retains all 32 AUX equipment/accessory rows and their 127-piece total. Exact active Product Catalogue matches fill automatically using the catalogue's commercial unit price. An unmatched AUX model stays visible with `Rate required`; Sales can choose an available same-category rate model in the Fill Rates dialog or enter a unit price directly. The selected rate model is recorded separately, so the original AUX model remains traceable.

This mapping prevents silent substitution. Known management-approved replacements are presented first as recommendations, while staff must still choose them. Cassette unit prices use their base equipment rate because the AUX list contains its grille/panel rows separately; this avoids adding the Rs. 33,000 grille twice. The sheet saves locally, calculates line and equipment totals, and provides styled Excel, Word-compatible document and print/PDF outputs. It remains an HTML demonstration and does not post to Accounts, Inventory or Procurement.

## Quotation naming correction (2026-09-18)

The Sales worksheet is named **Quotation Builder** in navigation and **Equipment Quotation Worksheet** in the page and export. New Excel/CSV files use `Equipment-Quotation` in their filename and the default project is `HVAC Equipment Quotation`. Existing browser-local drafts carrying the previous label are migrated without clearing quotation lines. The former HTML path remains only as a redirect so saved bookmarks continue to open the renamed page.

## Quotation group separators (2026-09-18)

The Quotation Builder browser grid and Excel export use medium-weight vertical separators between Equipment, Remote/Controller, Cassette Grille, Y-Joint and Line Total. These boundaries continue through the grouped heading row, detailed column headings and all equipment rows. The Line Total boundary uses the primary navy colour; other commercial groups use slate.

## Sales sidebar colour correction (2026-09-18)

Sales navigation badges now use one muted slate palette. The red `2 Due` indicator remains the only warning colour, while the active navigation row keeps the shared navy selection and displays its badge in neutral white. Connected-module badges also use slate, reducing visual noise and preserving colour for operational exceptions.
