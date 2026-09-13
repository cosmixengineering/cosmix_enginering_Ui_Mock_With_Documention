# Inventory mockup — workflow decisions and review guide

Read alongside PROJECT_CONTEXT.md. Last updated 2026-09-10.

## Confirmed by the project manager

Master-item form correction: preserve unique material code/SKU, item name, category, description/specifications, unit of measure, per-piece/unit purchase price, minimum stock, bin and opening stock. Variations are optional through an ON/OFF toggle; each row has its own unique code, specification and per-unit price. Existing internal item IDs remain stable so editing a displayed material code does not break request/stock references. Variations are saved in the item form; separate variation stock and request allocation are not introduced in this form-only correction.

Form-only revision verified: restored code/description, explicit per-unit pricing, optional variation add/remove toggle, duplicate-code validation, and save/edit round-trip. Material list shows code and per-unit price. All 17 regression tests passed. Browser verified toggle ON adding a row, adding/removing another row, saving parent price 100 and variation price 125, and reopening the same saved values. Existing demo records remain compatible through code fallback to their existing ID. Other workflow pages and layout were not redesigned in this correction.

Platform boundary: Inventory management is a web panel. The mobile application serves workers/office staff/site staff and clients through role-based views. Site Supervisor is a site-staff role with material/tool request access. All employees have personal salary, attendance, deductions, overtime, leave, advance and loan self-service; these personal features do not grant departmental management access. The client's mobile view is separate. Additional role permissions follow confirmed requirements.

Supervisor mobile request goes directly to Inventory. Inventory checks stock and sends available goods with an internal company office rider. There is no Project Manager approval. Warehouse dispatch is non-financial. For shortage, choose exactly one Administrator OR Director; after approval the company purchaser obtains goods from a vendor. The purchaser can deliver personally or arrange third-party delivery with exact charges. Vendor bill and material photos accompany purchaser updates. Site receiving requires material and signed challan photos; damage, missing or incorrect material requires comments and photographic evidence. Dispatch alone does not mean received.

## Proposed handling for staff review

- Reserve available stock before calculating shortage; 10 requested and 2 available means 2 reserved and 8 purchased. Reservation across requests prevents double allocation. Partial warehouse dispatch is allowed.
- Rejected PR quantities become eligible for a new submission to one approver. Approval and purchaser activity are simulated as other-role events, not inventory permissions.
- Direct vendor-to-site purchases do not enter central warehouse stock. Only physically received inward stock can increase warehouse quantities.
- GRN supports partial receipt and separate accepted versus held quantities. Held/damaged stock is excluded from available stock.
- Site delivery exceptions remain open until review. Inventory may accept after review, arrange a physical return, or reopen disputed quantities for replacement. No automatic write-off, payroll deduction, or payment action is implied.
- Tool custody records track serial, employee, site, due date and physical return. Returned tools become available only after actual receiving; damaged returns are held.

## Local demonstration limits

HTML/CSS/JavaScript only. Browser-local demo records persist across page navigation and refresh. Reset restores sample records. No backend, live mobile connection, notification delivery, vendor messaging, authentication or accounting posting. Uploaded proof is selected locally for review, with file names retained in mock state; browser-session previews are not a document storage service. Demo controls explicitly simulate other roles.

## Staff decisions still open

Who assigns the purchaser after approval? When should Administrator versus Director be chosen? Are there amount limits? What exact rejection/resubmission process applies? Can a shortage be bought in multiple vendor deliveries? What is the policy for urgent purchases, returns, damaged stock, repair and replacement? Which stock units permit fractional quantities? Confirm before production design.

## Mobile review backlog (not changed in this desktop pass)

The existing mobile InventoryDashboard is not registered in App.js and references absent StockList/IssueMaterial routes. Following the latest platform clarification, this is a prototype scope inconsistency, NOT a task to add mobile inventory management: departmental management stays on the web. MaterialRequestScreen has a mismatched JSX closing tag and a static submit action. ReceiveDeliveryScreen does not validate damage comments and always labels the final action received. Supplier outside-rider and purchaser outsourced labels conflict with the latest user clarification. App.tsx still contains starter content. During the mobile pass, align employee self-service and Supervisor-only request access with the confirmed role boundaries before extending any screen.

## Walkthrough

Open Warehouse dashboard, then REQ-8890. Stock and shortage are shown automatically. Use Dispatch with office rider for available items. Select the desired shortage items, edit purchase quantities if needed, and send to ONE Administrator or Director. Stock checking/reservation happens inside the action; there is no separate prerequisite button. In Purchase Tracking use the visible, clearly marked next-role demo actions to simulate approval and purchaser dispatch. In Deliveries simulate supervisor receipt with both photos, or report a discrepancy and review it in Damage & Returns. Verify Master Inventory and Stock Ledger after warehouse movements. Direct vendor-to-site delivery must not change central stock.

## Compact UI correction — latest user feedback, 2026-09-10

