import sharp from 'sharp';
import fs from 'fs';

// Beautiful SVG icon for Shopee Facilities Intelligence
const createSvgIcon = (size: number, isMaskable = false) => {
  const padding = isMaskable ? size * 0.15 : size * 0.08;
  const contentSize = size - padding * 2;
  const radius = isMaskable ? 0 : size * 0.22;

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#EE4D2D" />
        <stop offset="100%" stop-color="#FF5722" />
      </linearGradient>
      <linearGradient id="bagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="100%" stop-color="#fff5f2" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="${size * 0.02}" stdDeviation="${size * 0.02}" flood-opacity="0.25"/>
      </filter>
    </defs>

    <!-- Background -->
    <rect width="${size}" height="${size}" rx="${radius}" fill="url(#bgGrad)" />

    <!-- Center Content -->
    <g transform="translate(${padding}, ${padding})" filter="url(#shadow)">
      <!-- Handle of the bag -->
      <path d="
        M ${contentSize * 0.35} ${contentSize * 0.28}
        C ${contentSize * 0.35} ${contentSize * 0.12},
          ${contentSize * 0.65} ${contentSize * 0.12},
          ${contentSize * 0.65} ${contentSize * 0.28}
      " fill="none" stroke="#ffffff" stroke-width="${contentSize * 0.06}" stroke-linecap="round" />

      <!-- Bag body -->
      <path d="
        M ${contentSize * 0.22} ${contentSize * 0.28}
        L ${contentSize * 0.78} ${contentSize * 0.28}
        L ${contentSize * 0.84} ${contentSize * 0.88}
        Q ${contentSize * 0.84} ${contentSize * 0.94} ${contentSize * 0.76} ${contentSize * 0.94}
        L ${contentSize * 0.24} ${contentSize * 0.94}
        Q ${contentSize * 0.16} ${contentSize * 0.94} ${contentSize * 0.16} ${contentSize * 0.88}
        Z
      " fill="url(#bagGrad)" />

      <!-- The 'S' of Shopee inside bag -->
      <path d="
        M ${contentSize * 0.58} ${contentSize * 0.44}
        C ${contentSize * 0.58} ${contentSize * 0.38}, ${contentSize * 0.42} ${contentSize * 0.38}, ${contentSize * 0.42} ${contentSize * 0.48}
        C ${contentSize * 0.42} ${contentSize * 0.58}, ${contentSize * 0.60} ${contentSize * 0.56}, ${contentSize * 0.60} ${contentSize * 0.70}
        C ${contentSize * 0.60} ${contentSize * 0.82}, ${contentSize * 0.40} ${contentSize * 0.82}, ${contentSize * 0.40} ${contentSize * 0.74}
      " fill="none" stroke="#EE4D2D" stroke-width="${contentSize * 0.065}" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Small Facilities gear / spark badge -->
      <circle cx="${contentSize * 0.76}" cy="${contentSize * 0.78}" r="${contentSize * 0.12}" fill="#172554" />
      <path d="
        M ${contentSize * 0.73} ${contentSize * 0.78}
        L ${contentSize * 0.75} ${contentSize * 0.81}
        L ${contentSize * 0.79} ${contentSize * 0.75}
      " fill="none" stroke="#ffffff" stroke-width="${contentSize * 0.025}" stroke-linecap="round" stroke-linejoin="round" />
    </g>
  </svg>
  `;
};

async function generate() {
  // 1. Favicon SVG
  fs.writeFileSync('public/favicon.svg', createSvgIcon(64, false));

  // 2. 192x192 PNG (standard)
  await sharp(Buffer.from(createSvgIcon(192, false)))
    .png()
    .toFile('public/pwa-192x192.png');

  // 3. 512x512 PNG (standard)
  await sharp(Buffer.from(createSvgIcon(512, false)))
    .png()
    .toFile('public/pwa-512x512.png');

  // 4. 192x192 Maskable (with safe zone)
  await sharp(Buffer.from(createSvgIcon(192, true)))
    .png()
    .toFile('public/pwa-maskable-192x192.png');

  // 5. 512x512 Maskable (with safe zone)
  await sharp(Buffer.from(createSvgIcon(512, true)))
    .png()
    .toFile('public/pwa-maskable-512x512.png');

  // 6. Apple touch icon 180x180
  await sharp(Buffer.from(createSvgIcon(180, false)))
    .png()
    .toFile('public/apple-touch-icon.png');

  // 7. Favicon 32x32
  await sharp(Buffer.from(createSvgIcon(32, false)))
    .png()
    .toFile('public/favicon-32x32.png');

  console.log('All PWA icons successfully generated in public/ directory!');
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
