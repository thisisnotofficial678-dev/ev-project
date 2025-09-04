// Minimal Express server for Razorpay Order + Verify
// 1) Run: npm i express cors dotenv razorpay
// 2) Create .env at project root with:
//    RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
//    RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxx
// 3) Start: node server/index.js (or add an npm script)

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import crypto from 'crypto';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order (amount in paise)
app.post('/create-order', async (req, res) => {
  try {
    const { amountInPaise, currency = 'INR', receipt = 'rcpt_' + Date.now() } = req.body || {};
    if (!amountInPaise) return res.status(400).json({ error: 'amountInPaise required' });

    const order = await rzp.orders.create({ amount: amountInPaise, currency, receipt });
    return res.json(order);
  } catch (err) {
    console.error('create-order error', err);
    return res.status(500).json({ error: 'create_order_failed', message: err?.message });
  }
});

// Verify payment signature
app.post('/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'missing_fields' });
    }

    const payload = razorpay_order_id + '|' + razorpay_payment_id;
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest('hex');

    const valid = expected === razorpay_signature;
    return res.json({ valid });
  } catch (err) {
    console.error('verify error', err);
    return res.status(500).json({ error: 'verify_failed', message: err?.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));



