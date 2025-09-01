import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);

// Create payment session
app.post("/create-payment", async (req, res) => {
  try {
    const { email, amount } = req.body;

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount,
        callback_url: "https://mindgarden.netlify.app/success.html",
        cancel_action: "https://mindgarden.netlify.app/failed.html"
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`
        }
      }
    );

    res.json({ authorization_url: response.data.data.authorization_url });
  } catch (err) {
    console.error("Payment init error:", err.response?.data || err.message);
    res.status(500).json({ error: "Payment init failed" });
  }
});

// Webhook to confirm payment
app.post("/paystack-webhook", async (req, res) => {
  try {
    const event = req.body;

    if (event.event === "charge.success") {
      const email = event.data.customer.email;

      await supabase
        .from("profiles")
        .update({ is_premium: true })
        .eq("email", email);

      console.log(`✅ Premium activated for ${email}`);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
