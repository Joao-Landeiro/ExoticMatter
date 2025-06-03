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

## Milestone 2: Static Site Generator Implementation

### Overview
Converting the podcast website into a static site generator for easier content management and template reuse while maintaining 100% compatibility with the existing site.

### Current Implementation Status
✅ **Step 1 COMPLETED**: Basic project structure and build system
✅ **Step 2 COMPLETED**: Template-based landing page generation

### Step 2 Achievements
- **Guest Data Extraction**: Converted guest information from HTML to structured JSON format (`src/content/guests.json`)
- **Template System**: Created a landing page template (`src/templates/index.html`) that generates dynamic content
- **Enhanced Generator**: Updated build script with:
  - Simple template engine with placeholder replacement
  - Guest card generation from JSON data
  - Space animation script integration
  - Error handling and fallback mechanisms
- **Template Validation**: Successfully generated landing page with all 10 guests and proper formatting
- **Functionality Preservation**: All original features maintained (space animation, smooth scrolling, styling)

### New Project Structure
```
SitePodcastExoticMatter/
├── src/
│   ├── templates/
│   │   ├── base.html          # Base HTML template
│   │   └── index.html         # Landing page template
│   ├── content/
│   │   ├── site.json          # Site configuration
│   │   └── guests.json        # Guest data (NEW)
│   └── assets/                # Static assets
├── build/                     # Generated static site
├── scripts/
│   └── generate.js            # Enhanced build script
└── package.json               # Dependencies and scripts
```

### Build System Features
- **Template Engine**: Simple placeholder replacement system (`{{variable}}` syntax)
- **Dynamic Content**: Guest cards generated from JSON data
- **Asset Management**: Automatic copying of styles, images, and other assets
- **Error Handling**: Graceful fallbacks if templates fail
- **Development Server**: Built-in server for testing

### Available Commands
```bash
npm run build    # Generate static site in build/ directory
npm run dev      # Build and serve site on localhost:8000
npm run clean    # Clean build directory
```

### Development Approach
- **Incremental**: Each step builds on the previous one
- **Safe**: All development on separate Git branch
- **Tested**: Each step includes verification and testing
- **Documented**: Comprehensive comments and documentation

### Next Steps (Step 3)
- Convert episode pages to use templates
- Create episode data structure
- Implement episode page generation
- Add episode navigation and metadata

### Technical Notes
- **Template System**: Uses simple string replacement for maximum compatibility
- **Data Format**: JSON files for easy content management
- **Compatibility**: 100% backward compatible with existing site
- **Performance**: Static generation for optimal loading speeds
- **Maintainability**: Separation of content, templates, and logic

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

## Style Enhancements (Session ending YYYY-MM-DD) <!-- Replace YYYY-MM-DD with current date -->

This session focused on improving text readability and link consistency across the site through several CSS updates:

1.  **Consistent Left Padding for Text:**
    *   Introduced a CSS variable `--text-padding-left: 0.75rem;` in `:root`.
    *   Applied this `padding-left` to general text elements (`h1`, `h2`, `p`) and key text utility classes (`.text-label`, `.text-mono-small`, `.text-heading-primary`, `.text-body`, `.system-status-blink`). This ensures a visually consistent alignment and spacing for most text content.

2.  **Link Color Standardization:**
    *   The default color for all `<a>` (anchor) tags is now set to `var(--accent)` (which is `#613AA0`, a purple shade), providing a consistent brand color for links.
    *   The default text underline for links has been removed (`text-decoration: none;`).
    *   Specific link classes like `.episode-link` and `.guest-box-link` were updated to explicitly use `color: var(--accent);` to ensure they also adhere to this color scheme, overriding previous or inherited styles.

3.  **Vertical Padding for `.text-body`:**
    *   Added `padding-top: 0.5rem;` and `padding-bottom: 0.5rem;` to the `.text-body` class. This gives paragraphs and other elements using this class more vertical spacing, improving readability.

These changes contribute to a more polished and consistent visual experience on the website.