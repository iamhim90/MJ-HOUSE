import re

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix Booking HTML Heading
old_booking = """<section class="booking-section" id="booking">
  <div class="booking-inner">
    <!-- Section header -->
    <div class="reveal" style="max-width:560px;margin-bottom:0">
      <span class="sec-tag">Reserve Your Date</span>
      <h2 class="sec-h">Book the Farmhouse</h2>
      <div class="rule"></div>
      <p class="sec-p">Choose your time slot, fill in your details \u2014 your booking is confirmed instantly.</p>
    </div>

    <!-- TWO-COLUMN SPLIT -->
    <div class="booking-split" style="position: relative;">"""

new_booking = """<section class="booking-section" id="booking">
  <div class="booking-inner">

    <!-- FIX #3: BOOKING HEADING \u2014 Moved ABOVE the 2-column split for proper alignment -->
    <div class="booking-heading reveal">
      <div class="sec-tag">? RESERVE</div>
      <h2 class="sec-h">Plan Your Perfect Event</h2>
      <div class="rule"></div>
      <p class="sec-p">Select your preferred date and slot, share your details, and we'll confirm your booking instantly.</p>
    </div>

    <!-- TWO-COLUMN SPLIT -->
    <div class="booking-split" style="position: relative; margin-top:0;">"""

content = content.replace(old_booking, new_booking)

# 2. Fix T&C Popup HTML
tc_start = "<!-- TERMS & CONDITIONS POPUP -->"
tc_end = "  </div>\n\n</div>"
if tc_start in content:
    start_idx = content.find(tc_start)
    end_idx = content.find(tc_end, start_idx) + len(tc_end)
    
    new_tc = """<!-- TERMS & CONDITIONS OVERLAY (PREMIUM) -->
<div id="tcOverlay" class="tc-hidden" role="dialog" aria-modal="true" aria-labelledby="tcModalTitle">
  <div class="tc-modal">
    <div class="tc-header">
      <div class="tc-seal">Official Document</div>
      <h2 id="tcModalTitle">Terms &amp; Conditions of Booking</h2>
      <p>MJ Culture Farmhouse &amp; Events &mdash; Dahod, Gujarat &bull; Please read carefully before proceeding</p>
    </div>
    <div class="tc-body" id="tcBody">

      <!-- Clause 1: Security Deposit -->
      <div class="tc-clause">
        <div class="tc-clause-num">Article I</div>
        <h4>Security Deposit \u2014 Refundable Assurance</h4>
        <p>Upon confirmation of any booking, a mandatory <strong>refundable security deposit of \u20b910,000 (Rupees Ten Thousand)</strong> shall be collected from the guest. This deposit serves exclusively as a financial assurance against any damage, breakage, misuse, or loss of property belonging to MJ Culture Farmhouse. The deposit shall be returned in full upon inspection and clearance of the premises after the event. Any deductions shall be made strictly on the basis of documented damages, and a detailed account shall be provided to the guest accordingly.</p>
      </div>

      <!-- Clause 2: Cancellation Policy -->
      <div class="tc-clause">
        <div class="tc-clause-num">Article II</div>
        <h4>Cancellation &amp; Refund Policy</h4>
        <p>In the event of cancellation of a confirmed booking, the following policy shall apply: <strong>Cancellations made 10 (ten) or more days prior to the scheduled event date</strong> shall attract a deduction of <strong>20% (Twenty Percent) of the total advance payment</strong> made at the time of booking. Cancellations made within 10 days of the event date shall be subject to a separate forfeiture policy as communicated at the time of booking. All refund requests must be submitted in writing via official channels and shall be processed within 7\u201310 working days.</p>
      </div>

      <!-- Clause 3: Premises Maintenance -->
      <div class="tc-clause">
        <div class="tc-clause-num">Article III</div>
        <h4>Premises Maintenance &amp; Code of Conduct</h4>
        <p>The guest and all attendees are required to maintain the farmhouse premises in a clean, orderly, and respectful condition throughout the duration of their event. <strong>MJ Culture Farmhouse must be returned in the same condition as received.</strong> Any wilful damage, vandalism, littering, or failure to maintain decorum shall result in deductions from the security deposit and may result in immediate termination of the event without refund. Guests are fully responsible for the conduct of all individuals present at their event.</p>
      </div>

      <!-- Clause 4: Alcohol-Free & No Nuisance -->
      <div class="tc-clause">
        <div class="tc-clause-num">Article IV</div>
        <h4>Alcohol-Free Premises &amp; Zero Nuisance Policy</h4>
        <p>MJ Culture Farmhouse operates as a <strong>strictly alcohol-free venue.</strong> The possession, consumption, or distribution of any alcoholic beverages or prohibited substances on or around the premises is <strong>strictly forbidden</strong> and constitutes grounds for immediate termination of the event and forfeiture of all payments. Additionally, all guests are expected to conduct themselves with the utmost respect and dignity. Any behaviour causing disturbance, nuisance, or inconvenience to staff, neighbours, or the surrounding community shall not be tolerated under any circumstances.</p>
      </div>

      <!-- Clause 5: Janab Saab Authority -->
      <div class="tc-authority">
        <div class="janab-title">Supreme Authority</div>
        <h4>Mandatory Approval of Janab Saab</h4>
        <p>The explicit prior approval of <strong>Janab Saab</strong> \u2014 the designated authority and principal overseer of MJ Culture \u2014 is <strong>mandatory and non-negotiable</strong> for all bookings, events, and matters pertaining to the farmhouse. No booking shall be deemed confirmed, and no event shall proceed, without the express consent and authorisation of Janab Saab. This clause supersedes all other conditions and applies universally across all categories of events, packages, and arrangements.</p>
      </div>

      <!-- Consent checkbox -->
      <div class="tc-checkbox-row">
        <input type="checkbox" id="tcConsent" class="tc-checkbox">
        <label for="tcConsent" class="tc-checkbox-label">
          I have read, understood, and agree to comply with all the <strong>Terms &amp; Conditions</strong> stated above. I acknowledge that violation of any clause may result in termination of the event and/or financial deductions from my security deposit.
        </label>
      </div>

    </div><!-- /tc-body -->
    <div class="tc-footer">
      <p class="tc-footer-note">By clicking "I Accept", you acknowledge that you have read and understood all terms above and agree to be legally bound by them. Your acceptance will be recorded with a timestamp.</p>
      <div class="tc-btn-row">
        <button id="tcDeclineBtn" onclick="tcDecline()"><i class="fas fa-times"></i> Decline</button>
        <button id="tcAcceptBtn" onclick="tcAccept()" disabled><i class="fas fa-check"></i> I Accept &amp; Proceed</button>
      </div>
    </div>
  </div>
</div>

<!-- DECLINE REJECTION SCREEN -->
<div id="tcRejected">
  <div class="tc-rej-icon">\ud83d\udeab</div>
  <h2 class="tc-rej-title">This Farmhouse Is Not For You</h2>
  <div class="tc-rej-line"></div>
  <p class="tc-rej-sub">You have chosen not to accept the Terms &amp; Conditions of MJ Culture Farmhouse. We respect your decision. However, access to our booking services and facilities is exclusively available to guests who agree to our terms.<br><br>We hope to welcome you another time.</p>
  <button class="tc-rej-close" onclick="window.location.href='about:blank'">Close &amp; Exit</button>
</div>"""
    content = content[:start_idx] + new_tc + content[end_idx:]

