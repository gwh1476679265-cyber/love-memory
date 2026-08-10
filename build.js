const fs = require('fs');
const path = require('path');

const root = __dirname;
const out = path.join(root, 'dist');
const skipNames = new Set([
  '.git', '.github', 'dist', 'node_modules', 'tools', 'cloudfunctions',
  'build.js', 'package.json', 'package-lock.json'
]);
const skipExtensions = new Set(['.md', '.txt', '.sql', '.zip', '.py']);

function shouldSkip(name, fullPath) {
  if (skipNames.has(name)) return true;
  try {
    if (fs.statSync(fullPath).isFile() && skipExtensions.has(path.extname(name).toLowerCase())) {
      return true;
    }
  } catch (_) {}
  return false;
}

function copyTree(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    const fullSrc = path.join(src, name);
    if (shouldSkip(name, fullSrc)) continue;
    const fullDest = path.join(dest, name);
    const stat = fs.statSync(fullSrc);
    if (stat.isDirectory()) {
      copyTree(fullSrc, fullDest);
    } else if (stat.isFile()) {
      fs.copyFileSync(fullSrc, fullDest);
    }
  }
}

fs.rmSync(out, { recursive: true, force: true });
copyTree(root, out);

// 每次 CloudBase Git 部署都会重新执行构建，因此时间戳天然就是一次新的版本号。
const version = `${Date.now()}`;
const builtAt = new Date().toISOString();
const indexPath = path.join(out, 'index.html');

if (!fs.existsSync(indexPath)) {
  throw new Error('没有找到 index.html，请确认项目根目录就是网站根目录。');
}

let html = fs.readFileSync(indexPath, 'utf8');
function versionAsset(fileName) {
  const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`${escaped}(?:\\?v=[^"']*)?`, 'g');
  html = html.replace(re, `${fileName}?v=${version}`);
}

versionAsset('style.css');
versionAsset('cloudbase-config.js');
versionAsset('script.js');
fs.writeFileSync(indexPath, html, 'utf8');

fs.writeFileSync(
  path.join(out, 'site-version.json'),
  JSON.stringify({ version, builtAt }, null, 2),
  'utf8'
);

console.log(`CloudBase static build ready: version=${version}, output=dist/`);
