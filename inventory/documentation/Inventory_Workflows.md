# Cosmix Engineering Inventory workflows

Last updated: 2026-09-17.

This file preserves confirmed requirements for the Inventory HTML mockup. The mockup uses local browser data and does not represent a live backend, mobile connection, accounting posting or management approval.

## Confirmed request and fulfilment flow

1. A Site Supervisor submits a material or tool request from the role-based employee mobile application.
2. The request goes directly to Inventory. Project Manager approval is not part of this handoff.
3. Inventory checks warehouse availability.
4. Available material is issued from the warehouse and handed to the internal office rider for delivery to the site. This is a non-financial stock movement.
5. For a shortage, Inventory selects one approval recipient: Administrator or Director.
6. After approval, the company purchaser obtains the goods from a selected vendor and arranges delivery.
7. Site receiving records quantities and evidence. Damaged, missing or incorrect goods require comments and a photo.
8. A tool or reusable item returned from a site remains pending until Inventory physically receives and inspects it. The receiving action creates a return receiving note / GRN and preserves its receipt history.

## Reports and documents page

The client requested one compact Inventory page that shows reports, invoices and document-style records for all Inventory work. The sidebar route is warehouse/reports.html.

The document register is derived from current mock records and contains:

- Site material/tool Request Notes
- Material Issue Slips for internal warehouse dispatch
- Purchase Requisitions and approval/rejection notes
- Purchase Orders
- Vendor Purchase Invoices only when vendor bill/invoice evidence exists
- Vendor Delivery Notes and Site Receiving Notes
- Expected Inward Notes and Goods Received Notes (GRNs)
- Tool Issue / Custody Notes
- Tool / Site Return Notes and Return Receiving Notes / GRNs
- Damage / Discrepancy Reports and Inspection / Resolution Notes

Warehouse dispatches, tool handovers and returns are not labelled as invoices because they are operational and non-financial. They remain printable document-style notes, slips or GRNs. This distinction prevents a warehouse movement from being mistaken for a vendor payable.

The page also provides compact operational reports for stock balance and reorder, stock movement, site issue/receipt, purchase/vendor status, tool custody/returns and damage/held stock. Users can filter the document register by search, document group, status, site and date, open a document preview, print it or export the unified register as CSV.

## Data behavior

- All page values come from the current CosmixInventoryV2 browser data model.
- A physical inward receiving action appends an immutable mock receipt entry instead of overwriting the previous GRN reference.
- Previously saved mock data without receipt history remains readable through a legacy GRN fallback.
- Sample vendor invoices are visibly demonstration evidence. New purchase records do not become invoices unless bill/invoice data exists.
- Direct HTML navigation loads the reports module from every standard Inventory wrapper so the new page works when opened directly in Chrome.

## UI rules

- Keep the compact HR/Accounts sizing and navy active sidebar.
- Preserve existing Inventory forms and their fields.
- Keep demonstrations clearly identified as local HTML mock data.
- Do not add a backend or imply live mobile/accounting integration.

## Validation recorded on 2026-09-17

- JavaScript syntax checks cover the Inventory store, shell and reports module.
- Automated tests cover report/document derivation, unique document keys, financial invoice classification, multiple GRN receipt history and the tool-return physical receiving flow.
- Browser verification covers direct page load, sidebar visibility, document preview and refresh behavior.

## Open staff decisions

- Official document numbering prefixes and yearly reset rules.
- Which signatures are mandatory on each document.
- Whether site receiving and warehouse GRN require separate print templates.
- Purchase approval thresholds and whether both roles ever participate above a threshold.
- Repair, write-off and scrap approval rules for damaged tools/material.
- Final accounting ownership and posting rules for vendor invoices.
