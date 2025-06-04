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
✅ **Step 2.1 COMPLETED**: Episode data modularization and build script updates

### Step 2.1 Achievements - Episode Data Modularization
- **Individual Episode Files**: Successfully converted from single `episodes.json` to individual JSON files:
  - `src/content/episodes/S1E0_Intro.json` through `src/content/episodes/S1E9_Kurt.json`
  - Each file contains complete episode data (metadata, guest info, topics, summaries, etc.)
  - Maintains all existing data structure and compatibility

- **Enhanced Build Script**: Updated `scripts/generate.js` with new `loadEpisodes()` function:
  - **Automatic Discovery**: Scans `src/content/episodes/` directory for JSON files
  - **Robust Loading**: Loads and parses each episode file individually
  - **Smart Sorting**: Automatically sorts episodes by episode number (0, 1, 2, etc.)
  - **Error Handling**: Continues loading other files if one fails
  - **Fallback Support**: Falls back to original `episodes.json` if individual files aren't found
  - **Detailed Logging**: Comprehensive console output for debugging and verification

- **Backward Compatibility**: 
  - Build script maintains full compatibility with existing templates
  - Generated site is identical to previous version
  - All episode data properly loaded and sorted
  - No breaking changes to existing functionality

- **Verification Results**:
  - ✅ Successfully loads all 10 episode files
  - ✅ Episodes correctly sorted (S1E0 → S1E9)
  - ✅ Landing page generates with proper episode order
  - ✅ Individual episode pages generate correctly
  - ✅ All assets and styling preserved

## Milestone 3: Individual Episode Pages System

### Overview
Complete implementation of individual episode pages with template-based generation, explicit naming conventions, and flexible guest links system.

### Implementation Status
✅ **Step 3.1 COMPLETED**: Episode template creation and page generation
✅ **Step 3.2 COMPLETED**: Flexible links system implementation

### Step 3.1 Achievements - Episode Template System
- **Episode Template**: Created `src/templates/episode.html` with:
  - Dynamic episode title format: "S{season}E{episode} - {title} | Exotic Matter"
  - Comprehensive episode metadata display (number, title, status, summary)
  - Guest information panel with photo and topics
  - Spotify player integration
  - Transcript section with full conversation content
  - Space animation effects matching the landing page

- **Explicit Naming Convention**: Episode pages use clear, consistent filenames:
  - Format: `S{season}E{episode}_{guestFirstName}.html`
  - Examples: `S1E1_Nick.html`, `S1E2_Spencer.html`, `S1E6_Dylan.html`
  - Enables easy identification and direct access to episode pages

- **Template Generation Logic**: Enhanced `generateEpisodePages()` function:
  - Loads episode template and processes individual JSON files
  - Generates dynamic content sections (topics, Spotify, transcripts)
  - Handles missing optional content gracefully
  - Creates properly formatted episode pages with all metadata

### Step 3.2 Achievements - Flexible Links System
- **New JSON Structure**: Converted guest links from static objects to flexible arrays:
  ```json
  // Old format (static):
  "links": {
    "linkedin": "https://linkedin.com/in/username",
    "website": "https://example.com"
  }
  
  // New format (flexible):
  "links": [
    { "text": "LinkedIn", "url": "https://linkedin.com/in/username" },
    { "text": "Personal Website", "url": "https://example.com" },
    { "text": "YouTube Video", "url": "https://youtube.com/watch?v=..." }
  ]
  ```

- **Custom Link Text Support**: Each guest can now have personalized link descriptions:
  - Dylan: "LinkedIn", "Focus The Lens", "YouTube Video"
  - Patrick: "LinkedIn", "Website", "Projects"
  - Jay: "LinkedIn", "Website", "Newsletter"
  - Kurt: "LinkedIn", "Leverlo", "Newsletter"

- **Dynamic Link Generation**: New `generateEpisodeLinks()` function:
  - Processes flexible link arrays from episode JSON
  - Generates proper HTML with custom text and URLs
  - Maintains consistent styling and accessibility features
  - Handles varying numbers of links per guest

- **Template Integration**: Updated episode template system:
  - Added `<!-- EPISODE_LINKS -->` placeholder in template
  - Integrated link generation into build process
  - Maintains backward compatibility with existing episodes

### Updated All Episode Files
Successfully converted all 10 episode JSON files to the new flexible links format:
- ✅ S1E0_Intro.json - João (LinkedIn, Mesozoic, Newsletter)
- ✅ S1E1_Nick.json - Nick (LinkedIn, Website)
- ✅ S1E2_Spencer.json - Spencer (LinkedIn, Website)
- ✅ S1E3_Danilo.json - Danilo (LinkedIn, Website)
- ✅ S1E4_Florian.json - Florian (LinkedIn, Website)
- ✅ S1E5_Alex.json - Alex (LinkedIn, Website)
- ✅ S1E6_Dylan.json - Dylan (LinkedIn, Focus The Lens, YouTube Video)
- ✅ S1E7_Patrick.json - Patrick (LinkedIn, Website, Projects)
- ✅ S1E8_Jay.json - Jay (LinkedIn, Website, Newsletter)
- ✅ S1E9_Kurt.json - Kurt (LinkedIn, Leverlo, Newsletter)

