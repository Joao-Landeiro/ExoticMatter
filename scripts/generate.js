#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

// Paths
const SRC_DIR = path.join(__dirname, '../src');
const BUILD_DIR = path.join(__dirname, '..');  // Changed from '../build' to '..' (root directory)
const TEMPLATES_DIR = path.join(SRC_DIR, 'templates');
const CONTENT_DIR = path.join(SRC_DIR, 'content');
const EPISODES_DIR = path.join(CONTENT_DIR, 'episodes');

/**
 * Load all episode data from individual JSON files
 * Reads all JSON files from src/content/episodes/ directory
 * and aggregates them into a single array
 */
async function loadEpisodes() {
    console.log('📚 Loading episodes from individual JSON files...');
    
    try {
        // Check if episodes directory exists
        if (!await fs.pathExists(EPISODES_DIR)) {
            console.warn('⚠️  Episodes directory not found, falling back to episodes.json');
            return await fs.readJson(path.join(CONTENT_DIR, 'episodes.json'));
        }
        
        // Read all files in the episodes directory
        const files = await fs.readdir(EPISODES_DIR);
        
        // Filter for JSON files only
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        if (jsonFiles.length === 0) {
            console.warn('⚠️  No JSON files found in episodes directory, falling back to episodes.json');
            return await fs.readJson(path.join(CONTENT_DIR, 'episodes.json'));
        }
        
        console.log(`📄 Found ${jsonFiles.length} episode files: ${jsonFiles.join(', ')}`);
        
        // Load and parse each JSON file
        const episodes = [];
        for (const file of jsonFiles) {
            try {
                const filePath = path.join(EPISODES_DIR, file);
                const episodeData = await fs.readJson(filePath);
                episodes.push(episodeData);
                console.log(`✅ Loaded episode: ${episodeData.title || episodeData.number || file}`);
            } catch (error) {
                console.error(`❌ Failed to load episode file ${file}:`, error.message);
                // Continue loading other files even if one fails
            }
        }
        
        // Sort episodes by episode number (assuming episodes have a 'number' field)
        episodes.sort((a, b) => {
            // Extract episode number from various possible formats
            const getEpisodeNumber = (episode) => {
                if (episode.number !== undefined && episode.number !== null) {
                    // If number is already numeric, use it directly
                    if (typeof episode.number === 'number') {
                        return episode.number;
                    }
                    // If number is a string, try to parse it
                    if (typeof episode.number === 'string') {
                        // Handle formats like "S1E0", "S1E1", etc.
                        const match = episode.number.match(/E(\d+)/);
                        if (match) {
                            return parseInt(match[1]);
                        }
                        // Try to parse as a plain number
                        const parsed = parseInt(episode.number);
                        if (!isNaN(parsed)) {
                            return parsed;
                        }
                    }
                }
                return 0;
            };
            
            return getEpisodeNumber(a) - getEpisodeNumber(b);
        });
        
        console.log(`🎯 Successfully loaded and sorted ${episodes.length} episodes`);
        return episodes;
        
    } catch (error) {
        console.error('❌ Failed to load episodes from individual files:', error);
        console.log('📋 Falling back to episodes.json...');
        
        // Fallback to original episodes.json file
        try {
            return await fs.readJson(path.join(CONTENT_DIR, 'episodes.json'));
        } catch (fallbackError) {
            console.error('❌ Fallback to episodes.json also failed:', fallbackError);
            throw new Error('Could not load episode data from either individual files or episodes.json');
        }
    }
}

/**
 * Simple template engine using string replacement
 * Replaces {{variable}} with values from data object
 */
function renderTemplate(template, data) {
    let rendered = template;
    
    // Replace simple variables like {{title}}
    rendered = rendered.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] || match;
    });
    
    // Replace nested variables like {{site.title}}
    rendered = rendered.replace(/\{\{(\w+)\.(\w+)\}\}/g, (match, obj, key) => {
        return (data[obj] && data[obj][key]) || match;
    });
    
    // Replace deeply nested variables like {{site.intro.observation}}
    rendered = rendered.replace(/\{\{(\w+)\.(\w+)\.(\w+)\}\}/g, (match, obj, subObj, key) => {
        return (data[obj] && data[obj][subObj] && data[obj][subObj][key]) || match;
    });
    
    return rendered;
}

