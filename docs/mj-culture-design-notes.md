# MJ Culture / MJ Farmhouse Design Notes

Source of truth: `mj-(1).zip`, especially `index.html` and `admin.html`.
This document is written to let you rebuild the existing frontend without changing the UI, motion, or section order.

---

## 1) Project identity

**Brand name:** MJ Culture

**Public-facing title:** `MJ Culture – Farmhouse Booking Dahod, Gujarat | Events & Celebrations`

**Brand style:** luxury farmhouse / event venue / wedding-ready / dark gold aesthetic / elegant premium hospitality.

**Core mood words:** premium, warm, ceremonial, luxurious, rustic, intimate, celebratory.

**Primary frontend scope:** one long single-page landing + booking experience in `index.html`.

**Additional page:** `admin.html` for admin login / booking approval.

---

## 2) External assets used by the old build

Images / media files shipped inside the project:

- `logo-clean.png`
- `logo.png`
- `event-photo.jpeg`
- `payment-qr.png`
- `farmhouse.JPEG` (used as the hero / parallax background image in CSS and JS)
- `gallery1.jpeg`
- `gallery2.jpeg`
- `gallery3.jpeg`
- `gallery4.jpeg`
- `gallery5.jpeg`
- `gallery6.jpeg`
- `gallery7.jpeg`
- `gallery9.jpeg`
- `gallery10.jpeg`

Observed image dimensions:

- `logo-clean.png` / `logo.png`: 443×563
- `payment-qr.png`: 306×302
- `event-photo.jpeg`: 896×1200
- gallery images: mostly 1600px wide, mixed heights

---

## 3) Typography

Fonts loaded from Google Fonts:

- `Cinzel`
- `Cormorant Garamond`
- `DM Sans`

Usage pattern:

- **Cinzel**: logo text, navigation brand, badges, slot labels, footer headings
- **Cormorant Garamond**: hero headline, section headings, large numeric/stat typography, premium card titles, payment/QR emphasis
- **DM Sans**: body text, form fields, buttons, helper copy, general UI text

The design is built around contrast between an elegant serif display family and a clean sans body family.

---

## 4) Exact color system

CSS variables in the project:

```css
--ink: #0e0b08;
--soil: #2a1e12;
--bark: #5a3e24;
--wheat: #c9a96e;
--gold: #e2b96a;
--gold-light: #f0d49a;
--cream: #f5f0e8;
--fog: #ede8de;
--stone: #8a7a68;
--white: #fdfaf4;
--green: #3a5436;
--wa: #25d366;
--glass: rgba(253,250,244,0.06);
--glass-border: rgba(201,169,110,0.18);
--shadow-gold: rgba(201,169,110,0.25);
```

Usage notes:

- `--ink` is the deepest site background.
- `--soil` is used for section blocks and darker surfaces.
- `--wheat` is the main brand gold accent.
- `--gold` is the brighter hover / highlight gold.
- `--cream` is the main text color on dark backgrounds.
- `--stone` is muted descriptive text.
- `--glass` and `--glass-border` drive the translucent card style.
- `--wa` is the WhatsApp brand green.

Backdrop style:

- many cards use glassmorphism on top of dark gradients
- border colors are always subtle gold tints, never pure white

---

## 5) Global behavior and page scaffolding

### Base rules

- `html { scroll-behavior: smooth; }`
- `body` uses `DM Sans`, dark background, `--cream` text, and `overflow-x: hidden`
- the whole page has a fixed noise texture overlay using a small embedded SVG filter

### Global overlay effects

- a fixed noise texture sits above everything with `mix-blend-mode: overlay`
- the effect is subtle, low opacity, and always present

### Scroll progress bar

- a 2px fixed bar sits at the top
- gradient: `--bark → --wheat → --gold`
- width updates continuously on scroll

### Loader

- full-screen centered loader overlay
- background: `--soil`
- includes ornament text, brand title, subtitle, vertical line, and small progress bar
- fades out after load using `.done`

### Custom cursor

Desktop only:

- dot cursor
- ring cursor
- glow cursor
- cursor changes on hover-capable devices only
- cursor shrinks / expands on interactive elements

Mobile / coarse pointer:

