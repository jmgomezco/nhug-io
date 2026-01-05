import sharp from 'sharp';
import toIco from 'to-ico';
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createFaviconSVG() {
  // Read logo.svg from src/assets
  const logoPath = join(__dirname, '..', 'src', 'assets', 'logo.svg');
  
  // Check if logo file exists
  try {
    const svgBuffer = await readFile(logoPath);
    console.log('✓ Logo.svg loaded from src/assets');
    return svgBuffer;
  } catch (error) {
    throw new Error(`Logo file not found at ${logoPath}: ${error.message}`);
  }
}

async function generateFavicon() {
  try {
    console.log('Generating favicon from src/assets/logo.svg...');
    
    // Load the logo.svg from src/assets
    const svgBuffer = await createFaviconSVG();
    
    // Save a copy of the SVG for reference
    await writeFile(join(__dirname, 'favicon.svg'), svgBuffer);
    console.log('✓ Favicon SVG saved for reference');
    
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
    console.log('✓ PNG files generated at sizes:', sizes.join(', '));
    
    // Convert PNGs to ICO
    const icoBuffer = await toIco(pngBuffers);
    
    // Write to public folder (for Vite to serve)
    const publicOutputPath = join(__dirname, '..', 'public', 'favicon.ico');
    await writeFile(publicOutputPath, icoBuffer);
    console.log('✓ Favicon generated successfully at public/favicon.ico');
    
    // Write to src/assets folder as well
    const assetsOutputPath = join(__dirname, '..', 'src', 'assets', 'favicon.ico');
    await writeFile(assetsOutputPath, icoBuffer);
    console.log('✓ Favicon copy saved at src/assets/favicon.ico');
    
    console.log('✓ Favicon is now dynamically generated from src/assets/logo.svg');
  } catch (error) {
    console.error('Error generating favicon:', error);
    process.exit(1);
  }
}

generateFavicon();
