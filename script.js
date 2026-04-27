diff --git a/script.js b/script.js
index d0c0e7966e00b5c9f18caa0f6d44efbf75b1df40..4889c52b671fc0813b2c2d7e65a7d0a18417423c 100644
--- a/script.js
+++ b/script.js
@@ -1,404 +1,289 @@
-const currency = (value) =>
-  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(value) || 0);
-
-const formSchema = [
-  ["projectName", "Project Name"],
-  ["billingName", "Billing Name"],
-  ["clientName", "Client Name"],
-  ["siteLocation", "Site Location"],
-  ["gstNo", "GST Number"],
-  ["contactPerson", "Contact Person"],
-  ["contactNumber", "Contact Number"],
-  ["status", "Status", "select", ["running", "completed", "dispute"]],
-  ["phase", "Current Phase", "select", ["planning", "execution", "testing", "handover"]],
-  ["projectValue", "Project Value", "number"],
-  ["officialReceived", "Official Money Received", "number"],
-  ["cashReceived", "Cash Payment Received", "number"],
-  ["completedPercent", "Work Completed (%)", "number"],
-  ["expectedDate", "Expected Date", "date"],
-  ["remark", "Remark", "textarea"],
-  ["projectDetails", "Project Details", "textarea"],
+const expressions = ["normal", "sad", "crying", "shocked", "sorry", "happy"];
+const lines = [
+  "Sorry naaa 🥺",
+  "Galti ho gayi 😭",
+  "Mat maar yaar 💔",
+  "Pizza khilaunga 🍕",
+  "Still angry? 😶"
 ];
 
-let projects = [
-  {
-    id: crypto.randomUUID(),
-    projectName: "Northern Heights Plant Upgrade",
-    billingName: "NSE-BILL-PLANT-011",
-    clientName: "Apex Industrial Components",
-    siteLocation: "Surat, Gujarat",
-    gstNo: "24AAECN7788M1ZU",
-    contactPerson: "Rakesh Patel",
-    contactNumber: "+91-9876543210",
-    status: "running",
-    phase: "execution",
-    projectValue: 12500000,
-    officialReceived: 7200000,
-    cashReceived: 1400000,
-    completedPercent: 62,
-    expectedDate: "2026-02-20",
-    remark: "Material dispatch in progress",
-    projectDetails: "Automation panel replacement, cable routing and testing."
-  },
-  {
-    id: crypto.randomUUID(),
-    projectName: "Metro Pumping Station Retrofit",
-    billingName: "NSE-BILL-MPS-021",
-    clientName: "City Water Board",
-    siteLocation: "Vadodara, Gujarat",
-    gstNo: "24AACCM2219M1ZD",
-    contactPerson: "Karan Shah",
-    contactNumber: "+91-9797979797",
-    status: "dispute",
-    phase: "testing",
-    projectValue: 8400000,
-    officialReceived: 4500000,
-    cashReceived: 600000,
-    completedPercent: 75,
-    expectedDate: "2026-01-05",
-    remark: "Commercial clearance under review",
-    projectDetails: "PLC and SCADA migration with compliance validations."
-  },
-  {
-    id: crypto.randomUUID(),
-    projectName: "Solar Grid Commissioning Block-C",
-    billingName: "NSE-BILL-SOLAR-018",
-    clientName: "SunBridge Energy",
-    siteLocation: "Rajkot, Gujarat",
-    gstNo: "24AAPCS4444M1ZH",
-    contactPerson: "Priya Mehta",
-    contactNumber: "+91-9012345678",
-    status: "completed",
-    phase: "handover",
-    projectValue: 5300000,
-    officialReceived: 5000000,
-    cashReceived: 200000,
-    completedPercent: 100,
-    expectedDate: "2025-11-10",
-    remark: "Final sign-off done",
-    projectDetails: "Substation integration and load balancing completed."
-  }
-];
+const state = {
+  anger: 100,
+  expression: "normal",
+  isLongPress: false,
+  pointerStart: null,
+  holdTimer: null,
+  audioContext: null
+};
+
+const bodyImg = document.getElementById("bodyImg");
+const headImg = document.getElementById("headImg");
+const headAnchor = document.getElementById("headAnchor");
+const characterBodyWrap = document.getElementById("characterBodyWrap");
+const bubble = document.getElementById("bubble");
+const angerFill = document.getElementById("angerFill");
+const angerText = document.getElementById("angerText");
+const scene = document.getElementById("scene");
+const loadingScreen = document.getElementById("loadingScreen");
+const particles = document.getElementById("particles");
+const finalCard = document.getElementById("finalCard");
+
+function svgData(markup) {
+  return `data:image/svg+xml;utf8,${encodeURIComponent(markup)}`;
+}
 
-let selectedProjectId = null;
-let editingProjectId = null;
-let statusChart;
-let moneyChart;
-
-const tableBody = document.getElementById("projectTableBody");
-const detailPanel = document.getElementById("detailPanel");
-const searchInput = document.getElementById("searchInput");
-const statusFilter = document.getElementById("statusFilter");
-const phaseFilter = document.getElementById("phaseFilter");
-const addProjectBtn = document.getElementById("addProjectBtn");
-const kpiGrid = document.getElementById("kpiGrid");
-const projectDialog = document.getElementById("projectDialog");
-const projectForm = document.getElementById("projectForm");
-const formFields = document.getElementById("formFields");
-const dialogTitle = document.getElementById("dialogTitle");
-const chartWarning = document.createElement("p");
-chartWarning.className = "placeholder";
-chartWarning.textContent = "Charts unavailable (Chart.js failed to load), but all dashboard buttons and project details still work.";
-
-const calculatePending = (p) => Math.max(0, Number(p.projectValue) - Number(p.officialReceived) - Number(p.cashReceived));
-
-function buildForm() {
-  formFields.innerHTML = formSchema.map(([key, label, type = "text", options]) => {
-    if (type === "select") {
-      return `<label>${label}<select name="${key}" required>${options
-        .map((opt) => `<option value="${opt}">${opt}</option>`)
-        .join("")}</select></label>`;
-    }
-    if (type === "textarea") {
-      return `<label>${label}<textarea name="${key}" rows="2" required></textarea></label>`;
-    }
-    return `<label>${label}<input name="${key}" type="${type}" required /></label>`;
-  }).join("");
+function bodySvg() {
+  return svgData(`
+<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 326'>
+  <defs>
+    <linearGradient id='shirt' x1='0' x2='0' y1='0' y2='1'>
+      <stop offset='0%' stop-color='#d8ecff'/><stop offset='100%' stop-color='#9bc0ec'/>
+    </linearGradient>
+  </defs>
+  <ellipse cx='120' cy='315' rx='58' ry='10' fill='rgba(0,0,0,.15)'/>
+  <path d='M52 74c12-24 36-34 68-34s56 10 68 34l-18 120c-4 20-20 30-50 30s-46-10-50-30L52 74z' fill='url(#shirt)'/>
+  <rect x='85' y='95' width='72' height='95' rx='24' fill='rgba(255,255,255,.22)'/>
+  <path d='M74 108l-30 76c-3 8 2 16 10 18s16-2 18-10l20-72' fill='#9bc0ec'/>
+  <path d='M166 108l30 76c3 8-2 16-10 18s-16-2-18-10l-20-72' fill='#9bc0ec'/>
+  <rect x='82' y='218' width='34' height='74' rx='16' fill='#253143'/>
+  <rect x='124' y='218' width='34' height='74' rx='16' fill='#253143'/>
+  <rect x='74' y='285' width='54' height='18' rx='9' fill='#fcfcfd'/>
+  <rect x='112' y='285' width='54' height='18' rx='9' fill='#fcfcfd'/>
+</svg>`);
 }
 
-function getFilteredProjects() {
-  const term = searchInput.value.trim().toLowerCase();
-  return projects.filter((project) => {
-    const matchesSearch = !term || [
-      project.projectName,
-      project.billingName,
-      project.clientName,
-      project.siteLocation,
-      project.contactPerson
-    ].some((v) => v.toLowerCase().includes(term));
-    const matchesStatus = statusFilter.value === "all" || project.status === statusFilter.value;
-    const matchesPhase = phaseFilter.value === "all" || project.phase === phaseFilter.value;
-    return matchesSearch && matchesStatus && matchesPhase;
-  });
+function headSvg(type) {
+  const face = {
+    normal: { eye: "M44 65 q10 -10 20 0 M76 65 q10 -10 20 0", mouth: "M60 94 q20 12 40 0", brow: "M40 53h22 M78 53h22", extra: "" },
+    sad: { eye: "M44 69 q10 -6 20 0 M76 69 q10 -6 20 0", mouth: "M62 104 q18 -12 36 0", brow: "M40 52l24 6 M76 58l24-6", extra: "" },
+    crying: { eye: "M44 68 q10 -4 20 0 M76 68 q10 -4 20 0", mouth: "M62 103 q18 -14 36 0", brow: "M40 52l24 7 M76 59l24-7", extra: "<path d='M54 74v20M88 74v20' stroke='#53a6ff' stroke-width='5' stroke-linecap='round'/>" },
+    shocked: { eye: "M50 66 a6 7 0 1 0 .1 0 M86 66 a6 7 0 1 0 .1 0", mouth: "M72 95 a8 10 0 1 0 .1 0", brow: "M42 50h20 M78 50h20", extra: "" },
+    sorry: { eye: "M44 67 q10 -10 20 0 M76 67 q10 -10 20 0", mouth: "M62 98 q18 10 36 0", brow: "M42 50l22 5 M78 55l22-5", extra: "<ellipse cx='65' cy='102' rx='5' ry='4' fill='rgba(255,130,160,.5)'/><ellipse cx='95' cy='102' rx='5' ry='4' fill='rgba(255,130,160,.5)'/>" },
+    happy: { eye: "M44 67 q10 -10 20 0 M76 67 q10 -10 20 0", mouth: "M58 92 q22 24 44 0", brow: "M42 52h20 M80 52h20", extra: "" }
+  }[type];
+
+  return svgData(`
+<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 140'>
+  <ellipse cx='70' cy='62' rx='48' ry='50' fill='#f4c39f'/>
+  <path d='M28 44c8-26 29-35 42-35s34 9 42 35c-7-4-16-6-23-6-13 0-18 5-31 5-8 0-18-1-30 1z' fill='#2a1818'/>
+  <path d='M46 90q24 18 48 0' stroke='#2b1b1b' stroke-width='8' fill='none' stroke-linecap='round'/>
+  <path d='${face.eye}' stroke='#221616' stroke-width='4' fill='none' stroke-linecap='round'/>
+  <path d='${face.mouth}' stroke='#9b3849' stroke-width='4' fill='none' stroke-linecap='round'/>
+  <path d='${face.brow}' stroke='#332222' stroke-width='4' stroke-linecap='round'/>
+  ${face.extra}
+</svg>`);
+}
+
+function setExpression(expression) {
+  state.expression = expression;
+  headImg.src = headSvg(expression);
+}
+
+function randomExpression() {
+  const pick = expressions[Math.floor(Math.random() * expressions.length)];
+  setExpression(pick);
 }
 
-function renderKPIs(list) {
-  const totalValue = list.reduce((sum, p) => sum + Number(p.projectValue), 0);
-  const official = list.reduce((sum, p) => sum + Number(p.officialReceived), 0);
-  const cash = list.reduce((sum, p) => sum + Number(p.cashReceived), 0);
-  const pending = list.reduce((sum, p) => sum + calculatePending(p), 0);
-  const avgCompletion = list.length ? Math.round(list.reduce((sum, p) => sum + Number(p.completedPercent), 0) / list.length) : 0;
-
-  kpiGrid.innerHTML = `
-    <article class="kpi"><h3>Total Value</h3><strong>${currency(totalValue)}</strong></article>
-    <article class="kpi"><h3>Official Received</h3><strong>${currency(official)}</strong></article>
-    <article class="kpi"><h3>Cash Received</h3><strong>${currency(cash)}</strong></article>
-    <article class="kpi"><h3>Pending Amount</h3><strong>${currency(pending)}</strong></article>
-    <article class="kpi"><h3>Average Completion</h3><strong>${avgCompletion}%</strong></article>
-    <article class="kpi"><h3>Project Count</h3><strong>${list.length}</strong></article>
-  `;
+function setBubble(text) {
+  bubble.textContent = text;
+  gsap.fromTo(bubble, { y: 10, opacity: 0.6 }, { y: 0, opacity: 1, duration: 0.32, ease: "power2.out" });
 }
 
-function renderTable() {
-  const list = getFilteredProjects();
-  renderKPIs(list);
-
-  tableBody.innerHTML = list.map((project) => `
-    <tr data-project-id="${project.id}" class="project-row">
-      <td>
-        <strong>${project.projectName}</strong>
-        <div>${project.billingName}</div>
-      </td>
-      <td><span class="status-pill status-${project.status}"><i class="fa-solid fa-circle"></i> ${project.status}</span></td>
-      <td>${project.phase}</td>
-      <td>${currency(project.projectValue)}</td>
-      <td>${currency(project.officialReceived)}</td>
-      <td>${currency(project.cashReceived)}</td>
-      <td>${currency(calculatePending(project))}</td>
-      <td>${project.expectedDate}</td>
-      <td>
-        <button type="button" class="ghost-btn" data-action="view" data-id="${project.id}" title="View"><i class="fa-solid fa-eye"></i></button>
-        <button type="button" class="ghost-btn" data-action="edit" data-id="${project.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
-      </td>
-    </tr>
-  `).join("");
-
-  if (!selectedProjectId && list.length) {
-    selectedProjectId = list[0].id;
+function updateAnger(next) {
+  state.anger = Math.max(0, next);
+  angerText.textContent = `${Math.round(state.anger)}%`;
+  const hue = 120 - (state.anger * 1.2);
+  gsap.to(angerFill, {
+    width: `${state.anger}%`,
+    backgroundColor: `hsl(${Math.max(0, hue)} 90% 55%)`,
+    duration: 0.45,
+    ease: "power2.out"
+  });
+
+  if (state.anger <= 65) unlock("rewardHug", "🤗 Hug unlocked!");
+  if (state.anger <= 35) {
+    unlock("rewardChoco", "🍫 Chocolate unlocked!");
+    dropParticle("🍫", 55, 40);
   }
-  if (selectedProjectId && !list.some((p) => p.id === selectedProjectId)) {
-    selectedProjectId = list[0]?.id ?? null;
+  if (state.anger <= 10) {
+    unlock("rewardHeart", "💖 Heart burst unlocked!");
+    heartBurst(12);
   }
-  renderDetails(selectedProjectId);
-  renderCharts(list);
+  if (state.anger === 0) finishGame();
 }
 
-function renderDetails(projectId) {
-  const project = projects.find((p) => p.id === projectId);
-  if (!project) {
-    detailPanel.innerHTML = `<h2><i class="fa-solid fa-circle-info"></i> Project Details</h2><p class="placeholder">No project selected.</p>`;
-    return;
-  }
-  selectedProjectId = projectId;
-
-  const phases = ["planning", "execution", "testing", "handover"];
-  const activeIndex = phases.indexOf(project.phase);
-
-  detailPanel.innerHTML = `
-    <div class="panel-head">
-      <h2>${project.projectName}</h2>
-      <button class="primary-btn" id="exportProjectBtn"><i class="fa-solid fa-file-pdf"></i> Export PDF</button>
-    </div>
-    <p><strong>Billing:</strong> ${project.billingName}</p>
-    <div class="detail-card">
-      <section class="detail-group">
-        <h4>Client Details</h4>
-        <p><strong>Client:</strong> ${project.clientName}</p>
-        <p><strong>Site:</strong> ${project.siteLocation}</p>
-        <p><strong>Contact:</strong> ${project.contactPerson} (${project.contactNumber})</p>
-        <p><strong>GST:</strong> ${project.gstNo}</p>
-      </section>
-      <section class="detail-group">
-        <h4>Financial Overview</h4>
-        <p><strong>Project Value:</strong> ${currency(project.projectValue)}</p>
-        <p><strong>Official Received:</strong> ${currency(project.officialReceived)}</p>
-        <p><strong>Cash Received:</strong> ${currency(project.cashReceived)}</p>
-        <p><strong>Pending Amount:</strong> ${currency(calculatePending(project))}</p>
-        <p><strong>Formula:</strong> Total Value - Money Received - Cash Received = Pending Amount</p>
-      </section>
-      <section class="detail-group">
-        <h4>Progress & Timeline</h4>
-        <p><strong>Status:</strong> ${project.status}</p>
-        <p><strong>Work Completed:</strong> ${project.completedPercent}%</p>
-        <p><strong>Expected Date:</strong> ${project.expectedDate}</p>
-        <div class="phase-line">
-          ${phases.map((phase, index) => `<div class="phase-item ${index <= activeIndex ? "active" : ""}">${phase}</div>`).join("")}
-        </div>
-      </section>
-      <section class="detail-group">
-        <h4>Project Notes</h4>
-        <p>${project.projectDetails}</p>
-        <p><strong>Remark:</strong> ${project.remark}</p>
-      </section>
-    </div>
-  `;
-
-  document.getElementById("exportProjectBtn").addEventListener("click", () => exportProjectPDF(project));
+function unlock(id, msg) {
+  const el = document.getElementById(id);
+  if (el.classList.contains("unlocked")) return;
+  el.classList.add("unlocked");
+  setBubble(msg);
 }
 
-function renderCharts(list) {
-  const chartCtor = window.Chart;
-  if (!chartCtor) {
-    statusChart?.destroy?.();
-    moneyChart?.destroy?.();
-    const statusCanvas = document.getElementById("statusChart");
-    const moneyCanvas = document.getElementById("moneyChart");
-    statusCanvas.style.display = "none";
-    moneyCanvas.style.display = "none";
-    if (!statusCanvas.parentElement.querySelector(".placeholder")) {
-      statusCanvas.parentElement.append(chartWarning.cloneNode(true));
-      moneyCanvas.parentElement.append(chartWarning.cloneNode(true));
-    }
-    return;
-  }
+function playTone(type = "tap") {
+  const AC = window.AudioContext || window.webkitAudioContext;
+  if (!AC) return;
+  state.audioContext ??= new AC();
+  const ctx = state.audioContext;
+  const o = ctx.createOscillator();
+  const g = ctx.createGain();
+  o.connect(g);
+  g.connect(ctx.destination);
+
+  if (type === "tap") o.frequency.value = 220;
+  if (type === "swipe") o.frequency.value = 150;
+  if (type === "press") o.frequency.value = 120;
+  if (type === "cute") o.frequency.value = 360;
+
+  g.gain.setValueAtTime(0.0001, ctx.currentTime);
+  g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);
+  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
+  o.start();
+  o.stop(ctx.currentTime + 0.2);
+}
 
-  const statusData = ["running", "completed", "dispute"].map(
-    (status) => list.filter((project) => project.status === status).length
-  );
+function dropParticle(symbol, left = 50, top = 55) {
+  const node = document.createElement("span");
+  node.className = "float";
+  node.textContent = symbol;
+  node.style.left = `${left + (Math.random() * 30 - 15)}%`;
+  node.style.top = `${top + (Math.random() * 15 - 8)}%`;
+  particles.appendChild(node);
+  setTimeout(() => node.remove(), 1400);
+}
 
-  const totals = {
-    value: list.reduce((sum, p) => sum + Number(p.projectValue), 0),
-    official: list.reduce((sum, p) => sum + Number(p.officialReceived), 0),
-    cash: list.reduce((sum, p) => sum + Number(p.cashReceived), 0),
-    pending: list.reduce((sum, p) => sum + calculatePending(p), 0)
-  };
+function heartBurst(count = 7) {
+  for (let i = 0; i < count; i += 1) setTimeout(() => dropParticle("💖"), i * 70);
+}
 
-  statusChart?.destroy();
-  moneyChart?.destroy();
+function slapReaction(pointerX) {
+  const rect = scene.getBoundingClientRect();
+  const onLeft = pointerX < rect.left + rect.width / 2;
+  const rotateTo = onLeft ? 20 : -20;
+  randomExpression();
+  setBubble(lines[Math.floor(Math.random() * lines.length)]);
+  playTone("tap");
+  updateAnger(state.anger - 7);
+  dropParticle("✨", onLeft ? 35 : 65, 45);
+
+  gsap.timeline({ delay: 0.04 })
+    .to(headAnchor, { rotate: rotateTo, scaleX: 0.92, scaleY: 1.08, duration: 0.11, ease: "power2.out" })
+    .to(headAnchor, { rotate: -rotateTo * 0.45, scaleX: 1.05, scaleY: 0.97, duration: 0.24, ease: "back.out(3)" })
+    .to(headAnchor, { rotate: 0, scaleX: 1, scaleY: 1, duration: 0.34, ease: "elastic.out(1.2,0.44)" });
+}
 
-  statusChart = new chartCtor(document.getElementById("statusChart"), {
-    type: "doughnut",
-    data: {
-      labels: ["Running", "Completed", "Dispute"],
-      datasets: [{ data: statusData, backgroundColor: ["#f59e0b", "#0ea56a", "#e11d48"] }]
-    },
-    options: { plugins: { legend: { position: "bottom" } } }
-  });
+function swipeReaction(direction) {
+  randomExpression();
+  setBubble(direction > 0 ? "Ayy! Side se kyu push kiya 😵" : "Arre left se attack? 😖");
+  playTone("swipe");
+  updateAnger(state.anger - 10);
 
-  moneyChart = new chartCtor(document.getElementById("moneyChart"), {
-    type: "bar",
-    data: {
-      labels: ["Project Value", "Official Received", "Cash Received", "Pending"],
-      datasets: [{
-        data: [totals.value, totals.official, totals.cash, totals.pending],
-        backgroundColor: ["#2563eb", "#14b8a6", "#8b5cf6", "#f97316"],
-        borderRadius: 8
-      }]
-    },
-    options: { plugins: { legend: { display: false } } }
-  });
+  gsap.timeline()
+    .to(characterBodyWrap, { x: direction * 22, rotate: direction * 3, duration: 0.15, ease: "power2.out" })
+    .to(characterBodyWrap, { x: 0, rotate: 0, duration: 0.4, ease: "elastic.out(1,0.4)" });
 }
 
-function exportProjectPDF(project) {
-  const popup = window.open("", "_blank");
-  if (!popup) return;
-  popup.document.write(`
-    <html><head><title>${project.projectName}</title>
-    <style>body{font-family:Arial;padding:20px}h1{margin-bottom:0}small{color:#666}table{width:100%;border-collapse:collapse;margin-top:10px}td{border:1px solid #ddd;padding:8px}</style>
-    </head><body>
-      <h1>${project.projectName}</h1>
-      <small>${project.billingName}</small>
-      <table>
-        <tr><td>Client</td><td>${project.clientName}</td></tr>
-        <tr><td>Contact</td><td>${project.contactPerson} (${project.contactNumber})</td></tr>
-        <tr><td>GST</td><td>${project.gstNo}</td></tr>
-        <tr><td>Total Value</td><td>${currency(project.projectValue)}</td></tr>
-        <tr><td>Official Received</td><td>${currency(project.officialReceived)}</td></tr>
-        <tr><td>Cash Received</td><td>${currency(project.cashReceived)}</td></tr>
-        <tr><td>Pending</td><td>${currency(calculatePending(project))}</td></tr>
-        <tr><td>Status</td><td>${project.status}</td></tr>
-        <tr><td>Phase</td><td>${project.phase}</td></tr>
-        <tr><td>Completion</td><td>${project.completedPercent}%</td></tr>
-        <tr><td>Remark</td><td>${project.remark}</td></tr>
-      </table>
-      <p><b>Formula:</b> Total Value - Money Received - Cash Received = Pending Amount</p>
-      <p>Developed by Abhishek Jariwala</p>
-    </body></html>
-  `);
-  popup.document.close();
-  popup.focus();
-  popup.print();
+function longPressReaction() {
+  state.isLongPress = true;
+  setExpression("crying");
+  setBubble("Mat maar yaar 💔");
+  playTone("press");
+  updateAnger(state.anger - 16);
+
+  gsap.timeline()
+    .to(characterBodyWrap, { rotate: -26, x: -20, y: 18, duration: 0.32, ease: "power2.in" })
+    .to(characterBodyWrap, { rotate: 10, x: 10, y: 8, duration: 0.22, ease: "power1.out" })
+    .to(characterBodyWrap, { rotate: 0, x: 0, y: 0, duration: 0.44, ease: "elastic.out(1.1,0.45)" });
 }
 
-function exportDashboardPDF() {
-  window.print();
+function finishGame() {
+  setExpression("happy");
+  setBubble("Still angry… or can I get one smile now? 🙂❤️");
+  finalCard.classList.remove("hidden");
+  heartBurst(22);
+  playTone("cute");
 }
 
-function openDialog(mode, project = null) {
-  editingProjectId = mode === "edit" ? project.id : null;
-  dialogTitle.textContent = mode === "edit" ? "Edit Project" : "Add Project";
+function resetGame() {
+  state.anger = 100;
+  document.querySelectorAll(".reward").forEach((r) => r.classList.remove("unlocked"));
+  finalCard.classList.add("hidden");
+  setExpression("normal");
+  setBubble("Tap gently... I’m listening 🥺");
+  updateAnger(100);
+  gsap.set([headAnchor, characterBodyWrap], { clearProps: "all" });
+  startIdle();
+}
 
-  formSchema.forEach(([key, , type]) => {
-    const field = projectForm.elements[key];
-    field.value = project?.[key] ?? (type === "number" ? 0 : "");
+function startIdle() {
+  gsap.killTweensOf(characterBodyWrap);
+  gsap.killTweensOf(headAnchor);
+  gsap.to(characterBodyWrap, {
+    y: -5,
+    duration: 1.8,
+    repeat: -1,
+    yoyo: true,
+    ease: "sine.inOut"
+  });
+  gsap.to(headAnchor, {
+    y: -2,
+    duration: 1.4,
+    repeat: -1,
+    yoyo: true,
+    ease: "sine.inOut"
   });
-
-  if (typeof projectDialog.showModal === "function") {
-    projectDialog.showModal();
-    return;
-  }
-  projectDialog.setAttribute("open", "open");
 }
 
-function closeDialog() {
-  if (typeof projectDialog.close === "function") {
-    projectDialog.close();
-  } else {
-    projectDialog.removeAttribute("open");
-  }
-}
+scene.addEventListener("pointerdown", (event) => {
+  state.pointerStart = { x: event.clientX, y: event.clientY, t: Date.now() };
+  state.isLongPress = false;
+  clearTimeout(state.holdTimer);
+  state.holdTimer = setTimeout(() => longPressReaction(), 540);
+});
 
-function upsertProject(formData) {
-  const data = Object.fromEntries(formData.entries());
-  const projectRecord = {
-    ...data,
-    projectValue: Number(data.projectValue),
-    officialReceived: Number(data.officialReceived),
-    cashReceived: Number(data.cashReceived),
-    completedPercent: Number(data.completedPercent)
-  };
+scene.addEventListener("pointerup", (event) => {
+  clearTimeout(state.holdTimer);
+  if (!state.pointerStart) return;
 
-  if (editingProjectId) {
-    projects = projects.map((p) => (p.id === editingProjectId ? { ...p, ...projectRecord } : p));
-    selectedProjectId = editingProjectId;
-  } else {
-    const newProject = { id: crypto.randomUUID(), ...projectRecord };
-    projects.unshift(newProject);
-    selectedProjectId = newProject.id;
-  }
-  renderTable();
-}
+  const dx = event.clientX - state.pointerStart.x;
+  const dy = event.clientY - state.pointerStart.y;
+  const dt = Date.now() - state.pointerStart.t;
 
-[searchInput, statusFilter, phaseFilter].forEach((el) => el.addEventListener("input", renderTable));
-[statusFilter, phaseFilter].forEach((el) => el.addEventListener("change", renderTable));
+  if (state.isLongPress) {
+    state.pointerStart = null;
+    return;
+  }
 
-addProjectBtn.addEventListener("click", () => openDialog("add"));
-document.getElementById("cancelDialog").addEventListener("click", closeDialog);
-document.getElementById("closeDialog").addEventListener("click", closeDialog);
-document.getElementById("exportDashboardBtn").addEventListener("click", exportDashboardPDF);
+  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
+    swipeReaction(Math.sign(dx));
+  } else if (dt < 520) {
+    slapReaction(event.clientX);
+  }
 
-projectForm.addEventListener("submit", (event) => {
-  event.preventDefault();
-  upsertProject(new FormData(projectForm));
-  closeDialog();
+  state.pointerStart = null;
 });
 
-tableBody.addEventListener("click", (event) => {
-  const actionBtn = event.target.closest("button[data-action]");
-  if (actionBtn) {
-    const { id, action } = actionBtn.dataset;
-    const project = projects.find((p) => p.id === id);
-    if (!project) return;
-    if (action === "view") renderDetails(id);
-    if (action === "edit") openDialog("edit", project);
+scene.addEventListener("pointercancel", () => clearTimeout(state.holdTimer));
+
+document.getElementById("restartBtn").addEventListener("click", resetGame);
+document.getElementById("shareBtn").addEventListener("click", async () => {
+  const payload = {
+    title: "Sorry Hero",
+    text: "Send this when you're angry 😌",
+    url: window.location.href
+  };
+
+  if (navigator.share) {
+    try { await navigator.share(payload); } catch { /* ignore cancelled */ }
     return;
   }
 
-  const row = event.target.closest("tr[data-project-id]");
-  if (row) {
-    renderDetails(row.dataset.projectId);
-  }
+  await navigator.clipboard.writeText(`${payload.text} ${payload.url}`);
+  setBubble("Link copied! Share the calm vibes 💌");
 });
 
-buildForm();
-renderTable();
\ No newline at end of file
+window.addEventListener("load", () => {
+  bodyImg.src = bodySvg();
+  setExpression("normal");
+  startIdle();
+  setTimeout(() => loadingScreen.classList.add("hidden"), 900);
+});
