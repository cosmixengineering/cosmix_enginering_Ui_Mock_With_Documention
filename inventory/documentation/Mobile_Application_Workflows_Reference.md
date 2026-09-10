# COSMIX ENGINEERING ERP

## Mobile Application Workflows

This document outlines the complete operational workflows of the Cosmix Engineering ERP mobile application across all defined user roles. It serves as the official reference for the application's business logic, operational processes, and data flow.

---

# 1. Office Staff Portal

### Purpose

Designed for head-office employees to manage their HR, attendance, salary, and financial-related requests through the mobile application.

### Dashboard

The Office Staff Dashboard displays:

* Real-time salary calculations
* Current month's attendance statistics

  * Present Days
  * Leaves
  * Holidays
* Quick Action buttons for frequently used HR functions

### Attendance Calendar

A visual monthly calendar that allows employees to view their attendance records, including:

* Present
* Absent
* Leave
* Holiday
* Other applicable attendance statuses

### HR Requests

#### 1. Leave Request

Employees can submit leave requests by:

* Selecting the required leave dates
* Selecting the leave type
* Providing a reason for the leave
* Submitting the request for approval

#### 2. Salary Advance

Employees can request a mid-month salary advance.

Workflow:

1. Employee enters the requested advance amount.
2. System validates the amount against the company's predefined percentage limit.
3. Request is submitted for approval.
4. Once approved and processed, the advance is automatically recovered from the employee's next payroll.

#### 3. Company Loan

Employees can submit requests for long-term company loans.

The request includes:

* Requested loan amount
* Proposed installment plan
* Loan duration
* Detailed justification/reason
* Supporting information, where required

Once submitted, the request follows the company's approval workflow.

---

# 2. Site Staff & Supervisor Portal

### Purpose

Designed for field workers and site supervisors to manage on-ground attendance, site operations, material requirements, tools, deliveries, and site logistics.

### Site Dashboard

The Site Dashboard provides:

* Current punch-in / punch-out status
* Assigned site location
* Example: Karachi High-Rise Tower
* Access to site-related operations
* Pending material and tool requests
* Delivery-related activities

### Material & Tool Requests

#### 1. Request New Items

Supervisors can:

1. Search for the required material or tool.
2. Select the required item.
3. Enter the required quantity and relevant details.
4. Submit the request.
5. Track the request status from the application.

#### 2. Report Damaged Items

Supervisors can report damaged materials or tools.

The damage report must include:

* Item/material details
* Mandatory photo evidence
* Description of the damage
* Justification/reason
* Additional comments, where required

---

## Receive Delivery – Closing the Loop

When materials arrive at the assigned site, the Site Supervisor completes the delivery receiving process.

### Step 1 – Open Pending Delivery

The supervisor opens the relevant pending delivery from the mobile application.

### Step 2 – Capture Material Photo

The supervisor captures and uploads a photo of the received materials/items (Saman).

### Step 3 – Capture Signed Delivery Challan

The supervisor captures and uploads a photo of the signed delivery challan/paper as proof of delivery.

### Step 4 – Quality Check

The supervisor verifies the received materials.

If the materials are correct and undamaged:

* Delivery is marked as **RECEIVED**.

If the materials are broken, damaged, missing, or incorrect:

* Delivery is marked as **DAMAGED**.
* Mandatory comments/reason must be provided.
* Required photographic evidence is submitted.

This completes the delivery receiving and verification process.

---

# 3. Purchaser Workflow – Market Procurement

### Purpose

Designed for outsourced or field purchasers who purchase materials directly from markets or external vendors.

### Task Assignment

Purchasers receive purchase orders containing:

* Required item/material
* Quantity
* Vendor details
* Target delivery site
* Other relevant purchase instructions

---

## Step 1 – Bill Upload

The purchaser purchases the required item from the assigned vendor.

After purchasing:

* The purchaser uploads a clear photo of the vendor's bill/invoice.
* If applicable, the company processes the payment.
* The purchaser is notified regarding the payment status.

---

## Step 2 – Material Verification

After purchasing the material:

* The purchaser captures a photo of the physical items/material purchased.
* The photo is uploaded to the relevant purchase order.
* The system records the material verification evidence.

---

## Step 3 – Dispatch & Logistics

The purchaser selects the delivery method:

### Option A – Deliver by Me

The purchaser personally delivers the purchased material to the assigned site.

### Option B – Deliver by Rider

The purchaser arranges a third-party rider/courier service, such as:

* inDrive
* Bykea
* Other approved delivery services

If **Deliver by Rider** is selected:

* The purchaser enters the exact rider/delivery charges.
* The delivery details are recorded against the purchase order.

### Completion

Once the purchaser has dispatched the material:

* Purchase order status is updated to **GOING FOR DELIVERY**.
* The assigned Site Supervisor is notified.
* The Site Supervisor can then prepare to receive and verify the delivery.

---

# 4. Supplier Workflow – Warehouse to Site Dispatch

### Purpose

Designed for internal supply-chain operations where materials are dispatched from the company's central warehouse to project sites.

### Process

The Supplier follows the following workflow:

1. Review approved material requests.
2. Identify the required materials from the central warehouse.
3. Pick the required inventory.
4. Verify the requested quantity/items.
5. Assign the materials to the relevant site.
6. Dispatch the materials from the warehouse.
7. Update the delivery status to **OUT FOR DELIVERY**.
8. Notify the respective Site Supervisor.
9. Site Supervisor receives and verifies the delivery at the site.

### Financial Note

This workflow is **strictly non-financial**.

There is:

* No purchasing
* No payment processing
* No billing
* No vendor payment
* No financial transaction

The Supplier workflow is used **only for inventory movement, dispatch tracking, and delivery management** from the company's warehouse to the assigned project site.

---

# 5. Client Portal

### Purpose

Designed for project owners and clients to provide transparency, project visibility, financial information, approvals, and communication through the mobile application.

## Project Overview

Clients can view the overall progress of their project, including:

* Project progress
* Construction phase progress
* Estimated handover date
* Current project status

Example:

**Structure & Foundation – 65% Complete**

Progress bars provide a visual representation of the completion percentage of different project phases.

---

## Financial Highlights

Clients can view key financial information related to their project, including:

* Total Contract Value
* Amount Paid to Date
* Outstanding Amount
* Current Outstanding Bills
* Available Invoices

Clients can open and view relevant invoices directly from the application.

---

## Action Required – Approvals

Clients can view pending items that require their approval.

Examples include:

* 3D Kitchen Layouts
* Structural Changes
* Design Modifications
* Other Project Milestones

The client can review the submitted item and provide approval directly through the mobile application.

---

## Latest Site Updates

The Client Portal includes a site-update feed containing regular project updates uploaded by Site Supervisors.

Updates may include:

* Daily/weekly site status
* Progress notes
* Work completed
* Current site activities
* Important site observations
* Photo galleries

This allows clients to monitor project progress remotely and maintain complete visibility of ongoing site activities.

---

# End of Document

**Cosmix Engineering ERP – Mobile Application Workflows**
