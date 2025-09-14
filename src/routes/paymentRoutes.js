const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Payment = require("../Models/Payment");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const membershipAmount = require("../utils/constants");

const paymentRouter = express.Router();

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    const product = await stripe.products.create({
      name: "Starter Subscription",
      description: "$12/Month subscription",
    });
    const price = await stripe.prices.create({
      unit_amount: 70000,
      currency: "usd",
      recurring: { interval: "month" },
      product: product.id,
    });
    const order = {
      product,
      price,
      notes: {
        firstName: "awad riad",
        lastName: "riad",
      },
    };

    // 3. Save to MongoDB
    const payment = new Payment({
      userId: req.user._id, // from your userAuth middleware
      paymentId: null, // you don’t have this yet until a PaymentIntent is made
      orderId: price.id, // use price.id as orderId (or session.id if you make a Checkout Session)
      amount: price.unit_amount, // convert cents to dollars
      currency: price.currency,
      notes: {
        firstName: firstName,
        lastName: lastName,
        membershipType: membershipType,
      },
    });

    const savedPayment = await payment.save();
    res.json({
      message: "Order created successfully",
      data: {
        ...savedPayment._doc,
      },
    });
    console.log("✅ Product ID:", product.id);
    console.log("✅ Price ID:", price.id);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});
const YOUR_DOMAIN = "http://localhost:8080";
paymentRouter.post("/create-checkout-session", async (req, res) => {
  try {
    const { membershipType } = req.body; // Use the membershipType if needed

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1S6HsOCrlCYt4pG7UjO0XV4d",
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${YOUR_DOMAIN}/success.html`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    // Return JSON instead of redirecting
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = paymentRouter;
