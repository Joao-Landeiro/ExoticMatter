# Exotic Matter Website

## Milestone 1: Landing Page with Space Travel Effect

### Features
1. **Main Content**
   - Centered content box (70% viewport)
   - Semi-transparent dark background with blur effect
   - Hierarchical typography with large title
   - Responsive layout

2. **Space Travel Animation**
   - **Main Elements**
     - 18 different PNG elements
     - Outward movement from center
     - Full rotation (-180° to 180°)
     - Size and opacity scaling
     - 6-8 second travel duration
     - Spawn every 200-300ms

   - **Space Dust Effect**
     - Small white particles (8x8px)
     - Opacity range: 0.2 to 0.6
     - Faster movement (4-6 seconds)
     - High-frequency spawning (20-40ms)
     - 3 particles per spawn
     - Creates depth perception

3. **Episode Display**
   - Large episode number (3rem) using Instrument Serif font
   - Clean grid layout with title and theme
   - Responsive design for mobile views

4. **Guest Cards**
   - Uniform card design with consistent spacing
   - Three-part layout: status bar, photo area, meta description
   - Mobile-optimized stacked view with 3D perspective
   - Automatic text wrapping for meta descriptions
   - Monospace font for guest numbers and details

### Technical Implementation
- Pure vanilla JavaScript
- CSS animations with custom properties
- Dynamic element creation and cleanup
- Performance optimized with transform animations
- Blur effect for content readability

### Design System
- Dark theme with beige accent
- Font stack: Instrument Serif, Inter, JetBrains Mono
- Consistent spacing and border treatments
- Semi-transparent overlays
- Subtle blur effects

### Files Structure
```
├── index.html
├── styles/
│   ├── main.css
│   └── design-system.css
└── assets/
    └── images/
        └── element1.png through element18.png
```

### Recent Updates
- Enhanced space travel effect with full 360° rotation
- Optimized particle spawn rates and sizes
- Improved episode number visibility with larger font size
- Standardized guest card layouts with better text handling
- Mobile responsiveness improvements
- Resolved mobile guest card layout issues:
    - Addressed height conflicts caused by `position: absolute` and base `min-height` overrides.
    - **Solution:**
        - Ensured `.guests-grid` uses `min-height: auto` in the mobile media query (using increased specificity) to prevent inheriting large base heights.
        - Set calculated `min-height` on `.guests-grid-container` (nested rule, `52rem`) to match the visual stack height + padding.
        - Set calculated `min-height` on `.panel-guests` (`66rem`) to contain the content above the stack + the stack container itself.

### Locked Decisions

#### Mobile-First Grid Implementation
- Base case (mobile) uses `display: block` with absolute positioning
- Grid properties ONLY exist in desktop media query (min-width: 769px)
- Mobile view container dimensions:
  ```css
  width: min(500px, calc(100% - 4rem))
  margin: 0 auto
  padding: 4rem 0
  ```
- Desktop view reverts to grid:
  ```css
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))
  gap: var(--content-margin)
  ```
- Clear separation between mobile and desktop styles to prevent property conflicts

### Next Steps
- Add navigation functionality
- Implement responsive design adjustments
- Add content pages
- Adjust text padding on description text for each guest (`.text-body` padding)
- Create page template for each episode type
    - Make episode pages shareable (unique URLs, meta tags)
    - Consider audio player/clip integration
- Include links to Spotify (or other podcast platforms)
- Include a "Return to Top" link/button
- Include visual indicator for "Season 1"
- Add a section about the host (Joao)
- Add link to the Mesozoic site (in footer or dedicated section)
- Optimize for performance if needed 