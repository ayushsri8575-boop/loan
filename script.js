let currentStep = 1;
let currentApplication = null;
let selectedAppForReview = null;

let applicationsStore = [
  {
    appNumber: "APP-2026-1042",
    fullName: "Rohan Verma",
    mobile: "9876543210",
    pan: "ABCDE1234F",
    empType: "Salaried",
    income: 75000,
    loanType: "Personal Loan",
    amount: 300000,
    tenure: 24,
    rate: 10.5,
    emi: 13915,
    creditScore: 765,
    stage: "Underwriting",
    auditNotes: "All KYC match. Equifax clean."
  }
];

function switchPortal(portal) {
  document.getElementById("navUserBtn").classList.toggle("active", portal === "user");
  document.getElementById("navAdminBtn").classList.toggle("active", portal === "admin");
  document.getElementById("userPortal").classList.toggle("active", portal === "user");
  document.getElementById("adminPortal").classList.toggle("active", portal === "admin");

  if (portal === "admin") {
    renderAdminTable();
  }
}

function sendOtp() {
  const mob = document.getElementById("applicantMobile").value.trim();
  if (mob.length !== 10 || isNaN(mob)) {
    alert("Kripya 10 anko ka valid mobile number darj karein.");
    return;
  }
  document.getElementById("otpStep1").classList.add("hidden");
  document.getElementById("otpStep2").classList.remove("hidden");
}

function resendOtp() {
  alert("Naya OTP bhej diya gaya hai: 1234");
}

function verifyOtp() {
  const otp = document.getElementById("applicantOtp").value.trim();
  if (otp === "1234" || otp.length === 4) {
    document.getElementById("userAuthCard").classList.add("hidden");
    document.getElementById("userJourneyCard").classList.remove("hidden");
    proceedToStep(1);
    calculateLoanTerms();
  } else {
    alert("Galat OTP. Kripya 1234 darj karein.");
  }
}

function proceedToStep(step) {
  currentStep = step;

  const progressPercent = (step / 5) * 100;
  document.getElementById("journeyProgressBar").style.width = progressPercent + "%";

  for (let i = 1; i <= 5; i++) {
    const dot = document.getElementById("dot" + i);
    if (dot) {
      dot.classList.toggle("active", i <= step);
    }
    const screen = document.getElementById("screenStep" + i);
    if (screen) {
      screen.classList.toggle("hidden", i !== step);
    }
  }

  if (step === 5) {
    populateReviewDetails();
  }
}

function handleEmploymentChange() {
  const type = document.getElementById("empType").value;
  const lblEmployer = document.getElementById("lblEmployer");
  const lblIncome = document.getElementById("lblIncome");
  const lblDocIncome1 = document.getElementById("lblDocIncome1");

  if (type === "Salaried") {
    lblEmployer.innerText = "Employer Name";
    lblIncome.innerText = "Net Monthly Salary (INR)";
    lblDocIncome1.innerText = "Latest 3 Months Salary Slips";
  } else if (type === "Self-Employed") {
    lblEmployer.innerText = "Profession / Profession Name";
    lblIncome.innerText = "Average Monthly Net Earnings (INR)";
    lblDocIncome1.innerText = "2 Years ITR & Computation";
  } else {
    lblEmployer.innerText = "Registered Entity / Business Name";
    lblIncome.innerText = "Monthly Business Turnover (INR)";
    lblDocIncome1.innerText = "GST Returns (12 Months) & Audited Financials";
  }
}

function calculateLoanTerms() {
  const type = document.getElementById("loanType").value;
  const amount = parseFloat(document.getElementById("loanAmount").value) || 0;
  const tenure = parseInt(document.getElementById("loanTenure").value) || 12;

  let annualRate = 10.5;
  if (type === "Home Loan") annualRate = 8.5;
  if (type === "Business Loan") annualRate = 13.0;

  const monthlyRate = annualRate / 12 / 100;
  let emi = 0;
  if (amount > 0 && tenure > 0) {
    emi = Math.round(
      (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1)
    );
  }

  const processingFee = Math.round(amount * 0.02 * 1.18);

  document.getElementById("dispRate").innerText = annualRate + "% p.a.";
  document.getElementById("dispEmi").innerText = "₹ " + emi.toLocaleString("en-IN");
  document.getElementById("dispFee").innerText = "₹ " + processingFee.toLocaleString("en-IN");
}

function runCreditAssessment() {
  document.getElementById("scoreDisplay").innerText = "Score: 765 (Low Risk)";
}

function markUploaded(badgeId) {
  const badge = document.getElementById(badgeId);
  if (badge) {
    badge.innerText = "Uploaded";
    badge.classList.remove("pending");
    badge.classList.add("uploaded");
  }
}

function populateReviewDetails() {
  document.getElementById("sumName").innerText = document.getElementById("fullName").value || "N/A";
  document.getElementById("sumPan").innerText = (document.getElementById("panNumber").value || "N/A").toUpperCase();
  document.getElementById("sumEmp").innerText = document.getElementById("empType").value;
  document.getElementById("sumAmount").innerText = "₹ " + Number(document.getElementById("loanAmount").value).toLocaleString("en-IN");
  document.getElementById("sumTenureRate").innerText = document.getElementById("loanTenure").value + " Months @ " + document.getElementById("dispRate").innerText;
  document.getElementById("sumEmi").innerText = document.getElementById("dispEmi").innerText;
}

