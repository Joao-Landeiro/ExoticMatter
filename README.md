# Exotic Matter Podcast Website

A static website generator for the Exotic Matter podcast, featuring dynamic content generation from JSON data and modern web design.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Generate the website
npm run build

# The generated files will be in the root directory, ready for GitHub Pages
```

## 🧪 Local Development & Testing

After building the website, you need to run a local server to view it in your browser:

### Method 1: Python Server (Recommended)
```bash
# Start server on port 8080
python3 -m http.server 8080

# View in browser: http://localhost:8080
```

### Method 2: NPX Serve (Alternative)
```bash
# Start server on port 3000
npx serve . -p 3000

# View in browser: http://localhost:3000
```

### Common Issues & Solutions:
- **Port already in use**: Try a different port (8080, 3000, 8000, etc.)
- **Connection refused**: Make sure the server is running and check the correct port
- **To stop server**: Press `Ctrl+C` in the terminal

### Complete Development Workflow:
```bash
# 1. Make changes to templates or content
# 2. Rebuild the site
npm run build

# 3. Start local server
python3 -m http.server 8080

# 4. View changes at http://localhost:8080
# 5. Stop server with Ctrl+C when done
```

##  Project Structure

```
├── src/
│   ├── content/           # JSON data files
│   │   ├── site.json     # Site configuration
│   │   ├── guests.json   # Guest information with season data
│   │   └── episodes/     # Individual episode JSON files
│   └── templates/        # HTML templates
│       ├── base.html     # Base template
│       ├── index.html    # Home page template
│       └── episode.html  # Episode page template
├── scripts/
│   └── generate.js       # Static site generator
├── styles/               # CSS files
├── assets/              # Images and other assets
├── transcripts/         # Raw transcript files
├── update_transcript.py # Generic transcript processing script
└── *.html               # Generated HTML files (in root for GitHub Pages)
```

## 🎯 Features

- **Template-based generation**: Uses Handlebars-style templates for consistent design
- **Dynamic content**: Generates pages from JSON data
- **Season organization**: All episodes and guests include season identification
- **Responsive design**: Modern, mobile-friendly interface
- **GitHub Pages ready**: Files generated directly in root directory
- **Episode management**: Individual JSON files for each episode
- **Guest profiles**: Centralized guest information with episode linking

## 📊 Season Data Structure

All JSON files now include season information for better organization:

### Guest Data (`src/content/guests.json`)
```json
{
  "id": "nick-himowicz",
  "name": "Nick Himowicz",
  "season": 1,
  "episodeNumber": 1,
  "episodeId": "S1E1_Nick",
  "episodeLink": "S1E1_Nick.html"
}
```

### Episode Data (`src/content/episodes/S1E1_Nick.json`)
```json
{
  "id": "S1E1_Nick",
  "season": 1,
  "number": 1,
  "title": "Strategic Tools for Alignment and Clarity",
  "guest": {
    "name": "Nick Himowicz"
  }
}
```

## 🛠️ Development Workflow

1. **Add new episodes**: Create JSON files in `src/content/episodes/`
2. **Update guest list**: Add entries to `src/content/guests.json`
3. **Generate site**: Run `npm run build`
4. **Deploy**: Commit and push to GitHub (files are generated in root for GitHub Pages)

## 📝 Transcript Processing

The project includes a generic Python script for converting raw transcript files into properly formatted HTML for episode JSON files.

### Prerequisites
- Python 3.x installed on your system
- Raw transcript files in the `transcripts/` directory with naming format: `Transcript - {Guest Name}.txt`

### Usage

```bash
# Basic usage
python3 update_transcript.py "Guest Name"

# Examples
python3 update_transcript.py "Jay Malone"
python3 update_transcript.py "Alex James"
python3 update_transcript.py "Dylan Ciaccio"
python3 update_transcript.py "Patrick Kizny"
```

### What the Script Does

1. **Locates Files Automatically**:
   - Finds transcript file: `transcripts/Transcript - {Guest Name}.txt`
   - Finds corresponding JSON file in `src/content/episodes/` by matching the guest's first name

2. **Processes Transcript Format**:
   - Converts speaker lines: `Speaker Name (timestamp)` → HTML with proper styling
   - Formats timestamps: Converts various formats to `[MM:SS]` format
   - Handles continuation content across multiple lines
   - Preserves paragraph structure and content flow

3. **Updates JSON File**:
   - Replaces the `transcript` field with properly formatted HTML
   - Maintains all other episode data unchanged
   - Provides feedback on processing status and final transcript length

### File Structure Requirements

```
transcripts/
├── Transcript - Jay Malone.txt
├── Transcript - Alex James.txt
├── Transcript - Dylan Ciaccio.txt
└── Transcript - Patrick Kizny.txt

