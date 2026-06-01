
/* ── LOADER ── */
window.addEventListener('load', () => {
  const bg = document.getElementById('heroBg');
  const isMobile = window.matchMedia('(pointer:coarse)').matches;
  // On desktop trigger the subtle zoom animation; on mobile skip it (already no transform)
  if (!isMobile) {
    requestAnimationFrame(() => bg.classList.add('loaded'));
  }
 
  // Shorter delay on mobile for faster perceived load
  const loaderDelay = isMobile ? 1200 : 1800;
  setTimeout(() => {
    const l = document.getElementById('loader');
    l.classList.add('done');
    setTimeout(() => {
      l.style.display = 'none';
      // Show Terms & Conditions modal after loader hides
      showTermsModal();
    }, 600);
  }, loaderDelay);
});
 
/* ── CURSOR ── */
if (window.matchMedia('(hover:hover)').matches) {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const glow = document.getElementById('cursorGlow');
  let mx = -200, my = -200, rx = -200, ry = -200, rafId = null;
  let visible = false;
 
  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    rafId = requestAnimationFrame(animRing);
  }
 
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    glow.style.left = mx + 'px';
    glow.style.top  = my + 'px';
    if (!visible) {
      visible = true;
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
      glow.style.opacity = '1';
      rx = mx; ry = my;
      if (!rafId) animRing();
    }
  }, {passive:true});
 
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = ring.style.opacity = glow.style.opacity = '0';
    visible = false;
  }, {passive:true});
  document.addEventListener('mouseenter', () => {}, {passive:true});
 
  document.querySelectorAll('a,button,.slot,.amen,.testi-card,.ann-card,.thumb,.arrow-btn,.soc,.faq-q,#tcAcceptBtn,#tcDeclineBtn,.tc-checkbox,.tc-checkbox-label,.tc-clause,.tc-rej-close').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}
 
/* ── SCROLL HANDLER ── */
const navEl = document.getElementById('nav');
const topBtn = document.getElementById('topBtn');
topBtn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
let scrollRAF = false;
function onScroll() {
  if (scrollRAF) return;
  scrollRAF = true;
  requestAnimationFrame(() => {
    const sy = window.scrollY;
    const prog = (sy / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    document.getElementById('progress').style.width = prog + '%';
    navEl.classList.toggle('scrolled', sy > 60);
    topBtn.classList.toggle('show', sy > 600);
    document.querySelectorAll('.fade-in:not(.show)').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 60) el.classList.add('show');
    });
    scrollRAF = false;
  });
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();
 
/* ── REVEAL OBSERVER ── */
const ro = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('vis'); ro.unobserve(e.target); }
}), {threshold:.08});
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
 
/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = target >= 100 ? '+' : '';
  let start = 0;
  const dur = 1800, step = 16;
  const inc = target / (dur / step);
  const t = setInterval(() => {
    start = Math.min(start + inc, target);
    el.textContent = Math.floor(start) + suffix;
    if (start >= target) clearInterval(t);
  }, step);
}
const counterObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); }
}), {threshold:.3});
document.querySelectorAll('.stat-num[data-count]').forEach(el => counterObs.observe(el));
 
/* ── GALLERY SLIDER ── */
const slides = document.querySelectorAll('.slide');
const dotsWrap = document.getElementById('sliderDots');
const thumbs = document.querySelectorAll('.thumb');
let curSlide = 0, autoTimer;
 
function buildDots() {
  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i===0?' active':'');
    d.onclick = () => goSlide(i);
    dotsWrap.appendChild(d);
  });
}
function getSlideOffset() {
  const sw = document.querySelector('.slider-wrap');
  const gap = parseFloat(getComputedStyle(document.getElementById('mainSlider')).columnGap) || 24;
  return sw.offsetWidth + gap;
}
function goSlide(n) {
  curSlide = (n + slides.length) % slides.length;
  document.getElementById('mainSlider').style.transform = `translateX(-${curSlide * getSlideOffset()}px)`;
  document.querySelectorAll('.dot').forEach((d,i) => d.classList.toggle('active', i===curSlide));
  thumbs.forEach((t,i) => t.classList.toggle('active', i===curSlide));
}
function startAuto() { autoTimer = setInterval(() => goSlide(curSlide+1), 4500); }
function resetAuto() { clearInterval(autoTimer); startAuto(); }
 
window.addEventListener('load', () => {
  buildDots();
  const slider = document.getElementById('mainSlider');
  slider.style.transition = 'transform .65s cubic-bezier(.4,0,.2,1)';
  slider.style.willChange = 'transform';
  goSlide(0);
  startAuto();
  let txS=0,tyS=0;
  slider.addEventListener('touchstart', e=>{txS=e.touches[0].clientX;tyS=e.touches[0].clientY;},{passive:true});
  slider.addEventListener('touchend', e=>{
    const dx=e.changedTouches[0].clientX-txS, dy=e.changedTouches[0].clientY-tyS;
    if(Math.abs(dx)>Math.abs(dy)&&Math.abs(dx)>40){resetAuto();goSlide(dx<0?curSlide+1:curSlide-1);}
  },{passive:true});
});
document.getElementById('nextSlide').onclick = () => {resetAuto();goSlide(curSlide+1);};
document.getElementById('prevSlide').onclick = () => {resetAuto();goSlide(curSlide-1);};
thumbs.forEach(t => t.addEventListener('click', () => {resetAuto();goSlide(parseInt(t.dataset.index));}));
window.addEventListener('resize', () => goSlide(curSlide), {passive:true});
 
