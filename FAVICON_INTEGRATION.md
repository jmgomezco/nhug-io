# Integración de Favicons en Vite

Esta guía detalla cómo integrar favicons en un proyecto configurado con Vite, incluyendo la generación mediante scripts y su integración en el flujo de construcción.

## Tabla de Contenidos

1. [Dependencias Requeridas](#1-dependencias-requeridas)
2. [Solución de Errores Comunes](#2-solución-de-errores-comunes)
3. [Generación Dinámica del Favicon](#3-generación-dinámica-del-favicon)
4. [Configuración en Vite](#4-configuración-en-vite)
5. [Integración en el Flujo de Construcción](#5-integración-en-el-flujo-de-construcción)
6. [Estructura de Archivos](#6-estructura-de-archivos)

---

## 1. Dependencias Requeridas

### Instalación de Dependencias

Para generar favicons dinámicamente, necesitas instalar las siguientes dependencias de desarrollo:

```bash
npm install --save-dev sharp text-to-svg to-ico @resvg/resvg-js
```

### Descripción de las Dependencias

#### `sharp` (v0.34.5 o superior)
- **Propósito**: Procesamiento de imágenes de alto rendimiento
- **Uso**: Convierte SVG a PNG en múltiples tamaños (16x16, 32x32, 48x48)
- **Características**:
  - Redimensionamiento rápido y eficiente
  - Soporte para múltiples formatos de imagen
  - Optimización automática

#### `text-to-svg` (v3.1.5 o superior)
- **Propósito**: Convierte texto en rutas SVG
- **Uso**: Genera el texto "n" como SVG path para el favicon
- **Características**:
  - Soporte para fuentes TTF personalizadas
  - Control preciso de posicionamiento y tamaño
  - Generación de rutas vectoriales

#### `to-ico` (v1.1.5 o superior)
- **Propósito**: Convierte imágenes PNG a formato ICO
- **Uso**: Combina múltiples tamaños PNG en un único archivo .ico
- **Características**:
  - Soporte para múltiples tamaños en un solo archivo
  - Compatible con todos los navegadores

#### `@resvg/resvg-js` (v2.6.2 o superior)
- **Propósito**: Renderización de SVG
- **Uso**: Alternativa para renderizar SVG si es necesario
- **Características**:
  - Renderización precisa de SVG
  - Sin dependencias de navegador

### Verificación de Instalación

Después de instalar, verifica que las dependencias estén en tu `package.json`:

```json
{
  "devDependencies": {
    "@resvg/resvg-js": "^2.6.2",
    "sharp": "^0.34.5",
    "text-to-svg": "^3.1.5",
    "to-ico": "^1.1.5"
  }
}
```

---

## 2. Solución de Errores Comunes

### Error: `ERR_MODULE_NOT_FOUND` para `sharp`

Este error ocurre cuando:
1. Las dependencias no están instaladas
2. El módulo ES no encuentra el paquete
3. Hay incompatibilidad entre Node.js y Sharp

#### Solución 1: Instalar Dependencias

```bash
# Limpia el caché de npm
npm cache clean --force

# Elimina node_modules y package-lock.json
rm -rf node_modules package-lock.json

# Reinstala todas las dependencias
npm install
```

#### Solución 2: Verificar Configuración ES Module

Asegúrate de que tu `package.json` tenga:

```json
{
  "type": "module"
}
```

Esto permite usar `import` en lugar de `require` en scripts Node.js.

#### Solución 3: Verificar Versión de Node.js

Sharp requiere Node.js v18.17.0 o superior. Verifica tu versión:

```bash
node --version
```

Si necesitas actualizar, usa nvm:

```bash
nvm install 20
nvm use 20
```

#### Solución 4: Reinstalar Sharp Específicamente

Si el problema persiste con Sharp:

```bash
npm rebuild sharp
# o
npm install --force sharp
```

#### Solución 5: Problemas de Plataforma

Sharp es un módulo nativo. Si tienes problemas de compilación:

```bash
# Instala herramientas de compilación necesarias
# En Ubuntu/Debian:
sudo apt-get install build-essential libvips-dev

# En macOS:
brew install vips

# Luego reinstala
npm install sharp
```

---

## 3. Generación del Favicon

### Script de Generación

El favicon se genera mediante un script Node.js ubicado en `scripts/generate-favicon.js`:

```javascript
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
    throw new Error(`Font file not found at ${fontPath}`);
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
  
  // Extract path data
  const pathMatch = textSVG.match(/<path[^>]*d="([^"]*)"[^>]*>/);
  if (!pathMatch || !pathMatch[1]) {
    throw new Error('Failed to extract path data');
  }
  const pathData = pathMatch[1];
  
  // Create minimalist SVG with pure black background and white "n"
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
    
    const svgBuffer = await createFaviconSVG();
    await writeFile(join(__dirname, 'favicon.svg'), svgBuffer);
    
    // Convert to PNG at different sizes
    const sizes = [16, 32, 48];
    const pngBuffers = await Promise.all(
      sizes.map(size =>
        sharp(svgBuffer).resize(size, size).png().toBuffer()
      )
    );
    
    // Convert PNGs to ICO
    const icoBuffer = await toIco(pngBuffers);
    
    // Write to public folder
    const outputPath = join(__dirname, '..', 'public', 'favicon.ico');
    await writeFile(outputPath, icoBuffer);
    
    console.log('✓ Favicon generated successfully');
  } catch (error) {
    console.error('Error generating favicon:', error);
    process.exit(1);
  }
}

generateFavicon();
```

### Características del Favicon

#### Diseño Minimalista

El favicon utiliza un diseño simple y eficiente:

- **Fondo**: `#000000` (negro puro)
- **Texto**: `#ffffff` (blanco puro)
- **Fuente**: Audiowide (familia de fuentes moderna y legible)
- **Letra**: "n" en minúscula
- **Tamaño del círculo**: Máximo permitido (radio 128 en canvas 256x256)

#### Proceso de Generación

1. **Carga de Fuente**: Lee la fuente `Audiowide-Regular.ttf` desde el directorio `scripts/`
2. **Conversión de Texto a SVG**: Convierte la letra "n" en un path SVG
3. **Creación de SVG**: Combina un círculo negro de fondo con el texto blanco centrado
4. **Redimensionamiento**: Genera PNG en 3 tamaños (16x16, 32x32, 48x48)
5. **Conversión a ICO**: Combina los PNG en un único archivo `.ico`
6. **Guardado**: Escribe el archivo en `public/favicon.ico`

### Archivo de Fuente Requerido

El script requiere el archivo `scripts/Audiowide-Regular.ttf`. Este archivo debe estar presente en el directorio `scripts/` para que la generación funcione correctamente.

Si falta el archivo, el script arrojará un error claro:
```
Font file not found at /path/to/scripts/Audiowide-Regular.ttf
```

---

## 4. Configuración en Vite

### vite.config.js

La configuración básica de Vite no requiere cambios especiales para los favicons, ya que Vite automáticamente copia archivos de la carpeta `public/` al directorio de salida:

```javascript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
```

### Carpeta Public

Vite tiene un comportamiento especial con la carpeta `public/`:

- **Durante el desarrollo**: Los archivos se sirven en la raíz (`/`)
- **Durante el build**: Los archivos se copian al directorio `dist/`
- **Sin procesamiento**: Los archivos no pasan por el pipeline de Vite

Por lo tanto, `public/favicon.ico` estará disponible en `/favicon.ico` tanto en desarrollo como en producción.

### index.html

Asegúrate de que tu `index.html` tenga la referencia al favicon:

```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

### Configuración Avanzada (Opcional)

Si quisieras mover el favicon o cambiar su comportamiento, podrías usar plugins de Vite:

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  // ... otras configuraciones
  
  // Personalizar el comportamiento de la carpeta public
  publicDir: 'public',
  
  // Configuración de build
  build: {
    // Copiar archivos adicionales
    rollupOptions: {
      // Opciones de Rollup si es necesario
    }
  }
})
```

---

## 5. Integración en el Flujo de Construcción

### package.json Scripts

El flujo de construcción está configurado en `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "node scripts/generate-favicon.js && vite build",
    "preview": "vite preview",
    "generate-favicon": "node scripts/generate-favicon.js"
  }
}
```

### Comandos Disponibles

#### Desarrollo
```bash
npm run dev
```
- Inicia el servidor de desarrollo de Vite
- **Nota**: No regenera el favicon automáticamente
- Si necesitas regenerar el favicon durante el desarrollo, ejecuta `npm run generate-favicon`

#### Build de Producción
```bash
npm run build
```
- **Paso 1**: Ejecuta `node scripts/generate-favicon.js`
  - Genera `favicon.ico` en `public/`
  - Crea archivos SVG de referencia en `scripts/`
- **Paso 2**: Ejecuta `vite build`
  - Compila el código Vue
  - Copia `public/favicon.ico` a `dist/`
  - Genera los bundles optimizados

#### Generar Solo Favicon
```bash
npm run generate-favicon
```
- Ejecuta solo el script de generación de favicon
- Útil para regenerar el favicon sin hacer un build completo

#### Preview
```bash
npm run preview
```
- Previsualiza el build de producción localmente
- Sirve los archivos desde `dist/`

### Flujo de Trabajo Recomendado

#### Para Desarrollo:
1. Instala las dependencias: `npm install`
2. Genera el favicon inicial: `npm run generate-favicon`
3. Inicia el servidor: `npm run dev`

#### Para Producción:
1. Ejecuta el build: `npm run build`
2. Verifica el output en `dist/`
3. (Opcional) Previsualiza: `npm run preview`

### Orden de Ejecución

Es **crítico** que el script de generación de favicon se ejecute **antes** del build de Vite:

```json
"build": "node scripts/generate-favicon.js && vite build"
```

**¿Por qué?**
- El favicon debe existir en `public/` antes de que Vite lo copie a `dist/`
- Si se ejecutara después, el favicon no estaría disponible en el build
- El operador `&&` asegura ejecución secuencial (el segundo comando solo se ejecuta si el primero tiene éxito)

### Manejo de Errores

Si el script de generación falla:
- El proceso de build se detiene (exit code 1)
- Vite no se ejecuta
- Recibes un mensaje de error descriptivo

```javascript
catch (error) {
  console.error('Error generating favicon:', error);
  process.exit(1);  // Detiene el proceso
}
```

---

## 6. Estructura de Archivos

### Árbol de Archivos del Proyecto

```
nhug-io/
├── public/
│   └── favicon.ico           # Favicon generado (copiado a dist/)
├── scripts/
│   ├── generate-favicon.js   # Script de generación
│   ├── Audiowide-Regular.ttf # Fuente para el texto
│   └── favicon.svg           # SVG generado (referencia)
├── src/
│   └── main.js               # Punto de entrada de Vue
├── index.html                # HTML principal con <link> al favicon
├── package.json              # Scripts y dependencias
├── vite.config.js            # Configuración de Vite
└── FAVICON_INTEGRATION.md    # Esta documentación
```

### Archivos Críticos

#### `public/favicon.ico`
- **Generado por**: `scripts/generate-favicon.js`
- **Formato**: ICO multi-resolución (16x16, 32x32, 48x48)
- **Destino**: Copiado a `dist/favicon.ico` durante el build

#### `scripts/generate-favicon.js`
- **Tipo**: Script Node.js (ES Module)
- **Propósito**: Genera el favicon dinámicamente
- **Ejecución**: Parte del script de build

#### `scripts/Audiowide-Regular.ttf`
- **Tipo**: Archivo de fuente TrueType
- **Propósito**: Fuente para generar el texto "n"
- **Requerido**: Sí, el script falla sin él

#### `scripts/favicon.svg`
- **Generado por**: Script de generación
- **Propósito**: Referencia visual del favicon
- **No usado**: En producción (solo referencia)

### Archivos Generados Durante el Build

```
dist/
├── index.html
├── favicon.ico               # Copiado desde public/
└── assets/
    ├── index-[hash].css
    └── index-[hash].js
```

---

## Preguntas Frecuentes (FAQ)

### ¿Por qué usar Sharp en lugar de otras bibliotecas?

Sharp es más rápido y eficiente que alternativas como ImageMagick o GraphicsMagick. Es ideal para procesamiento de imágenes en Node.js.

### ¿Puedo cambiar los colores del favicon?

Sí, modifica los valores en `scripts/generate-favicon.js`:

```javascript
// Cambiar colores en la función createFaviconSVG
const svg = `<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <circle cx="128" cy="128" r="128" fill="#000000"/>
  <g transform="translate(128, 158)">
    <path d="${pathData}" fill="#ffffff"/>
  </g>
</svg>`;
```

El diseño actual utiliza:
- Fondo: `#000000` (negro puro)
- Texto: `#ffffff` (blanco puro)

### ¿Puedo usar otra fuente?

Sí, reemplaza `Audiowide-Regular.ttf` con tu fuente y actualiza la ruta:

```javascript
const fontPath = join(__dirname, 'tu-fuente.ttf');
```

### ¿Cómo actualizo el favicon en desarrollo?

Ejecuta:
```bash
npm run generate-favicon
```

Luego recarga la página en el navegador (puede requerir limpiar caché).

### ¿El favicon se regenera en cada build?

Sí, el script `generate-favicon.js` se ejecuta automáticamente en cada `npm run build`.

### ¿Puedo usar SVG directamente como favicon?

Sí, pero el soporte de navegadores es limitado. ICO tiene mejor compatibilidad, especialmente en navegadores antiguos.

---

## Recursos Adicionales

- [Documentación de Vite](https://vite.dev/)
- [Documentación de Sharp](https://sharp.pixelplumbing.com/)
- [Especificación ICO](https://en.wikipedia.org/wiki/ICO_(file_format))
- [Favicon Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel#icon)

---

## Troubleshooting

### El favicon no aparece en el navegador

1. Limpia el caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)
2. Verifica que `public/favicon.ico` exista
3. Verifica que `index.html` tenga `<link rel="icon" href="/favicon.ico">`
4. Verifica la consola del navegador por errores 404

### Error de compilación de Sharp

```bash
# Reinstala con rebuild
npm rebuild sharp

# O limpia y reinstala todo
rm -rf node_modules package-lock.json
npm install
```

### Fuente no encontrada

Asegúrate de que `scripts/Audiowide-Regular.ttf` exista. Descárgala desde [Google Fonts](https://fonts.google.com/specimen/Audiowide) si falta.

---

**Documentación creada para el proyecto nhug-io**
