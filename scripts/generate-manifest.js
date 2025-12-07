const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_FILE = path.join(ROOT_DIR, 'dist/llms.md');
const PHILOSOPHY_FILE = path.join(ROOT_DIR, 'PHILOSOPHY.md');
const TOKENS_FILE = path.join(ROOT_DIR, 'dist/tokens/index.js');

// Helper to read file content
const readFile = (relativePath) => fs.readFileSync(path.join(ROOT_DIR, relativePath), 'utf8');

// Helper to flatten tokens
function flattenTokens(obj, prefix = '', result = []) {
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      flattenTokens(value, newKey, result);
    } else {
      let stringValue = value;
      if (Array.isArray(value)) {
          stringValue = `[${value.map(v => typeof v === 'object' ? JSON.stringify(v) : v).join(', ')}]`;
      } else if (typeof value === 'object') {
          stringValue = JSON.stringify(value);
      }
      result.push({ key: newKey, value: stringValue });
    }
  }
  return result;
}

function generateManifest() {
  let output = '';

  // 1. Add Philosophy
  if (fs.existsSync(PHILOSOPHY_FILE)) {
    output += fs.readFileSync(PHILOSOPHY_FILE, 'utf8') + '\n\n';
  } else {
    console.warn('⚠️ PHILOSOPHY.md not found!');
    output += '# Aurelius Design System\n\n';
  }

  // 2. Add Components
  output += '## React Components API\n\n';
  try {
    const componentsDir = path.join(ROOT_DIR, 'src/components');
    if (fs.existsSync(componentsDir)) {
      const componentFiles = fs.readdirSync(componentsDir)
      .filter(f => f.endsWith('.tsx') && !f.includes('index'));

      componentFiles.forEach(file => {
        const content = readFile(`src/components/${file}`);
        const name = file.replace('.tsx', '');

        // Extract Props interface
        const propsMatch = content.match(
            /interface\s+(\w+Props)(?:\s+extends[^{]*)?\s*{([^}]+)}/s);

        output += `### <${name} />\n`;
        if (propsMatch) {
          const props = propsMatch[2].split('\n')
          .map(line => line.trim())
          .filter(line => line && !line.startsWith('//') && !line.startsWith('/*'))
          .map(line => `- \`${line}\``)
          .join('\n');
          output += `**Props:**\n${props}\n`;
        }
        output += '\n';
      });
    }
  } catch (e) {
    console.warn('Could not parse components', e);
  }

  // 3. Add CSS Classes / Tailwind
  output += '## CSS Classes & Tailwind Utilities\n\n';
  try {
    const baseCss = readFile('src/styles/base.css');

    // Helper to extract classes
    // Matches lines starting with .classname that are followed by space, {, or :
    const extractClasses = (text) => {
      const classes = new Set();
      const regex = /(?:^|[\r\n])\s*\.([a-zA-Z_-][a-zA-Z0-9_-]*)(?=\s*[:{])/g;
      let match;
      while ((match = regex.exec(text)) !== null) {
        classes.add(match[1]);
      }
      return Array.from(classes).sort();
    };

    // Split by layers roughly
    const parts = baseCss.split('@layer ');
    const componentsPart = parts.find(p => p.startsWith('components'));
    const utilitiesPart = parts.find(p => p.startsWith('utilities'));

    if (componentsPart) {
        const classes = extractClasses(componentsPart);
        if (classes.length > 0) {
            output += '### Component Classes\n\n';
            output += '| Class | Description |\n|---|---|\n';
            classes.forEach(c => output += `| \`.${c}\` | |\n`);
            output += '\n';
        }
    }

    if (utilitiesPart) {
        const classes = extractClasses(utilitiesPart);
        if (classes.length > 0) {
            output += '### Utility Classes\n\n';
            output += '| Class | Description |\n|---|---|\n';
            classes.forEach(c => output += `| \`.${c}\` | |\n`);
            output += '\n';
        }
    }

  } catch (e) {
    console.warn('Could not parse base.css', e);
  }

  // 4. Add Design Tokens
  output += '## Design Tokens\n\n';
  if (fs.existsSync(TOKENS_FILE)) {
    try {
      // Clear cache to ensure fresh require if running multiple times
      delete require.cache[require.resolve(TOKENS_FILE)];
      const tokensModule = require(TOKENS_FILE);
      
      for (const [groupName, groupTokens] of Object.entries(tokensModule)) {
          if (groupName === 'default') continue;
          
          // Format title
          const title = groupName.charAt(0).toUpperCase() + groupName.slice(1);
          output += `### ${title}\n\n`;
          
          output += '| Token | Value |\n|---|---|\n';
          const flat = flattenTokens(groupTokens, groupName);
          flat.forEach(t => {
              output += `| \`${t.key}\` | ${t.value} |\n`;
          });
          output += '\n';
      }
    } catch (e) {
      console.warn('Could not load tokens from dist', e);
      output += '> Error loading tokens. Ensure `npm run build` has been run.\n\n';
    }
  } else {
      output += '> Tokens file not found. Ensure `npm run build` has been run.\n\n';
  }

  // Ensure dist exists
  if (!fs.existsSync(path.join(ROOT_DIR, 'dist'))) {
    fs.mkdirSync(path.join(ROOT_DIR, 'dist'), {recursive: true});
  }

  fs.writeFileSync(OUT_FILE, output);
  console.log(`✅ AI Manifest generated at ${OUT_FILE}`);
}

generateManifest();