/* ── LIGHTBOX ── */
const lbImages = ['assets/gallery1.jpeg','assets/gallery2.jpeg','assets/gallery3.jpeg','assets/gallery4.jpeg','assets/gallery5.jpeg','assets/gallery6.jpeg','assets/gallery7.jpeg','assets/gallery9.jpeg','assets/gallery10.jpeg'];
let lbIdx = 0;
function openLightbox(i) { lbIdx=i; document.getElementById('lbImg').src=lbImages[lbIdx]; document.getElementById('lightbox').classList.add('open'); document.body.style.overflow='hidden'; }
function closeLightbox() { document.getElementById('lightbox').classList.remove('open'); document.body.style.overflow=''; }
function lbNav(dir) { lbIdx=(lbIdx+dir+lbImages.length)%lbImages.length; document.getElementById('lbImg').src=lbImages[lbIdx]; }
document.getElementById('lightbox').addEventListener('click', e=>{if(e.target===e.currentTarget)closeLightbox();});
document.addEventListener('keydown', e=>{
  if(e.key==='Escape')closeLightbox();
  if(e.key==='ArrowLeft')lbNav(-1);
  if(e.key==='ArrowRight')lbNav(1);
});
 
/* ── ANNOUNCEMENTS ── */
const ANNOUNCEMENTS = [
  {type:'offer',label:'Special Offer',date:'April 2026',title:'20% off Morning Slots this Summer',body:'Book any morning slot in April–June 2026 and enjoy an exclusive 20% discount. Limited dates available.'},
  {type:'event',label:'Event',date:'May 15, 2026',title:'Open House Viewing Day',body:'Come visit the farmhouse! Walk around, meet the team, and plan your event in person. Free entry, no booking needed.'},
  {type:'new',label:'New',date:'March 2026',title:'Pool Area Now Ready',body:'Our newly renovated pool area is open for all bookings. Perfect for summer celebrations and photoshoots.'},
  {type:'offer',label:'Package',date:'Ongoing',title:'Wedding Full-Day Package',body:'Special bundled package for weddings — includes full-day slot + basic decoration + catering consultation. Ask us for details.'},
  {type:'new',label:'New',date:'2026',title:'Ridas Boutique Now Online',body:'Browse our exclusive collection of Dawoodi Bohra Ridas. DM us on Instagram or WhatsApp to place your order.'},
  {type:'event',label:'Update',date:'Always',title:'Follow us on Instagram',body:'Get real-time updates, behind-the-scenes looks, and exclusive offers. Follow @mjculturecenterofficial.'}
];
document.getElementById('annCards').innerHTML = ANNOUNCEMENTS.map(a => {
  const cls = a.type==='offer'?'type-offer':a.type==='event'?'type-event':'type-new';
  return `<div class="ann-card"><div class="ann-meta"><span class="ann-type ${cls}">${a.label}</span><span class="ann-date">${a.date}</span></div><h3>${a.title}</h3><p>${a.body}</p></div>`;
}).join('');
 
/* ── ADVANCE PAYMENT HELPERS ── */
function updateAdvanceDisplay(price) {
  const advance = Math.round(price * 0.30);
  const fmt = advance.toLocaleString('en-IN');
  // Advance banner in form summary
  const bannerEl = document.getElementById('advanceBannerAmt');
  if (bannerEl) bannerEl.textContent = fmt;
  // Form slot summary price
  const fssPrice = document.getElementById('fssPriceDisplay');
  if (fssPrice) fssPrice.textContent = parseInt(price).toLocaleString('en-IN');
  // QR card advance label
  const qrEl = document.getElementById('qrAdvanceAmt');
  if (qrEl) qrEl.textContent = '\u20b9' + fmt;
  // UPI deep link — pre-fill advance amount
  const upiLink = document.getElementById('upiPayLink');
  if (upiLink) {
    upiLink.href = 'upi://pay?pa=8758457909@omni&pn=MJ%20Culture&am=' + advance + '&cu=INR&tn=MJ%20Culture%20Booking%20Advance';
  }
}

