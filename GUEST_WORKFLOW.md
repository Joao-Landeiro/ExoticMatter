# Guest & Episode Workflow Guide

## Understanding the Data Structure

Your podcast now uses a **proper relational structure** (Option C) where:

### Guests Collection
- **Each guest is a separate file** in `src/content/guests/`
- **One guest file per person** (e.g., `nick-himowicz.json`)
- Contains: name, image, bio, LinkedIn, website, Twitter
- **No episode-specific info** in guest files

### Episodes Collection
- **Each episode is a separate file** in `src/content/episodes/`
- **References guests** via the `guestId` field
- Still contains embedded guest info (for backwards compatibility)

### Benefits of This Structure
✅ **No Duplication**: One guest can appear in multiple episodes without creating duplicate guest entries
✅ **Easy Management**: Update a guest's bio/links in ONE place
✅ **Future-Ready**: If a guest returns for episode 15, just reference their existing guest file
✅ **Separation of Concerns**: Guest info vs. episode info are properly separated

---

## Workflow: Adding a New Episode with a New Guest

### Step 1: Create the Guest First (Recommended)
1. Go to Decap CMS → **"Guests"** collection
2. Click **"New Guest"**
3. Fill in:
   - Name: `Nick Himowicz`
   - Image: Upload guest picture
   - Bio: Short description
   - LinkedIn, Website (optional)
4. **Save** → This creates `nick-himowicz.json`

### Step 2: Create the Episode
1. Go to Decap CMS → **"Episodes"** collection
2. Click **"New Episode"**
3. Fill in:
   - **Guest ID**: `nick-himowicz` (the filename without `.json`)
   - Episode ID: `episode-1`
   - Season: `1`
   - Episode Number: `1`
   - Title, Status
   - **Episode Description**: Write the full description in markdown format, including:
     - Opening paragraph
     - **Topics:** as a bullet list
     - Guest bio paragraph with links (use markdown syntax: `[Name](url)`)
   - **Short Topics**: Abbreviated versions for display (e.g., "Visual Tools & Alignment")
   - **Guest section**: (This is for backwards compatibility, fill it in with the same info)
4. **Save**

### Alternative: Create Episode First
You can also create the episode first and add the guest to the database later. The Guest ID field tells the system which guest file to link to.

---

## Why Do We Have Guest Info in Two Places?

You might notice that episodes have:
- A `guestId` field (references the guest file)
- A `guest` object (embedded guest info)

**This is intentional for backwards compatibility:**
- The `guestId` is the **new relational reference**
- The `guest` object ensures **existing code still works** while we transition
- In future versions, we can remove the embedded guest object

---

## Common Questions

### Q: If a guest returns for multiple episodes, do I duplicate their info?
**A: No!** Just:
1. Use the same `guestId` in the new episode
2. The guest file stays the same (no duplication)

### Q: What's the difference between the Guests collection and guest info in episodes?
**A:**
- **Guests collection** = The master database of all people who've appeared
- **Guest info in episodes** = Episode-specific context (still needed for now)

### Q: Can I update a guest's bio after episodes are published?
**A: Yes!** Update their file in the Guests collection and it updates everywhere.

---

## Technical Details (For Developers)

### File Structure
```
src/content/
├── guests/
│   ├── nick-himowicz.json
│   ├── spencer-ayres.json
│   └── ... (one file per guest)
└── episodes/
    ├── S1E0_Intro.json
    ├── S1E1_Nick.json
    └── ... (one file per episode)
```

### Schema
```typescript
// Guest schema
{
  name: string;
  image: string;
  bio?: string;
  linkedin?: string;
  website?: string;
  twitter?: string;
}

// Episode schema (partial)
{
  guestId: string;  // References guest filename
  guest: {          // Embedded for backwards compat
    name: string;
    image: string;
    linkedin?: string;
    website?: string;
  }
  // ... other episode fields
}
```

### How It Works
1. `index.astro` fetches all guests via `getCollection('guests')`
2. For each guest, it finds their episodes by matching `guestId`
3. Creates a guest roster with links to their first episode
4. No more manual syncing of episode numbers/links in the guest database!

---

## Migrating from Old Structure

The old structure had:
- Single `guests.json` file with an array
- Each entry was guest-per-episode (duplication)

The new structure:
- ✅ Individual guest files (no duplication)
- ✅ Episodes reference guests by ID
- ✅ More scalable and maintainable

**Migration Status:** ✅ Complete!
- All existing guests have been migrated to individual files
- All episodes have been updated with `guestId` references
- Old `guests.json` has been removed
- Episode descriptions consolidated into single markdown field (Oct 2025)

---

## Episode Description Format (Updated Oct 2025)

Episodes now use a **single markdown description field** instead of separate fields for description, topics, and guest bio.

### Format Example:
```markdown
These are the questions Nick and I will go over in this episode.

**Topics:**
- What makes visual tools like the Business Model Canvas so effective?
- How can you make sure clients follow through after workshops?
- What's the best way to begin running Customer Interviews?

[Nick Himowicz](https://linkedin.com/in/nickhimowicz) is a Product Innovation 
Coach and a friend. After countless conversations...
```

### Benefits:
- Easier to edit in CMS (one field instead of three)
- More flexible formatting with markdown
- Cleaner content management
- `shortTopics` still separate for SEO/filtering

### Migration:
All existing episodes were automatically migrated on Oct 29, 2025 using `Utils/MIGRATE_episode_descriptions.js`. Backups are in `Utils/backups/episodes/`.