src/content/episodes/
├── S1E8_Jay.json
├── S1E5_Alex.json
├── S1E6_Dylan.json
└── S1E7_Patrick.json
```

### Error Handling

The script includes comprehensive error handling:
- **File not found**: Clear error messages if transcript or JSON files don't exist
- **Multiple matches**: Interactive selection when multiple JSON files match a guest name
- **Processing errors**: Detailed error messages for file reading/writing issues
- **Usage help**: Displays usage instructions when run without arguments

### Output Format

The script converts raw transcript text into HTML with consistent styling:

```html
<span class="transcript-meta">[12:34] Speaker Name:</span><br>
Content of what the speaker said goes here.
<p class="text-body">
<span class="transcript-meta">[15:42] Another Speaker:</span><br>
Their response and continued conversation.
</p>
```

### Workflow Integration

After processing transcripts:
1. Run the transcript script: `python3 update_transcript.py "Guest Name"`
2. Rebuild the website: `npm run build`
3. Test locally: `python3 -m http.server 8080`
4. Deploy: Commit and push changes

This ensures that episode pages display properly formatted transcripts with timestamps, speaker identification, and consistent styling throughout the website.

## 📝 Build Process

The build script (`scripts/generate.js`) now generates files directly in the root directory:

- **Selective cleanup**: Only removes generated HTML files, preserves important files like `.git/`, `package.json`, etc.
- **Template rendering**: Uses templates from `src/templates/` with data from `src/content/`
- **Asset management**: Styles and assets are already in the correct location
- **Episode pages**: Generated with naming convention `S{season}E{episode}_{guestFirstName}.html`

## 🌟 Recent Updates

- ✅ Added season identification to all JSON data
- ✅ Updated build process to generate files directly in root directory
- ✅ Eliminated need for manual file copying
- ✅ Improved GitHub Pages deployment workflow
- ✅ Enhanced episode file organization
- ✅ Fixed episode panel consistency between homepage and episode pages
- ✅ Added mobile-responsive layout for episode panels
- ✅ Implemented proper mobile breakpoints for episode content layout

## 🔍 SEO Optimization Plan

### Phase 1: Foundation & Meta Tags (Priority: High)

#### 1.1 Basic Meta Tags Implementation
- **Title Tags**: Unique, descriptive titles for each page (50-60 characters)
  - Homepage: "Exotic Matter Podcast - Knowledge Work Insights & Expert Interviews"
  - Episodes: "Episode {N}: {Guest} on {Topic} | Exotic Matter Podcast"
- **Meta Descriptions**: Compelling descriptions for each page (150-160 characters)
- **Canonical URLs**: Prevent duplicate content issues
- **Language Declaration**: Proper `lang` attribute implementation

#### 1.2 Open Graph & Social Media Tags
```html
<!-- Open Graph Tags -->
<meta property="og:title" content="Episode Title | Exotic Matter">
<meta property="og:description" content="Episode description...">
<meta property="og:image" content="https://exoticmatter.space/assets/images/og-image.jpg">
<meta property="og:url" content="https://exoticmatter.space/episode-url">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Exotic Matter Podcast">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Episode Title">
<meta name="twitter:description" content="Episode description...">
<meta name="twitter:image" content="https://exoticmatter.space/assets/images/twitter-card.jpg">
```

### Phase 2: Structured Data & Schema Markup (Priority: High)

#### 2.1 Podcast Schema Implementation
```json
{
  "@context": "https://schema.org",
  "@type": "PodcastSeries",
  "name": "Exotic Matter",
  "description": "Exploring how AI and global competition are changing knowledge work",
  "url": "https://exoticmatter.space",
  "author": {
    "@type": "Person",
    "name": "João Landeiro"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Exotic Matter"
  }
}
```

#### 2.2 Episode Schema Implementation
```json
{
  "@context": "https://schema.org",
  "@type": "PodcastEpisode",
  "name": "Episode Title",
  "description": "Episode description",
  "url": "https://exoticmatter.space/episode-url",
  "datePublished": "2024-01-01",
  "duration": "PT45M",
  "partOfSeries": {
    "@type": "PodcastSeries",
    "name": "Exotic Matter"
  },
  "associatedMedia": {
    "@type": "MediaObject",
    "contentUrl": "spotify-embed-url"
  }
}
```

#### 2.3 Person Schema for Guests
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Guest Name",
  "jobTitle": "Guest Title",
  "url": "Guest Website",
  "sameAs": ["LinkedIn URL", "Twitter URL"]
}
```

