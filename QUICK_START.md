# 🚀 Quick Start - Checkout System

## Step 1: Install Razorpay SDK

```bash
npm install razorpay
```

## Step 2: Add Environment Variables

Add these to your `.env.local` file:

```env
# Get these from https://dashboard.razorpay.com/app/keys

```

## Step 3: Test the System

### Using Browser:

1. **Add items to cart** - Browse products and add to cart
2. **Go to cart** - Click cart icon → `/cart`
3. **Click "Proceed to Checkout"** → `/checkout`
4. **Select or add address**
   - Choose from saved addresses OR
   - Click "Add New Address" and fill the form
5. **Review order summary** - Check items, pricing, shipping
6. **Select payment method**
   - **Card**: Credit/Debit Card (Visa, MasterCard, Amex)
   - **UPI**: PhonePe, Google Pay, PayTm (India only)
7. **Click "Proceed to Payment"** - Opens Razorpay popup
8. **Use test card** (for Card payment):
   - Card: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: `12/25`
   - OTP: Any 6-digit number
9. **Use test UPI** (for UPI payment):
   - UPI ID: `success@razorpay` (or any UPI ID during testing)
   - OTP: Any 6-digit number
10. **Success!** - Redirected to order success page

### Using cURL:

```bash
# 1. Get addresses
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/user/addresses

# 2. Add address
curl -X POST \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "fullName": "John Doe",
       "phone": "9876543210",
       "addressLine1": "123 Main St",
       "city": "Mumbai",
       "state": "MH",
       "postalCode": "400001",
       "country": "India",
       "isDefault": true
     }' \
     http://localhost:3000/api/user/addresses

# 3. Create order
curl -X POST \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "addressId": "ADDRESS_ID",
       "paymentMethod": "razorpay"
     }' \
     http://localhost:3000/api/orders/create

# 4. Create Razorpay order
curl -X POST \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "orderId": "ORDER_ID"
     }' \
     http://localhost:3000/api/orders/razorpay

# 5. Get order details
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3000/api/orders/ORDER_ID
```

## Step 4: Check Database

After successful payment, verify in MongoDB:

```javascript
// Check Order
db.orders.findOne({ _id: "order_id" })

// Expected output:
{
  "user": ObjectId("user_id"),
  "items": [...],
  "paymentStatus": "paid",
  "orderStatus": "processing",
  "razorpayPaymentId": "pay_xxxxx",
  "totalAmount": 1500.50
}

// Check Cart is cleared
db.carts.findOne({ userId: "user_id" })
// Should return null or empty items array
```

## Common Issues & Solutions

### ❌ "Cannot find module 'razorpay'"
**Solution**: Run `npm install razorpay`

### ❌ "Razorpay is not configured"
**Solution**: Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `.env.local`

### ❌ "Address not found"
**Solution**: Make sure address ID is valid and belongs to the logged-in user

### ❌ "Payment verification failed"
**Solution**: 
- Check that signature matches
- Ensure RAZORPAY_KEY_SECRET is correct
- Don't mix test and live keys

### ❌ Cart not clearing after payment
**Solution**: Verify payment verification succeeded and order status is "paid"

### ❌ UPI not showing in payment methods
**Solution**: 
- UPI is India-only, ensure region is set correctly
- Refresh page after selecting UPI option
- Check Razorpay dashboard for UPI enablement

## File Structure Created

```
src/app/
├── api/
│   ├── user/addresses/route.ts
│   └── orders/
│       ├── create/route.ts
│       ├── [id]/route.ts
│       ├── razorpay/route.ts
│       └── verify/route.ts
├── checkout/page.tsx
└── order-success/[id]/page.tsx
```

## Features Available

✅ Address Management
- Save multiple addresses
- Set default address
- Edit/delete addresses

✅ Checkout
- Select saved address
- Add new address
- Real-time order calculation
- Free shipping for orders > ₹100
- 8% tax calculation

✅ Payment
- Razorpay integration
- Secure payment gateway
- Payment verification
- Automatic order status update

✅ Order Tracking
- Order confirmation
- Order details page
- Payment status
- Shipping address

## Next Steps

1. **Test thoroughly** with test cards and data
2. **Get Razorpay Live Keys** when ready for production
3. **Update environment variables** with live keys
4. **Deploy to production**
5. **Monitor payments** in Razorpay dashboard

## Documentation

- **Full Setup Guide**: See `CHECKOUT_SETUP.md`
- **Implementation Details**: See `CHECKOUT_IMPLEMENTATION.md`
- **API Reference**: See `CHECKOUT_SETUP.md` API section

## Support

For issues, check:
1. Logs in browser console (F12)
2. Server logs in terminal
3. Razorpay dashboard
4. MongoDB documents

Happy coding! 🎉
