# 📊 Checkout System - Complete Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        🛒 USER FLOW DIAGRAM                          │
└─────────────────────────────────────────────────────────────────────┘

     [HOME]
        ↓
   [PRODUCTS]
        ↓
   [ADD TO CART] ────→ [CART PAGE]
                            ↓
                    [PROCEED TO CHECKOUT]
                            ↓
    ┌──────────────────[CHECKOUT PAGE]──────────────────┐
    │                                                     │
    │  1. Load Addresses from /api/user/addresses        │
    │  2. Display saved addresses OR                     │
    │  3. Show "Add New Address" form                    │
    │  4. Display Order Summary:                         │
    │     - Cart items with images                       │
    │     - Subtotal calculation                         │
    │     - Shipping (free if > ₹100, else ₹9.99)       │
    │     - Tax (8%)                                     │
    │     - Total                                        │
    │                                                     │
    │  5. User clicks "Proceed to Payment"               │
    └──────────────────────────────────────────────────────┘
                            ↓
    ┌──────────────────[BACKEND PROCESS]────────────────┐
    │                                                     │
    │  POST /api/orders/create                           │
    │  - Validate address                                │
    │  - Get cart items                                  │
    │  - Calculate total                                 │
    │  - Create Order record (status: pending)           │
    │                                                     │
    │  POST /api/orders/razorpay                         │
    │  - Get order                                       │
    │  - Call Razorpay API                               │
    │  - Generate order_id                               │
    │  - Save to order record                            │
    │                                                     │
    └──────────────────────────────────────────────────────┘
                            ↓
    ┌──────────────────[RAZORPAY POPUP]────────────────┐
    │                                                     │
    │  - Card number: 4111 1111 1111 1111               │
    │  - CVV: 123                                        │
    │  - Expiry: 12/25                                   │
    │  - OTP: Any 6 digits                               │
    │                                                     │
    │  Success Handler:                                  │
    │  - POST /api/orders/verify                         │
    │    - Verify signature                              │
    │    - Check authorization                           │
    │    - Update order (paid)                           │
    │    - Clear cart                                    │
    │                                                     │
    └──────────────────────────────────────────────────────┘
                            ↓
    ┌────────────────[ORDER SUCCESS PAGE]────────────────┐
    │                                                     │
    │  GET /api/orders/[id]                              │
    │  - Display order confirmation                      │
    │  - Show order ID                                   │
    │  - Show payment ID                                 │
    │  - Display shipping address                        │
    │  - List order items                                │
    │  - Show price breakdown                            │
    │  - Show next steps                                 │
    │                                                     │
    │  Actions:                                          │
    │  - Continue Shopping (→ Home)                      │
    │  - View Account (→ User account)                   │
    │                                                     │
    └──────────────────────────────────────────────────────┘
                            ↓
                       [SUCCESS ✅]
```

## Database Schema

```
┌─────────────────────────┐
│        USER             │
├─────────────────────────┤
│ _id                     │
│ name                    │
│ email                   │
│ password                │
│ addresses[]             │
│   ├─ fullName           │
│   ├─ phone              │
│   ├─ addressLine1       │
│   ├─ addressLine2       │
│   ├─ city               │
│   ├─ state              │
│   ├─ postalCode         │
│   ├─ country            │
│   └─ isDefault          │
│ createdAt               │
│ updatedAt               │
└─────────────────────────┘
         ↑
         │ (references)
         │
┌─────────────────────────┐
│       ORDER             │
├─────────────────────────┤
│ _id                     │
│ user (ref: User._id)    │
│ items[]                 │
│   ├─ product (ref)      │
│   ├─ quantity           │
│   └─ priceAtPurchase    │
│ shippingAddress         │
│   ├─ fullName           │
│   ├─ phone              │
│   ├─ addressLine1       │
│   ├─ addressLine2       │
│   ├─ city               │
│   ├─ state              │
│   ├─ postalCode         │
│   └─ country            │
│ paymentMethod: razorpay │
│ paymentStatus: paid     │
│ orderStatus: processing │
│ totalAmount             │
│ razorpayOrderId         │
│ razorpayPaymentId       │
│ createdAt               │
│ updatedAt               │
└─────────────────────────┘
         ↑
         │ (references)
         │