/**
 * Generate guest cards HTML from guest data
 */
function generateGuestCards(guests) {
    return guests.map(guest => `
                        <a href="${guest.episodeLink}" class="guest-link">
                            <div class="sub-wrapper-guest-box">
                                <div class="form-space-guest-name form-space" data-section="guests" data-type="name">
                                    <h2>${guest.name}</h2>
                                </div>
                                <div class="form-space-guest-photo form-space" data-section="guests" data-type="photo">
                                    <img src="${guest.image}" alt="${guest.name}">
                                </div>
                            </div>
                        </a>`).join('');
}

/**
 * Generate episode sections HTML
 */
function generateEpisodeSections(episodes) {
    return episodes.map(episode => {
        const episodeNumber = episode.number;
        const guest = episode.guest || {};
        
        // Handle guest photo path (check both 'photo' and 'image' fields)
        let guestPhoto = null;
        const photoField = guest.photo || guest.image;
        
        if (photoField) {
            guestPhoto = photoField.startsWith('assets/') ? photoField : `assets/images/guest-pictures/${photoField}`;
        } else {
            // Use the guest's name to construct the expected filename
            const firstName = (guest.name || '').split(' ')[0];
            if (firstName) {
                guestPhoto = `assets/images/guest-pictures/${firstName}H.png`; // Fallback pattern
            } else {
                guestPhoto = 'assets/images/guest-pictures/default.png'; // Last resort
            }
        }
        
        // Generate episode summary content
        const summaryContent = episode.summary?.description || episode.description || '';
        const topics = episode.topics || [];
        const topicBullets = topics.map(topic => `✺ ${topic}`).join('<br>\n                                    ');
        
        // Generate guest description
        const guestDescription = episode.summary?.guest || `<a href="${guest.linkedin || '#'}"><b>${guest.name}</b></a> ${guest.title ? `is a ${guest.title}` : ''} and a friend.`;
        
        // Generate episode links - handle both old and new link formats
        const links = episode.links || [];
        let episodeLinksHtml = '';
        
        if (Array.isArray(links)) {
            // New flexible format: array of {text, url} objects
            episodeLinksHtml = links.map((link, index) => {
                const linkNumber = index + 1;
                return `                                <div class="sub-wrapper-episode-links-${linkNumber}">
                                    <div class="form-space-episode-links-${linkNumber}-label form-space text-label" data-type="label" data-section="episode">
                                        Link ${linkNumber}:
                                    </div>
                                    <div class="form-space-episode-links-${linkNumber} form-space" data-section="episode" data-type="content">
                                        <a href="${link.url}" class="episode-link" target="_blank" rel="noopener noreferrer">${link.text}</a>
                                    </div>
                                </div>`;
            }).join('\n');
        } else {
            // Old format: object with linkedin/website/additional properties (fallback)
            const link1 = links.linkedin || guest.linkedin || '#';
            const link2 = links.website || guest.website || '#';
            const link3 = links.additional || '#';
            
            episodeLinksHtml = `                                <div class="sub-wrapper-episode-links-1">
                                    <div class="form-space-episode-links-1-label form-space text-label" data-type="label" data-section="episode">
                                        Link 1:
                                    </div>
                                    <div class="form-space-episode-links-1 form-space" data-section="episode" data-type="content">
                                        <a href="${link1}" class="episode-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                                    </div>
                                </div>
                                <div class="sub-wrapper-episode-links-2">
                                    <div class="form-space-episode-links-2-label form-space text-label" data-type="label" data-section="episode">
                                        Link 2:
                                    </div>
                                    <div class="form-space-episode-links-2 form-space" data-section="episode" data-type="content">
                                        <a href="${link2}" class="episode-link" target="_blank" rel="noopener noreferrer">Website</a>
                                    </div>
                                </div>
                                <div class="sub-wrapper-episode-links-3">
                                    <div class="form-space-episode-links-3-label form-space text-label" data-type="label" data-section="episode">
                                        Link 3:
                                    </div>
                                    <div class="form-space-episode-links-3 form-space" data-section="episode" data-type="content">
                                        <a href="${link3}" class="episode-link" target="_blank" rel="noopener noreferrer">Additional</a>
                                    </div>
                                </div>`;
        }
        
        // Generate colored bars for topics using the same logic as episode pages
        const topicBars = generateTopicBars(episode);
        
        // Determine episode status and title display based on status field
        const episodeStatus = episode.status || 'To be released';
        const isReleased = episodeStatus.toLowerCase() === 'released';
        
        // Generate episode title with or without link based on status
        let episodeTitleHtml;
        if (isReleased && episode.episodeLink) {
            // Episode is released and has a link - create clickable title
            episodeTitleHtml = `<h2><a href="${episode.episodeLink}" class="episode-link">${episode.title}</a></h2>`;
        } else {
            // Episode is not released or has no link - plain title
            episodeTitleHtml = `<h2>${episode.title}</h2>`;
        }
        
        return `            <div class="sub-wrapper-episode" id="episode-${episodeNumber}">
                <div class="episode-tab text-label">
                    Episode Status:<br>${episodeStatus}
                </div>
                <div class="panel-episode">
                    <div class="sub-wrapper-episode-header">
                        <div class="form-space-episode-number form-space" data-section="episode" data-type="number">
                            <h3 class="text-episode-number">${episodeNumber}</h3>
                        </div>
                        <div class="sub-wrapper-episode-title">
                            <div class="form-space-episode-title-label form-space text-label" data-type="label" data-section="episode">
                                Theme:
                            </div>
                            <div class="form-space-episode-title form-space" data-section="episode" data-type="content">
                                ${episodeTitleHtml}
                            </div>
                        </div>
                    </div>
                    <div class="sub-wrapper-episode-body">
                        <div class="sub-wrapper-episode-content">
                            <div class="form-space-episode-summary form-space" data-section="episode" data-type="content">
                                <div class="system-status">
                                    <p>${topicBullets}<br>
                                    <br>
                                    ${summaryContent}
                                    <br>
                                    <br>
                                    ${guestDescription}
                                    <br>
                                    <br>
                                    </p>

<span class="system-status-blink">STANDBY FOR TRANSMISSION</span></div>
                            </div>
                            <div class="sub-wrapper-episode-links">
                                ${episodeLinksHtml}
                            </div>
                        </div>
                        <div class="sub-wrapper-episode-meta">
                            <div class="sub-wrapper-guest-box">
                                <div class="form-space-episode-guest form-space" data-section="episode" data-type="content">
                                    <h2>${guest.name || 'Guest'}</h2>
                                </div>
                                <div class="form-space-guest-photo form-space" data-section="guests" data-type="photo">
                                    <img src="${guestPhoto}" alt="${guest.name || 'Guest'}">
                                </div>
                                <div class="colored-bars-container">
${topicBars}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="episode-tab text-label episode-tab-bottom">
                    <a href="#roster" class="tab-link">Back to Roster</a>
                </div>
            </div>`;
    }).join('\n');
}