function submitApplication() {
  const consent = document.getElementById("userConsent").checked;
  if (!consent) {
    alert("Kripya terms and credit check consent ko check karein.");
    return;
  }

  const generatedId = "APP-2026-" + Math.floor(1000 + Math.random() * 9000);
  const fullName = document.getElementById("fullName").value || "Applicant";
  const mobile = document.getElementById("applicantMobile").value || "9876543210";
  const pan = (document.getElementById("panNumber").value || "ABCDE1234F").toUpperCase();
  const empType = document.getElementById("empType").value;
  const income = parseFloat(document.getElementById("monthlyIncome").value) || 50000;
  const loanType = document.getElementById("loanType").value;
  const amount = parseFloat(document.getElementById("loanAmount").value) || 500000;
  const tenure = parseInt(document.getElementById("loanTenure").value) || 36;
  const rate = parseFloat(document.getElementById("dispRate").innerText) || 10.5;
  const emi = document.getElementById("dispEmi").innerText.replace(/[^0-9]/g, "");

  currentApplication = {
    appNumber: generatedId,
    fullName,
    mobile,
    pan,
    empType,
    income,
    loanType,
    amount,
    tenure,
    rate,
    emi: Number(emi),
    creditScore: 765,
    stage: "Submitted",
    auditNotes: "Application submitted. KYC verified via mock bureau."
  };

  applicationsStore.unshift(currentApplication);

  document.getElementById("screenStep5").classList.add("hidden");
  document.getElementById("screenSuccess").classList.remove("hidden");
  document.getElementById("finalAppNumber").innerText = generatedId;
  document.getElementById("displayAppNumber").innerText = "Application: " + generatedId;
}

function acceptAndESign() {
  if (!currentApplication) return;
  currentApplication.stage = "Disbursal hand-off";
  document.getElementById("sanctionOfferCard").classList.add("hidden");
  document.getElementById("disbursalSuccessNotice").classList.remove("hidden");
  document.getElementById("currentStatusBadge").innerText = "Disbursal Hand-Off";
  document.getElementById("statusActionMsg").innerText = "e-NACH Mandate generated. LMS handover complete.";
}

function renderAdminTable() {
  const tbody = document.getElementById("adminTableBody");
  tbody.innerHTML = "";

  applicationsStore.forEach((app) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${app.appNumber}</strong></td>
      <td>${app.fullName}</td>
      <td>${app.loanType}</td>
      <td>₹ ${app.amount.toLocaleString("en-IN")}</td>
      <td>${app.tenure}M</td>
      <td><span class="text-success font-bold">${app.creditScore}</span></td>
      <td><span class="badge">${app.stage}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="openReviewModal('${app.appNumber}')">Review</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openReviewModal(appNumber) {
  selectedAppForReview = applicationsStore.find(a => a.appNumber === appNumber);
  if (!selectedAppForReview) return;

  document.getElementById("modalAppId").innerText = "Review Desk: " + selectedAppForReview.appNumber;
  document.getElementById("mApplicantName").innerText = selectedAppForReview.fullName;
  document.getElementById("mPan").innerText = selectedAppForReview.pan;
  document.getElementById("mEmp").innerText = selectedAppForReview.empType;
  document.getElementById("mIncome").innerText = selectedAppForReview.income.toLocaleString("en-IN");
  document.getElementById("mCategory").innerText = selectedAppForReview.loanType;
  document.getElementById("mAmount").innerText = selectedAppForReview.amount.toLocaleString("en-IN");
  document.getElementById("mRate").innerText = selectedAppForReview.rate + "%";
  document.getElementById("mTenure").innerText = selectedAppForReview.tenure;
  document.getElementById("mEmi").innerText = selectedAppForReview.emi.toLocaleString("en-IN");
  document.getElementById("adminDecisionNotes").value = selectedAppForReview.auditNotes || "";

  document.getElementById("reviewModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("reviewModal").classList.add("hidden");
}

function makeDecision(decisionState) {
  if (!selectedAppForReview) return;

  const notes = document.getElementById("adminDecisionNotes").value;
  selectedAppForReview.auditNotes = notes;

  if (decisionState === "Approved") {
    selectedAppForReview.stage = "Offer Sanctioned";

    if (currentApplication && currentApplication.appNumber === selectedAppForReview.appNumber) {
      document.getElementById("currentStatusBadge").innerText = "Offer Sanctioned";
      document.getElementById("statusActionMsg").innerText = "Offer letter ready for acceptance & e-sign.";
      document.getElementById("offerAmt").innerText = "₹ " + selectedAppForReview.amount.toLocaleString("en-IN");
      document.getElementById("offerRate").innerText = selectedAppForReview.rate + "% p.a.";
      document.getElementById("offerTenure").innerText = selectedAppForReview.tenure + " Months";
      document.getElementById("sanctionOfferCard").classList.remove("hidden");
    }
  } else if (decisionState === "Rejected") {
    selectedAppForReview.stage = "Closed (Rejected)";
  } else {
    selectedAppForReview.stage = "Deficiency / On Hold";
  }

  closeModal();
  renderAdminTable();
}