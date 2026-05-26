# MJ Culture / MJ Farmhouse — Design Notes

Source of truth:
- Reference screenshots and screen recording from the old website
- Desktop-first luxury farmhouse booking landing page
- Keep the visual language consistent while rebuilding in React + Tailwind

## 1) Brand / Visual Direction

Overall feel:
- Luxury
- Warm
- Dark
- Premium
- Wedding / celebration venue
- Elegant serif typography with modern sans-serif supporting text

Core mood:
- Black / deep brown backgrounds
- Gold and cream accents
- Soft glows and subtle gradients
- Calm, spacious sections
- High-end venue presentation

## 2) Site Structure

This is a long single-page marketing site with the following sections in order:

1. Navbar
2. Hero
3. Stats strip
4. About / venue introduction
5. Venue highlights / amenities
6. Gallery / image showcase
7. Guest testimonials / CTA banner
8. Announcements
9. FAQ
10. Booking section
11. Payment section
12. Footer

Common UI patterns used throughout:
- Dark section backgrounds alternating between near-black and warm brown
- Gold accent headings and outlines
- Rounded cards
- Subtle borders with low-contrast opacity
- Small uppercase eyebrow labels
- Soft hover transitions
- Floating WhatsApp button at bottom-right

## 3) Layout System

Desktop layout:
- Wide centered container
- Large horizontal breathing room
- Most sections use a two-column layout or a centered single-column layout
- Content stays visually aligned within a consistent max width

Spacing:
- Large vertical spacing between sections
- Sections usually have generous top and bottom padding
- Headings sit above supporting copy with noticeable gap

Cards:
- Rounded corners
- Low-contrast borders
- Dark translucent fills
- Soft shadows or glow-like highlights on hover

## 4) Typography

Headline style:
- Elegant serif display font
- Used for hero title, section titles, and featured statements
- Mix of regular and italic/ornamental emphasis on key words

Body style:
- Clean sans-serif
- Smaller, readable copy
- Often muted cream or beige text

Observed type hierarchy:
- Hero title is very large, centered, and split over multiple lines
- Section titles are medium-large serif headings
- Supporting text is smaller and lighter in weight

## 5) Color Palette

Primary background:
- Near black / deep brown

Secondary background:
- Warm brown / coffee tone

Accent gold:
- Used for buttons, borders, icons, and emphasized words

Text colors:
- Main text: cream / off-white
- Secondary text: muted beige / brown-gray

Support colors:
- Green used for WhatsApp and some status badges
- Very subtle amber glow overlays and vignette lighting

Recommended palette approximation:
- Background: #0e0b08
- Warm panel: #24180f
- Brown panel: #2c1e12
- Gold: #c9a96e
- Light gold: #e2b96a
- Cream: #f5f0e8
- Muted text: #8a7a68
- WhatsApp green: #25d366

## 6) Navbar

Observed behavior:
- Dark header
- Logo on the left
- Navigation links aligned on the right
- Minimal top spacing
- Clean and compact

Navbar links visible in the reference:
- Home
- Gallery
- Events
- FAQ
- Book Now
- About / Contact style items appear in the top area depending on scroll/view

Style:
- Transparent or near-black background
- Small uppercase-like link styling
- Gold/cream text
- Very subtle hover states

## 7) Hero Section

Hero content:
- Centered logo/brand mark above title
- Main headline:
  “Where Every Celebration Begins”
- Supporting paragraph below
- Two CTA buttons below the paragraph

Hero layout:
- Center aligned
- Big empty breathing space around the copy
- Background is dark and atmospheric
- Soft bokeh/light particles visible in the video
- Premium, cinematic presentation

Buttons:
- Primary CTA: gold-filled style
- Secondary CTA: darker outline or dark filled button
- Button labels in the reference:
  - “BOOK YOUR DATE”
  - “VIEW GALLERY”

Hero motion:
- Gentle fade-in / reveal on page load
- Slight staggered appearance of logo, heading, paragraph, and buttons
- Background feels softly animated rather than static

## 8) Stats Strip

Immediately below the hero:
- A full-width or nearly full-width band
- Four stat blocks spaced evenly across the row

Visible stats:
- 250+
- 5000+
- 1
- 1000+

Each stat has:
- Large numeric value
- Small label underneath
- Minimal divider lines between items

Style:
- Dark brown band
- Gold/cream text
- Very restrained, premium presentation

## 9) About Section

Structure:
- Two-column layout
- Large venue image on one side
- Title, body copy, and supporting text on the other

Observed heading:
- “A Venue as Elegant as Your Occasion”

Copy style:
- Paragraph-based introduction
- Premium event-venue language
- Emphasis on weddings / celebrations / memorable experiences

Visual detail:
- Large image card with rounded corners
- Overlaid caption badge on image
- Dark background around the image
- A refined, editorial look

## 10) Venue Highlights / Amenities

This section appears after the about section and uses:
- A large image preview on one side
- Multiple small feature cards on the other side

Visible feature cards include icons and short labels such as:
- Ample Parking
- Stage Area
- Comfortable Seating
- Prayer Space / similar amenity card
- Lawn / Garden
- Food / hospitality-related feature

Style:
- Small dark cards
- Centered icons
- Gold or cream icons
- Even spacing and tidy grid alignment

