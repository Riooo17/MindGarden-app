
const SUPABASE_URL = "https://ueyarxjekrtlhikvbywf.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVleWFyeGpla3J0bGhpa3ZieXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NzI1MTEsImV4cCI6MjA3MjI0ODUxMX0.JrSnB8Ilp55g0Z-HR1u8oH6NdC-EaYST6LZYPGBGBnE";
const RENDER_BACKEND = "https://mindgarden-backend-gidc.onrender.com"; // e.g. https://mindgarden-backend-gidc.onrender.com

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const authSection = document.getElementById("auth-section");
const dashboard = document.getElementById("dashboard");
const userNameDisplay = document.getElementById("user-name");
const saveEntryBtn = document.getElementById("save-entry");
const entriesList = document.getElementById("entries-list");
const displayNameInput = document.getElementById("display-name");

let selectedMood = null;
let moodChart, calendarChart;

// Buttons
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const upgradeBtn = document.getElementById("upgrade-btn");

// --- Daily Quotes ---
const quotes = [
  "He who has a why to live can bear almost any how. — Nietzsche",
  "The unexamined life is not worth living. — Socrates",
  "Happiness depends upon ourselves. — Aristotle",
  "Be still, and know that I am God. — Psalm 46:10",
  "Do unto others as you would have them do unto you. — Luke 6:31",
  "God does not burden a soul beyond that it can bear. — Quran 2:286",
  "Out of suffering have emerged the strongest souls. — Khalil Gibran",
  "Knowing yourself is the beginning of all wisdom. — Aristotle",
  "Peace comes from within. Do not seek it without. — Buddha",
  "Faith is taking the first step even when you don’t see the whole staircase. — MLK Jr."
];
function showDailyQuote(){
  const now = new Date();
  const dayIndex = now.getFullYear()*366 + now.getMonth()*31 + now.getDate();
  document.getElementById("daily-quote").textContent = quotes[dayIndex % quotes.length];
}
showDailyQuote();

// --- Sign Up ---
signupBtn.addEventListener("click", async ()=>{
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const displayName = displayNameInput.value.trim();
  if(!email || !password || !displayName) return alert("All fields required");

  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if(error) return alert(error.message);
  localStorage.setItem("display_name", displayName);
  showDashboard(data.user);
});

// --- Login ---
loginBtn.addEventListener("click", async ()=>{
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if(!email || !password) return alert("All fields required");

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if(error) return alert(error.message);
  showDashboard(data.user);
});

// --- Logout ---
logoutBtn.addEventListener("click", async ()=>{
  await supabaseClient.auth.signOut();
  authSection.style.display="grid";
  dashboard.style.display="none";
});

// --- Mood select ---
document.querySelectorAll(".mood-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".mood-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    selectedMood = btn.dataset.mood;
  });
});

// --- Save Entry ---
saveEntryBtn.addEventListener("click", async ()=>{
  const entryText = document.getElementById("journal-entry").value.trim();
  const displayName = displayNameInput.value.trim() || localStorage.getItem("display_name") || "User";
  const { data: { user } } = await supabaseClient.auth.getUser();
  if(!user) return alert("Login first");
  if(!entryText || !selectedMood) return alert("Entry and mood required");

  const { error } = await supabaseClient.from("journal_entries").insert({
    user_id: user.id,
    display_name: displayName,
    entry: entryText,
    mood: selectedMood,
    created_at: new Date().toISOString()
  });
  if(error) return alert(error.message);

  document.getElementById("journal-entry").value="";
  selectedMood = null;
  document.querySelectorAll(".mood-btn").forEach(b=>b.classList.remove("active"));
  loadEntries();
});

// --- Load Entries ---
async function loadEntries(filter="all"){
  const { data: { user } } = await supabaseClient.auth.getUser();
  if(!user) return;
  let { data, error } = await supabaseClient.from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at",{ascending:false});
  if(error) return console.error(error);

  entriesList.innerHTML="";
  (data||[]).filter(e=>filter==="all"||e.mood===filter).forEach(entry=>{
    const card=document.createElement("div");
    card.className="entry-card";
    card.innerHTML=`
      <div>
        <div><strong>${entry.mood}</strong> - ${entry.display_name}</div>
        <div>${entry.entry}</div>
      </div>
      <button data-id="${entry.id}">Delete</button>
    `;
    entriesList.appendChild(card);
    card.querySelector("button").addEventListener("click", async ()=>{
      await supabaseClient.from("journal_entries").delete().eq("id", entry.id);
      loadEntries(filter);
    });
  });
  renderCharts(data);
}

// --- Filter buttons ---
document.querySelectorAll(".filter-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    loadEntries(btn.dataset.filter);
  });
});

// --- Charts ---
function renderCharts(entries){
  const ctx1=document.getElementById("moodChart").getContext("2d");
  const moodCounts={};
  entries.forEach(e=>moodCounts[e.mood]=(moodCounts[e.mood]||0)+1);
  if(moodChart) moodChart.destroy();
  moodChart=new Chart(ctx1,{
    type:"pie",
    data:{labels:Object.keys(moodCounts), datasets:[{data:Object.values(moodCounts), backgroundColor:["#667eea","#fc8181","#48bb78","#ecc94b","#ed64a6"]}]},
    options:{responsive:true, maintainAspectRatio:true}
  });

  const ctx2=document.getElementById("calendarChart").getContext("2d");
  const daily={};
  entries.forEach(e=>{
    const day=new Date(e.created_at).toLocaleDateString();
    daily[day]=(daily[day]||0)+1;
  });
  if(calendarChart) calendarChart.destroy();
  calendarChart=new Chart(ctx2,{
    type:"bar",
    data:{labels:Object.keys(daily), datasets:[{label:"Entries", data:Object.values(daily), backgroundColor:"#667eea"}]},
    options:{responsive:true, maintainAspectRatio:true}
  });
}

// --- Show Dashboard ---
function showDashboard(user){
  authSection.style.display="none";
  dashboard.style.display="flex";
  const displayName = localStorage.getItem("display_name") || user.email.split("@")[0];
  userNameDisplay.textContent = displayName;
  loadEntries();
}

// --- Upgrade Premium ---
upgradeBtn.addEventListener("click", async ()=>{
  const { data: { user } } = await supabaseClient.auth.getUser();
  if(!user) return alert("Login first");

  const res = await fetch(`${RENDER_BACKEND}/create-payment`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ email:user.email, amount:100000 }) // KES 1000
  });
  const data = await res.json();
  if(data.authorization_url) window.location.href = data.authorization_url;
  else alert("Payment failed. Try again.");
});