/**
 * Generate space animation JavaScript
 */
function generateSpaceAnimationScript() {
    return `
            // Space animation script for landing page
            const container = document.querySelector('.space-background');
            const totalElements = 18;
            let activeElements = 0;

            function getRandomValue(min, max) {
                return Math.random() * (max - min) + min;
            }

            function createSpaceElement() {
                const element = document.createElement('img');
                const elementNumber = Math.floor(Math.random() * totalElements) + 1;
                element.src = \`assets/images/element\${elementNumber}.png\`;
                element.className = 'space-element';

                // Random angle for direction (in radians)
                const angle = Math.random() * Math.PI * 2;
                // Random distance to travel (viewport diagonal)
                const distance = Math.max(window.innerWidth, window.innerHeight) * 1.5;
                // Calculate end position
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                // Random rotation between -180 and 180 degrees
                const rotation = getRandomValue(-180, 180);
                // Random duration between 6 and 8 seconds (slower travel)
                const duration = getRandomValue(6000, 8000);

                element.style.setProperty('--tx', \`\${tx}px\`);
                element.style.setProperty('--ty', \`\${ty}px\`);
                element.style.setProperty('--rotation', \`\${rotation}deg\`);
                element.style.animation = \`moveOutward \${duration}ms cubic-bezier(0.34, 0.13, 0.71, 0.95) forwards\`;

                container.appendChild(element);
                activeElements++;

                element.addEventListener('animationend', () => {
                    element.remove();
                    activeElements--;
                });
            }

            function createSpaceDust() {
                const dust = document.createElement('div');
                dust.className = 'space-dust';

                const angle = Math.random() * Math.PI * 2;
                const distance = Math.max(window.innerWidth, window.innerHeight) * 1.5;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                const duration = getRandomValue(4000, 6000); // Dust moves faster than elements

                dust.style.setProperty('--tx', \`\${tx}px\`);
                dust.style.setProperty('--ty', \`\${ty}px\`);
                dust.style.animation = \`moveOutwardDust \${duration}ms cubic-bezier(0.34, 0.13, 0.71, 0.95) forwards\`;

                container.appendChild(dust);

                dust.addEventListener('animationend', () => {
                    dust.remove();
                });
            }

            // Create new element every 200-300ms
            function spawnElements() {
                createSpaceElement();
                const nextSpawn = getRandomValue(200, 300);
                setTimeout(spawnElements, nextSpawn);
            }

            // Create new dust particles every 20-40ms (much more frequent)
            function spawnDust() {
                // Create multiple dust particles per spawn
                for(let i = 0; i < 3; i++) {
                    createSpaceDust();
                }
                const nextSpawn = getRandomValue(20, 40);
                setTimeout(spawnDust, nextSpawn);
            }

            // Start spawning both elements and dust
            spawnElements();
            spawnDust();`;
}

