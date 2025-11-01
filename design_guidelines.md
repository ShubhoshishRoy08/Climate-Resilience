# Design Guidelines: AI Disaster Forecasting & Response Platform

## Design Approach

**Selected Approach:** Design System with Emergency Interface Patterns

**Justification:** This is a critical, data-intensive application requiring clarity, speed, and trust. Drawing inspiration from Material Design for robust component patterns, combined with emergency dashboard conventions seen in systems like weather.gov, emergency.gov, and enterprise monitoring platforms (Datadog, Grafana).

**Core Principles:**
- Information hierarchy optimized for crisis situations
- Rapid scanning and decision-making support
- Mobile-first for field accessibility
- Progressive disclosure of complex data
- Trust through clarity and precision

---

## Typography System

**Font Families:**
- Primary: Inter (via Google Fonts CDN) - excellent for data readability
- Monospace: JetBrains Mono - for coordinates, timestamps, technical data

**Type Scale:**
- Hero/Dashboard Titles: `text-4xl font-bold` (36px)
- Section Headers: `text-2xl font-semibold` (24px)
- Alert Titles: `text-xl font-bold` (20px)
- Subsection Headers: `text-lg font-semibold` (18px)
- Body Text: `text-base font-normal` (16px)
- Supporting Data: `text-sm font-medium` (14px)
- Metadata/Timestamps: `text-xs font-normal` (12px)
- Technical Data (coordinates, metrics): `font-mono text-sm`

**Line Heights:** Use Tailwind defaults (`leading-tight` for headers, `leading-relaxed` for body)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **4, 6, 8, 12, 16, 24** (e.g., p-4, gap-6, mb-8, py-12, space-y-16, mt-24)

**Grid Structure:**
- Desktop: 12-column grid with `gap-6`
- Tablet: 8-column grid with `gap-4`
- Mobile: Single column with `gap-4`

**Container Approach:**
- Full-width sections: `w-full` with inner `max-w-7xl mx-auto px-4 md:px-6 lg:px-8`
- Dashboard panels: `max-w-screen-2xl` for data-heavy views
- Content sections: `max-w-6xl`
- Text-only content: `max-w-prose`

**Section Padding:**
- Desktop: `py-16` for major sections, `py-12` for subsections
- Mobile: `py-8` for major sections, `py-6` for subsections

---

## Component Library

### Navigation & Header

**Primary Navigation:**
- Fixed top navigation bar, height `h-16`
- Logo/branding left (height `h-8`)
- Primary navigation items center with `space-x-8`
- User profile and alert notifications right
- Mobile: Hamburger menu with slide-out drawer
- Emergency alert banner below header when active (dismissible)

### Dashboard Layout

**Main Dashboard Structure:**
- Split layout: Left sidebar (fixed, `w-80`) + Main content area
- Sidebar contains: Current location selector, quick stats, active alerts list
- Main area: Interactive map (60% height) + Data panels grid below
- Mobile: Stack vertically with collapsible sections

**Map Interface:**
- Primary interactive element using Leaflet or Mapbox GL
- Full-width container, `h-96 md:h-[600px]`
- Overlay controls: Top-right corner with layer toggles
- Risk zone overlays with opacity controls
- Location markers with severity indicators
- Zoom controls and geolocation button

**Alert Cards:**
- Card-based design with `rounded-lg shadow-lg`
- Header: Severity badge + Disaster type icon + Timestamp
- Body: Affected regions, predicted impact, confidence score
- Footer: Action buttons (View Details, Get Route, Share)
- Padding: `p-6` for desktop, `p-4` for mobile
- Spacing between cards: `space-y-4`

### Data Visualization Panels

**Statistics Grid:**
- 3-column grid on desktop (`grid-cols-1 md:grid-cols-3`)
- Each stat card: Large number (`text-5xl font-bold`), label below (`text-sm uppercase tracking-wide`)
- Icons using Heroicons (24x24 for cards, 20x20 for inline)
- Card padding: `p-8`

**Charts & Graphs:**
- Use Chart.js for time-series data
- Container: `aspect-video` for consistent aspect ratios
- Titles: `text-lg font-semibold mb-4`
- Chart height: `h-64` minimum for readability

**Data Tables:**
- Responsive tables with horizontal scroll on mobile
- Sticky headers
- Row padding: `px-6 py-4`
- Alternating row treatment for scannability
- Sortable columns with indicators