The user explicitly rejected the larger first-pass Inventory styling. Match HR and Accounts density: reuse shared createNavLink for the navy active sidebar, compact labels, icons and connected modules; keep tables, forms, buttons, headings and spacing small. Avoid large banners and repeated KPI blocks. Main request view now has five columns, working per-item purchase checkboxes, Select All and editable purchase quantities, with two clear supply paths. History and advanced stock details are optional expanders. Other-role demo next-step buttons are visible and labelled.

Inventory page navigation now stays in one HTML document using hash routes. This avoids switching browser-local storage contexts between separate file URLs and preserves session photo previews and in-memory records during normal menu navigation. A storage write failure no longer cancels a valid action; the UI explains when records are session-only. Browser back/forward and direct route parameters remain supported. The runtime test browser cannot open file URLs due to its URL security policy, so interactive validation was performed on the local HTTP preview; direct Chrome file-mode execution is not claimed as browser-tested.

Revision validation: 16 tests pass, including selected/partial purchase quantities, excessive and duplicate selection rejection, automatic stock reservation, and denied-storage fallback. Four scripts pass syntax checks. Browser checks confirmed Add Vendor saving, request selection (insulation unchecked, copper quantity changed from 8 to 6), a Director PR containing only six coils, preserved remaining shortage, compact sidebar, office-rider dispatch, and partial GRN saving with matching ledger movement. Demo state was reset after checks. The final reload rendered the request page successfully with no new console errors; a historical syntax error captured during an intermediate module edit did not recur. Interactive checks used the local HTTP preview; direct file opening was blocked by the browser tool's security policy.

## Completed HTML changes — 2026-09-10

Twelve connected routes under `hr/warehouse`: dashboard, requests/dispatch, request detail, master inventory, purchase tracking, delivery tracking, inward/GRN, damage/returns, tools/custody, stock ledger, vendors, workflow/review. Shared warehouse state is in `assets/js/inventory-store.js`; the shell and stock operations are in `inventory-ui.js`, requests in `inventory-requests.js`, purchasing/receiving exceptions in `inventory-procurement.js`, and scoped styling in `assets/css/inventory.css`.

Removed the contradictory PM approval from the active desktop workflow. Replaced missing/hardcoded dialogs with selected-record forms, wired filters and vendor history, enabled stock item edits, tool returns, physical GRN, CSV ledger export and printable material issue slips. All workflow counts derive from the local sample records. HR, Accounts and React Native sources were not changed.

## Validation completed — 2026-09-10

- `node --test inventory/tests/inventory-store.test.cjs`: 13 passing tests covering shared reservations, duplicate/rejected PRs, invalid/partial dispatch, physical GRN and held quantities, direct-site stock isolation, required receipt evidence, discrepancy replacements, physical/tool returns, serial uniqueness, page rendering and escaped user input.
- All four inventory JavaScript files passed syntax checks. All twelve warehouse HTML routes returned HTTP 200 and local asset references resolved.
- Browser walkthrough: dashboard → REQ-8890 → reserve 2 of 10 coils → PR for 8 to Administrator → office-rider handover → approval/purchaser assignment → local proof selection → purchaser direct-site dispatch → receipt of 7/8 coils with reason and both photos → DAMAGED delivery and one-coil issue report. The test used the existing logo solely as disposable mock evidence; sample data was reset afterward.
- Dashboard visual review and console check completed; no browser errors captured in the walkthrough. The responsive narrow-panel view was inspected; broad device/browser coverage is not claimed.

The local HTTP preview is normally `http://127.0.0.1:4173/hr/warehouse/index.html` while the preview server is running. It is not a published URL. Restart if needed from the repository root using `python -m http.server 4173 --bind 127.0.0.1`.

## Refresh startup fix — 2026-09-10

User reported a blank delivery page after refreshing deliveries.html#page=deliveries, with only the old shared sidebar visible. Direct HTTP entry and refresh succeeded; the exact Chrome file session was not accessible for browser testing. A denied-storage startup regression reproduced a matching failure: shared renderLayout read sidebarCollapsed without a guard and aborted before Inventory rendered its content. Guarded sidebar preference reads and writes in shared.js; no form, styling or department flow changes. Existing stored records are not cleared.

Validation: the new startup regression failed before the fix and passed afterward, including rendered delivery register and sidebar toggle with storage denied. All 18 inventory tests pass. The HTTP browser delivery entry/hash route renders after refresh. The user's exact file-mode environment remains unverified.

## Master-item vendor, unit and variation correction — 2026-09-10

The project manager confirmed that the master-item form needs a vendor dropdown, proper unit choices and selectable variation details. The form now requires one active preferred vendor from Vendor Directory and saves its vendor ID with the item. Unit choices cover count/packaging, length, weight, liquid/container, area and volume units while preserving an existing stored unit.

When variations are ON, every row now follows Code → Variation type → Value/specification → Price per unit. Common values are selectable for size/diameter, thickness/gauge, length, colour, capacity/rating and material/grade. Brand, model, other specifications and uncommon values use the Custom value option. Variation type is saved with the existing unique variation code, specification and price. This remains item-master metadata; separate variation-level stock allocation is still outside this correction.
