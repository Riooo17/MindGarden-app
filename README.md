 🌱 MindGarden

MindGarden is a **full-stack web app** for tracking moods, writing journals, viewing analytics, and upgrading to premium via Paystack. Users can log in, manage their entries, and see charts summarizing their mood trends.

---

 Features

- **User Authentication**: Sign up, log in, log out with Supabase auth  
- **Journal Management**: Add, view, and delete your own entries  
- **Mood Selection**: Track your mood per entry (Happy, Sad, Angry, Tired, Excited)  
- **Charts & Analytics**: Pie chart for moods, bar chart for entries over time  
- **Daily Quotes**: Motivational quotes displayed at the top  
- **Premium Upgrade**: Upgrade to premium via Paystack (through backend)  
- **Responsive Design**: Works on mobile, tablet, and desktop  

---

 Folder Structure

mindgarden-app/
├─ backend/
│ ├─ server.js # Node/Express backend (handles payments)
│ ├─ package.json
│ └─ .env # Paystack & Supabase secrets (not pushed)
├─ frontend/
│ ├─ index.html
│ ├─ style.css
│ └─ app.js
├─ README.md
└─ .gitignore

yaml

---

 Setup Instructions

 1. Backend

```bash
cd backend
npm install
node server.js
.env should contain:

ini
Copy code
PAYSTACK_SECRET=sk_test_xxxxx
SUPABASE_URL=https://your-supabase-url
SUPABASE_KEY=your-anon-key
server.js handles premium payments via Paystack.

2. Frontend
Open frontend/index.html in your browser

Update app.js with your SUPABASE_URL, SUPABASE_KEY, and RENDER_BACKEND URL

javascript
Copy code
const SUPABASE_URL = "[https://your-supabase-url](https://ueyarxjekrtlhikvbywf.supabase.co)";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVleWFyeGpla3J0bGhpa3ZieXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NzI1MTEsImV4cCI6MjA3MjI0ODUxMX0.JrSnB8Ilp55g0Z-HR1u8oH6NdC-EaYST6LZYPGBGBnE";
const RENDER_BACKEND = "https://mindgarden-backend-gidc.onrender.com";
Deployment
Frontend → Netlify

Backend → Render hosting

Make sure backend URL matches RENDER_BACKEND in app.js.

Security Notes
Never push your .env or secret keys to GitHub

Supabase RLS ensures users only see their own entries

Payments handled securely via backend

Credits
Built with:

Supabase for auth & database

Chart.js for mood analytics

Paystack for premium payments