### Phase 3: Content Optimization (Priority: Medium)

#### 3.1 Heading Structure Optimization
- **H1**: One per page, descriptive and keyword-rich
- **H2-H6**: Logical hierarchy, descriptive subheadings
- **Keywords**: Natural integration without stuffing

#### 3.2 Image Optimization
- **Alt Text**: Descriptive alt attributes for all images
- **File Names**: SEO-friendly image file names
- **Image Compression**: Optimize file sizes for faster loading
- **Responsive Images**: Implement srcset for different screen sizes

#### 3.3 Internal Linking Strategy
- **Episode Cross-linking**: Link related episodes
- **Topic Clustering**: Group episodes by themes
- **Breadcrumb Navigation**: Implement breadcrumbs for better navigation
- **Anchor Links**: Deep linking to specific transcript sections

### Phase 4: Technical SEO (Priority: Medium)

#### 4.1 Site Performance
- **Core Web Vitals**: Optimize LCP, FID, and CLS
- **Image Optimization**: WebP format, lazy loading
- **CSS/JS Minification**: Reduce file sizes
- **Caching Strategy**: Implement proper cache headers

#### 4.2 Site Structure
- **XML Sitemap**: Generate and submit to search engines
- **Robots.txt**: Proper crawling instructions
- **URL Structure**: Clean, descriptive URLs
- **404 Page**: Custom 404 with navigation options

#### 4.3 Mobile Optimization
- **Mobile-First Design**: Ensure mobile responsiveness
- **Touch Targets**: Proper button and link sizing
- **Viewport Configuration**: Correct viewport meta tag
- **Mobile Speed**: Optimize for mobile performance

### Phase 5: Advanced SEO Features (Priority: Low)

#### 5.1 Rich Snippets & Enhanced Results
- **FAQ Schema**: For common questions about episodes
- **Review Schema**: If implementing episode ratings
- **Event Schema**: For live podcast recordings
- **Video Schema**: If adding video content

#### 5.2 Content Enhancement
- **Transcript Optimization**: SEO-friendly transcript formatting
- **Episode Summaries**: Detailed, keyword-rich summaries
- **Show Notes**: Comprehensive episode notes with links
- **Guest Bios**: Detailed guest information pages

#### 5.3 User Experience Signals
- **Related Episodes**: Suggest similar content
- **Search Functionality**: Internal site search
- **Newsletter Signup**: Email list building
- **Social Sharing**: Easy sharing buttons

### Implementation Timeline

#### Week 1-2: Foundation Setup
- [ ] Implement basic meta tags for all pages
- [ ] Add Open Graph and Twitter Card tags
- [ ] Set up canonical URLs
- [ ] Create basic XML sitemap

#### Week 3-4: Schema Implementation
- [ ] Add Podcast and PodcastEpisode schema
- [ ] Implement Person schema for guests
- [ ] Add Organization schema
- [ ] Test structured data with Google's Rich Results Test

#### Week 5-6: Content Optimization
- [ ] Optimize heading structure across all pages
- [ ] Add descriptive alt text to all images
- [ ] Implement internal linking strategy
- [ ] Optimize transcript formatting for SEO

#### Week 7-8: Technical Implementation
- [ ] Optimize site performance and Core Web Vitals
- [ ] Implement proper robots.txt
- [ ] Set up Google Search Console and Analytics
- [ ] Create custom 404 page

### Target Keywords Strategy

#### Primary Keywords
- "knowledge work podcast"
- "business innovation interviews"
- "strategic tools podcast"
- "exotic matter podcast"

#### Long-tail Keywords
- "business model canvas expert interview"
- "innovation coaching strategies"
- "knowledge work transformation"
- "strategic alignment tools"

#### Episode-Specific Keywords
- Based on guest expertise and episode topics
- Industry-specific terms and methodologies
- Guest names and their specializations

