# Design Guidelines: Event Display Application

## Design Approach
**Selected Approach:** Design System + Custom Animation Layer
- **Foundation:** Material Design 3 principles for data-rich interfaces
- **Enhancement:** Custom animation system for premium feel
- **Inspiration:** Linear's smooth interactions + Spotify's card aesthetics + Apple's fluid transitions

## Core Design Elements

### A. Color Palette

**Dark Mode Primary (Default)**
- Background: 220 25% 8% (deep charcoal)
- Surface: 220 20% 12% (elevated cards)
- Surface Elevated: 220 18% 16% (active cards)
- Primary: 250 85% 65% (vibrant purple-blue)
- Primary Muted: 250 60% 45% (subdued accent)
- Text Primary: 220 10% 95% (crisp white)
- Text Secondary: 220 10% 70% (muted gray)
- Border: 220 15% 22% (subtle separation)

**Light Mode**
- Background: 220 20% 97%
- Surface: 0 0% 100%
- Primary: 250 75% 55%
- Text Primary: 220 30% 15%

### B. Typography

**Font Stack**
- Primary: 'Inter' for UI elements and body text
- Display: 'Manrope' for event titles and headings

**Scale**
- Event Titles: text-2xl font-bold (24px)
- Date Labels: text-sm font-medium uppercase tracking-wider (12px)
- Location: text-base font-normal (16px)
- Descriptions: text-sm leading-relaxed (14px)

### C. Layout System

**Spacing Primitives:** Tailwind units of 4, 6, 8, 12, 16
- Card padding: p-6 to p-8
- Section spacing: gap-6 between elements
- Container margins: mx-4 md:mx-8
- Navigation button spacing: positioned with left-8/right-8

**Card Dimensions**
- Width: Fixed at 380px for consistency
- Height: Auto with min-h-[480px] for uniform appearance
- Aspect ratio: Approximately 4:5 portrait orientation
- Gap between cards: gap-6 in horizontal scroll

### D. Component Library

**Event Cards**
- Rounded corners: rounded-2xl
- Shadow: Layered shadows (shadow-lg + custom glow on hover)
- Border: 1px solid with border color from palette
- Backdrop: Semi-transparent blur effect (backdrop-blur-sm)
- Hover state: Scale up to 1.02, increase shadow intensity

**Navigation Arrows**
- Style: Circular buttons with icon-only design
- Size: w-12 h-12 for comfortable tap targets
- Position: Absolute positioning, vertically centered
- Background: Semi-transparent with backdrop-blur-md
- Icon: Heroicons chevron-left/chevron-right, size 24px
- States: Disabled state when at scroll boundaries

**Data Display Structure**
- Date Badge: Top-left or top-right corner, pill-shaped
- Event Title: Prominent, centered or left-aligned
- Location: Icon + text combination (map pin icon)
- Description: Below location, max 3-4 lines with text-ellipsis

**Loading States**
- Skeleton cards with animated gradient shimmer
- Pulse animation at 1.5s duration

### E. Animation System

**Card Scroll Transitions**
- Smooth scroll behavior with easing: cubic-bezier(0.4, 0, 0.2, 1)
- Duration: 500ms for scroll animations
- Snap points: scroll-snap-align-center for each card

**Micro-interactions**
- Arrow button hover: Scale 1.1, rotate icon 2deg
- Card hover: Transform translateY(-4px) + shadow enhancement
- Card entrance: Staggered fade-in with slide from bottom (100ms delay between cards)
- Active card indicator: Subtle border glow or scale effect

**Transition Specifications**
- Default transition: all 300ms ease-out
- Hover transitions: transform 200ms ease-out
- Scroll container: scroll-behavior smooth with snap

## Images

**Event Card Imagery**
- Each event card should include a background image or header image
- Image dimensions: Full-width within card, aspect ratio 16:9
- Treatment: Subtle gradient overlay (top to bottom) for text readability
- Placement: Top 40% of card with content overlay, or as full card background with dark overlay
- Fallback: Abstract gradient backgrounds when no image available

**No large hero image required** - Focus is on horizontal card scrolling experience

## Special Requirements

**Horizontal Scroll Container**
- Overflow handling: overflow-x-auto with hidden-y
- Scrollbar styling: Custom thin scrollbar or hidden with navigation arrows only
- Container width: Full viewport width minus margins
- Snap behavior: scroll-snap-type-x-mandatory for precise card alignment

**Responsive Behavior**
- Mobile: Reduce card width to 320px, single card view
- Tablet: 2 cards visible
- Desktop: 3+ cards visible with navigation

**Visual Hierarchy**
- Most prominent: Event title and date
- Secondary: Location with icon
- Tertiary: Additional event details
- Use size, weight, and color contrast to establish clear hierarchy