/* ── SLOT SELECTION ── */
// Map slot data-slot value to friendly display name + time
const SLOT_META = {
  'fullday':          { name: 'Full Day Exclusive',  time: '9:00 AM – 10:00 PM' },
  'hday-morning':     { name: 'Half Day – Morning',  time: '9:00 AM – 3:00 PM' },
  'hday-evening':     { name: 'Half Day – Evening',  time: '3:30 PM – 10:30 PM' },
  'daris-morning':    { name: 'Daris – Morning',     time: '11:00 AM – 2:00 PM' },
  'daris-evening':    { name: 'Daris – Evening',     time: '7:00 PM – 10:00 PM' },
  'birthday-morning': { name: 'Birthday – Morning',  time: '11:00 AM – 3:00 PM' },
  'birthday-evening': { name: 'Birthday – Evening',  time: '6:00 PM – 10:00 PM' },
};
document.querySelectorAll('.slot').forEach(s => s.addEventListener('click', () => {
  if (s.classList.contains('slot-disabled')) return;
  document.querySelectorAll('.slot').forEach(x => x.classList.remove('sel'));
  s.classList.add('sel');
  document.getElementById('selSlot').value = s.dataset.slot;
  document.getElementById('selPrice').value = s.dataset.price;
  updateAdvanceDisplay(parseInt(s.dataset.price));
  // Update form summary strip
  const meta = SLOT_META[s.dataset.slot];
  if (meta) {
    const nameEl = document.getElementById('fssSlotName');
    const timeEl = document.getElementById('fssSlotTime');
    if (nameEl) nameEl.textContent = meta.name;
    if (timeEl) timeEl.textContent = meta.time;
  }
}));

 
/* ══════════════════════════════════════════════
   AVAILABILITY SYSTEM — Read-only data layer
   Does NOT modify /book API or MongoDB schema
══════════════════════════════════════════════ */
(function AvailabilitySystem() {
  const API = API_BASE_URL + '/api/bookings/availability';
  let availCache = null;   // { "YYYY-MM-DD": ["noon","evening"] }
  let calYear, calMonth;
  let calSelectedDate = null;

  /* ── Fetch once, cache for session ── */
  async function fetchAvailability() {
    if (availCache !== null) return;
    try {
      const res = await fetch(API, { method: 'GET' });
      if (!res.ok) throw new Error('non-200');
      const data = await res.json();
      availCache = data.availability || {};
    } catch {
      availCache = {};   // graceful degradation — calendar still works, no colors
    }
  }

  /* ── Slot-level logic ── */
  function getSlotStatus(dateStr) {
    const bookedObj = (availCache && availCache[dateStr]) ? availCache[dateStr] : {};
    const booked = Array.isArray(bookedObj) ? bookedObj : Object.keys(bookedObj);
    
    const fulldayBooked = booked.includes('fullday');
    const morningBooked = booked.some(s => s.includes('morning') || s === 'noon');
    const eveningBooked = booked.some(s => s.includes('evening'));
    
    return {
      morning: !fulldayBooked && !morningBooked,
      evening: !fulldayBooked && !eveningBooked,
      fullday: !fulldayBooked && !morningBooked && !eveningBooked
    };
  }

  /* ── Date-level status ── */
  function getDateStatus(dateStr) {
    const s = getSlotStatus(dateStr);
    const freeCount = [s.morning, s.evening, s.fullday].filter(Boolean).length;
    if (freeCount === 3) return 'avail';
    if (freeCount === 0) return 'full';
    return 'partial';
  }

  /* ── Calendar rendering ── */
  const MONTHS = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];

  function renderCalendar() {
    document.getElementById('calMonthLabel').textContent = MONTHS[calMonth] + ' ' + calYear;
    const container = document.getElementById('calDays');
    container.innerHTML = '';

    const today = new Date(); today.setHours(0,0,0,0);
    const firstDay   = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

    // Filler cells
    for (let i = 0; i < firstDay; i++) {
      const e = document.createElement('div');
      e.className = 'cal-day empty';
      container.appendChild(e);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const cell    = document.createElement('div');
      const dateObj = new Date(calYear, calMonth, d);
      dateObj.setHours(0,0,0,0);
      const pad     = n => String(n).padStart(2,'0');
      const dateStr = `${calYear}-${pad(calMonth+1)}-${pad(d)}`;

      cell.className = 'cal-day';
      cell.textContent = d;

      if (dateObj < today) {
        cell.classList.add('past');
      } else {
        if (dateObj.getTime() === today.getTime()) cell.classList.add('today');

        cell.classList.add('selectable');
        cell.addEventListener('click', () => selectDate(dateStr, cell));

        if (dateStr === calSelectedDate) cell.classList.add('selected');
      }
      container.appendChild(cell);
    }
  }

  function selectDate(dateStr, cell) {
    calSelectedDate = dateStr;
    // Set the hidden input value — read by booking JS untouched
    document.getElementById('bDate').value = dateStr;

    // Update display label
    const [yr, mo, dy] = dateStr.split('-').map(Number);
    const dateObj = new Date(yr, mo - 1, dy);
    const label   = dateObj.toLocaleDateString('en-IN', {weekday:'short', day:'numeric', month:'short', year:'numeric'});
    const ph = document.getElementById('calPlaceholder');
    ph.textContent = label;
    ph.className = 'cal-selected-text';

    // Close panel — also restore overflow and backdrop on mobile
    const calPanel   = document.getElementById('calPanel');
    const calDisplay = document.getElementById('calDisplay');
    const calBackdrop = document.getElementById('calBackdrop');
    calPanel.classList.remove('open');
    calDisplay.classList.remove('open');
    calDisplay.setAttribute('aria-expanded', 'false');
    if (calBackdrop) calBackdrop.classList.remove('active');
    document.body.style.overflow = '';

    // Re-render to show selected highlight
    renderCalendar();

    // Update slot availability UI
    updateSlotUI(dateStr);

    // Clear any stale booking feedback
    const mb = document.getElementById('bookingMessage');
    if (mb) { mb.style.display = 'none'; }
  }

  function updateSlotUI(dateStr) {
    // Availability removed - no-op
  }

  /* ── Wire up calendar controls ── */
  function initCalendar() {
    const now = new Date();
    calYear  = now.getFullYear();
    calMonth = now.getMonth();

    renderCalendar();

    document.getElementById('calPrev').addEventListener('click', e => {
      e.stopPropagation();
      if (calMonth === 0) { calMonth = 11; calYear--; } else calMonth--;
      renderCalendar();
    });
    document.getElementById('calNext').addEventListener('click', e => {
      e.stopPropagation();
      if (calMonth === 11) { calMonth = 0; calYear++; } else calMonth++;
      renderCalendar();
    });

    const display = document.getElementById('calDisplay');
    const panel   = document.getElementById('calPanel');

    // CRITICAL: Move panel to <body> so it escapes any ancestor
    // transform/will-change/preserve-3d stacking context that would
    // break position:fixed positioning.
    document.body.appendChild(panel);

    // Create a backdrop element for mobile
    let backdrop = document.getElementById('calBackdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'calBackdrop';
      document.body.appendChild(backdrop);
    }
    backdrop.onclick = closeCalendar;

    function positionPanel() {
      // On mobile (bottom sheet) — CSS handles position via media query
      if (window.innerWidth <= 680) return;
      const rect = display.getBoundingClientRect();
      const panelW = 320;
      const gap = 8;
      let left = rect.left;
      // Prevent going off right edge of viewport
      if (left + panelW > window.innerWidth - 12) {
        left = window.innerWidth - panelW - 12;
      }
      if (left < 8) left = 8;
      // position:fixed is viewport-relative — DO NOT add scrollY
      const spaceBelow = window.innerHeight - rect.bottom - gap;
      const panelH = 340; // approximate calendar height
      if (spaceBelow >= panelH || spaceBelow >= 200) {
        // Open below the trigger
        panel.style.top    = (rect.bottom + gap) + 'px';
        panel.style.bottom = 'auto';
      } else {
        // Flip: open above the trigger
        panel.style.top    = Math.max(8, rect.top - panelH - gap) + 'px';
        panel.style.bottom = 'auto';
      }
      panel.style.left  = left + 'px';
      panel.style.width = panelW + 'px';
    }

    function openCalendar() {
      panel.classList.add('open');
      display.classList.add('open');
      display.setAttribute('aria-expanded', 'true');
      positionPanel();
      if (window.innerWidth <= 680) {
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closeCalendar() {
      panel.classList.remove('open');
      display.classList.remove('open');
      display.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    display.addEventListener('click', e => {
      e.stopPropagation();
      if (panel.classList.contains('open')) { closeCalendar(); } else { openCalendar(); }
    });
    display.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); display.click(); }
      if (e.key === 'Escape') closeCalendar();
    });
    panel.addEventListener('click', e => e.stopPropagation());
    document.addEventListener('click', closeCalendar);
    window.addEventListener('resize', () => {
      if (panel.classList.contains('open')) positionPanel();
    }, { passive: true });
    // On mobile: close calendar on scroll (bottom sheet doesn't need repositioning)
    // On desktop: reposition on scroll so it stays anchored to the trigger
    window.addEventListener('scroll', () => {
      if (!panel.classList.contains('open')) return;
      if (window.innerWidth <= 680) {
        // On mobile, close on scroll to prevent glitch
        closeCalendar();
      } else {
        positionPanel();
      }
    }, { passive: true });
  }

  /* ── Expose slot-guard for booking form ── */
  window._getSlotStatus = getSlotStatus;
  window._availCache    = () => availCache;

  /* ── Boot ── */
  (async () => {
    await fetchAvailability();
    initCalendar();
  })();

})();