### Measurement & Analytics

#### Key Metrics to Track
- **Organic Traffic**: Google Analytics organic sessions
- **Search Rankings**: Position tracking for target keywords
- **Click-Through Rates**: Search Console CTR data
- **Core Web Vitals**: PageSpeed Insights scores
- **Rich Results**: Structured data performance

#### Tools for Monitoring
- Google Search Console
- Google Analytics 4
- PageSpeed Insights
- Screaming Frog (for technical audits)
- Ahrefs or SEMrush (for keyword tracking)

### Content Calendar Integration

#### SEO-Driven Content Planning
- **Keyword Research**: Before each episode, research relevant keywords
- **Topic Clustering**: Group episodes around related themes
- **Seasonal Content**: Plan episodes around industry events or trends
- **Guest Selection**: Consider SEO value of guest expertise and following

This SEO plan will transform the Exotic Matter podcast website into a search engine powerhouse, driving organic traffic and establishing authority in the knowledge work and business innovation space.

## 📝 Transcript Formatting Guide

### Overview
This guide provides step-by-step instructions for converting raw transcript files into the HTML format used in episode pages. Follow these instructions to ensure consistency across all episodes.

### Current Transcript Status
- **Episodes with transcripts**: S1E1_Nick, S1E2_Spencer
- **Episodes needing formatting**: S1E9_Kurt (raw transcript available in `transcripts/` folder)
- **Episodes missing transcripts**: S1E0, S1E3-S1E8

### Raw Transcript Format (Input)
Raw transcripts are typically formatted as:
```
João (00:14)
Hello everyone, welcome to Exotic Matter, which is a podcast series...

Kurt (00:51)
Good, good.

João (01:10)
... to really to the next level. Sometimes we see this from the perspective...
```

### Target HTML Format (Output)
Transcripts should be converted to this HTML structure:
```html
<p class="text-body"> <span class="transcript-meta">[00:14] João:</span><br> Hello everyone, welcome to Exotic Matter, which is a podcast series...</p>

<p class="text-body"> <span class="transcript-meta">[00:51] Kurt:</span><br> Good, good.</p>

<p class="text-body"> <span class="transcript-meta">[01:10] João:</span><br> ... to really to the next level. Sometimes we see this from the perspective...</p>
```

### Step-by-Step Conversion Process

#### Step 1: Prepare the Raw Transcript
1. **Clean up the text**: Remove any extra line breaks or formatting inconsistencies
2. **Verify speaker names**: Ensure consistent spelling (João, not Joao)
3. **Check timestamps**: Ensure they follow the (MM:SS) format

#### Step 2: Format Conversion Rules

##### 2.1 Timestamp Format
- **From**: `(00:14)` (parentheses)
- **To**: `[00:14]` (square brackets)

##### 2.2 Speaker Format
- **From**: `João (00:14)`
- **To**: `[00:14] João:`

##### 2.3 HTML Structure
Each speaker turn should be wrapped in:
```html
<p class="text-body"> <span class="transcript-meta">[TIMESTAMP] SPEAKER:</span><br> CONTENT</p>
```

#### Step 3: Detailed Conversion Instructions

##### 3.1 Basic Pattern Replacement
Use find-and-replace (regex recommended) to convert:

1. **Convert timestamp format**:
   - Find: `\((\d{2}:\d{2})\)`
   - Replace: `[\1]`

2. **Convert speaker lines**:
   - Find: `^([A-Za-z]+) \[(\d{2}:\d{2})\]$`
   - Replace: `<p class="text-body"> <span class="transcript-meta">[\2] \1:</span><br> `

3. **Handle content lines**:
   - Add content after the `<br> ` tag
   - Close each paragraph with `</p>`

##### 3.2 Manual Steps
1. **Wrap each speaker turn**: Each time someone speaks, it should be one `<p>` element
2. **Add line breaks**: Use `<br>` for natural speech pauses within the same speaker turn
3. **Handle interruptions**: Keep short interjections as separate paragraphs
4. **Clean up spacing**: Remove extra spaces and ensure consistent formatting

#### Step 4: Quality Checks