- custom cursor elements are hidden
- pointer cursor is restored for interactive elements

---

## 6) Navigation system

### Desktop navbar

- fixed at top
- height: `72px`
- padding: `0 2.5rem`
- transparent initially
- becomes dark / blurred on scroll via `nav.scrolled`
- scrolled height: `64px`
- subtle gold border and shadow appear after scroll

### Brand block

- logo container: `44px × 44px`
- rounded `14px`
- logo image uses `object-fit: contain`
- brand name uses `Cinzel`, uppercase, letter-spaced

### Navigation links

- horizontal list
- small uppercase text
- low-opacity cream color by default
- gold hover
- underline animates from width `0` to `100%`

### Mobile nav

- hamburger appears under `768px`
- menu becomes a fixed overlay panel below the navbar
- mobile menu is closed by default
- body scroll is locked while mobile nav is open

Primary anchors used:

- `#home`
- `#about`
- `#gallery`
- `#announcements`
- `#booking`
- `#payment`

---

## 7) Page structure and section order

The old landing page is arranged as:

1. Loader
2. Fixed progress bar
3. Navbar
4. Hero
5. Stats bar
6. About
7. Gallery
8. Parallax band
9. Testimonials
10. Announcements
11. FAQ
12. Booking
13. Payment / QR section
14. Footer
15. Floating WhatsApp button
16. Scroll-to-top button

That order is important. Rebuilding should preserve it.

---

## 8) Hero section

### Layout

- full viewport height: `100vh`
- minimum height: `640px`
- centered content
- text is centered
- background image is `farmhouse.JPEG`
- background image starts slightly zoomed (`scale(1.04)`) then eases to `scale(1)` after load

### Overlay structure

- dark gradient overlay sits above the background image
- bottom fade layer blends the hero into the next section

### Hero content

Exact visible copy:

- eyebrow: `Farmhouse & Events • Dahod, Gujarat`
- H1: `Where Every Celebration Begins`
- subtext: `An exclusive farmhouse retreat crafted for weddings, birthdays, and life's most cherished gatherings — nestled in the heart of Dahod.`
- primary CTA: `Book Your Date`
- secondary CTA: `View Gallery`

### Hero animation timing

The hero content fades up in staggered order:

- eyebrow: `0.3s`
- headline: `0.45s`
- subtext: `0.6s`
- CTA row: `0.75s`

Animation style:

- `fadeUp`
- translateY from `22px`
- fade from `0` to `1`

### Hero extras

- floating particles on hover-capable devices
- ring orbit / decorative motion in hero
- decorative image/logo present in the center area

---

## 9) Stats bar

Placed immediately below the hero.

### Layout

- dark gradient background
- 4-column grid on desktop
- becomes 2-column under `600px`

### Stat items

The stats text is:

- `250+` — `Events Hosted`
- `8+` — `Years of Excellence`
- `1000+` — `Happy Guests`
- `24/7` — `Support & Assistance`

### Styling

- large serif numbers (`Cormorant Garamond`)
- uppercase micro-labels
- separators between columns

---

## 10) About section

### Layout

- two-column grid
- image left, content right on desktop
- collapses to one column under `800px`

### Heading copy

- `A Venue as Elegant as Your Occasion`

### Section copy

The text describes MJ Culture as Dahod’s premier farmhouse venue with lush gardens, premium facilities, and warm hospitality, located on Ukardi Road and featuring an iconic dolphin fountain, premium lighting, and curated event spaces.

### Visual elements

- large framed image with `aspect-ratio: 4 / 5`
- thin outer border frame offset by `12px`
- gold gradient badge pinned bottom-right
- image darkens slightly with overlay at the bottom

### Amenities cards

5 feature cards:

- `Ample Parking`
- `Photo Spots`
- `Catering(optional)`
- `Premium Lighting`
- `Lush Gardens`

Each card includes:

- gold icon
- glass background
- border in gold-tinted transparent line
- lift-on-hover (`translateY(-6px)`)

---

## 11) Gallery section

### Layout

- section background: `--soil`
- large carousel / slider
- width constrained to about `1100px`
- caption overlay on every slide
- thumbnail strip below
- dot controls and arrow controls below the slider

### Slider behavior