/**
 * Copy assets (styles, images, etc.) to build directory
 */
async function copyAssets() {
    console.log('📁 Copying assets...');
    
    // Check if BUILD_DIR is the root directory (when generating directly to root)
    const isRootBuild = path.resolve(BUILD_DIR) === path.resolve('.');
    
    if (isRootBuild) {
        console.log('✅ Assets already in place (building to root directory)');
        return;
    }
    
    // Copy styles directory
    if (await fs.pathExists('styles')) {
        await fs.copy('styles', path.join(BUILD_DIR, 'styles'));
    }
    
    // Copy assets directory
    if (await fs.pathExists('assets')) {
        await fs.copy('assets', path.join(BUILD_DIR, 'assets'));
    }
    
    console.log('✅ Assets copied successfully');
}

/**
 * Generate the main landing page using templates
 */
async function generateLandingPage() {
    console.log('🏠 Generating landing page from templates...');
    
    try {
        // Load data
        const siteConfig = await fs.readJson(path.join(CONTENT_DIR, 'site.json'));
        const guests = await fs.readJson(path.join(CONTENT_DIR, 'guests.json'));
        const episodes = await loadEpisodes();
        
        // Load templates
        const baseTemplate = await fs.readFile(path.join(TEMPLATES_DIR, 'base.html'), 'utf8');
        const indexTemplate = await fs.readFile(path.join(TEMPLATES_DIR, 'index.html'), 'utf8');
        
        // Generate dynamic content
        const guestCards = generateGuestCards(guests);
        const episodeSections = generateEpisodeSections(episodes);
        const spaceAnimationScript = generateSpaceAnimationScript();
        
        // Replace placeholders in index template
        let indexContent = indexTemplate;
        indexContent = indexContent.replace('<!-- GUEST_CARDS -->', guestCards);
        indexContent = indexContent.replace('<!-- EPISODE_SECTIONS -->', episodeSections);
        
        // Prepare data for template rendering
        const templateData = {
            title: siteConfig.title,
            site: siteConfig,
            content: indexContent
        };
        
        // Render the base template with content
        let finalHtml = renderTemplate(baseTemplate, templateData);
        
        // Replace special placeholders
        finalHtml = finalHtml.replace('<!-- SPACE_ANIMATION_SCRIPT -->', spaceAnimationScript);
        finalHtml = finalHtml.replace('<!-- ADDITIONAL_FONTS -->', '');
        finalHtml = finalHtml.replace('<!-- CUSTOM_STYLES -->', '');
        finalHtml = finalHtml.replace('<!-- STICKY_TOPBAR -->', '');
        
        // Write the generated file
        await fs.writeFile(path.join(BUILD_DIR, 'index.html'), finalHtml);
        
        console.log('✅ Landing page generated from templates');
        
    } catch (error) {
        console.error('❌ Failed to generate landing page:', error);
        
        // Fallback: copy existing index.html
        console.log('📋 Falling back to copying existing index.html...');
        if (await fs.pathExists('index.html')) {
            await fs.copy('index.html', path.join(BUILD_DIR, 'index.html'));
            console.log('✅ Landing page copied (fallback)');
        }
    }
}

