# Cosmix Engineering Sales workflow discovery

Last updated: 2026-09-17.

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
3. Staff have a CEO-provided printed price/rate book covering units, wires and other items.
4. Some prices may be entered in USD and converted to PKR. The exact exchange-rate source, effective-date rule and extra landed-cost formula are still open.
5. Boss/management decides model consolidation/substitution, calculates the intended profit and discount, and gives commercial approval.
6. For other or market-sourced products, staff seek the best available vendor price and enter it. No mandatory number of vendor quotations is confirmed.
7. Market prices can rise or fall at any time. A tender may be submitted and accepted several months later, so submitted pricing may be stale at acceptance.
8. Sales is being designed now. A Procurement panel has not yet been designed.
9. Freight, tax, duty, installation, overhead and profit can each follow a different procedure. There is no confirmed universal formula across all products and projects.
10. After acceptance, commercial quantities and values can still move up or down. The exact Project, Procurement and Accounts procedures remain separate discovery work.

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

These are deliberate commercial decisions controlled by Boss/management. The future system must record the original model, replacement/grouped model, quantity impact, reason, author and Boss approval.

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

Each component supports `fixed amount`, `percentage` or `manual calculated amount`, plus its calculation base, notes, evidence, author and approval status. Components may apply to one line, one section/category or the complete quotation. A reusable template can provide defaults, but an authorized user may change it with a reason. Boss approval freezes the selected components and calculated result for that revision.

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
6. Manual Quotation Sheet
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
- `sales/costing.html` — BOQ, flexible cost components, substitutions and Boss approval
- `sales/catalog.html` — searchable Sales product catalogue, Excel/CSV data import, manual product entry, linked controller/grille mapping and active/inactive control
- `sales/manual-quotation.html` — Excel-style manual quotation preparation with category/model search, price snapshots, linked accessories, quantity editing, Excel export and print layout
- `sales/rates.html` — pre-sale vendor rate enquiries
- `sales/quotations.html` — quotation revisions, dispatch, acceptance and revalidation
- `sales/quotation-detail.html` — full quotation document, commercial control, revision history, dispatch and acceptance evidence
- `sales/settings.html` — CEO rate-book references, USD/PKR snapshots and commercial clause templates
- `sales/workflow.html` — end-to-end workflow map and department boundaries

`assets/js/sales-store.js` provides versioned local demonstration state with guarded browser storage and Sales-only reset. `assets/js/sales-pages.js` renders the screens and working mock actions. `assets/css/sales.css` keeps cards, tables, forms and badges compact. `assets/js/shared.js` now recognizes Sales as a full department with Sales navigation, quick links, notifications and workflow shortcut.

Implemented controls include new inquiry, AUX file-metadata selection, full report review, issue-gated technical validation, persisted accessory decision, editable per-line currency/rate/source, all 28 workbook costing rows, flexible fixed/percentage/manual cost components, frozen management approval snapshot, item/specification-scoped vendor selection, quotation dispatch log, append-only quotation revision, immutable accepted-baseline snapshot and late-tender commercial revalidation. The Indus Motor reference opens as a dedicated structured detail page showing Project Information, Air-conditioning Design Parameters, the 127-piece Equipment Quotation list, and all 13 `GF-CU` / `1F-CU` system sections with system information and indoor-unit tables.

The HTML mock records selected upload metadata and a known supplied-workbook mapping; it does not retain or parse arbitrary workbook bytes. This limitation is stated in the UI. Actions do not call AUX, Inventory, Procurement, Accounts, email or WhatsApp services.

Validation completed:

- JavaScript syntax checks pass for shared and Sales scripts.
- Nine Sales tests pass, covering the 28-row workbook reconciliation, quotation snapshot isolation, append-only revision, issue-gated management approval and freeze, item-specific vendor selection, expired-quotation revalidation, reset, denied-storage fallback and runtime rendering of all ten Sales screens.
- All local file references in the ten Sales HTML entry points resolve.
- `git diff --check` reports no whitespace errors in the Sales changes.

## Deep audit outcome (2026-09-17)

The compact shell, department boundary, AUX hierarchy and direct-file navigation are suitable for staff walkthrough. The audit corrected the highest-risk contradictions: submitted quotation overwrites, cross-item rate deselection, unresolved accessory validation, incomplete 7/28 costing display, repeatable approval mutation, expired acceptance and missing rate-book/quotation-detail surfaces.

Items intentionally left open for staff confirmation are not represented as final policy: workbook `Price` meaning, FX source, quotation validity defaults, tax/freight/duty formulas, approval thresholds and the exact post-acceptance departmental handoff. Procurement remains a future boundary only.

