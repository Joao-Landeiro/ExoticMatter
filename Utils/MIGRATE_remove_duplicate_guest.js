import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EPISODES_DIR = path.join(__dirname, '..', 'src', 'content', 'episodes');
const BACKUP_DIR = path.join(__dirname, 'backups', 'episodes-guest-dedup');

// Create backup directory
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Process each episode
const files = fs.readdirSync(EPISODES_DIR).filter(f => f.endsWith('.json'));

console.log(`Found ${files.length} episode files to process...\n`);

files.forEach(filename => {
  const filePath = path.join(EPISODES_DIR, filename);
  const episode = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Backup original
  fs.writeFileSync(
    path.join(BACKUP_DIR, filename),
    JSON.stringify(episode, null, 2)
  );
  
  // Remove guest object, keep only guestId
  if (episode.guest) {
    console.log(`  ${filename}: Removing duplicate guest object (kept guestId: ${episode.guestId})`);
    delete episode.guest;
  } else {
    console.log(`  ${filename}: No guest object to remove`);
  }
  
  // Write updated episode
  fs.writeFileSync(filePath, JSON.stringify(episode, null, 2) + '\n');
  console.log(`  ✓ Updated ${filename}`);
});

console.log(`\n✅ Migration complete! Processed ${files.length} episodes.`);
console.log(`📦 Backups saved to: ${BACKUP_DIR}`);

