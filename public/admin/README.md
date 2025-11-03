# Decap CMS Setup Guide

## What is Decap CMS?

Decap CMS provides a user-friendly interface for editing your podcast episodes, guest information, and site settings. All changes are saved directly to your JSON files in the repository.

## Quick Start

### Local Development (Test Mode)

For local testing without authentication:

1. Edit `config.yml` and uncomment the test-repo backend:
```yaml
backend:
  name: test-repo
```

2. Comment out the git-gateway backend:
```yaml
# backend:
#   name: git-gateway
#   branch: experiments-with-layout
```

3. Go to `http://localhost:4321/admin`
4. You can now edit content without logging in

### Production Setup (Netlify)

If deploying to Netlify:

1. Enable Netlify Identity in your Netlify dashboard:
   - Go to Site Settings > Identity
   - Click "Enable Identity"
   
2. Enable Git Gateway:
   - Go to Identity > Services > Git Gateway
   - Click "Enable Git Gateway"

3. Invite yourself:
   - Go to Identity tab
   - Click "Invite users"
   - Enter your email

4. Visit your deployed site and click the Identity widget to sign up

5. Once logged in, go to `https://yourdomain.com/admin`

## Features

### Episodes Management
- Create new episodes with all metadata
- Upload guest pictures
- Add episode links and Spotify embeds
- Paste full transcripts
- Schedule future releases

### Editorial Workflow
- Draft mode: Create episodes without publishing
- Review: Preview changes before going live
- Publish: Make episodes live on your site

### Scheduling
Set a "Publish Date" on episodes to schedule them for future release. You'll need to set up a build hook or CI/CD to automatically rebuild your site when scheduled posts should go live.

### Background Animation Elements

The animated background on your site uses images from `public/assets/images/background-elements/`. 

**To manage these images:**

1. **Via GitHub**: Add/replace PNG files directly in the `public/assets/images/background-elements/` folder
2. **Via File System**: Add PNG files locally and commit them to Git
3. **Naming**: Name files as `element1.png`, `element2.png`, etc. (the animation picks random numbered elements)
4. **Requirements**: 
   - Format: PNG
   - Transparency recommended (for better animation effect)
   - The animation will automatically use all PNG files in this folder

**Note**: These are pure image files (not managed through the CMS collections). To add new elements, simply add PNG files to the folder and commit to Git.

## File Structure

```
public/admin/
  ├── index.html    - CMS interface
  ├── config.yml    - CMS configuration
  └── README.md     - This file

src/content/
  ├── episodes/     - Episode JSON files (edited by CMS)
  ├── guests/       - Guest database (edited by CMS)
  └── site/         - Site settings (edited by CMS)
```

## How It Works

1. **Git-Based**: All edits create Git commits
2. **No Database**: Everything is stored in JSON files
3. **Works with Astro**: Fully compatible with your Astro content collections
4. **Static-Friendly**: No server-side rendering required

## Troubleshooting

### Can't access /admin

- Make sure dev server is running: `npm run dev`
- Check that files exist in `public/admin/`
- Clear browser cache and try again

### Authentication issues

- For local dev, use `test-repo` backend (no auth needed)
- For production, ensure Netlify Identity is enabled
- Check that you've been invited as a user

### Changes not appearing

- CMS creates Git commits - you may need to pull changes
- For scheduled posts, you need a build trigger set up
- Check that JSON files are being updated in `src/content/`

## Resources

- [Decap CMS Documentation](https://decapcms.org/docs/)
- [Netlify Identity Setup](https://docs.netlify.com/visitor-access/identity/)
- [Editorial Workflow Guide](https://decapcms.org/docs/configuration-options/#publish-mode)