Section heading:
- “The Venue, Up Close”

## 11) Gallery / Image Showcase

Gallery behavior:
- Large main image
- Thumbnail strip beneath
- Carousel-like feel with image navigation
- One image caption overlay in the lower left
- Card/badge overlay on the active image

Image style:
- Bright, colorful venue photos against the dark UI
- Strong contrast between the gallery image and the dark page background

Interaction:
- Thumbnail selection
- Slide / swap presentation
- Smooth transition between images

## 12) Testimonials / CTA Banner

The testimonial area is preceded by a hero-like statement banner:
- Large centered serif text
- “Every Memory, Eternal” style message
- A gold CTA button centered below the headline

Then below:
- “What Our Guests Say” heading
- Testimonial cards in a row/grid

Testimonial cards:
- Dark cards
- Small stars at top
- Short review text
- Guest name and avatar or initials
- Gentle hover lift

## 13) Announcements

Announcements section:
- Section title “Announcements”
- Grid of multiple cards
- Small category badges on cards
- Short title + description format

Card style:
- Dark brown cards
- Soft borders
- Category labels in green/gold/neutral tones
- Simple readable hierarchy

## 14) FAQ

FAQ section:
- Centered heading
- Accordion list
- One question per row
- Expand/collapse behavior

Observed questions:
- How far in advance should I book?
- Is catering included in the booking rate?
- What is the maximum guest capacity?
- Can I visit the venue before booking?
- What is the cancellation policy?

Style:
- Very minimal
- Thin dividers
- Small plus/expand icon
- Dark background with gold accent on active states

## 15) Booking Section

Title:
- “Book the Farmhouse”

Layout:
- Booking pricing cards on top
- Booking form below

Pricing cards:
- Multiple package options
- Highlighted borders on the selected package
- Large price text
- Small plan labels

Form:
- Dark form panels
- Input fields in rows
- Long form structure
- Booking details section beneath pricing

Form tone:
- Luxury booking form
- Not crowded, but information-dense

## 16) Payment Section

Payment area:
- Heading “Pay with Ease”
- Left side shows instructions / policy points
- Right side shows QR code card

Important detail:
- QR / UPI-style payment card is visually prominent
- Instructions are listed in a numbered or bullet format
- The section is very practical and clearly separated from the marketing sections

Button / action:
- WhatsApp / confirmation style action button appears in the booking/payment flow

## 17) Footer

Footer structure:
- Brand block on the left
- Navigation links in the center
- Contact / address block
- Embedded map image on the right

Footer style:
- Dark brown background
- Small text
- Clean grid layout
- Minimal social icons
- Local address and contact information emphasized

## 18) Persistent Floating UI

Floating WhatsApp button:
- Fixed bottom-right
- Bright green circular button
- Always visible
- Small shadow / glow
- Used across all pages/sections

## 19) Motion / Interaction Rules

Observed motion language:
- Soft fade-ins
- Gentle upward reveals
- Slow staggered section content appearance
- Light hover lifts on cards
- Smooth button transitions
- No harsh motion or aggressive bounce

Animation feel:
- Elegant
- Subtle
- Premium
- Slow enough to feel polished

Recommended durations:
- 200ms–300ms for hover interactions
- 500ms–900ms for section reveals
- Slight stagger between grouped elements

## 20) Tailwind Mapping Notes

Recommended utility patterns:
- Backgrounds: `bg-[#0e0b08]`, `bg-[#24180f]`, `bg-[#2c1e12]`
- Text: `text-[#f5f0e8]`, `text-[#8a7a68]`
- Accent: `text-[#c9a96e]`, `border-[#c9a96e]`
- Cards: rounded large, soft shadow, low-opacity borders
- Containers: wide centered layout with generous side padding
- Buttons: gold filled primary, dark outlined secondary

## 21) React Component Breakdown

Suggested components for the user side:

Layout:
- `MainLayout`
- `Navbar`
- `Footer`
- `Container`

Global UI:
- `PrimaryButton`
- `SecondaryButton`
- `SectionTitle`
- `SectionEyebrow`
- `Card`
- `Badge`
- `Input`
- `Textarea`
- `Accordion`

Sections:
- `Hero`
- `StatsStrip`
- `About`
- `VenueHighlights`
- `Gallery`
- `Testimonials`
- `Announcements`
- `FAQ`
- `Booking`
- `Payment`
- `Footer`

## 22) Rebuild Order

1. Theme tokens
2. Global layout and container
3. Navbar
4. Hero
5. Stats strip
6. About
7. Venue highlights
8. Gallery
9. Testimonials
10. Announcements
11. FAQ
12. Booking
13. Payment
14. Footer
15. Fine-tune spacing and motion

## 23) Notes for the Admin Side

The screenshots mainly cover the user-facing site. The admin side should be built separately as a dashboard and should not copy the marketing page layout. Use the same color language, but switch to:
- Sidebar navigation
- Tables
- Filters
- Booking management cards
- Payment summaries
- Expense / staff modules
- Reports and export tools

## 24) Non-negotiables

- Keep the same dark luxury feel
- Keep the gold accent system
- Do not flatten the UI into a generic light theme
- Keep the hero centered and editorial
- Keep section spacing spacious
- Keep the WhatsApp floating action visible
- Match the card shapes and button style closely