- slides are full-width panels
- autoplay every `4500ms`
- swipe gesture supported on touch devices
- arrows navigate previous / next
- dot navigation is clickable
- thumbnails below also act as navigation

### Slider styling

- slide image height: `540px` desktop
- hover zoom on image: `scale(1.03)`
- caption gradient darkens from bottom
- top-left badge uses gold background
- slider transitions use `cubic-bezier(.4,0,.2,1)` and `0.65s`

### Slide contents

The carousel contains 9 gallery items:

1. `Open-Air Event Lawn`
2. `Ridas Boutique`
3. `Glowing Venue Entrance`
4. `Dolphin Fountain at Dusk`
5. `Celestial Nikah Stage`
6. `Whimsical Birthday Hall`
7. `Golden Bridal Seating`
8. `Serene Night Courtyard`
9. `Pure White Nikah Stage`

Each item has a short descriptive caption.

### Lightbox

- clicking a slide opens a lightbox
- lightbox supports:
  - close button
  - previous / next navigation
  - Escape key
  - left / right arrow keys
- background is nearly black with blur
- image max height is `86vh`

---

## 12) Parallax band

A separate full-width visual strip appears after the gallery.

### Layout

- height: `58vh`
- background: `farmhouse.JPEG`
- `background-attachment: fixed`
- dark green / black gradient overlay

### Copy style

- short eyebrow line in uppercase gold
- large serif headline
- emphasized italic word in gold
- small uppercase supporting line

This section functions like a visual break / luxury statement block.

---

## 13) Testimonials section

### Layout

- dark background
- grid of testimonial cards
- 3 cards on desktop

### Card styling

- glass cards
- gold outline accents
- quote icon styling
- star row at top
- small avatar / author block

### Motion

- reveal on scroll
- hover lift and border shift

---

## 14) Announcements section

### Heading copy

- `Announcements`

### Section note

- `More coming soon — follow us on Instagram @mjculturecenterofficial`

### Data rendering

Announcements are populated from a JavaScript array and turned into cards.

### Example items in the script

- `20% off Morning Slots this Summer`
- `Open House Viewing Day`
- `Pool Area Now Ready`
- `Wedding Full-Day Package`
- `Ridas Boutique Now Online`
- `Follow us on Instagram`

### Card styling

- announcement cards are compact glass panels
- each has a type chip (`offer`, `event`, or `new`)
- date is shown on the right side of the metadata row
- cards use scroll reveal

---

## 15) FAQ section

### Heading copy

- `Frequently Asked`

### Questions in the old build

1. `How far in advance should I book?`
2. `Is catering included in the booking price?`
3. `What is the maximum guest capacity?`
4. `Can I visit the venue before booking?`
5. `What is the cancellation policy?`

### Interaction

- accordion style
- only one FAQ item stays open at a time
- click toggles open / close
- answer height animates using `max-height`

### Visual design

- outer card with translucent background
- circular icon button with plus / minus transition
- gold hover states

---

## 16) Booking section

### Heading copy

- `Book the Farmhouse`

### Intro copy

- `Choose your time slot, fill in your details — your booking is confirmed instantly.`

### Pricing row

There are 3 selectable booking cards:

#### 1. Noon
- Time: `12 PM – 3 PM`
- Price: `12,000`
- Advance: `₹3,600`

#### 2. Evening
- Time: `6 PM – 9 PM`
- Price: `15,000`
- Advance: `₹4,500`

#### 3. Full Day
- Time: `12 AM – 10 PM`
- Price: `30,000`
- Advance: `₹9,000`

### Slot design

- glass card
- border radius: `8px`
- padding: `1.8rem 1.4rem`
- hover lift: `translateY(-4px)`
- selected state gets inset gold outline, gold tint background, and a `Selected` badge

### Booking form heading

- `Your Details`

### Form note

- `All fields marked * are required`

### Form fields

- Name (`bName`)
- Phone (`bPhone`)
- Email (`bEmail`)
- Date (`bDate`, hidden input handled by calendar selection)
- Occasion (`bOccasion`)
- Guests (`bGuests`)
- Notes (`bNotes`)

### Occasion options

- `Select occasion…`
- `Wedding`
- `Birthday`
- `Family Event`
- `Engagement`
- `Nikah`
- `Corporate Event`
- `Photoshoot`
- `Other`

