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
    
    // Handle conditional blocks {{#if condition}}...{{/if}}
    rendered = rendered.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
        return data[condition] ? content : '';
    });
    
    return rendered;
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
 * Generate the main landing page
 */
async function generateLandingPage() {
    console.log('🏠 Generating landing page...');
    
    // Load site configuration
    const siteConfig = await fs.readJson(path.join(CONTENT_DIR, 'site.json'));
    
    // For now, let's copy the existing index.html to preserve functionality
    // In the next step, we'll convert it to use templates
    if (await fs.pathExists('index.html')) {
        await fs.copy('index.html', path.join(BUILD_DIR, 'index.html'));
        console.log('✅ Landing page copied (using existing index.html for now)');
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