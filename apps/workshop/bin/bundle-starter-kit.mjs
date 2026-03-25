/**
 *              © 2026 Visa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 **/

import { execSync } from 'child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'fs';
import { globSync } from 'glob';
import { basename, dirname, join, resolve } from 'path';
import process from 'process';

// Constants
const WORKSPACE_ROOT = resolve('../..');
const COMPONENTS_PATH = resolve('src/examples/components');
const PATTERNS_PATH = resolve('src/examples/patterns');
const STARTER_KIT_NAME = 'nova-react-starter-kit';
const STARTER_KIT_PATH = join(WORKSPACE_ROOT, STARTER_KIT_NAME);
const PUBLIC_PATH = resolve('public');
const ZIP_NAME = `${STARTER_KIT_NAME}.zip`;
const ZIP_PATH = join(PUBLIC_PATH, ZIP_NAME);

/**
 * Clean up existing starter kit folder and zip
 */
const cleanup = () => {
  console.log('🧹 Cleaning up existing files...');
  if (existsSync(STARTER_KIT_PATH)) {
    rmSync(STARTER_KIT_PATH, { recursive: true, force: true });
    console.log(`   ✓ Removed ${STARTER_KIT_PATH}`);
  }
  if (existsSync(ZIP_PATH)) {
    rmSync(ZIP_PATH, { force: true });
    console.log(`   ✓ Removed ${ZIP_PATH}`);
  }
};

/**
 * Find all reusable*.tsx files from components and patterns
 */
const findReusableFiles = () => {
  console.log('🔍 Finding reusable*.tsx files...');
  const componentFiles = globSync(`${COMPONENTS_PATH}/*/reusable*.tsx`);
  const patternFiles = globSync(`${PATTERNS_PATH}/*/reusable*.tsx`);
  const files = [...componentFiles, ...patternFiles];
  console.log(`   ✓ Found ${componentFiles.length} component files`);
  console.log(`   ✓ Found ${patternFiles.length} pattern files`);
  console.log(`   ✓ Total: ${files.length} files`);
  return files;
};

/**
 * Copy files to starter kit folder maintaining structure
 */
const copyFiles = files => {
  console.log('📦 Copying files to starter kit folder...');

  // Create the starter kit directory
  mkdirSync(STARTER_KIT_PATH, { recursive: true });

  files.forEach(filePath => {
    // Get the component folder name (e.g., "checkbox", "radio", etc.)
    const componentName = basename(dirname(filePath));

    // Create component directory in starter kit
    const targetDir = join(STARTER_KIT_PATH, componentName);
    mkdirSync(targetDir, { recursive: true });

    // Copy the file
    const fileName = basename(filePath);
    const targetPath = join(targetDir, fileName);
    cpSync(filePath, targetPath);

    console.log(`   ✓ Copied ${componentName}/${fileName}`);
  });

  console.log(`   ✓ All files copied to ${STARTER_KIT_PATH}`);
};

/**
 * Extract component exports from a file
 */
