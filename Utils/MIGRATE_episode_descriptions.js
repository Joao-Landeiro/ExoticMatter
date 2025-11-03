#!/usr/bin/env node

/**
 * MIGRATE_episode_descriptions.js
 * 
 * One-time migration script to consolidate episode description fields.
 * Combines summary.description, topics, and summary.guest into a single
 * markdown description field.
 * 
 * Usage: node Utils/MIGRATE_episode_descriptions.js
 * 
 * Safety:
 * - Creates backups in Utils/backups/episodes/ before modifying
 * - Idempotent: Can be run multiple times safely
 * - Preserves shortTopics field
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const EPISODES_DIR = path.join(__dirname, '..', 'src', 'content', 'episodes');
const BACKUP_DIR = path.join(__dirname, 'backups', 'episodes');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log(`✓ Created backup directory: ${BACKUP_DIR}`);
}

/**
 * Convert HTML links to markdown links
 * e.g., <a href="url">text</a> → [text](url)
 */
function htmlToMarkdown(text) {
  if (!text) return '';
  
  // Convert HTML links to markdown
  let result = text.replace(
    /<a\s+href="([^"]+)">(?:<b>)?([^<]+)(?:<\/b>)?<\/a>/gi,
    '[$2]($1)'
  );
  
  // Remove any remaining <b> tags
  result = result.replace(/<\/?b>/g, '**');
  
  return result;
}

/**
 * Migrate a single episode file
 */
function migrateEpisode(filename) {
  const filepath = path.join(EPISODES_DIR, filename);
  const backupPath = path.join(BACKUP_DIR, filename);
  
  try {
    // Read the episode file
    const content = fs.readFileSync(filepath, 'utf8');
    const episode = JSON.parse(content);
    
    // Check if already migrated
    if (episode.description && !episode.summary && !episode.topics) {
      console.log(`  ⊘ ${filename} - Already migrated`);
      return { success: true, skipped: true };
    }
    
    // Check if old structure exists
    if (!episode.summary || !episode.topics) {
      console.log(`  ⚠ ${filename} - Missing expected fields, skipping`);
      return { success: false, error: 'Missing fields' };
    }
    
    // Create backup
    fs.writeFileSync(backupPath, content, 'utf8');
    
    // Build the new description
    let description = '';
    
    // 1. Add summary description
    if (episode.summary.description) {
      description += episode.summary.description.trim() + '\n\n';
    }
    
    // 2. Add topics as bullet list
    if (episode.topics && episode.topics.length > 0) {
      description += '**Topics:**\n';
      episode.topics.forEach(topic => {
        description += `- ${topic}\n`;
      });
      description += '\n';
    }
    
    // 3. Add guest bio (convert HTML to markdown)
    if (episode.summary.guest) {
      const guestBio = htmlToMarkdown(episode.summary.guest);
      description += guestBio.trim();
    }
    
    // Create new episode object
    const migratedEpisode = {
      id: episode.id,
      season: episode.season,
      number: episode.number,
      title: episode.title,
      status: episode.status,
      guestId: episode.guestId,
      guest: episode.guest,
      description: description.trim(),
      links: episode.links,
      shortTopics: episode.shortTopics, // Keep this!
      episodeLink: episode.episodeLink,
      spotifyUrl: episode.spotifyUrl,
      transcript: episode.transcript
    };
    
    // Write migrated file
    fs.writeFileSync(
      filepath,
      JSON.stringify(migratedEpisode, null, 2) + '\n',
      'utf8'
    );
    
    console.log(`  ✓ ${filename} - Migrated successfully`);
    return { success: true, skipped: false };
    
  } catch (error) {
    console.error(`  ✗ ${filename} - Error:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Main migration function
 */
function main() {
  console.log('\n🚀 Starting Episode Description Migration\n');
  console.log(`Episodes directory: ${EPISODES_DIR}`);
  console.log(`Backup directory: ${BACKUP_DIR}\n`);
  
  // Get all episode files
  const files = fs.readdirSync(EPISODES_DIR)
    .filter(file => file.endsWith('.json'));
  
  console.log(`Found ${files.length} episode files\n`);
  
  // Migrate each file
  const results = {
    success: 0,
    skipped: 0,
    failed: 0
  };
  
  files.forEach(file => {
    const result = migrateEpisode(file);
    if (result.success) {
      if (result.skipped) {
        results.skipped++;
      } else {
        results.success++;
      }
    } else {
      results.failed++;
    }
  });
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Migration Summary');
  console.log('='.repeat(50));
  console.log(`✓ Successfully migrated: ${results.success}`);
  console.log(`⊘ Already migrated: ${results.skipped}`);
  console.log(`✗ Failed: ${results.failed}`);
  console.log(`📦 Backups saved to: ${BACKUP_DIR}`);
  console.log('='.repeat(50) + '\n');
  
  if (results.failed > 0) {
    console.log('⚠️  Some migrations failed. Check the errors above.');
    process.exit(1);
  } else {
    console.log('✅ Migration completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run build');
    console.log('2. Verify episodes display correctly');
    console.log('3. Test CMS editing');
    console.log('4. Commit changes\n');
  }
}

// Run migration
main();