/**
 * Generate episode pages from templates using individual JSON files
 * Each episode page will be named using the pattern: S{season}E{episode}_{guestFirstName}.html
 * This naming convention is explicitly defined and documented here.
 */
async function generateEpisodePages() {
    console.log('📺 Generating episode pages from templates...');
    
    try {
        // Load the episode template
        const episodeTemplate = await fs.readFile(path.join(TEMPLATES_DIR, 'episode.html'), 'utf8');
        
        // Load site configuration for template data
        const siteConfig = await fs.readJson(path.join(CONTENT_DIR, 'site.json'));
        
        // Load episodes from individual JSON files
        const episodes = await loadEpisodes();
        
        let generatedCount = 0;
        
        for (const episode of episodes) {
            try {
                // Generate the episode filename using explicit naming convention
                // Pattern: S{season}E{episode}_{guestFirstName}.html
                // Example: S1E1_Nick.html, S1E0_Intro.html
                const filename = generateEpisodeFilename(episode);
                
                console.log(`📄 Generating episode page: ${filename}`);
                
                // Prepare episode data for template rendering
                const episodeData = prepareEpisodeData(episode);
                
                // Generate dynamic content sections
                const episodeTopics = generateEpisodeTopics(episode.topics || []);
                const topicBars = generateTopicBars(episode);
                const episodeLinks = generateEpisodeLinks(episode);
                const spotifySection = generateSpotifySection(episode);
                const transcriptSection = generateTranscriptSection(episode);
                const spotifyTranscriptNote = episode.spotifyUrl || episode.transcript ? 
                    'Scroll down for the Spotify Link and the Transcript.' : '';
                
                // Render the template with episode data
                let episodeHtml = renderTemplate(episodeTemplate, {
                    site: siteConfig,
                    episode: episodeData
                });
                
                // Replace special placeholders with generated content
                episodeHtml = episodeHtml.replace('<!-- EPISODE_TOPICS -->', episodeTopics);
                episodeHtml = episodeHtml.replace('<!-- TOPIC_BARS -->', topicBars);
                episodeHtml = episodeHtml.replace('<!-- EPISODE_LINKS -->', episodeLinks);
                episodeHtml = episodeHtml.replace('<!-- SPOTIFY_SECTION -->', spotifySection);
                episodeHtml = episodeHtml.replace('<!-- TRANSCRIPT_SECTION -->', transcriptSection);
                episodeHtml = episodeHtml.replace('<!-- SPOTIFY_TRANSCRIPT_NOTE -->', spotifyTranscriptNote);
                
                // Write the generated episode page
                const outputPath = path.join(BUILD_DIR, filename);
                await fs.writeFile(outputPath, episodeHtml);
                
                generatedCount++;
                console.log(`✅ Generated: ${filename}`);
                
            } catch (error) {
                console.error(`❌ Failed to generate episode page for episode ${episode.number}:`, error.message);
                // Continue with other episodes even if one fails
            }
        }
        
        console.log(`✅ Generated ${generatedCount} episode pages from templates`);
        
    } catch (error) {
        console.error('❌ Failed to generate episode pages from templates:', error);
        
        // Fallback: copy existing episode HTML files
        console.log('📋 Falling back to copying existing episode HTML files...');
        try {
            const episodeFiles = await fs.readdir('.');
            const htmlFiles = episodeFiles.filter(file => file.startsWith('S1E') && file.endsWith('.html'));
            
            for (const file of htmlFiles) {
                await fs.copy(file, path.join(BUILD_DIR, file));
            }
            
            console.log(`✅ Copied ${htmlFiles.length} episode pages (fallback)`);
        } catch (fallbackError) {
            console.error('❌ Fallback copying also failed:', fallbackError);
        }
    }
}

