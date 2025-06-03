#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

// Paths
const SRC_DIR = path.join(__dirname, '../src');
const BUILD_DIR = path.join(__dirname, '../build');
const TEMPLATES_DIR = path.join(SRC_DIR, 'templates');
const CONTENT_DIR = path.join(SRC_DIR, 'content');

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
        
        // Load templates
        const baseTemplate = await fs.readFile(path.join(TEMPLATES_DIR, 'base.html'), 'utf8');
        const indexTemplate = await fs.readFile(path.join(TEMPLATES_DIR, 'index.html'), 'utf8');
        
        // Generate dynamic content
        const guestCards = generateGuestCards(guests);
        const spaceAnimationScript = generateSpaceAnimationScript();
        
        // Replace placeholders in index template
        let indexContent = indexTemplate;
        indexContent = indexContent.replace('<!-- GUEST_CARDS -->', guestCards);
        indexContent = indexContent.replace('<!-- EPISODE_SECTIONS -->', ''); // For now, we'll add episodes later
        
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
 * Generate episode pages
 */
async function generateEpisodePages() {
    console.log('📺 Generating episode pages...');
    
    // For now, copy existing episode HTML files
    // In the next step, we'll convert them to use templates
    const episodeFiles = await fs.readdir('.');
    const htmlFiles = episodeFiles.filter(file => file.startsWith('S1E') && file.endsWith('.html'));
    
    for (const file of htmlFiles) {
        await fs.copy(file, path.join(BUILD_DIR, file));
    }
    
    console.log(`✅ Copied ${htmlFiles.length} episode pages`);
}

/**
 * Main build function
 */
async function build() {
    console.log('🚀 Starting static site generation...');
    
    try {
        // Clean and create build directory
        await fs.emptyDir(BUILD_DIR);
        
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