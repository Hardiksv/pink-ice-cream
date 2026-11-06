# Pink Ice Cream — B2B Supplier Website (HTML/CSS/JS Demo)

Front-end design demonstration for a high-volume B2B ice cream manufacturer and cold-chain distributor. Built purely with semantic HTML5, modern CSS3, and vanilla JavaScript (no npm, no frameworks, zero build step).

---

## 🚀 How to Open and Run

1. **Direct Double-Click (`file://`)**:
   - Simply double-click `index.html` in your file explorer.
   - Works fully offline without requiring any local HTTP server or build tools.
   - All scripts use classic deferred loading (`<script defer>`) without ES module imports to maintain complete `file://` compatibility.

2. **Client Review Mode**:
   - Append `?review=1` to any page URL (e.g. `index.html?review=1` or `capacity.html?review=1`).
   - In review mode, yellow badges marked `[sample – client to confirm]` appear next to unverified operational figures, MOQ numbers, transit times, certifications, and placeholders.
   - Without `?review=1`, the site renders clean and production-ready for client executive viewing.

---

## 🛠️ How to Customize

### 1. Change Brand Name in One Place
In [`js/script.js`](js/script.js):
```javascript
const BRAND_NAME = 'Pink Ice Cream';
```
Changing this single variable updates the logo text, footer brand, dialog headers, and prefilled WhatsApp communication templates across every page.

### 2. Update Operational Capacity & Numbers
All operational variables live in the central `CONFIG` object at the top of [`js/script.js`](js/script.js):
```javascript
const CONFIG = {
  brandName: BRAND_NAME,
  phone: '+91 XXXXX XXXXX',
  email: 'supply@pinkicecream.in',
  address: 'Plot 42, Food Park Phase II, Industrial Area, Gujarat 390001, India',
  whatsappNumber: '', // Put international number without plus (e.g. '919876543210')
  capacity: {
    monthlyLitres: 600000,
    dailyLitres: 20000,
    coldStoragePallets: 1200,
    fleetVehicles: 48,
    citiesCovered: 35,
    truckLitres: 3000,
    leadDays: { local: 1, state: 2, other: 4 }
  },
  moq: '500 Litres',
  fssaiNumber: '100XXXXXXXXXXX'
};
```
- **WhatsApp Button**: If `CONFIG.whatsappNumber` is empty (`''`), clicking any WhatsApp button opens an accessible modal with the ready-to-copy commercial message and prompt to insert client's phone number. Once a valid number is provided, clicking directly launches `https://wa.me/<number>`.

### 3. Replace Images with Client Photography
All images reside in `/assets/images/`:
- Factory photos: `hero-factory.webp`, `production-line.webp`, `cold-storage.webp`, `quality-lab.webp`
- Fleet & dispatch: `reefer-truck.webp`, `packing-cartons.webp`
- Customer contexts: `hotel-buffet.webp`, `party-catering.webp`, `cafe-freezer.webp`, `retail-freezer.webp`
- Product group shots: `product-tubs.webp`, `product-bulk.svg`, `product-cups.svg`, `product-cones.svg`, `product-kulfi.svg`, `product-partypacks.svg`

See [`ASSETS.md`](ASSETS.md) for full prompt logs and asset specifications.

---

## 📐 Assumptions

The following design and business assumptions were adopted to build this demo:
1. **Target Persona & Buying Intent**:
   - Buyers are professional procurement heads, hotel F&B directors, banquet caterers, and retail distributors whose primary concern is supply reliability, temperature guarantees (-18°C), and daily batch capacity.
   - The user journey prioritizes **proof of capacity within 5 seconds**, followed by an interactive volume feasibility calculator, and direct RFQ generation.
2. **Mother Plant Location**:
   - Gujarat (Food Park Industrial Corridor) was assumed as the primary manufacturing plant given regional dairy infrastructure, with 5 regional cold-storage transfer hubs (Mumbai MMR, Delhi NCR, Bengaluru, Hyderabad, Kolkata) to serve national routes.
3. **Packaging Standardisation**:
   - Bulk catering assumes 5-litre and 10-litre tubs (compatible with standard commercial dipping cabinets).
   - Retail assortment assumes 500ml pints, 1000ml family bricks, 100ml single-serve cups with spoons in lid, and 120ml crown cones.
4. **Cold Chain Fleet Logistics**:
   - Standard reefer truck payload assumed at 3,000 Litres per vehicle drop to power the volume simulation math in the feasibility tool.

---

## 🔍 Known Gaps / Client to Confirm

Before moving from demo to live public production:
1. **Client Phone & WhatsApp Number**: Currently displays placeholder `+91 XXXXX XXXXX` and copy modal. Client must provide verified commercial sales WhatsApp contact.
2. **Statutory Food Safety Licences**: FSSAI Central License number and ISO/HACCP certificate registration numbers need client's authentic registration IDs.
3. **Exact Plant Address**: Client to confirm registered factory physical address and registered office.
4. **Real Operational Metrics**: Confirm actual daily litre output, cold room pallet capacity, and fleet truck count.
5. **Real Photography**: Replace concept visuals with high-resolution photographs of client's real factory floor, laboratory technicians, and delivery vehicles.

---

## 🎨 Design System & Accessibility

- **Palette**:
  - `--pink`: `#FF6FA5` (hero accents, sticker badges)
  - `--pink-ink`: `#D81B60` (buttons, primary links; white text contrast >= 4.5:1)
  - `--blush`: `#FFE4EE` (warm alternating blocks)
  - `--cream`: `#FFF8F3` (warm light backdrop)
  - `--cocoa`: `#3B1F2B` (deep readable text and dark technical sections)
  - `--frost`: `#E3F4FA` (cold-chain, logistics, and calculator blocks)
  - `--frost-ink`: `#0E4A6B` (deep blue text on cold sections)
  - `--butter`: `#FFE08A` & `--mint`: `#BFE3C0` (accents)
- **Typography**: Display: *Bricolage Grotesque* (700-800); Body: *DM Sans* (400-600). Minimum body text 16px.
- **Motion**: Powered by native `IntersectionObserver` with smooth cubic-bezier easing. Fully respects `prefers-reduced-motion: reduce` with instantaneous visibility and zero parallax/zoom.
- **Form Submissions**: RFQ submissions validate inline, save to `localStorage`, output to browser console, and trigger a celebratory confetti sprinkle without third-party dependencies.
