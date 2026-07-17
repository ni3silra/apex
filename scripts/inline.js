const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');
const indexPath = path.join(outDir, 'index.html');
const outputPath = path.join(outDir, 'apex-standalone.html');

if (!fs.existsSync(indexPath)) {
  console.error('index.html not found in out directory. Did you run next build?');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf-8');

// Inline CSS
html = html.replace(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g, (match, href) => {
  // Remove basePath (/apex) if present
  let relativePath = href;
  if (relativePath.startsWith('/apex/')) relativePath = relativePath.substring(6);
  if (relativePath.startsWith('/')) relativePath = relativePath.substring(1);
  const filePath = path.join(outDir, relativePath);
  
  if (fs.existsSync(filePath)) {
    const cssContent = fs.readFileSync(filePath, 'utf-8');
    return `<style>${cssContent}</style>`;
  }
  console.warn(`Warning: Could not find CSS file ${filePath}`);
  return match;
});

// Inline JS
html = html.replace(/<script[^>]*src="([^"]+)"[^>]*><\/script>/g, (match, src) => {
  // Remove basePath (/apex) if present
  let relativePath = src;
  if (relativePath.startsWith('/apex/')) relativePath = relativePath.substring(6);
  if (relativePath.startsWith('/')) relativePath = relativePath.substring(1);
  const filePath = path.join(outDir, relativePath);
  
  if (fs.existsSync(filePath)) {
    const jsContent = fs.readFileSync(filePath, 'utf-8');
    return `<script>${jsContent}</script>`;
  }
  console.warn(`Warning: Could not find JS file ${filePath}`);
  return match;
});

// Disable Next.js router from trying to fetch chunks dynamically by injecting a small script
const disableNextChunkFetch = `
<script>
  // Prevent Next.js from trying to fetch additional chunks
  window.__NEXT_DATA__ = window.__NEXT_DATA__ || {};
  window.__NEXT_DATA__.assetPrefix = "";
</script>
`;

html = html.replace('</body>', `${disableNextChunkFetch}</body>`);

fs.writeFileSync(outputPath, html);
console.log(`Successfully created standalone HTML at ${outputPath}`);