const extractComponentExports = filePath => {
  const content = readFileSync(filePath, 'utf-8');
  const exports = [];

  // Match exported components like: export const NovaComponentName = (
  // Exclude Demo components
  const exportRegex = /export\s+const\s+(Nova[A-Za-z]+)\s*=\s*[(<]/g;
  let match;

  while ((match = exportRegex.exec(content)) !== null) {
    const componentName = match[1];
    // Skip Demo components
    if (!componentName.endsWith('Demo')) {
      exports.push(componentName);
    }
  }

  return exports;
};

/**
 * Generate index.ts file that exports all components
 */
const generateIndexFile = () => {
  console.log('📝 Generating index.ts file...');

  const componentDirs = readdirSync(STARTER_KIT_PATH).filter(item => {
    const itemPath = join(STARTER_KIT_PATH, item);
    return statSync(itemPath).isDirectory();
  });

  const exportMap = new Map();

  // Scan each component directory
  componentDirs.forEach(dir => {
    const dirPath = join(STARTER_KIT_PATH, dir);
    const files = readdirSync(dirPath).filter(file => file.endsWith('.tsx'));

    files.forEach(file => {
      const filePath = join(dirPath, file);
      const exports = extractComponentExports(filePath);

      if (exports.length > 0) {
        const fileName = basename(file, '.tsx');
        const importPath = `./${dir}/${fileName}`;

        if (!exportMap.has(dir)) {
          exportMap.set(dir, []);
        }

        exportMap.get(dir).push({
          importPath,
          exports,
        });
      }
    });
  });

  // Generate index.ts content
  const lines = [
    '/**',
    ' *              © 2025 Visa',
    ' *',
    ' * Licensed under the Apache License, Version 2.0 (the "License");',
    ' * you may not use this file except in compliance with the License.',
    ' * You may obtain a copy of the License at',
    ' *',
    ' *         http://www.apache.org/licenses/LICENSE-2.0',
    ' *',
    ' * Unless required by applicable law or agreed to in writing, software',
    ' * distributed under the License is distributed on an "AS IS" BASIS,',
    ' * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
    ' * See the License for the specific language governing permissions and',
    ' * limitations under the License.',
    ' *',
    ' **/',
    '',
    '// Nova Starter Kit - Reusable Components',
    '// This file exports all reusable Nova components',
    '',
  ];

  // Add exports grouped by component
  const sortedDirs = Array.from(exportMap.keys()).sort();

  sortedDirs.forEach((dir, index) => {
    const imports = exportMap.get(dir);

    // Add component comment
    lines.push(`// ${dir.charAt(0).toUpperCase() + dir.slice(1)} components`);

    imports.forEach(({ importPath, exports: componentExports }) => {
      const exportList = componentExports.join(', ');
      lines.push(`export { ${exportList} } from '${importPath}';`);
    });

    // Add spacing between component groups (except for the last one)
    if (index < sortedDirs.length - 1) {
      lines.push('');
    }
  });

  // Write the file
  const indexPath = join(STARTER_KIT_PATH, 'index.ts');
  writeFileSync(indexPath, lines.join('\n') + '\n');

  // Count total exports
  let totalExports = 0;
  exportMap.forEach(imports => {
    imports.forEach(({ exports }) => {
      totalExports += exports.length;
    });
  });

  console.log(`   ✓ Created index.ts with ${totalExports} component exports`);
};

/**
 * Create a zip file of the starter kit
 */
const createZip = () => {
  console.log('🗜️  Creating zip file...');

  try {
    // Change to workspace root to zip the folder
    const command = `cd "${WORKSPACE_ROOT}" && zip -r "${ZIP_PATH}" "${STARTER_KIT_NAME}" -x "*.DS_Store"`;
    execSync(command, { stdio: 'pipe' });

    // Check if zip was created successfully
    if (existsSync(ZIP_PATH)) {
      const stats = statSync(ZIP_PATH);
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      console.log(`   ✓ Created ${ZIP_NAME} (${sizeMB} MB)`);
      console.log(`   ✓ Saved to ${ZIP_PATH}`);
    } else {
      throw new Error('Zip file was not created');
    }
  } catch (error) {
    console.error('   ✗ Failed to create zip:', error.message);
    throw error;
  }
};

/**
 * Display summary
 */
const displaySummary = () => {
  console.log('\n✅ Starter kit bundle complete!');
  console.log(`\n📁 Folder: ${STARTER_KIT_PATH}`);
  console.log(`📦 Zip: ${ZIP_PATH}`);

  // Count components
  const componentDirs = readdirSync(STARTER_KIT_PATH).filter(item => {
    const itemPath = join(STARTER_KIT_PATH, item);
    return statSync(itemPath).isDirectory();
  });
  console.log(`\n📊 Bundled ${componentDirs.length} components:`);
  componentDirs.sort().forEach(dir => {
    const files = readdirSync(join(STARTER_KIT_PATH, dir));
    console.log(`   • ${dir} (${files.length} file${files.length > 1 ? 's' : ''})`);
  });
};

/**
 * Main execution
 */
const main = () => {
  try {
    console.log('\n🚀 Building Nova Starter Kit...\n');

    cleanup();
    const files = findReusableFiles();
    copyFiles(files);
    generateIndexFile();
    createZip();
    displaySummary();

    console.log('\n✨ Done!\n');
  } catch (error) {
    console.error('\n❌ Error building starter kit:', error.message);
    process.exit(1);
  }
};

main();