# 3. Fix JS
old_js = """/* TERMS & CONDITIONS POPUP */
const termsCheckbox = document.getElementById('termsAgree');
const acceptBtn = document.getElementById('acceptBtn');

termsCheckbox?.addEventListener('change', () => {
  acceptBtn.disabled = !termsCheckbox.checked;
});

function acceptTerms() {
  localStorage.setItem('termsAccepted', 'true');
  document.getElementById('termsPopup').classList.remove('active');
}

function tcDecline() {
  alert('You must accept the terms and conditions to proceed.');
}

// Check if user already accepted terms on page load
document.addEventListener('DOMContentLoaded', () => {
  // Hide popup on page load - it will be shown after loader finishes
  const popup = document.getElementById('termsPopup');
  if (popup) {
    popup.classList.remove('active');
  }

  if (localStorage.getItem('termsAccepted') === 'true') {
    popup?.classList.remove('active');
  }
});"""

new_js = """/* TERMS & CONDITIONS OVERLAY LOGIC */
function showTermsModal() {
  _openTcOverlay();
}

function _openTcOverlay() {
  const checkbox = document.getElementById('tcConsent');
  const acceptBtn = document.getElementById('tcAcceptBtn');
  if (checkbox) checkbox.checked = false;
  if (acceptBtn) {
    acceptBtn.disabled = true;
    acceptBtn.innerHTML = '<i class="fas fa-check"></i> I Accept &amp; Proceed';
  }

  if (checkbox && acceptBtn) {
    checkbox.removeEventListener('change', onCheckboxChange);
    checkbox.addEventListener('change', onCheckboxChange);
  }

  const overlay = document.getElementById('tcOverlay');
  overlay.classList.remove('tc-hidden');
  overlay.classList.add('tc-visible');
  document.body.style.overflow = 'hidden';
}

function onCheckboxChange() {
  const checkbox = document.getElementById('tcConsent');
  const acceptBtn = document.getElementById('tcAcceptBtn');
  acceptBtn.disabled = !checkbox.checked;
}

function tcAccept() {
  const checkbox = document.getElementById('tcConsent');
  if (!checkbox || !checkbox.checked) return;

  const acceptBtn = document.getElementById('tcAcceptBtn');
  acceptBtn.disabled = true;
  acceptBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recording...';

  const record = {
    accepted: true,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    page: window.location.href,
    version: 'MJC-TC-v1.0'
  };

  sessionStorage.setItem('mjc_tc_accepted', JSON.stringify(record));
  localStorage.setItem('mjc_tc_accepted', JSON.stringify(record));

  console.log('? MJ Culture T&C Accepted:', record);

  setTimeout(() => {
    const overlay = document.getElementById('tcOverlay');
    overlay.classList.remove('tc-visible');
    overlay.classList.add('tc-hidden');
    document.body.style.overflow = '';
    setTimeout(() => {
      overlay.classList.remove('tc-hidden');
      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);
  }, 800);

  acceptBtn.innerHTML = '<i class="fas fa-check-circle"></i> Accepted!';
}

function tcDecline() {
  const record = {
    accepted: false,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  };
  console.log('? MJ Culture T&C Declined:', record);
  sessionStorage.setItem('mjc_tc_declined', JSON.stringify(record));

  const overlay = document.getElementById('tcOverlay');
  overlay.classList.remove('tc-visible');
  overlay.classList.add('tc-hidden');
  setTimeout(() => {
    const rejected = document.getElementById('tcRejected');
    rejected.classList.add('active');
    document.body.style.overflow = 'hidden';
  }, 400);
}"""

content = content.replace(old_js, new_js)

# Fix CSS mapping for booking heading
content = content.replace("/* -- LEFT PANEL: SLOT PICKER -- */", "/* -- BOOKING HEADING -- */\n    .booking-heading { margin-bottom:3rem; }\n    .booking-heading .sec-h { margin-bottom:1rem; }\n\n    /* -- LEFT PANEL: SLOT PICKER -- */")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Replacement complete.")
