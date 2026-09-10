# Temporary implementation contract

Core script `assets/js/inventory-ui.js` loads after inventory-store.js and defines global `Inv`. Page modules load afterward and register `Inv.pages[key] = () => html` and `Inv.actions[name] = (id, button) => { ... }`. Final boot calls `Inv.start(pageKey)`.

API:
- `Inv.S` = InventoryStore; read latest `S.data`, never cache the data object across transactions.
- `Inv.h(value)` HTML escape; `Inv.n(value)` quantity; `Inv.money(value)` PKR formatting.
- `Inv.badge(text)` status badge; `Inv.btn(label, action, id='', style='', disabled=false)` renders data-action/data-id button.
- `Inv.link(label, href, style='')` button anchor; `Inv.panel(title, body, actions='')`; `Inv.notice(text, proposed=false)`.
- `Inv.table(headers, rows, empty='No records', id='')` rows are HTML strings of td elements. Does NOT wrap tbody row automatically: pass full tr strings.
- `Inv.field(label, name, value='', type='text', extra='')` escaped value input; extra is trusted HTML attributes, e.g. required, min, max, step.
- `Inv.select(label,name, options, value='', extra='')`: options strings or {value,label}; extra trusted attributes.
- `Inv.area(label,name,value='',extra='')` textarea; `Inv.upload(label,name,required=true)` image upload; `Inv.proof(form,name)` returns selected file metadata or null; `Inv.evidence(proof,label)` preview/file metadata card. File names persist, previews only for this session.
- `Inv.dialog(title, bodyHtml, submitLabel, handler)` creates native dialog with form. handler(form) may be async, errors stay in modal; on success closes and re-renders. Can return `{navigate:'file.html?id=...'}` to navigate. Inv.val(form,name) returns string. `Inv.close()`.
- `Inv.render()` refreshes current page; `Inv.toast(message)`; `Inv.query(name)` URL parameter; `Inv.print(title, bodyHtml)` printable slip.
- `Inv.filters(statusOptions=[])` renders search and status controls for rows with data-search/data-status, and `Inv.filterRows()` applies them. Use only one table with rows marked data-record on each listing page.
- `Inv.demo(body)` places controls in a collapsed, explicitly labelled other-role simulation section.

Core owns HTML wrappers for ALL warehouse pages, shared nav, dashboard, master stock, inward, equipment, history, vendors, workflow, CSS and store. Request agent owns ONLY `assets/js/inventory-requests.js` (register pages outward and request-detail, plus namespaced req-* actions). Procurement agent owns ONLY `assets/js/inventory-procurement.js` (pages purchases, deliveries, exceptions; actions pr-*, del-*, issue-*). Do not modify store/core/wrappers; send requested contract changes to root. Existing styling available in assets/css/inventory.css.