### Forms & Inputs

**Location Registration Form:**
- Vertical form layout with `space-y-6`
- Label above input: `text-sm font-medium mb-2`
- Input fields: `h-12` height, `px-4` padding, `rounded-md`
- Multi-select for disaster types using checkbox groups
- Radius selector using range slider
- Submit button: `h-12 px-8 rounded-md font-semibold`

**Search & Filter:**
- Search bar: `h-10 px-4 rounded-full` with search icon
- Filter dropdowns: `h-10` with chevron indicators
- Tag-based active filters with dismiss buttons

### Alert System

**Emergency Banner:**
- Full-width, positioned below main header
- Height: `h-20` with centered content
- Icon left (`w-6 h-6`), message center, close button right
- Action button: `px-6 py-2 rounded-md font-medium`

**Notification Popups:**
- Bottom-right corner positioning (`fixed bottom-6 right-6`)
- Max-width: `max-w-md`
- Padding: `p-4`
- Auto-dismiss after 8 seconds with progress bar
- Stack multiple notifications with `space-y-3`

### Evacuation Route Display

**Route Optimizer Panel:**
- Two-column layout: Map (70%) + Route list (30%)
- Route cards: Origin → Destination with waypoints
- Show distance, estimated time, safety rating
- Alternative routes collapsed by default
- Step-by-step directions in accordion format
- Print/export buttons

### Analytics Dashboard

**Historical Data Section:**
- Time range selector: Tab-based (Last 7 days, 30 days, 6 months, 1 year)
- Large area chart showing prediction accuracy over time
- Grid of metric cards below: Total predictions, Accuracy rate, Lives saved estimate, Response time average
- Trend indicators with up/down arrows

**Prediction Explainability Panel:**
- Card layout with sections for each prediction factor
- Progress bars showing contribution percentage
- Expandable details for data sources
- Confidence meter: Large circular progress indicator
- Contributing factors list with weighted importance

---

## Accessibility Standards

- Maintain WCAG 2.1 AA compliance minimum
- Focus indicators: `ring-2 ring-offset-2` on all interactive elements
- ARIA labels for all map markers and interactive elements
- Keyboard navigation support for map controls
- Screen reader announcements for new alerts
- Emergency alerts must be perceivable by all users (visual + sound + vibration options)

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px (sm/md)
- Tablet: 768px - 1024px (md/lg)
- Desktop: > 1024px (lg/xl/2xl)

**Mobile Optimizations:**
- Bottom navigation bar for primary actions
- Swipeable alert cards
- Collapsible map (allow users to expand to full screen)
- Stack all multi-column layouts to single column
- Larger touch targets: minimum `h-12` for buttons
- Simplified data visualizations (show key metrics only)

**Progressive Enhancement:**
- Core functionality works without JavaScript
- Map gracefully degrades to static image with location text
- Forms work with standard HTML5 validation

---

## Images

**Hero Section:** No traditional hero - the application opens directly to the interactive dashboard for immediate utility.

**Contextual Images:**
- Satellite imagery thumbnails in data source panels (small, `w-16 h-16 rounded`)
- Disaster type illustrations in onboarding flow (medium, `w-32 h-32`)
- Weather pattern visualizations in prediction panels
- Team photos in About section (if included)
- Educational graphics in Help/FAQ section

All images should convey urgency, professionalism, and scientific credibility. Use high-contrast imagery that remains clear at small sizes.

---

## Animation Guidelines

**Use Sparingly - Only for Critical UX:**
- Map zoom/pan transitions (smooth, 300ms)
- Alert entrance: Slide-in from right (200ms ease-out)
- Loading states: Pulsing skeleton screens
- Data updates: Brief highlight flash (500ms)
- Route drawing on map: Animated path reveal (1s)

**Avoid:**
- Decorative animations
- Parallax effects
- Complex hover states
- Auto-playing animations

---

## Icon Library

**Selected Library:** Heroicons via CDN (https://heroicons.com)

**Icon Sizes:**
- Nav items: `w-5 h-5`
- Cards/panels: `w-6 h-6`
- Large features: `w-12 h-12`
- Alert badges: `w-8 h-8`

**Icon Usage:**
- Disaster types: Custom SVG sprites (flood, cyclone, storm, earthquake, fire)
- UI actions: Heroicons (search, filter, location, menu, close, chevrons)
- Status indicators: Filled circles with inner icons