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

## 📁 Project Structure

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

## 🚀 Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch. Files are generated directly in the root directory, so GitHub Pages serves them immediately without additional configuration.

**Live site**: https://exoticmatter.space