/* ── BOOKING FORM ── */
(function() {
  const bookForm   = document.getElementById('bookForm');
  const submitBtn  = document.getElementById('submitBtn');
  const msgBox     = document.getElementById('bookingMessage');

  function showMsg(type, html) {
    msgBox.className = 'msg-' + type;
    msgBox.innerHTML = html;
    msgBox.style.display = 'block';
    msgBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function hideMsg() { msgBox.style.display = 'none'; msgBox.innerHTML = ''; }

  bookForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (submitBtn.disabled) return;  // guard double-submit

    hideMsg();

    const name     = document.getElementById('bName').value.trim();
    const phone    = document.getElementById('bPhone').value.trim();
    const email    = document.getElementById('bEmail').value.trim();
    const date     = document.getElementById('bDate').value;
    const occasion = document.getElementById('bOccasion').value;
    const guests   = document.getElementById('bGuests').value;
    const notes    = document.getElementById('bNotes').value.trim();
    const slot     = document.getElementById('selSlot').value;
    const price    = parseInt(document.getElementById('selPrice').value);

    // Frontend logging
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📋 FORM SUBMISSION DETECTED");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Form data extracted:");
    console.log("  name:", name);
    console.log("  phone:", phone);
    console.log("  email:", email);
    console.log("  date:", date);
    console.log("  slot (timeSlot):", slot);
    console.log("  occasion:", occasion);
    console.log("  guests:", guests);
    console.log("  notes:", notes);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Validation
    if (!name || !phone || !date || !occasion || !guests) {
      console.log("❌ VALIDATION FAILED: Missing required fields");
      showMsg('warn', '<div class="msg-title"><span class="msg-icon">⚠️</span>Please fill all required fields marked *</div>');
      return;
    }
    if (!date) {
      showMsg('warn', '<div class="msg-title"><span class="msg-icon">📅</span>Please select an event date from the calendar.</div>');
      return;
    }
    if (!/^[0-9]{10}$/.test(phone)) {
      console.log("❌ VALIDATION FAILED: Invalid phone format");
      showMsg('warn', '<div class="msg-title"><span class="msg-icon">⚠️</span>Please enter a valid 10-digit mobile number.</div>');
      return;
    }

    // ── Smart booking prevention: guard against already-booked slot ──
    if (window._availCache && window._availCache() && Object.keys(window._availCache()).length > 0) {
      const slotStatus = window._getSlotStatus(date);
      
      let isAvailable = true;
      if (slot === 'fullday') {
        isAvailable = slotStatus.fullday;
      } else if (slot.includes('morning') || slot === 'noon') {
        isAvailable = slotStatus.morning;
      } else if (slot.includes('evening')) {
        isAvailable = slotStatus.evening;
      }

      if (!isAvailable) {
        console.log("🚫 FRONTEND GUARD: Slot already booked for selected date");
        showMsg('error',
          '<div class="msg-title"><span class="msg-icon">🚫</span>This slot is already booked for the selected date.</div>' +
          '<div class="msg-detail">Please choose a different time slot or pick another date.</div>'
        );
        return;
      }
    }



    const slotLabel = slot==='noon'?'12 PM – 3 PM':slot==='evening'?'6 PM – 9 PM':'12 AM – 10 PM';
    const formattedDate = new Date(date).toLocaleDateString('en-IN', {weekday:'long',year:'numeric',month:'long',day:'numeric'});

    // Prepare payload — field names unchanged
    const payload = {
      name,
      phone,
      email,
      date,
      timeSlot: slot,
      occasion,
      price,
      guests: parseInt(guests),
      specialRequirements: notes
    };

    console.log("📤 SENDING TO BACKEND:");
    console.log(JSON.stringify(payload, null, 2));
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Disable button during request
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner" style="animation:spin 1s linear infinite"></i> Processing...';

    try {
      // Call backend API — URL untouched
      console.log(API_BASE_URL + "/api/bookings");
      const response = await fetch(API_BASE_URL + '/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const fetcha = await response.json();

      console.log("📥 RESPONSE FROM BACKEND:");
      console.log("Status:", response.status);
      console.log("Data:", fetcha);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      if (response.ok) {
        console.log("✅ BOOKING SAVED — redirecting to payment section");
        const bookingId = fetcha.bookingId;
        const advance = Math.round(price * 0.30);

        // Reset form
        this.reset();
        document.querySelectorAll('.slot').forEach(s => s.classList.remove('sel'));
        document.querySelector('[data-slot="fullday"]').classList.add('sel');
        updateAdvanceDisplay(30000);
        hideMsg();

        // Show premium systematic popup message
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(10,12,16,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);padding:1rem;opacity:0;transition:opacity 0.3s ease;';
        overlay.innerHTML = `
          <div style="background:#11151c;border:1px solid rgba(201,169,110,0.3);padding:2.5rem 2rem;border-radius:12px;max-width:420px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,0.6);transform:translateY(20px);transition:transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275)">
            <i class="fas fa-check-circle" style="font-size:3.5rem;color:#86efac;margin-bottom:1.2rem"></i>
            <h3 style="font-family:'Cinzel',serif;color:var(--wheat);margin-bottom:1rem;font-size:1.5rem">Request Received</h3>
            <p style="color:rgba(245,240,232,0.85);font-size:0.95rem;line-height:1.6;margin-bottom:1.8rem">
              Your request has been successfully taken. To secure your slot, <strong>please pay the 30% advance</strong> now via the QR code. Your booking will be officially confirmed by the admin once the payment is verified.
            </p>
            <button onclick="const o = this.parentElement.parentElement; o.style.opacity='0'; setTimeout(()=>o.remove(),300)" style="background:var(--wheat);color:#111;border:none;padding:.85rem 2.2rem;border-radius:30px;font-weight:600;font-size:.95rem;cursor:pointer;font-family:'Inter',sans-serif;box-shadow:0 4px 15px rgba(201,169,110,0.2)">Proceed to Payment</button>
          </div>
        `;
        document.body.appendChild(overlay);
        // Trigger animations
        requestAnimationFrame(() => {
          overlay.style.opacity = '1';
          overlay.firstElementChild.style.transform = 'translateY(0)';
        });

        // Populate status tracker
        document.getElementById('bstBookingId').textContent = 'Ref: ' + bookingId;
        document.getElementById('bstSummary').innerHTML =
          `<div class="bst-row"><span class="bst-label">Name</span><span class="bst-val">${name}</span></div>` +
          `<div class="bst-row"><span class="bst-label">Date</span><span class="bst-val">${formattedDate}</span></div>` +
          `<div class="bst-row"><span class="bst-label">Slot</span><span class="bst-val">${slotLabel}</span></div>` +
          `<div class="bst-row"><span class="bst-label">Advance (30%)</span><span class="bst-val highlight">₹${advance.toLocaleString()}</span></div>`;

        // Reset stepper to initial state
        document.getElementById('bstStep1').className = 'bst-step done';
        document.getElementById('bstStep2').className = 'bst-step active';
        document.getElementById('bstStep3').className = 'bst-step';
        document.getElementById('bstAction').style.display = 'block';
        document.getElementById('bstWaiting').classList.remove('active');
        document.getElementById('bstConfirmed').classList.remove('active');
        document.getElementById('bstRejected').classList.remove('active');
        document.getElementById('bstPayDoneBtn').disabled = false;
        document.getElementById('bstPayDoneBtn').innerHTML = '<i class="fas fa-check-circle"></i> I Have Completed Payment';

        // Show tracker
        const tracker = document.getElementById('bookingStatusTracker');
        tracker.classList.add('active');

        // Update QR section to show correct advance for this booking
        updateAdvanceDisplay(price);

        // Scroll to payment section
        document.getElementById('payment').scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Wire up "I have paid" button
        const payDoneBtn = document.getElementById('bstPayDoneBtn');
        const newPayDoneBtn = payDoneBtn.cloneNode(true); // remove old listeners
        payDoneBtn.parentNode.replaceChild(newPayDoneBtn, payDoneBtn);
        newPayDoneBtn.addEventListener('click', async function() {
          newPayDoneBtn.disabled = true;
          newPayDoneBtn.innerHTML = '<i class="fas fa-spinner" style="animation:spin 1s linear infinite"></i> Notifying owner…';
          try {
            const pRes = await fetch(API_BASE_URL + '/api/bookings/' + bookingId + '/paydone', { method: 'PATCH' });
            if (pRes.ok) {
              // Switch to waiting state
              document.getElementById('bstStep2').className = 'bst-step done';
              document.getElementById('bstStep3').className = 'bst-step active';
              document.getElementById('bstAction').style.display = 'none';
              document.getElementById('bstWaiting').classList.add('active');
              // Start polling
              startStatusPolling(bookingId);
            } else {
              const pData = await pRes.json();
              newPayDoneBtn.disabled = false;
              newPayDoneBtn.innerHTML = '<i class="fas fa-check-circle"></i> I Have Completed Payment';
              alert(pData.error || 'Something went wrong. Please try again.');
            }
          } catch (pollErr) {
            newPayDoneBtn.disabled = false;
            newPayDoneBtn.innerHTML = '<i class="fas fa-check-circle"></i> I Have Completed Payment';
            alert('Connection error. Please check your internet and try again.');
          }
        });
      } else {
        console.log("⚠️ BOOKING FAILED:", fetcha.message);
        showMsg('error',
          `<div class="msg-title"><span class="msg-icon">⚠️</span>${fetcha.message || 'Booking failed'}</div>` +
          `<div class="msg-detail">This time slot may already be booked. Please select another date or time.</div>`
        );
      }
    } catch (err) {
      console.error("❌ NETWORK/API ERROR:", err);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      showMsg('error',
        `<div class="msg-title"><span class="msg-icon">❌</span>Connection Error</div>` +
        `<div class="msg-detail">${err.message}<br>Please check your internet connection and try again.</div>`
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
    }
  });
})();

