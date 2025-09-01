🌱 MindGarden Frontend

MindGarden is a journaling and mental wellness app with premium features (analytics, calendar, AI insights) unlocked via Paystack payments.

This is the frontend (Netlify project). It connects to:

Supabase (database + auth)

Paystack Backend (hosted on Render)

📂 Project Structure
/frontend
 ├── index.html        # main journaling app
 ├── app.js            # frontend logic (Supabase + Paystack integration)
 ├── style.css         # styles
 ├── success.html      # payment success page
 ├── failed.html       # payment failed/cancel page
 └── README.md

🚀 Setup Instructions
1. Clone the Project
git clone https://github.com/your-username/mindgarden-frontend.git
cd mindgarden-frontend

2. Configure Supabase

Open app.js

Replace placeholders with your Supabase project details:

const supabaseClient = supabase.createClient(
  "https://YOURPROJECT.supabase.co", // Supabase URL
  "YOUR-ANON-KEY" // Supabase anon public key
);


You also need a profiles table with an is_premium boolean column.

3. Link to Backend

In app.js, update the backend URL:

const res = await fetch("https://your-backend.onrender.com/create-payment", { ... })

💳 Payment Flow (Paystack)

User clicks Upgrade to Premium

Frontend calls backend → Paystack checkout opens

On success → Paystack redirects user to success.html

On failure/cancel → Paystack redirects user to failed.html

Paystack also notifies backend via webhook → backend updates Supabase is_premium

On next login → frontend checks Supabase and unlocks premium features

🌐 Deployment
Deploy Frontend (Netlify)

Go to Netlify

Connect this repo (or upload project folder)

Deploy → your site will be live at:

https://yourapp.netlify.app

Deploy Backend (Render)

Follow the backend README.md (different project).

🔑 Pages

/index.html → main app

/success.html → shown after successful payment

/failed.html → shown after failed/cancelled payment