/**
 * Generate episode filename using explicit naming convention
 * Pattern: S{season}E{episode}_{guestFirstName}.html
 * 
 * Examples:
 * - Episode 0 with João Landeiro -> S1E0_Intro.html (special case for intro)
 * - Episode 1 with Nick Himowicz -> S1E1_Nick.html
 * - Episode 2 with Spencer Ayres -> S1E2_Spencer.html
 * 
 * @param {Object} episode - Episode data object
 * @returns {string} - Generated filename
 */
function generateEpisodeFilename(episode) {
    // Default season is 1 (can be made configurable later)
    const season = 1;
    
    // Get episode number, ensuring it's a number
    let episodeNumber = episode.number;
    if (typeof episodeNumber === 'string') {
        // Handle formats like "S1E0", "S1E1", etc.
        const match = episodeNumber.match(/E(\d+)/);
        if (match) {
            episodeNumber = parseInt(match[1]);
        } else {
            episodeNumber = parseInt(episodeNumber) || 0;
        }
    }
    
    // Get guest first name for filename
    let guestName = 'Guest'; // Default fallback
    
    if (episode.guest && episode.guest.name) {
        // Extract first name from full name
        const firstName = episode.guest.name.split(' ')[0];
        guestName = firstName;
    }
    
    // Special case for episode 0 (intro episode)
    if (episodeNumber === 0) {
        guestName = 'Intro';
    }
    
    // Generate filename: S{season}E{episode}_{guestFirstName}.html
    const filename = `S${season}E${episodeNumber}_${guestName}.html`;
    
    return filename;
}

/**
 * Generate episode links HTML for templates
 */
function generateEpisodeLinks(episode) {
    const links = episode.links || [];
    const guest = episode.guest || {};
    
    if (Array.isArray(links)) {
        // New flexible format: array of {text, url} objects
        return links.map((link, index) => {
            const linkNumber = index + 1;
            return `                                <div class="sub-wrapper-episode-links-${linkNumber}">
                                    <div class="form-space-episode-links-${linkNumber}-label form-space text-label" data-type="label" data-section="episode">
                                        Link ${linkNumber}:
                                    </div>
                                    <div class="form-space-episode-links-${linkNumber} form-space" data-section="episode" data-type="content">
                                        <a href="${link.url}" class="episode-link" target="_blank" rel="noopener noreferrer">${link.text}</a>
                                    </div>
                                </div>`;
        }).join('\n');
    } else {
        // Old format: object with linkedin/website/additional properties (fallback)
        const link1 = links.linkedin || guest.linkedin || '#';
        const link2 = links.website || guest.website || '#';
        const link3 = links.additional || '#';
        
        return `                                <div class="sub-wrapper-episode-links-1">
                                    <div class="form-space-episode-links-1-label form-space text-label" data-type="label" data-section="episode">
                                        Link 1:
                                    </div>
                                    <div class="form-space-episode-links-1 form-space" data-section="episode" data-type="content">
                                        <a href="${link1}" class="episode-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                                    </div>
                                </div>
                                <div class="sub-wrapper-episode-links-2">
                                    <div class="form-space-episode-links-2-label form-space text-label" data-type="label" data-section="episode">
                                        Link 2:
                                    </div>
                                    <div class="form-space-episode-links-2 form-space" data-section="episode" data-type="content">
                                        <a href="${link2}" class="episode-link" target="_blank" rel="noopener noreferrer">Website</a>
                                    </div>
                                </div>
                                <div class="sub-wrapper-episode-links-3">
                                    <div class="form-space-episode-links-3-label form-space text-label" data-type="label" data-section="episode">
                                        Link 3:
                                    </div>
                                    <div class="form-space-episode-links-3 form-space" data-section="episode" data-type="content">
                                        <a href="${link3}" class="episode-link" target="_blank" rel="noopener noreferrer">Additional</a>
                                    </div>
                                </div>`;
    }
}

/**
 * Prepare episode data for template rendering
 * Ensures all required fields are present and properly formatted
 */