┌─────────────────────────┐
│       PRODUCT           │
├─────────────────────────┤
│ _id                     │
│ name                    │
│ price                   │
│ discountPrice           │
│ images[]                │
│ stock                   │
│ ...                     │
└─────────────────────────┘
```

## API Endpoints

```
╔═══════════════════════════════════════════════════════════════════╗
║                     ADDRESS MANAGEMENT APIs                       ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  GET /api/user/addresses                                          ║
║  ├─ Auth: ✅ Required                                             ║
║  ├─ Returns: User's saved addresses                               ║
║  └─ Status: 200 OK, 404 Not Found, 500 Error                     ║
║                                                                   ║
║  POST /api/user/addresses                                         ║
║  ├─ Auth: ✅ Required                                             ║
║  ├─ Body: {fullName, phone, addressLine1, city, state, ...}      ║
║  ├─ Returns: Created address                                      ║
║  └─ Status: 201 Created, 400 Bad Request, 500 Error              ║
║                                                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║                      ORDER MANAGEMENT APIs                        ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  POST /api/orders/create                                          ║
║  ├─ Auth: ✅ Required                                             ║
║  ├─ Body: {addressId, paymentMethod}                              ║
║  ├─ Process:                                                      ║
║  │  1. Validate address                                           ║
║  │  2. Get cart items                                             ║
║  │  3. Calculate total                                            ║
║  │  4. Create order (status: pending)                             ║
║  ├─ Returns: {success, order}                                     ║
║  └─ Status: 201 Created, 400 Bad Request, 500 Error              ║
║                                                                   ║
║  GET /api/orders/[id]                                             ║
║  ├─ Auth: ✅ Required                                             ║
║  ├─ Returns: Order with populated items                           ║
║  └─ Status: 200 OK, 404 Not Found, 403 Forbidden, 500 Error      ║
║                                                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║                    PAYMENT PROCESSING APIs                        ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  POST /api/orders/razorpay                                        ║
║  ├─ Auth: ✅ Required                                             ║
║  ├─ Body: {orderId}                                               ║
║  ├─ Process:                                                      ║
║  │  1. Validate order ownership                                   ║
║  │  2. Call Razorpay API                                          ║
║  │  3. Create payment order                                       ║
║  │  4. Save Razorpay order_id                                     ║
║  ├─ Returns: {razorpayOrderId, amount}                            ║
║  └─ Status: 200 OK, 400 Bad Request, 500 Error                   ║
║                                                                   ║
║  POST /api/orders/verify                                          ║
║  ├─ Auth: ✅ Required                                             ║
║  ├─ Body: {razorpayOrderId, razorpayPaymentId,                   ║
║  │          razorpaySignature, orderId}                           ║
║  ├─ Process:                                                      ║
║  │  1. Verify signature                                           ║
║  │  2. Validate order                                             ║
║  │  3. Update order (paid)                                        ║
║  │  4. Clear cart                                                 ║
║  ├─ Returns: {success, order}                                     ║
║  └─ Status: 200 OK, 400 Bad Request, 403 Forbidden, 500 Error    ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

## Frontend Components

