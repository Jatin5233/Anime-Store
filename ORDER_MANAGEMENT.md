# Order Management System - Complete Documentation

## Overview

Complete order management system with both user and admin interfaces for tracking and managing orders throughout their lifecycle.

## User Features

### User Order Pages

#### 1. **My Orders** (`/orders`)
- View all personal orders
- Filter by status: all, processing, shipped, delivered, cancelled
- Quick order summary with key information
- Click to view order details

**Features:**
- Real-time order status display with icons
- Order items count and total amount
- Payment status indicator
- Shipping city and state
- Order date and time
- Responsive grid layout

#### 2. **Order Details** (`/orders/[id]`)
- Complete order information
- Full order items with images and pricing
- Shipping address details
- Payment information
- Price breakdown (subtotal, shipping, tax, total)
- Order status timeline

**Access Control:**
- Only view own orders
- Secure authentication required

### User APIs

#### GET `/api/user/orders`
Fetch all user's orders
```bash
curl -H "Authorization: Bearer {JWT_TOKEN}" \
     http://localhost:3000/api/user/orders
```

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "order_id",
      "items": [...],
      "totalAmount": 1500.50,
      "orderStatus": "processing",
      "paymentStatus": "paid",
      "createdAt": "2026-01-28T10:30:00Z",
      "shippingAddress": {...}
    }
  ]
}
```

#### GET `/api/user/orders/[id]`
Fetch specific order details
```bash
curl -H "Authorization: Bearer {JWT_TOKEN}" \
     http://localhost:3000/api/user/orders/order_id
```

---

## Admin Features

### Admin Order Management Pages

#### 1. **Order Dashboard** (`/admin/orders`)
- View all customer orders
- Real-time order statistics
- Filter by status
- Quick order overview in table/card format

**Statistics Dashboard:**
- Total Orders count
- Total Revenue (₹)
- Paid Orders count
- Pending Orders count
- Average Order Value

**Features:**
- Responsive table on desktop
- Card layout on mobile
- Order status with emoji indicators
- Customer email
- Number of items
- Order total
- Payment status
- Quick action links

#### 2. **Order Management Details** (`/admin/orders/[id]`)
- Edit order status
- Edit payment status
- View all order details
- Customer information
- Full order items list
- Shipping address
- Price breakdown

**Admin Capabilities:**
- Change order status: processing → shipped → delivered/cancelled
- Change payment status: pending → paid/failed/refunded
- Real-time updates with success/error feedback
- Save buttons with loading states

### Admin APIs

#### GET `/api/admin/orders`
Fetch all orders (admin only)
```bash
curl -H "Authorization: Bearer {ADMIN_JWT_TOKEN}" \
     http://localhost:3000/api/admin/orders
```

**Access Control:**
- Admin role verification
- Returns 403 if not admin

#### GET `/api/admin/orders/[id]`
Fetch specific order (admin only)
```bash
curl -H "Authorization: Bearer {ADMIN_JWT_TOKEN}" \
     http://localhost:3000/api/admin/orders/order_id
```

#### PATCH `/api/admin/orders/[id]`
Update order status or payment status
```bash
curl -X PATCH \
     -H "Authorization: Bearer {ADMIN_JWT_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{
       "orderStatus": "shipped",
       "paymentStatus": "paid"
     }' \
     http://localhost:3000/api/admin/orders/order_id
```

**Valid Status Values:**
- Order Status: `processing`, `shipped`, `delivered`, `cancelled`
- Payment Status: `pending`, `paid`, `failed`, `refunded`

#### GET `/api/admin/orders/stats/overview`
Fetch order statistics (admin only)
```bash
curl -H "Authorization: Bearer {ADMIN_JWT_TOKEN}" \
     http://localhost:3000/api/admin/orders/stats/overview
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalOrders": 15,
    "totalRevenue": 22500.50,
    "paidOrders": 12,
    "pendingOrders": 3,
    "averageOrderValue": 1500.03,
    "processingOrders": 5,
    "shippedOrders": 4,
    "deliveredOrders": 3,
    "cancelledOrders": 0
  }
}
```

---

## Order Status Flow

```
┌─────────────┐
│ Processing  │  ← Order created, awaiting fulfillment
└─────┬───────┘
      │
      ▼
┌─────────────┐
│  Shipped    │  ← Order dispatched to customer
└─────┬───────┘
      │
      ▼
┌─────────────┐
│ Delivered   │  ← Order received by customer
└─────────────┘

OR (Alternative)
┌─────────────┐
│ Cancelled   │  ← Order cancelled by admin or user
└─────────────┘
```

## Payment Status Flow

```
Pending  →  Paid  (Successful payment)
         →  Failed  (Payment failed)
         →  Refunded  (Refund issued)
