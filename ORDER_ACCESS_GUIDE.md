# Order Management System - Quick Access Guide

## 🔗 Access URLs

### User Pages
| Feature | URL | Access |
|---------|-----|--------|
| My Orders | `/orders` | Logged in users |
| Order Details | `/orders/[order_id]` | Own orders only |

### Admin Pages
| Feature | URL | Access |
|---------|-----|--------|
| Orders Dashboard | `/admin/orders` | Admins only |
| Manage Order | `/admin/orders/[order_id]` | Admins only |

---

## 🔌 API Endpoints

### User Endpoints
```
GET  /api/user/orders              # Get all user's orders
GET  /api/user/orders/[id]         # Get specific order
```

### Admin Endpoints
```
GET    /api/admin/orders           # Get all orders
GET    /api/admin/orders/[id]      # Get specific order
PATCH  /api/admin/orders/[id]      # Update order status/payment
GET    /api/admin/orders/stats/overview  # Get statistics
```

---

## 📊 What Information is Available

### User Orders View
- Order ID
- Order date and time
- Items in order
- Total amount
- Order status
- Payment status
- Shipping address
- Price breakdown (subtotal, shipping, tax)

### Admin Orders View
- Customer email
- Items count
- Total amount
- Order status
- Payment status
- Payment method
- Order date
- Full order details
- Edit capabilities

---

## ⚙️ Order Status Options

### Order Status (Admin can change)
- `processing` - Order received, being prepared
- `shipped` - Order dispatched
- `delivered` - Order delivered to customer
- `cancelled` - Order cancelled

### Payment Status (Admin can change)
- `pending` - Payment awaited
- `paid` - Payment received
- `failed` - Payment failed
- `refunded` - Payment refunded

---

## 💰 Financial Data Available

### Individual Order
- Subtotal (items total)
- Shipping cost
- Tax (8%)
- Final total

### Dashboard Statistics
- Total orders count
- Total revenue
- Paid orders count
- Pending orders count
- Average order value
- Orders by status breakdown

---

## 🔐 Access Requirements

### User Orders
- ✅ Logged in
- ✅ Valid JWT token
- ✅ Can only access own orders

### Admin Orders
- ✅ Logged in with admin account
- ✅ Valid admin JWT token
- ✅ Can access all orders
- ✅ Can update order status

---

## 🎯 Common Tasks

### As a User

**View my orders:**
1. Login to account
2. Go to `/orders`
3. See all your orders with status

**Check order details:**
1. Go to `/orders`
2. Click on any order
3. See full details, address, items, pricing

**Track order status:**
1. Go to `/orders`
2. Check status column
3. Click order to see more details

### As Admin

**View all orders:**
1. Login with admin account
2. Go to `/admin/orders`
3. See all customer orders + stats

**Update order status:**
1. Go to `/admin/orders`
2. Click order to manage
3. Select new status from dropdown
4. Click "Save Status"

**Update payment status:**
1. Go to `/admin/orders/[id]`
2. Select payment status dropdown
3. Click "Save Payment"

**Check revenue:**
1. Go to `/admin/orders`
2. See statistics cards at top
3. View total revenue, paid orders, etc.

---

## 📱 Responsive Design

### Desktop
- Full table view for orders
- Detailed statistics cards
- Side-by-side layouts
- All information visible

### Mobile/Tablet
- Card-based layout
- Stacked information
- Touch-friendly buttons
- Full functionality maintained

---

## 🔍 Filtering & Searching

### User Orders
- Filter by status: All, Processing, Shipped, Delivered, Cancelled

### Admin Orders
- Filter by status: All, Processing, Shipped, Delivered, Cancelled
- View all orders in one list
- Sort by date (newest first)

---

## ✨ Features by Page

### `/orders` (User)
| Feature | Status |
|---------|--------|
| View all orders | ✅ |
| Filter by status | ✅ |
| View order summary | ✅ |
| Click for details | ✅ |
| Real-time updates | ✅ |
| Responsive | ✅ |

### `/orders/[id]` (User)
| Feature | Status |
|---------|--------|
| Order items list | ✅ |
| Item images | ✅ |
| Shipping address | ✅ |
| Payment details | ✅ |
| Price breakdown | ✅ |
| Order status | ✅ |
| Payment status | ✅ |

### `/admin/orders` (Admin)
| Feature | Status |
|---------|--------|
| All orders list | ✅ |
| Statistics dashboard | ✅ |
| Revenue tracking | ✅ |
| Status filtering | ✅ |
| Customer info | ✅ |
| Quick actions | ✅ |
| Mobile responsive | ✅ |

### `/admin/orders/[id]` (Admin)
| Feature | Status |
|---------|--------|
| Order details | ✅ |
| Edit status | ✅ |
| Edit payment | ✅ |
| Customer info | ✅ |
| Item details | ✅ |
| Price breakdown | ✅ |
| Save changes | ✅ |

---

## 🎨 Status Indicators

### Visual Indicators
- **Processing** 🕐 Yellow - Being prepared
- **Shipped** 🚚 Blue - On the way
- **Delivered** ✅ Green - Received
- **Cancelled** ❌ Red - Cancelled

### Payment Indicators
- **Paid** ✓ Green - Payment received
- **Pending** ⏳ Yellow - Awaiting payment

---

## 💻 Example Requests

### Get User's Orders
```bash
curl -H "Authorization: Bearer {JWT_TOKEN}" \
     http://localhost:3000/api/user/orders
```

### Get Specific Order
```bash
curl -H "Authorization: Bearer {JWT_TOKEN}" \
     http://localhost:3000/api/user/orders/{order_id}
```

### Get All Orders (Admin)
```bash
curl -H "Authorization: Bearer {ADMIN_JWT}" \
     http://localhost:3000/api/admin/orders
```

### Update Order Status (Admin)
```bash
curl -X PATCH \
     -H "Authorization: Bearer {ADMIN_JWT}" \
     -H "Content-Type: application/json" \
     -d '{"orderStatus": "shipped"}' \
     http://localhost:3000/api/admin/orders/{order_id}
```

### Get Statistics (Admin)
```bash
curl -H "Authorization: Bearer {ADMIN_JWT}" \
     http://localhost:3000/api/admin/orders/stats/overview
```

---

## ⚡ Quick Start

### For Users
1. Complete checkout and payment
2. You'll be redirected to order success page
3. Go to `/orders` to view all your orders anytime
4. Click any order to see full details

### For Admins
1. Login with admin account
2. Go to `/admin/orders`
3. See all customer orders and statistics
4. Click order to manage status and payment
5. Updates reflect in real-time

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't see `/orders` | Make sure you're logged in |
| Can't access `/admin/orders` | Verify admin account role |
| Status not updating | Check JWT token is valid |
| Orders not showing | Verify orders exist in database |

---

## 📞 Support

For more details, see:
- `ORDER_MANAGEMENT.md` - Full documentation
- `ORDER_SYSTEM_SUMMARY.md` - Implementation summary

---

**System is ready to use!** 🚀