```
┌─────────────────────────────────────────────────────────┐
│            /checkout PAGE STRUCTURE                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  HEADER                                                 │
│  ├─ Back to Cart button                                 │
│  └─ "Checkout" title                                    │
│                                                          │
│  MAIN GRID (2/3 width)                                  │
│  ├─ SHIPPING ADDRESS SECTION                            │
│  │  ├─ Saved addresses (radio select)                   │
│  │  ├─ "Add New Address" button                         │
│  │  └─ Address form (if adding new)                     │
│  │     ├─ Full Name                                     │
│  │     ├─ Phone                                         │
│  │     ├─ Address Line 1                                │
│  │     ├─ Address Line 2 (optional)                     │
│  │     ├─ City, State, Postal Code                      │
│  │     ├─ Country (default: India)                      │
│  │     └─ Set as Default checkbox                       │
│  │                                                      │
│  └─ BUTTONS                                             │
│     ├─ Save Address button                              │
│     └─ Cancel button                                    │
│                                                          │
│  SIDEBAR (1/3 width, sticky)                            │
│  ├─ ORDER SUMMARY                                       │
│  │  ├─ Cart Items (scrollable list)                     │
│  │  │  └─ [Image] | Name | Qty | Price                 │
│  │  ├─ Subtotal                                         │
│  │  ├─ Shipping (Free/₹9.99)                            │
│  │  ├─ Tax (8%)                                         │
│  │  └─ TOTAL (highlighted)                              │
│  │                                                      │
│  └─ BUTTONS                                             │
│     └─ "Proceed to Payment" button                      │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│        /order-success/[id] PAGE STRUCTURE               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  SUCCESS INDICATOR                                      │
│  ├─ Green checkmark (large)                             │
│  ├─ "Order Confirmed!" heading                          │
│  └─ "Thank you for your purchase" message               │
│                                                          │
│  ORDER ID SECTION                                       │
│  ├─ Order ID (monospace, copyable)                      │
│  └─ Payment ID (monospace, if available)                │
│                                                          │
│  DETAILS GRID (2 columns)                               │
│  ├─ SHIPPING ADDRESS                                    │
│  │  ├─ Full Name                                        │
│  │  ├─ Address Lines                                    │
│  │  ├─ City, State, Postal Code                         │
│  │  └─ Phone                                            │
│  │                                                      │
│  └─ ORDER STATUS                                        │
│     ├─ Payment Status (badge)                           │
│     └─ Order Status (badge)                             │
│                                                          │
│  ORDER ITEMS                                            │
│  └─ Item List                                           │
│     └─ [Image] | Name | Qty | Price x Qty              │
│                                                          │
│  PRICE BREAKDOWN                                        │
│  ├─ Subtotal                                            │
│  ├─ Shipping                                            │
│  ├─ Tax                                                 │
│  └─ TOTAL AMOUNT                                        │
│                                                          │
│  NEXT STEPS                                             │
│  └─ 4-step guidance                                     │
│     1. Order confirmed and paid                         │
│     2. Confirmation email coming                        │
│     3. Shipping in 2-3 days                             │
│     4. Track in account                                 │
│                                                          │
│  ACTION BUTTONS                                         │
│  ├─ Continue Shopping                                   │
│  └─ View Account                                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Key Features

```
✅ ADDRESS MANAGEMENT
   ├─ Save multiple addresses
   ├─ Set default address
   ├─ Full validation
   └─ Easy selection during checkout

✅ CHECKOUT PAGE
   ├─ Real-time calculations
   ├─ Smart shipping (free > ₹100)
   ├─ 8% tax calculation
   ├─ Order preview
   └─ One-click payment

✅ PAYMENT INTEGRATION
   ├─ Razorpay integration
   ├─ Signature verification
   ├─ Secure token handling
   ├─ Auto cart clearing
   └─ Order status updates

✅ ORDER TRACKING
   ├─ Order confirmation
   ├─ Payment details
   ├─ Shipping address
   ├─ Item list
   └─ Price breakdown

✅ SECURITY
   ├─ JWT authentication
   ├─ User ownership validation
   ├─ Signature verification
   ├─ HTTPS ready
   └─ Secure token storage
```

## Performance Optimizations

```
⚡ DATABASE
   ├─ Indexed queries (user_id, order_id)
   ├─ Populated references only when needed
   └─ Efficient cart clearing

⚡ FRONTEND
   ├─ Client-side calculations
   ├─ Optimized re-renders
   ├─ Image lazy loading
   └─ Sticky sidebar

⚡ API
   ├─ Minimal database calls
   ├─ Efficient authorization
   ├─ Error handling
   └─ Status codes compliance
```

## Error Handling

```
✅ VALIDATION ERRORS (400)
   └─ Missing required fields
   └─ Invalid data format
   └─ Invalid address

✅ AUTHENTICATION (401, 403)
   └─ Missing token
   └─ Invalid token
   └─ Unauthorized access (order not owned by user)

✅ NOT FOUND (404)
   └─ Order not found
   └─ Address not found
   └─ User not found

✅ SERVER ERRORS (500)
   └─ Database connection error
   └─ Razorpay API error
   └─ Signature verification error
```

## Deployment Checklist

```
BEFORE GOING LIVE:

☐ Install razorpay: npm install razorpay
☐ Add env variables (.env.local)
☐ Test with Razorpay test keys
☐ Test payment flow end-to-end
☐ Verify email functionality (if used)
☐ Check error messages
☐ Test with multiple addresses
☐ Verify cart clearing works
☐ Check order creation in database
☐ Test order success page
☐ Get Razorpay live keys
☐ Update env with live keys
☐ Deploy to production
☐ Monitor first payments
☐ Set up email notifications (optional)
☐ Configure webhook (optional)
```

---

**Total Implementation**: 
- ✅ 6 Backend APIs
- ✅ 2 Frontend Pages
- ✅ Complete Data Flow
- ✅ Security Features
- ✅ Error Handling
- ✅ Documentation