### Key Features
- **Template-Based Generation**: All episode pages generated from templates
- **Explicit File Naming**: Clear, consistent naming convention for easy navigation
- **Flexible Guest Links**: Custom link text and URLs for each guest
- **Dynamic Content**: Handles optional content (transcripts, Spotify) gracefully
- **Space Animation**: Consistent visual effects across all pages
- **Mobile Responsive**: Optimized for all device sizes
- **Accessibility**: Proper link attributes and semantic HTML

### Technical Implementation
- **Template System**: String replacement with dynamic content generation
- **Build Process**: Automated generation of all episode pages
- **Error Handling**: Graceful handling of missing content
- **Performance**: Static generation for optimal loading speeds
- **Maintainability**: Modular functions for different content sections

### Verification Results
- ✅ All 10 episode pages generate successfully
- ✅ Custom link text displays correctly for each guest
- ✅ Flexible links work across all episodes
- ✅ Template system handles missing content gracefully
- ✅ Space animations work on all episode pages
- ✅ Mobile responsiveness maintained
- ✅ Episode page headers now match landing page episode panel format

### Updated Project Structure
```
SitePodcastExoticMatter/
├── src/
│   ├── templates/
│   │   ├── base.html          # Base HTML template
│   │   ├── index.html         # Landing page template
│   │   └── episode.html       # Episode page template (NEW)
│   ├── content/
│   │   ├── episodes/          # Individual episode files
│   │   │   ├── S1E0_Intro.json
│   │   │   ├── S1E1_Nick.json
│   │   │   ├── S1E2_Spencer.json
│   │   │   ├── S1E3_Danilo.json
│   │   │   ├── S1E4_Florian.json
│   │   │   ├── S1E5_Alex.json
│   │   │   ├── S1E6_Dylan.json
│   │   │   ├── S1E7_Patrick.json
│   │   │   ├── S1E8_Jay.json
│   │   │   └── S1E9_Kurt.json
│   │   ├── site.json          # Site configuration
│   │   ├── guests.json        # Guest data
│   │   └── episodes.json      # Legacy file (kept for fallback)
│   └── assets/                # Static assets
├── build/                     # Generated static site
│   ├── index.html            # Generated landing page
│   ├── S1E0_Intro.html       # Generated episode pages
│   ├── S1E1_Nick.html
│   ├── S1E2_Spencer.html
│   ├── S1E3_Danilo.html
│   ├── S1E4_Florian.html
│   ├── S1E5_Alex.html
│   ├── S1E6_Dylan.html
│   ├── S1E7_Patrick.html
│   ├── S1E8_Jay.html
│   ├── S1E9_Kurt.html
│   ├── assets/               # Copied static assets
│   └── styles/               # Copied stylesheets
├── scripts/
│   └── generate.js            # Complete build script with episode generation
└── package.json               # Dependencies and scripts
```

### Build System Enhancements
- **Modular Episode Loading**: New `loadEpisodes()` function replaces direct JSON file loading
- **Episode Page Generation**: Complete `generateEpisodePages()` function with template system
- **Flexible Links System**: Dynamic link generation with custom text support
- **Template Processing**: String replacement with dynamic content sections
- **Improved Maintainability**: Each episode can be edited independently
- **Better Version Control**: Individual files create cleaner Git diffs
- **Scalable Architecture**: Easy to add new episodes without modifying existing files

## Step 3.2: Episode Page Header Consistency and Layout Fix

### Implementation Details
- **Header Format**: Updated episode page headers to match landing page format
  - Changed from "Status: Episode {{episode.status}}" to "Episode Status:<br>{{episode.status}}"
  - Maintained consistent episode number and title structure
  
- **Layout Structure**: Fixed episode page layout to match landing page side-by-side format
  - **Left side**: Episode content (summary and links)
  - **Right side**: Guest information (name, photo, topic bars)
  - Previously all content was stacked vertically, now matches landing page layout

- **Section Spacing**: Fixed spacing between episode sections to match landing page format
  - Moved Spotify and Transcript sections outside the main episode panel
  - Now each section (Episode, Spotify, Transcript) is a separate grid item
  - Proper 2rem spacing between sections using CSS grid gap
  - Consistent visual hierarchy and breathing room between content sections

### Verification Results
- ✅ All episode pages generated successfully
- ✅ Episode page headers now match landing page format perfectly
- ✅ Episode page layout now uses correct side-by-side structure
- ✅ Guest photos positioned correctly on the right side
- ✅ Proper spacing between episode sections (Episode → Spotify → Transcript)
- ✅ Consistent visual design across landing page and episode pages

### Technical Changes Made
1. **Episode Template Structure**: Restructured `src/templates/episode.html` to separate content and meta sections
2. **Header Format**: Updated episode status display format
3. **Layout Consistency**: Ensured episode pages mirror landing page panel structure
4. **Section Separation**: Moved Spotify and Transcript sections to be independent grid items with proper spacing

The Exotic Matter podcast website now has complete visual and structural consistency between the landing page and individual episode pages.

### JSON Structure

Each episode JSON file contains:
- **Basic Info**: `id`, `title`, `guest`, `summary` (description and guest info)
- **Content**: `topics` (detailed discussion points), `shortTopics` (brief versions for colored bars)
- **Links**: `episodeLink`, `spotifyUrl`, `transcript`
- **Assets**: Guest photo path and other media references

**Note**: The `shortTopics` field provides concise versions of the topics specifically for the colored bars displayed under the guest photo. If `shortTopics` is not provided, the system falls back to using the regular `topics` array.