/* ── STATUS POLLING (live updates after "I have paid") ── */
let _pollTimer = null;
function startStatusPolling(bookingId) {
  if (_pollTimer) clearInterval(_pollTimer);
  _pollTimer = setInterval(async () => {
    try {
      const res = await fetch(API_BASE_URL + '/api/bookings/' + bookingId);
      if (!res.ok) return;
      const data = await res.json();

      if (data.status === 'confirmed') {
        clearInterval(_pollTimer); _pollTimer = null;
        document.getElementById('bstStep3').className = 'bst-step done';
        document.getElementById('bstWaiting').classList.remove('active');
        document.getElementById('bstConfirmed').classList.add('active');
      } else if (data.status === 'rejected') {
        clearInterval(_pollTimer); _pollTimer = null;
        document.getElementById('bstStep3').className = 'bst-step';
        document.getElementById('bstWaiting').classList.remove('active');
        document.getElementById('bstRejected').classList.add('active');
      }
    } catch (e) {
      console.warn('Polling error:', e.message);
    }
  }, 5000);
}
 
/* ── MOBILE NAV ── */
const ham=document.getElementById('ham'), mobNav=document.getElementById('mobNav');
ham.addEventListener('click',()=>{
  const open=mobNav.classList.toggle('open');
  ham.innerHTML=open?'<i class="fas fa-times"></i>':'<i class="fas fa-bars"></i>';
  document.body.style.overflow=open?'hidden':'';
});
function closeMob(){mobNav.classList.remove('open');ham.innerHTML='<i class="fas fa-bars"></i>';document.body.style.overflow='';}
 
