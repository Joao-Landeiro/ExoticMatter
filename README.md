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

### Episode Updates

*   **S1E1_Nick.html**: Added the full HTML transcript for the episode featuring Nick Himowicz.
*   **S1E4_Florian.html**: Added the full HTML transcript for the episode featuring Florian Heinrichs.
*   **S1E2_Spencer.html**: Added the full HTML transcript for the episode featuring Spencer Ayres.
*   **S1E6_Dylan.html**: Added the full HTML transcript for the episode featuring Dylan Ciaccio.
*   **S1E7_Patrick.html**: Added the full HTML transcript for the episode featuring Patrick Kizny.
*   **S1E9_Kurt.html**: Added the full HTML transcript for the episode featuring Kurt Bostelaar.
- **Episode S1E6 (Dylan Ciaccio):** Located `S1E6_Dylan.html`, removed placeholder. Used temporary file `temp_S1E6_transcript.md` for full transcript. Initial full insertion and reapply failed. Resorting to chunking, first chunk succeeded, second failed. Reapply of second chunk caused data loss in the target div. After confirming div was empty, successfully inserted transcript in 11 chunks. Deleted temporary file.

### Episode S1E3 (Danilo Kreimer)
- Located `S1E3_Danilo.html` and read its content.
- Identified and removed the placeholder comment `<!-- Transcript content will be dynamically loaded or manually inserted here -->` from the transcript section.
- Created a temporary file `temp_S1E3_transcript.md` and pasted the full HTML transcript into it.
- Attempted to insert the full transcript from the temporary file into `S1E3_Danilo.html`. This initially appeared to fail ("no changes made") but a subsequent read of the target HTML file showed the content was inserted, albeit with a nested `panel-transcript` div structure.
- Corrected the HTML structure in `S1E3_Danilo.html` by replacing the content of the `div.form-space-transcript-content` with only the `<p>` tags from the transcript, resolving the nesting issue.
- Deleted the temporary file `temp_S1E3_transcript.md`.

### Episode S1E5 (Alex James)

- Located `S1E5_Alex.html`.
- Removed placeholder comment `<!-- Transcript will be added later -->`.
- Encountered issues inserting the full transcript provided by the user using `edit_file` (reported "no changes made") and subsequent `reapply` failed.
- Reset the process by deleting the corrupted `S1E5_Alex.html` and recreating it with the base structure.
- Re-attempted transcript insertion using a chunking method, replacing the entire content of the transcript `div` in each step to ensure proper insertion.
- Successfully inserted the full transcript in stages.
- Deleted temporary transcript file `temp_S1E5_transcript.md`.
- Corrected a nested `panel-transcript` div issue in `S1E5_Alex.html` by replacing the content of the correct transcript `div` with only the clean `<p>` tags.