### Date picker / availability system

- date is selected through a custom calendar UI
- calendar trigger text: `Choose a date`
- calendar legend: `Available`, `Limited`, `Fully Booked`
- availability panel opens as a popover / drawer depending on viewport
- calendar uses month navigation buttons
- date availability states are shown with small badges

### Booking logic

Frontend fetches availability from:

- `GET /api/bookings/availability`

The calendar is read-only from the frontend side.

Slot state rules:

- noon slot
- evening slot
- full-day slot
- slots can be disabled when booked
- selected slot updates the booking form hidden fields
- selected price updates the advance amount banner

### Advance banner

- shows calculated 30% advance
- same amount is mirrored into the payment section later

### Booking message area

- success / error / info message box below the form
- fades in using the same `fadeUp` motion system

### Submit button

- `Confirm Booking`
- gold filled button styling
- WhatsApp-themed action styling is used in this area

---

## 17) Payment section

### Heading copy

- `Pay with Ease`

### Intro copy

- `Only 30% advance is required to confirm your booking. Scan the QR or use UPI ID to pay instantly via GPay, PhonePe, Paytm, and more.`

### Payment explanation block

Heading:
- `Simple, Secure & Instant Payments`

Supporting copy:
- pay 30% advance now
- remaining 70% collected after the event
- all major UPI apps are accepted

### Steps shown in the UI

1. Select your plan above
2. Scan the QR code
3. Enter your advance amount
4. Share screenshot on WhatsApp

### UPI details

- UPI ID shown in the UI: `8758457909@omni`
- QR card also shows:
  - `MJ Culture`
  - `Scan & Pay`
  - `All UPI Apps Accepted`
  - `Advance Due (30%)`
  - `MJ Culture Farmhouse Dahod, Gujarat • 9313846266`
  - supported badges: `GPay`, `PhonePe`, `Paytm`, `BHIM`

### QR / payment card behavior

- QR card is visually emphasized as a 3D glass card
- there is a scanning line animation
- the UPI deep link gets updated automatically based on selected slot price

### Booking status tracker

Section heading:
- `Your Booking Status`

Stepper labels:
- `Submitted`
- `Paid`
- `Approved`

Button:
- `I Have Completed Payment`

Waiting copy:
- `Waiting for owner approval…`
- `This usually takes a few minutes. This page updates automatically.`

Outcome cards:
- `Booking Confirmed!`
- `Booking Not Approved`

Rejected state includes a WhatsApp contact button.

### Payment / status logic

- after booking submit, a booking ID is created
- the tracker fills in name, date, slot, and advance amount
- the page polls booking status every `5 seconds`
- endpoint used for polling: `GET /api/bookings/:id`
- confirmed status switches tracker state to confirmed
- rejected status switches tracker state to rejected

---

## 18) Footer

### Footer brand copy

- `MJ Culture`
- tag: `Where Everything Begins`
- description: `A serene farmhouse retreat in Dahod, Gujarat — designed for life's most cherished celebrations and moments.`

### Footer columns

#### Navigate

- Home
- About
- Gallery
- Announcements
- Book Farmhouse
- Payment

#### Contact

- `Ukardi Road, opp. Sidharth Nursery, Dahod, Gujarat 389151`
- `9313846266`
- `moizdhilawala99@gmail.com`
- hours line: `Mon–Fri 8AM–6PM • Sat–Sun 10AM–5PM`

### Map

- embedded Google Maps iframe
- grayscale / slightly dimmed appearance

### Footer bottom

- `© 2026 MJ Culture. All Rights Reserved.`
- `Crafted with ❤ in Dahod, Gujarat`

### Social links

- Instagram
- Facebook placeholder
- WhatsApp
- Email

---

## 19) Floating actions

### WhatsApp float button

- fixed bottom-right
- green circular button
- pulsing ring animation
- appears after a short delay
- uses the WhatsApp brand green

### Scroll-to-top button

- fixed bottom-left
- circular gold-tinted button
- appears after scrolling down
- smooth scrolls to top

---

## 20) Animations and motion language

### Reveal classes