function prepareEpisodeData(episode) {
    // Handle guest photo path (check both 'photo' and 'image' fields)
    let guestPhoto = null;
    const guest = episode.guest || {};
    const photoField = guest.photo || guest.image;
    
    if (photoField) {
        guestPhoto = photoField.startsWith('assets/') ? photoField : `assets/images/guest-pictures/${photoField}`;
    } else {
        // Use the guest's name to construct the expected filename
        const firstName = (guest.name || '').split(' ')[0];
        if (firstName) {
            guestPhoto = `assets/images/guest-pictures/${firstName}H.png`; // Fallback pattern
        } else {
            guestPhoto = 'assets/images/guest-pictures/default.png'; // Last resort
        }
    }
    
    return {
        ...episode,
        guest: {
            ...guest,
            image: guestPhoto
        },
        summary: episode.summary || {
            description: '',
            guest: `<a href="${guest.linkedin || '#'}"><b>${guest.name || 'Guest'}</b></a> and a friend.`
        }
    };
}

/**
 * Generate episode topics as bullet points
 */
function generateEpisodeTopics(topics) {
    if (!topics || topics.length === 0) {
        return '';
    }
    
    return topics.map(topic => `✺ ${topic}`).join('<br>\n                                    ');
}

/**
 * Generate colored topic bars for the episode meta section
 */
function generateTopicBars(episode) {
    // Use shortTopics if available, otherwise fall back to regular topics
    const topicsToUse = episode.shortTopics || episode.topics;
    
    if (!topicsToUse || topicsToUse.length === 0) {
        return '';
    }
    
    return topicsToUse.slice(0, 3).map((topic, index) => {
        const barClass = index === 0 ? 'colored-bar-top' : index === 1 ? 'colored-bar-middle' : 'colored-bar-bottom';
        return `                                    <div class="${barClass}">
                                        <span class="text-body">${topic}</span>
                                    </div>`;
    }).join('\n');
}

/**
 * Generate Spotify player section if episode has Spotify URL
 */
function generateSpotifySection(episode) {
    if (!episode.spotifyUrl) {
        return '';
    }
    
    return `
            <!-- Spotify Player Panel -->
            <div class="panel-spotify">
                <div class="form-space-spotify-title form-space text-label" data-type="label" data-section="spotify">
                    Listen:
                </div>
                <div class="spotify-container">
                    <iframe style="border-radius:12px" src="${episode.spotifyUrl}" width="624" height="351" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                </div>
            </div>`;
}

/**
 * Generate transcript section if episode has transcript
 */
function generateTranscriptSection(episode) {
    if (!episode.transcript) {
        return '';
    }
    
    return `
            <!-- Transcript Section -->
            <div class="panel-transcript">
                <div class="form-space-transcript-title form-space text-label" data-type="label" data-section="transcript">
                    Transcript:
                </div>
                <div class="transcript-container">
                    <div class="form-space-transcript-content form-space" data-section="transcript" data-type="content">
                        ${episode.transcript}
                    </div>
                </div>
            </div>`;
}

/**
 * Main build function
 */
async function build() {
    console.log('🚀 Starting static site generation...');
    
    try {
        // Clean up only generated HTML files (not the entire directory since we're in root)
        console.log('🧹 Cleaning up previous generated files...');
        const filesToClean = [
            'index.html',
            'S1E0_Intro.html',
            'S1E1_Nick.html', 
            'S1E2_Spencer.html',
            'S1E3_Danilo.html',
            'S1E4_Florian.html',
            'S1E5_Alex.html',
            'S1E6_Dylan.html',
            'S1E7_Patrick.html',
            'S1E8_Jay.html',
            'S1E9_Kurt.html'
        ];
        
        for (const file of filesToClean) {
            const filePath = path.join(BUILD_DIR, file);
            if (await fs.pathExists(filePath)) {
                await fs.remove(filePath);
                console.log(`🗑️  Removed: ${file}`);
            }
        }
        
        // Copy assets
        await copyAssets();
        
        // Generate pages
        await generateLandingPage();
        await generateEpisodePages();
        
        console.log('🎉 Build completed successfully!');
        console.log(`📂 Generated files are in: ${BUILD_DIR}`);
        
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

// Run the build if this script is executed directly
if (require.main === module) {
    build();
}

module.exports = { build, renderTemplate }; 