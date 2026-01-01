import sharp from 'sharp';
import toIco from 'to-ico';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import TextToSVG from 'text-to-svg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createFaviconSVG() {
  const fontPath = join(__dirname, 'Audiowide-Regular.ttf');
  
  // Check if font file exists
  try {
    await readFile(fontPath);
  } catch (error) {
    throw new Error(`Font file not found at ${fontPath}. Please ensure Audiowide-Regular.ttf is present in the scripts directory.`);
  }
  
  const textToSVG = TextToSVG.loadSync(fontPath);
  
  // Generate the text path for "n" with Audiowide font
  const textSVG = textToSVG.getSVG('n', {
    x: 0,
    y: 0,
    fontSize: 180,
    anchor: 'center',
    attributes: { fill: '#ffffff' }
  });
  
  // Extract the path from the text SVG
  const pathMatch = textSVG.match(/<path[^>]*d="([^"]*)"[^>]*>/);
  if (!pathMatch || !pathMatch[1]) {
    throw new Error('Failed to extract path data from generated SVG text');
  }
  const pathData = pathMatch[1];
  
  // Create minimalist SVG with pure black background and white "n"
  // Circle at maximum size (r=128) within 256x256 canvas
  const svg = `<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <circle cx="128" cy="128" r="128" fill="#000000"/>
  <g transform="translate(128, 158)">
    <path d="${pathData}" fill="#ffffff"/>
  </g>
</svg>`;
  
  return Buffer.from(svg);
}

async function generateFavicon() {
  try {
    console.log('Generating favicon...');
    
    // Create minimalist SVG with pure black background and white text
    const svgBuffer = await createFaviconSVG();
    
    // Save SVG file for reference
    await writeFile(join(__dirname, 'favicon.svg'), svgBuffer);
    
    // Convert SVG to PNG at different sizes
    const sizes = [16, 32, 48];
    const pngBuffers = await Promise.all(
      sizes.map(size =>
        sharp(svgBuffer)
          .resize(size, size)
          .png()
          .toBuffer()
      )
    );
    
    // Convert PNGs to ICO
    const icoBuffer = await toIco(pngBuffers);
    
    // Write to public folder
    const outputPath = join(__dirname, '..', 'public', 'favicon.ico');
    await writeFile(outputPath, icoBuffer);
    
    console.log('✓ Favicon generated successfully at public/favicon.ico');
  } catch (error) {
    console.error('Error generating favicon:', error);
    process.exit(1);
  }
}

generateFavicon();