/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const t = document.querySelector(a.getAttribute('href'));
  if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}
}));
 
/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-q').forEach(btn => btn.addEventListener('click', () => {
  const item = btn.closest('.faq-item');
  const wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if(!wasOpen) item.classList.add('open');
}));
 
/* ═══════════════════════════════════════════
   3D ANIMATION JAVASCRIPT — added on top
   No existing functionality is changed
═══════════════════════════════════════════ */
 
/* — Hero floating particles — */
(function spawnParticles() {
  if (!window.matchMedia('(hover:hover)').matches) return;
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const TOTAL = 18;
  for (let i = 0; i < TOTAL; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    const size = Math.random() * 5 + 2;
    const left = Math.random() * 100;
    const dur  = Math.random() * 12 + 10;
    const delay = -(Math.random() * dur);
    const drift = (Math.random() - 0.5) * 160;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
      --drift:${drift}px;
    `;
    container.appendChild(p);
  }
})();
 
/* — 3D mouse-tilt on cards (perspective tilt effect — desktop only) — */
(function init3DTilt() {
  // Skip on touch devices — touch events on cards cause scroll jank and visual glitches
  if (window.matchMedia('(pointer:coarse)').matches) return;

  const TILT_MAX = 12; /* degrees */
  const TILT_SCALE = 1.03;

  function attachTilt(selector, maxDeg, scale) {
    document.querySelectorAll(selector).forEach(card => {
      let rafId = null;

      function applyTilt(clientX, clientY) {
        const r = card.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top  + r.height / 2;
        const dx = (clientX - cx) / (r.width  / 2);
        const dy = (clientY - cy) / (r.height / 2);
        const rotY =  dx * maxDeg;
        const rotX = -dy * maxDeg;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale}) translateZ(0)`;
        });
      }

      card.addEventListener('mousemove', e => {
        applyTilt(e.clientX, e.clientY);
      }, {passive:true});

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
        card.style.transform  = 'perspective(700px) rotateX(0) rotateY(0) scale(1) translateZ(0)';
        setTimeout(() => card.style.transition = '', 500);
        if (rafId) cancelAnimationFrame(rafId);
      }, {passive:true});

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform .1s ease';
      }, {passive:true});
    });
  }

  attachTilt('.testi-card',  TILT_MAX,       TILT_SCALE);
  attachTilt('.ann-card',    TILT_MAX * 0.7, 1.02);
  attachTilt('.amen',        TILT_MAX * 1.2, 1.04);
  attachTilt('.slot',        TILT_MAX * 0.6, 1.02);
  attachTilt('.qr-card',     TILT_MAX * 0.5, 1.02);
})();
 
