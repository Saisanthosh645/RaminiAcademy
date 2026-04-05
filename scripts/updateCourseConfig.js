#!/usr/bin/env node

/**
 * Course Configuration Update Script
 *
 * Usage:
 * node scripts/updateCourseConfig.js [command] [options]
 *
 * Commands:
 * - update-zoom [courseId] [newZoomLink] - Update Zoom link for a course
 * - update-capacity [courseId] [newCapacity] - Update course capacity
 * - update-enrollment [courseId] [newCount] - Update enrollment count
 * - list - List all current configuration
 *
 * Examples:
 * node scripts/updateCourseConfig.js update-zoom web-dev-basics https://zoom.us/j/9999999999
 * node scripts/updateCourseConfig.js update-capacity dsa-python 80
 * node scripts/updateCourseConfig.js list
 */

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '../src/config/courseConfig.ts');

function readConfig() {
  const content = fs.readFileSync(configPath, 'utf8');

  // Extract the COURSE_CONFIG object (simplified parsing)
  const configMatch = content.match(/export const COURSE_CONFIG = ({[\s\S]*?});/);
  if (!configMatch) {
    throw new Error('Could not find COURSE_CONFIG in file');
  }

  // This is a simplified approach - in production, you'd want proper AST parsing
  return content;
}

function updateZoomLink(courseId, newLink) {
  let content = fs.readFileSync(configPath, 'utf8');

  // Find and replace the zoom link
  const regex = new RegExp(`("${courseId}": ")[^"]*(")`, 'g');
  content = content.replace(regex, `$1${newLink}$2`);

  fs.writeFileSync(configPath, content);
  console.log(`✅ Updated Zoom link for ${courseId}: ${newLink}`);
}

function updateCapacity(courseId, newCapacity) {
  let content = fs.readFileSync(configPath, 'utf8');

  const regex = new RegExp(`("${courseId}": )[^,]+(,)`, 'g');
  content = content.replace(regex, `$1${newCapacity}$2`);

  fs.writeFileSync(configPath, content);
  console.log(`✅ Updated capacity for ${courseId}: ${newCapacity}`);
}

function updateEnrollment(courseId, newCount) {
  let content = fs.readFileSync(configPath, 'utf8');

  const regex = new RegExp(`("${courseId}": )[^}]+(?=,)`, 'g');
  content = content.replace(regex, `$1${newCount}`);

  fs.writeFileSync(configPath, content);
  console.log(`✅ Updated enrollment for ${courseId}: ${newCount}`);
}

function listConfig() {
  const content = fs.readFileSync(configPath, 'utf8');
  console.log('Current Course Configuration:');
  console.log('===============================');

  // Extract and display key sections
  const zoomMatch = content.match(/zoomLinks: ({[\s\S]*?})/);
  if (zoomMatch) {
    console.log('\nZoom Links:');
    console.log(zoomMatch[1]);
  }

  const capacityMatch = content.match(/capacities: ({[\s\S]*?})/);
  if (capacityMatch) {
    console.log('\nCapacities:');
    console.log(capacityMatch[1]);
  }

  const enrolledMatch = content.match(/enrolledCounts: ({[\s\S]*?})/);
  if (enrolledMatch) {
    console.log('\nEnrolled Counts:');
    console.log(enrolledMatch[1]);
  }
}

// Main execution
const [,, command, ...args] = process.argv;

try {
  switch (command) {
    case 'update-zoom':
      if (args.length !== 2) {
        console.error('Usage: node scripts/updateCourseConfig.js update-zoom <courseId> <zoomLink>');
        process.exit(1);
      }
      updateZoomLink(args[0], args[1]);
      break;

    case 'update-capacity':
      if (args.length !== 2) {
        console.error('Usage: node scripts/updateCourseConfig.js update-capacity <courseId> <capacity>');
        process.exit(1);
      }
      updateCapacity(args[0], parseInt(args[1]));
      break;

    case 'update-enrollment':
      if (args.length !== 2) {
        console.error('Usage: node scripts/updateCourseConfig.js update-enrollment <courseId> <count>');
        process.exit(1);
      }
      updateEnrollment(args[0], parseInt(args[1]));
      break;

    case 'list':
      listConfig();
      break;

    default:
      console.log('Course Configuration Update Script');
      console.log('===================================');
      console.log('Commands:');
      console.log('  update-zoom <courseId> <zoomLink>    - Update Zoom link');
      console.log('  update-capacity <courseId> <capacity> - Update course capacity');
      console.log('  update-enrollment <courseId> <count>  - Update enrollment count');
      console.log('  list                                 - List current configuration');
      break;
  }
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}