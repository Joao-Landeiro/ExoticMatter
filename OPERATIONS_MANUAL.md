# 🎙️ Exotic Matter: Operational Manual

This manual provides instructions on how to manage, upload, and maintain the Exotic Matter podcast website.

---

## 1. Core Technology Stack
- **Framework**: [Astro 5](https://astro.build/) (Static Site Generator)
- **Content**: Stored as JSON files in `src/content/` (Episodes, Guests, Site Settings)
- **CMS**: [Decap CMS](https://decapcms.org/) (accessed via `/admin`)
- **Hosting**: GitHub Pages
- **Deployment**: Automatic via GitHub Actions

---

## 2. Managing Content

### Option A: Using the CMS (Recommended)
1. Navigate to: `https://exoticmatter.space/admin`
2. Log in using your GitHub account.
3. Use the **Collections** sidebar to manage:
   - **Guests**: Add or edit speaker profiles.
   - **Episodes**: Create new episodes and link them to guests.
   - **Site Settings**: Update global site info like description or SEO.
4. Clicking **Publish** in the CMS automatically creates a commit in the GitHub repository.

### Option B: Manual File Management (Git)
If you prefer working directly with files:
- **Guests**: JSON files in `src/content/guests/` (e.g., `nick-himowicz.json`).
- **Episodes**: JSON files in `src/content/episodes/` (e.g., `S1E1_Nick.json`).
- **Images**: Upload guest pictures to `public/assets/images/guest-pictures/`.

---

## 3. Creating a New Episode

### Step 1: Add the Guest
A guest must exist before an episode can reference them.
- Filename should be lowercase and slugified (e.g., `firstname-lastname.json`).
- This filename (without `.json`) becomes the `guestId`.

### Step 2: Add the Episode
- Create the JSON file in `src/content/episodes/`.
- **Required Fields**:
  - `id`: Unique identifier (e.g., `episode-12`). This determines the URL: `/episodes/episode-12`.
  - `guestId`: Must match the guest's filename exactly.
  - `status`: "Published" (visible) or "To be released" (hidden).
  - `publishDate`: ISO 8601 format (e.g., `2026-02-05T10:00:00.000-03:00`).

### Step 3: Format the Transcript
To ensure João and Guests have distinct colors, the transcript field in the JSON must use this HTML structure:

```html
<p class="text-body"> <span class="transcript-meta">[MM:SS] João:</span><br> João's text here...</p>
<p class="text-body"> <span class="transcript-meta">[MM:SS] Guest Name:</span><br> Guest's text here...</p>
```
- **João's Lines**: Must contain exactly `João:` inside the `transcript-meta` span to trigger the custom styling.
- **Guest Lines**: Will automatically receive the default guest styling.

---

## 4. Scheduling and Publishing

### Automatic Publishing
The site checks for new content **every hour** via GitHub Actions.
- If an episode's `publishDate` is in the past, it will be published automatically.
- If it is in the future, the episode remains hidden.

### Manual Force-Publish
To update the site immediately:
1. Go to the **Actions** tab in your GitHub Repository.
2. Select **"Deploy to GitHub Pages"** from the left sidebar.
3. Click the **"Run workflow"** button, select the `main` branch, and click **"Run workflow"**.

---

## 5. Maintenance and Troubleshooting

### ⚠️ GitHub Activity Rule (The 60-Day Pause)
GitHub automatically disables scheduled tasks if there has been no manual code activity (commits) for **60 days**.
- **How to fix**: If the site stops updating, go to the **Actions** tab and click **"Enable workflow"** in the orange notification box.
- **Prevention**: Making any code change or even an "empty commit" resets this timer.

### Local Development
To work on the site locally:
1. `npm install` - Install dependencies.
2. `npm run dev` - Start local server at `http://localhost:4321`.
3. `npm run build` - Test the production build.

---

## 6. Pro-Tips
- **Naming**: Use lowercase and hyphens for IDs and filenames.
- **Images**: Use square aspect ratios for guest pictures for the best layout results.
- **SEO**: Use the `seo` block in episode JSONs to customize sharing images and meta descriptions for social media.

