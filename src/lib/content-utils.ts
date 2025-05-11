import fs from 'fs';
import path from 'path';

const contentDirectory = path.join(process.cwd(), 'src/content');

/**
 * Get all blog post files
 */
export function getAllPosts(): string[] {
  try {
    const blogDir = path.join(contentDirectory, 'blog');
    if (!fs.existsSync(blogDir)) return [];
    
    return fs.readdirSync(blogDir)
      .filter(file => file.endsWith('.mdx'));
  } catch (error) {
    console.error('Error getting blog posts:', error);
    return [];
  }
}

/**
 * Get all market item files
 */
export function getAllMarketItems(): string[] {
  try {
    const marketDir = path.join(contentDirectory, 'market');
    if (!fs.existsSync(marketDir)) return [];
    
    return fs.readdirSync(marketDir)
      .filter(file => file.endsWith('.mdx'));
  } catch (error) {
    console.error('Error getting market items:', error);
    return [];
  }
}

/**
 * Get all work project files
 */
export function getAllWorkItems(): string[] {
  try {
    const workDir = path.join(contentDirectory, 'work');
    if (!fs.existsSync(workDir)) return [];
    
    return fs.readdirSync(workDir)
      .filter(file => file.endsWith('.mdx'));
  } catch (error) {
    console.error('Error getting work items:', error);
    return [];
  }
}

/**
 * Get counts of all content types
 */
export function getContentCounts() {
  return {
    blogPosts: getAllPosts().length,
    marketItems: getAllMarketItems().length,
    workProjects: getAllWorkItems().length
  };
} 