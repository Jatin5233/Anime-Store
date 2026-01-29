# Checkout & Payment System Setup Guide

## Overview
Complete checkout flow with address management and Razorpay payment integration. Users can save multiple addresses, select one during checkout, and complete payments via Razorpay.

## Features Implemented

### 1. **Address Management APIs**
- **GET `/api/user/addresses`** - Retrieve all saved addresses for user
- **POST `/api/user/addresses`** - Add new address to user's account
- Automatic handling of default address

### 2. **Order Management APIs**
- **POST `/api/orders/create`** - Create order with selected address
- **POST `/api/orders/razorpay`** - Generate Razorpay payment order
- **POST `/api/orders/verify`** - Verify payment and update order status
- **GET `/api/orders/[id]`** - Fetch specific order details

### 3. **Frontend Pages**

#### Checkout Page (`/checkout`)
- List saved addresses with radio selection
- Add new address form with validation
- Real-time order summary showing:
  - Cart items with images
  - Subtotal, shipping, tax calculations
  - Free shipping for orders > ₹100
- Direct Razorpay integration
- Address validation before payment

#### Order Success Page (`/order-success/[id]`)
- Order confirmation with order ID
- Payment and order status display
- Detailed shipping address
- Order items with prices
- Next steps guidance

## Installation & Setup

### 1. Install Razorpay SDK
```bash
npm install razorpay
# or
yarn add razorpay
```

### 2. Environment Variables
Add these to your `.env.local`:

```env
# Razorpay Keys (get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxxxx  # or rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx  # Public key for frontend
```

### 3. Database Models (Already Configured)
- User model has `addresses` array field
- Order model stores shipping address, payment & order status
- Cart model is cleared after successful payment

## Flow Diagram

```
Cart Page
   ↓
[Proceed to Checkout Button]
   ↓
Checkout Page
   ├─ Load User's Addresses
   ├─ Select Address or Add New
   └─ Review Order Summary
      ↓
   [Proceed to Payment]
      ↓
Create Order (Backend)
   ↓
Create Razorpay Order
   ↓
Open Razorpay Payment Popup
   ├─ Payment Success
   │   ↓
   │ Verify Payment Signature
   │   ↓
   │ Update Order Status
   │   ↓
   │ Clear Cart
   │   ↓
   │ Redirect to Order Success Page
   │
   └─ Payment Failed
       ↓
       Show Error & Retry Option
```

## API Endpoints

### Address Management

**GET /api/user/addresses**
```bash
curl -H "Authorization: Bearer <token>" \
     https://your-domain/api/user/addresses
```
Response:
```json
{
  "success": true,
  "addresses": [
    {
      "_id": "address_id",
      "fullName": "John Doe",
      "phone": "9876543210",
      "addressLine1": "123 Main St",
      "addressLine2": "Apt 4B",
      "city": "Mumbai",
      "state": "MH",
      "postalCode": "400001",
      "country": "India",
      "isDefault": true
    }
  ]
}
```

**POST /api/user/addresses**
```bash
curl -X POST \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{
       "fullName": "John Doe",
       "phone": "9876543210",
       "addressLine1": "123 Main St",
       "addressLine2": "Apt 4B",
       "city": "Mumbai",
       "state": "MH",
       "postalCode": "400001",
       "country": "India",
       "isDefault": true
     }' \
     https://your-domain/api/user/addresses
```

### Order Management

**POST /api/orders/create**
```json
{
  "addressId": "address_id",
  "paymentMethod": "razorpay"
}
```
Response:
```json
{
  "success": true,
  "order": {
    "_id": "order_id",
    "totalAmount": 1500.50
  }
}
```

**POST /api/orders/razorpay**
```json
{
  "orderId": "order_id"
}
```
Response:
```json
{
  "success": true,
  "razorpayOrderId": "order_DBJOWzybf0sJbb",
  "amount": 1500.50,
  "orderId": "order_id"
}
```

**POST /api/orders/verify**
```json
{
  "razorpayOrderId": "order_id",
  "razorpayPaymentId": "pay_id",
  "razorpaySignature": "signature",
  "orderId": "order_id"
}
```
Response:
```json
{
  "success": true,
  "order": {
    "_id": "order_id",
    "orderStatus": "processing",
    "paymentStatus": "paid"
  }
}
```

**GET /api/orders/[id]**
```bash
curl -H "Authorization: Bearer <token>" \
     https://your-domain/api/orders/order_id
```

## Frontend Integration

### Navigate to Checkout
From cart page:
```typescript
router.push('/checkout');
```

### Using Checkout Component
```typescript
import CheckoutPage from '@/app/checkout/page';
```

## Payment Testing

### Test Razorpay Credentials
- **Mode**: Test (default)
- **Key ID**: `rzp_test_xxxxx`
- **Key Secret**: `your_test_secret`

### Test Cards
| Card Number | CVC | Expiry |
|------------|-----|--------|
| 4111 1111 1111 1111 | 123 | 12/25 |
| 5555 5555 5555 4444 | 123 | 12/25 |
| 3782 822463 10005 | 123 | 12/25 |

### Test OTP
- For HDFC: Enter any 6-digit OTP
- For other banks: 123456

## Troubleshooting

### Issue: "Razorpay module not installed"
**Solution**: Install with `npm install razorpay`

### Issue: Payment Signature Verification Failed
**Check**:
1. RAZORPAY_KEY_SECRET is correct
2. Test vs Live keys are not mixed
3. Signature calculation is correct

### Issue: Cart Not Clearing After Payment
**Check**:
1. Payment verification succeeded
2. Cart deletion API is called
3. User is logged in during payment

### Issue: Address Not Found
**Check**:
1. Address ID is valid ObjectId
2. Address belongs to logged-in user
3. Database connection is active

## Security Notes

1. **RAZORPAY_KEY_SECRET** should NEVER be exposed in frontend
   - Keep in `.env.local` only
   - Use on server-side only

2. **Payment Verification**
   - Always verify signature on backend
   - Don't trust client-side data

3. **User Authorization**
   - Verify order belongs to logged-in user
   - Check authentication token before payment

4. **Cart Handling**
   - Clear cart only after successful verification
   - Store payment ID for reference

## Production Deployment

### 1. Get Live Razorpay Keys
- Go to https://dashboard.razorpay.com/app/keys
- Switch to "Live" mode
- Generate live keys

### 2. Update Environment Variables
```env
RAZORPAY_KEY_ID=rzp_live_xxxxx  # Live key
RAZORPAY_KEY_SECRET=your_live_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

### 3. Enable Webhooks (Optional)
- For real-time payment updates
- Configure in Razorpay dashboard
- Implement webhook endpoint for payment notifications

## Future Enhancements

1. **Email Notifications**
   - Order confirmation email
   - Payment receipt
   - Shipping tracking email

2. **Admin Dashboard**
   - View all orders
   - Update order status
   - Generate reports

3. **Webhook Handling**
   - Real-time payment confirmation
   - Automatic order status updates
   - Refund handling

4. **Additional Payment Methods**
   - Apple Pay / Google Pay
   - Credit Card
   - Net Banking
   - Wallet integration

5. **Inventory Management**
   - Reduce stock after successful payment
   - Handle out-of-stock scenarios

6. **Order History**
   - User account page with order history
   - Download invoice as PDF
   - Return / Exchange requests