```

---

## Database Model

### Order Schema
```typescript
{
  user: ObjectId,              // Reference to User
  items: [
    {
      product: ObjectId,       // Reference to Product
      quantity: Number,
      priceAtPurchase: Number  // Price locked at purchase time
    }
  ],
  shippingAddress: {
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  paymentMethod: String,       // 'razorpay', 'cod', 'stripe'
  paymentStatus: String,       // 'pending', 'paid', 'failed', 'refunded'
  orderStatus: String,         // 'processing', 'shipped', 'delivered', 'cancelled'
  totalAmount: Number,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  isGift: Boolean,
  giftMessage: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Complete Order Flow

### 1. User Checkout Process
```
1. User adds items to cart
2. User goes to /checkout
3. User selects/adds shipping address
4. User selects payment method (Card/UPI)
5. User clicks "Proceed to Payment"
6. Order created with orderStatus: "processing"
7. Razorpay popup opens for payment
8. User completes payment
9. Payment verified via /api/orders/verify
10. Order marked as paid
11. User redirected to /order-success/[id]
```

### 2. Admin Order Management
```
1. Admin visits /admin/orders
2. Admin sees all orders with stats
3. Admin clicks on order to view details
4. Admin updates order status (e.g., processing → shipped)
5. Admin updates payment status if needed
6. Order status synced in database
7. User sees updated status on /orders/[id]
```

### 3. User Order Tracking
```
1. User visits /orders
2. User sees all their orders with filters
3. User clicks order to view details
4. User sees complete order information
5. User sees current status and payment status
6. User sees shipping address
7. User sees itemized breakdown
```

---

## Security Features

✅ **Authentication Required**
- All order endpoints require JWT token
- User can only view own orders
- Admin can only access orders with admin role

✅ **Authorization Checks**
- User order endpoints verify userId matches
- Admin endpoints verify admin role
- Order ownership validation on PATCH requests

✅ **Data Validation**
- Order status must be valid enum value
- Payment status must be valid enum value
- Order ownership verified before updates

---

## File Structure Created

```
src/app/
├── orders/                          # User Order Pages
│   ├── page.tsx                     # My Orders List
│   └── [id]/page.tsx                # Order Details
│
├── admin/orders/                    # Admin Order Pages
│   ├── page.tsx                     # Orders Dashboard
│   └── [id]/page.tsx                # Order Management
│
└── api/
    ├── user/orders/                 # User APIs
    │   ├── route.ts                 # GET all user orders
    │   └── [id]/route.ts            # GET specific order
    │
    └── admin/orders/                # Admin APIs
        ├── route.ts                 # GET all orders
        ├── [id]/route.ts            # GET & PATCH order
        └── stats/overview/route.ts  # GET statistics
```

---

## Testing the System

### Test User Orders
```bash
# Get all user orders
curl -H "Authorization: Bearer {USER_JWT}" \
     http://localhost:3000/api/user/orders

# Get specific order
curl -H "Authorization: Bearer {USER_JWT}" \
     http://localhost:3000/api/user/orders/{order_id}
```

### Test Admin Orders
```bash
# Get all orders
curl -H "Authorization: Bearer {ADMIN_JWT}" \
     http://localhost:3000/api/admin/orders

# Get specific order
curl -H "Authorization: Bearer {ADMIN_JWT}" \
     http://localhost:3000/api/admin/orders/{order_id}

# Update order status
curl -X PATCH \
     -H "Authorization: Bearer {ADMIN_JWT}" \
     -H "Content-Type: application/json" \
     -d '{"orderStatus": "shipped"}' \
     http://localhost:3000/api/admin/orders/{order_id}

# Get statistics
curl -H "Authorization: Bearer {ADMIN_JWT}" \
     http://localhost:3000/api/admin/orders/stats/overview
```

---

## Features Summary

### User Features ✅
- View all personal orders
- Filter orders by status
- View detailed order information
- See payment and order status
- View shipping address
- See itemized order breakdown
- Real-time updates

### Admin Features ✅
- View all customer orders
- Real-time order statistics
- Filter orders by status
- Edit order status
- Edit payment status
- View customer details
- Manage order fulfillment
- Track revenue metrics

### Security Features ✅
- JWT authentication
- Role-based access control
- User data isolation
- Admin verification
- Input validation
- Order ownership verification

---

## Next Steps

1. **Email Notifications**
   - Send order confirmation emails
   - Send status update emails
   - Send delivery notifications

2. **Order Tracking**
   - Add tracking number field
   - Integrate with shipping providers
   - Send tracking links to customers

3. **Returns & Refunds**
   - Create return request system
   - Manage refund process
   - Track return status

4. **Advanced Analytics**
   - Revenue charts
   - Order trends
   - Customer insights
   - Product performance

5. **Order Exports**
   - Export orders to CSV/PDF
   - Generate invoices
   - Bulk order management

---

## Support

For issues or questions:
1. Check API response messages
2. Verify authentication tokens
3. Ensure user/admin roles are correct
4. Check browser console for errors
5. Review server logs for detailed errors