Confirmed pricing clarification (2026-09-17): the Rs. 33,000 entries beside the cassette models are the per-unit cassette grille add-on. For `ARVCA-H45/NR3DQB`, Rs. 174,900 equipment + Rs. 33,000 grille = Rs. 207,900 per unit. For `ARVCA-H71/NR3DQB`, Rs. 190,740 equipment + Rs. 33,000 grille = Rs. 223,740 per unit. The commercial BOQ displays this breakdown while preserving the source total and must not add the grille twice. Whether the grille receives a separate Inventory SKU remains an Inventory/Sales mapping decision.

Further production design will need generic workbook parsing/storage, role-based internal-cost visibility, inquiry/BOQ/vendor detail records for every project, client contact and attachment evidence, full activity audit events, SKU mapping to Inventory, and responsive/accessibility hardening. These are not implied as completed backend behavior by this HTML mockup.

## Manual quotation builder update (2026-09-17)

Sales staff can prepare a local draft from the rate-book catalogue without repeatedly reading the printed book. Category and model/description search returns the current stored price snapshot. Adding a model copies its description, unit and price into an editable worksheet line, so later master-price changes do not silently rewrite the draft.

Confirmed sample relationships auto-add as separate visible rows:

- `ARVCA-H45/NR3DQB` and `ARVCA-H71/NR3DQB` → `MB10` cassette grille at Rs. 33,000 per parent unit and suggested `YK-H` remote at Rs. 6,600.
- `ARVMD-*` duct units → suggested `XK-05A` wired controller.
- `ARVWM-*` wall units → suggested `YK-H` remote controller.

The Rs. 33,000 grille is applied to the cassette base rate and not added to the already-combined amount. Each selected equipment model occupies one worksheet row. Base equipment, remote/controller, grille and the engineering-selected Y-joint appear as columns in that same row with their own quantity and price. Changing the equipment quantity updates non-overridden controller and grille quantities; removing the row removes the complete package.

Y-joint compatibility is not inferred from model prefixes because the supplied workbook does not prove a safe engineering formula. The builder shows `AFG-00B` (Rs. 9,900) and `AFG-12B` (Rs. 13,200) in an explicit engineering-selection dropdown with editable quantity. This satisfies fast price entry without silently choosing an unsafe joint.

The manual page intentionally omits the generic mockup banner and introductory command card. Its worksheet has a wide/tall internal Excel-style canvas with independent horizontal and vertical scrolling, while New, Save, Excel Export and Print actions sit below the worksheet.

## Product catalogue and import update (2026-09-17)

Sales has a dedicated catalogue page for the data used by Manual Quotation search. It lists reference and user-maintained products with code/SKU, category, brand, model, specification, unit, PKR unit price, rate source, effective date, status and optional controller/grille model-price mappings. Staff can add or edit one product, activate/deactivate it, search/filter the complete register, download a CSV template, or upload `.xlsx`, `.xls` and `.csv` data. Duplicate model numbers update the existing user-maintained record. Active additions become available in Manual Quotation immediately through the same local browser store.

This remains an HTML mockup with browser-local demonstration persistence. Excel parsing uses the SheetJS browser library already used for quotation export; if it is unavailable, staff can use the CSV template/import path.

The worksheet stores draft metadata and lines separately from approved/submitted quotations. It calculates subtotal, freight, tax/duty, discount and grand total, downloads a real `.xlsx` workbook when SheetJS is available (with an Excel-compatible CSV fallback), and prints a clean A4 landscape quotation while hiding application controls.

## Sales operational UI update (2026-09-18)

The Dashboard, Inquiries & Tenders, and BOQ & Costing screens were simplified for the staff walkthrough without changing the confirmed workflow:

- The large yellow `HTML MOCKUP` banner is replaced by a quiet `Local mock data` status and reset control.
- Each page now has one compact title/action row followed by a single four-value summary strip.
- Dashboard prioritizes the work queue, recent activity, pipeline and active records instead of five separate presentation cards.
- Inquiries keeps stage tabs, search and priority filtering inside the register so staff can filter and act in one place.
- BOQ keeps all commercial tabs, price calculations, FX snapshot, stock reference, cost components, substitutions and management approval, with the financial summary compressed into one row.
- Primary actions use the shared navy treatment; secondary actions, table density and responsive behavior remain consistent with HR/Accounts sizing.

Validation: JavaScript syntax check and all 12 Sales store/render tests pass. Browser automation could not open the local `file://` preview because that surface blocks local-file navigation, so direct-file behavior remains covered by the existing render/runtime tests and the user can review the visual result in Chrome.