/* — 3D parallax depth on hero as mouse moves (desktop only) — */
(function heroParallax() {
  // Skip on mobile — touch parallax causes hero to glitch/jump during scroll
  if (window.matchMedia('(pointer:coarse)').matches) return;

  const hero = document.querySelector('.hero');
  const inner = document.querySelector('.hero-inner');
  if (!hero || !inner) return;

  function applyParallax(clientX, clientY) {
    const r = hero.getBoundingClientRect();
    const cx = r.width  / 2;
    const cy = r.height / 2;
    const dx = (clientX - r.left - cx) / cx;
    const dy = (clientY - r.top  - cy) / cy;
    inner.style.transform = `perspective(900px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg) translateZ(8px)`;
    inner.style.transition = 'transform .1s ease';
  }

  hero.addEventListener('mousemove', e => {
    applyParallax(e.clientX, e.clientY);
  }, {passive:true});

  hero.addEventListener('mouseleave', () => {
    inner.style.transition = 'transform .7s cubic-bezier(.34,1.56,.64,1)';
    inner.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
  }, {passive:true});
})();
 
/* — 3D magnetic pull on btn-gold buttons — */
(function magneticButtons() {
  if (!window.matchMedia('(hover:hover)').matches) return;
  document.querySelectorAll('.btn-gold, .btn-ghost').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) * 0.22;
      const dy = (e.clientY - cy) * 0.22;
      btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-3px)`;
    }, {passive:true});
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform .4s cubic-bezier(.34,1.56,.64,1), box-shadow .25s, background .25s';
      btn.style.transform  = '';
      setTimeout(() => btn.style.transition = '', 400);
    }, {passive:true});
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform .1s ease, box-shadow .25s, background .25s';
    }, {passive:true});
  });
})();
 
/* — 3D depth shimmer on slide images in gallery — */
(function slideDepth() {
  if (!window.matchMedia('(hover:hover)').matches) return;
  document.querySelectorAll('.slide').forEach(slide => {
    slide.addEventListener('mousemove', e => {
      const r = slide.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      slide.style.transform = `perspective(1200px) rotateY(${dx * 3}deg) rotateX(${-dy * 2}deg)`;
      slide.style.transition = 'transform .1s ease';
    }, {passive:true});
    slide.addEventListener('mouseleave', () => {
      slide.style.transition = 'transform .5s ease';
      slide.style.transform  = '';
    }, {passive:true});
  });
})();
 
/* — Scroll-driven 3D depth shift on about image — */
(function aboutDepth() {
  if (!window.matchMedia('(hover:hover)').matches) return;
  const wrap = document.querySelector('.about-img-wrap');
  if (!wrap) return;
  wrap.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    wrap.style.transform = `perspective(800px) rotateY(${dx * 6}deg) rotateX(${-dy * 4}deg)`;
    wrap.style.transition = 'transform .1s ease';
  }, {passive:true});
  wrap.addEventListener('mouseleave', () => {
    wrap.style.transition = 'transform .6s cubic-bezier(.34,1.56,.64,1)';
    wrap.style.transform  = '';
  }, {passive:true});
})();
 

/* ── TERMS & CONDITIONS LOGIC ── */
/*
 * AUTH INTEGRATION GUIDE (for when real backend is ready):
 * ─────────────────────────────────────────────────────────
 * Replace the showTermsModal() function body with:
 *
 *   async function showTermsModal() {
 *     try {
 *       const res = await fetch('/api/user/tc-status', { credentials: 'include' });
 *       const data = await res.json();
 *       if (data.tc_accepted) return;  // Returning user — skip modal
 *     } catch(e) { /* network error — show modal to be safe *\/ }
 *     _openTcOverlay();
 *   }
 *
 * Your backend endpoint should:
 *   GET /api/user/tc-status  → { tc_accepted: true/false, accepted_at: ISO_date }
 *   POST /api/tc-consent     → save { user_id, accepted_at, ip, user_agent }
 *
 * Until then, modal shows on every visit (correct behaviour for no-auth state).
 */
function showTermsModal() {
  // ── NO-AUTH MODE (current): always show on every page load / refresh ──
  // When real auth + backend is added, replace this entire function
  // with the async version in the guide above.
  _openTcOverlay();
}

function _openTcOverlay() {
  // Reset checkbox and button state for a fresh display
  const checkbox = document.getElementById('tcConsent');
  const acceptBtn = document.getElementById('tcAcceptBtn');
  if (checkbox) checkbox.checked = false;
  if (acceptBtn) {
    acceptBtn.disabled = true;
    acceptBtn.innerHTML = '<i class="fas fa-check"></i> I Accept &amp; Proceed';
  }

  // Attach checkbox listener to ensure it works
  if (checkbox && acceptBtn) {
    checkbox.addEventListener('change', function() {
      acceptBtn.disabled = !checkbox.checked;
    });
  }

  const overlay = document.getElementById('tcOverlay');
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => overlay.classList.add('tc-visible'));
  });
}


function tcAccept() {
  const checkbox = document.getElementById('tcConsent');
  if (!checkbox || !checkbox.checked) return;

  const acceptBtn = document.getElementById('tcAcceptBtn');
  acceptBtn.disabled = true;
  acceptBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Recording...';

  // Record acceptance with timestamp
  const record = {
    accepted: true,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    page: window.location.href,
    version: 'MJC-TC-v1.0'
  };

  // Save to sessionStorage (current session)
  sessionStorage.setItem('mjc_tc_accepted', JSON.stringify(record));
  // Save to localStorage (persists across sessions)
  localStorage.setItem('mjc_tc_accepted', JSON.stringify(record));

  // Log to console for backend reference
  console.log('✅ MJ Culture T&C Accepted:', record);

  // Simulate a brief confirmation delay, then close
  setTimeout(() => {
    const overlay = document.getElementById('tcOverlay');
    overlay.classList.remove('tc-visible');
    overlay.classList.add('tc-hidden');
    document.body.style.overflow = '';
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 600);
    // Optionally: send to backend via fetch
    // fetch('/api/tc-consent', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(record) })
    //   .catch(err => console.warn('T&C backend log failed:', err));
  }, 800);

  acceptBtn.innerHTML = '<i class="fas fa-check-circle"></i> Accepted!';
}

function tcDecline() {
  // Log decline
  const record = {
    accepted: false,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  };
  console.log('❌ MJ Culture T&C Declined:', record);
  sessionStorage.setItem('mjc_tc_declined', JSON.stringify(record));

  // Hide modal, show rejection screen
  const overlay = document.getElementById('tcOverlay');
  overlay.classList.remove('tc-visible');
  overlay.classList.add('tc-hidden');
  setTimeout(() => {
    overlay.style.display = 'none';
    const rejected = document.getElementById('tcRejected');
    rejected.classList.add('active');
    document.body.style.overflow = 'hidden';
  }, 400);
}