- `.fade-in` and `.reveal` are the main scroll-reveal systems
- both begin hidden with translateY and opacity 0
- become visible when intersecting the viewport

### Keyframes present in the build

- `lLine`
- `lFill`
- `scrollPulse`
- `fadeUp`
- `pulse`
- `qrScan`
- `waPop`
- `waRing`
- `stepPulse`
- `spin`
- `float3d`
- `orbFloat`
- `ringExpand`
- `logoBob`

### Motion character

- animations are soft and luxurious, not bouncy
- hover motion uses small upward shifts and scale changes
- transitions are mostly `0.2s` to `0.4s`
- hero background uses a longer `8s` slow zoom transition

---

## 21) Responsive breakpoints

Exact breakpoints found in the stylesheet:

- `900px`
- `800px`
- `768px`
- `600px`
- `480px`
- `400px`

### Main responsive behavior

- `768px`: nav links hide, hamburger appears, section padding tightens, pricing row becomes single-column, form padding reduces
- `800px`: about section becomes single-column
- `600px`: stats become 2-column, hero images / gallery height reduce, footer likely compresses more
- `900px`: footer grid becomes single-column, calendar panel becomes bottom sheet style
- `480px` and `400px`: calendar and compact UI sizes shrink further

---

## 22) Exact spacing and sizing patterns

The site strongly prefers these shapes and spacings:

- section padding: `7rem 1.5rem`
- max content width: about `1100px`
- hero content width: about `740px`
- rounded corners range from `2px` to `14px`
- cards mostly use `8px` or `10px`
- buttons use `4px` to `6px` radius
- thin gold dividers are a repeated motif


---

## 23) Color and surface behavior by area

### Dark background surfaces

- hero background is the darkest layer with warm gradient overlays
- about and booking sections use translucent glass surfaces on dark bases
- gallery and footer remain closer to `--soil` / `--ink`

### Gold accents

Gold appears in:

- headings and label text
- button fills
- card borders on hover
- selected states
- loader line and fill
- slider badges
- FAQ icons
- footer headings
- payment emphasis

### Glass cards

Shared pattern:

- background `var(--glass)`
- border `var(--glass-border)`
- backdrop blur around `8px`–`10px`
- subtle hover lift

---

## 24) Frontend logic hooks worth preserving when rebuilding

These are the pieces that matter when you rewrite the frontend in React + Tailwind:

- `#progress` scroll bar
- `#loader` full-screen intro
- custom cursor elements
- `nav.scrolled` state
- hero background loaded state
- `.fade-in` / `.reveal` observer behavior
- stats counters
- gallery autoplay + arrows + dots + thumbnails
- lightbox open / close / keyboard navigation
- FAQ accordion single-open behavior
- booking slot selection and selected-state badge
- availability fetch + calendar rendering
- advance amount calculation (30% of slot price)
- payment UPI deep-link update
- booking submit → booking ID → status polling
- mobile nav open / close with body scroll lock
- floating WhatsApp button
- scroll-to-top button

---

## 25) Admin page notes (`admin.html`)

The project also contains a separate admin screen.

### Admin identity

- page title: `Admin Panel – MJ Culture`
- same luxury dark-gold system as the user site
- fonts: `DM Sans` and `Cormorant Garamond`

### Admin layout

- centered login card first
- dark translucent panel
- gold logo text
- secure login form

### Admin controls visible in the page

- `Login`
- `Booking Approval`
- `Download Bookings`
- `Logout`
- `Approve`
- `Reject`
- `Back to Dashboard`

### Admin colors

Same family as the user site:

- `#0e0b08`
- `#2a1e12`
- `#c9a96e`
- `#f5f0e8`
- `#fdfaf4`
- `#e2b96a`
- `#4ade80`
- `#ef4444`

---

## 26) Rebuild priority order

To recreate the old UI cleanly in React + Tailwind, build in this order:

1. global theme tokens
2. navbar
3. hero
4. stats bar
5. about section
6. gallery slider + lightbox
7. parallax band
8. testimonials
9. announcements
10. FAQ accordion
11. booking cards + form + calendar
12. payment section + QR card + status tracker
13. footer
14. floating buttons
15. admin page

That order matches the visual hierarchy of the old site and avoids accidental design drift.