##### 4.1 Validation Checklist
- [ ] All timestamps are in `[MM:SS]` format
- [ ] All speaker names are consistent and properly capitalized
- [ ] Each speaker turn is wrapped in `<p class="text-body">` tags
- [ ] Timestamp and speaker are in `<span class="transcript-meta">` tags
- [ ] Content follows `<br>` tag
- [ ] All paragraphs are properly closed with `</p>`
- [ ] No orphaned HTML tags

##### 4.2 Common Issues to Watch For
- **Missing closing tags**: Ensure every `<p>` has a `</p>`
- **Inconsistent speaker names**: João vs Joao, Nick vs Nicholas
- **Malformed timestamps**: [0:14] should be [00:14]
- **Missing line breaks**: Content should follow `<br>` immediately

#### Step 5: Integration Process

##### 5.1 Locate Transcript Section
In the episode HTML file, find the transcript container:
```html
<div class="form-space-transcript-content form-space" data-section="transcript" data-type="content">
    <!-- INSERT FORMATTED TRANSCRIPT HERE -->
</div>
```

##### 5.2 Replace Content
1. **Backup the file**: Always create a backup before editing
2. **Remove placeholder content**: Clear any existing content in the transcript container
3. **Insert formatted transcript**: Paste the converted HTML
4. **Test locally**: Run local server to verify formatting

#### Step 6: Testing and Validation

##### 6.1 Local Testing
```bash
# Start local server
python3 -m http.server 8080

# If port 8080 is in use, try alternative:
python3 -m http.server 3000
# or
npx serve . -p 3000
```

##### 6.2 Visual Checks
- [ ] Timestamps display correctly with proper styling
- [ ] Speaker names are bold and properly formatted
- [ ] Content flows naturally with appropriate line breaks
- [ ] No HTML tags are visible in the rendered page
- [ ] Transcript section scrolls properly on mobile

##### 6.3 Accessibility Checks
- [ ] Screen readers can navigate between speakers
- [ ] Timestamps are properly associated with content
- [ ] Text contrast meets accessibility standards

### Example Conversion

#### Before (Raw):
```
João (00:14)
Hello everyone, welcome to Exotic Matter, which is a podcast series I'm creating with some friends from the internet.

Kurt (00:51)
Good, good.

João (01:10)
... to really to the next level. Sometimes we see this from the perspective of just content, but I think Kurt does it from a deeper understanding.
```

#### After (HTML):
```html
<p class="text-body"> <span class="transcript-meta">[00:14] João:</span><br> Hello everyone, welcome to Exotic Matter, which is a podcast series I'm creating with some friends from the internet.</p>

<p class="text-body"> <span class="transcript-meta">[00:51] Kurt:</span><br> Good, good.</p>

<p class="text-body"> <span class="transcript-meta">[01:10] João:</span><br> ... to really to the next level. Sometimes we see this from the perspective of just content, but I think Kurt does it from a deeper understanding.</p>
```

### Tools and Resources

#### Recommended Text Editors
- **VS Code**: With regex find-and-replace support
- **Sublime Text**: Excellent for large file handling
- **Vim/Emacs**: For advanced regex operations

#### Useful Regex Patterns
```regex
# Convert timestamps
Find: \((\d{2}:\d{2})\)
Replace: [\1]

# Find speaker lines
Find: ^([A-Za-z]+) \[(\d{2}:\d{2})\]
Replace: <p class="text-body"> <span class="transcript-meta">[\2] \1:</span><br> 

# Clean up extra spaces
Find: \s+
Replace: (single space)
```

#### Automation Opportunities
Consider creating a script for future transcripts:
- Python script to automate the conversion process
- Template for consistent formatting
- Validation script to check for common errors

### Troubleshooting

#### Common Problems and Solutions

**Problem**: Port already in use when testing locally
```bash
# Solution: Use a different port
python3 -m http.server 3000
# or kill the process using port 8080
lsof -ti:8080 | xargs kill -9
```

**Problem**: HTML tags showing in the rendered page
- **Solution**: Check for unescaped characters or malformed tags

**Problem**: Inconsistent timestamp formatting
- **Solution**: Use regex to standardize all timestamps before conversion

**Problem**: Missing speaker names in transcript
- **Solution**: Review raw transcript and add missing speaker identifications

This guide ensures consistent, high-quality transcript formatting across all episodes while maintaining SEO benefits and accessibility standards.

## 🚀 Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch. Files are generated directly in the root directory, so GitHub Pages serves them immediately without additional configuration.

**Live site**: https://exoticmatter.space