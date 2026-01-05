# Integración de Favicons en Vite

Esta guía detalla cómo integrar favicons en un proyecto configurado con Vite, incluyendo la generación mediante scripts y su integración en el flujo de construcción.

## Cambios Recientes (Enero 2026)

**Versión actualizada**: El favicon ahora se genera dinámicamente desde `src/assets/logo.svg` en lugar de generarse desde texto con la fuente Audiowide. Esto proporciona:

- ✅ Mayor consistencia con el logo del proyecto
- ✅ Actualizaciones automáticas cuando se modifica el logo
- ✅ Menos dependencias (ya no necesita `text-to-svg`)
- ✅ Proceso de generación más simple y mantenible

**Última actualización (Enero 5, 2026)**: 
- ✅ El favicon ahora se genera en **TRES ubicaciones**: `src/assets/favicon.ico`, `src/assets/logo.ico` y `public/favicon.ico`
- ✅ La generación ocurre automáticamente durante **desarrollo** (`npm run dev`) y **build** (`npm run build`)
- ✅ `src/assets/favicon.ico` - Disponible en la carpeta de assets del proyecto
- ✅ `src/assets/logo.ico` - Archivo logo.ico generado automáticamente desde logo.svg
- ✅ `public/favicon.ico` - Servido por Vite y copiado a dist durante el build

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

Para generar favicons dinámicamente desde el logo.svg, necesitas instalar las siguientes dependencias de desarrollo:

```bash
npm install --save-dev sharp to-ico
```

### Descripción de las Dependencias

#### `sharp` (v0.34.5 o superior)
- **Propósito**: Procesamiento de imágenes de alto rendimiento
- **Uso**: Convierte SVG a PNG en múltiples tamaños (16x16, 32x32, 48x48)
- **Características**:
  - Redimensionamiento rápido y eficiente
  - Soporte para múltiples formatos de imagen
  - Optimización automática

#### `to-ico` (v1.1.5 o superior)
- **Propósito**: Convierte imágenes PNG a formato ICO
- **Uso**: Combina múltiples tamaños PNG en un único archivo .ico
- **Características**:
  - Soporte para múltiples tamaños en un solo archivo
  - Compatible con todos los navegadores

### Dependencias Opcionales (ya no necesarias)

Las siguientes dependencias se usaban en versiones anteriores pero ya no son necesarias:

- `text-to-svg`: Ya no se usa, el favicon se genera directamente desde logo.svg
- `@resvg/resvg-js`: Ya no se usa, Sharp maneja la conversión SVG directamente

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
    
    // Write to src/assets folder as logo.ico as well
    const logoOutputPath = join(__dirname, '..', 'src', 'assets', 'logo.ico');
    await writeFile(logoOutputPath, icoBuffer);
    console.log('✓ Logo.ico generated at src/assets/logo.ico');
    
    console.log('✓ Favicon and logo.ico are now dynamically generated from src/assets/logo.svg');
  } catch (error) {
    console.error('Error generating favicon:', error);
    process.exit(1);
  }
}

generateFavicon();
```

### Características del Favicon

#### Diseño Dinámico

El favicon se genera dinámicamente desde el archivo `src/assets/logo.svg`:

- **Fuente**: Logo del proyecto ubicado en `src/assets/logo.svg`
- **Proceso**: El SVG original se convierte automáticamente a los tamaños requeridos
- **Consistencia**: Cualquier cambio en el logo se reflejará automáticamente en el favicon

#### Proceso de Generación

1. **Carga del Logo**: Lee el archivo `logo.svg` desde el directorio `src/assets/`
2. **Validación**: Verifica que el archivo SVG sea válido y esté completo
3. **Redimensionamiento**: Genera PNG en 3 tamaños (16x16, 32x32, 48x48) usando Sharp
4. **Conversión a ICO**: Combina los PNG en un único archivo `.ico` multi-resolución
5. **Guardado Triple**: 
   - Escribe el archivo en `public/favicon.ico` para ser servido por Vite
   - Escribe una copia en `src/assets/favicon.ico` para disponibilidad en el código fuente
   - Escribe una copia en `src/assets/logo.ico` como logo.ico generado automáticamente
6. **Referencia**: Guarda una copia del SVG en `scripts/favicon.svg` como referencia

### Archivo de Logo Requerido

El script requiere el archivo `src/assets/logo.svg`. Este archivo debe:
- Estar presente en el directorio `src/assets/`
- Ser un archivo SVG válido con etiquetas de apertura y cierre correctas
- Tener contenido visual adecuado para ser convertido a favicon

Si falta el archivo o está corrupto, el script arrojará un error claro:
```
Logo file not found at /path/to/src/assets/logo.svg
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
    "dev": "node scripts/generate-favicon.js && vite",
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
- **Paso 1**: Ejecuta `node scripts/generate-favicon.js`
  - Genera `favicon.ico` en `src/assets/` y `public/`
  - Crea archivos SVG de referencia en `scripts/`
- **Paso 2**: Inicia el servidor de desarrollo de Vite
- El favicon está disponible inmediatamente en el servidor de desarrollo

#### Build de Producción
```bash
npm run build
```
- **Paso 1**: Ejecuta `node scripts/generate-favicon.js`
  - Genera `favicon.ico` en `src/assets/` y `public/`
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
2. Inicia el servidor: `npm run dev` (el favicon se genera automáticamente)

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
│   ├── Audiowide-Regular.ttf # Fuente (obsoleto, ya no usado)
│   └── favicon.svg           # SVG generado (referencia)
├── src/
│   ├── assets/
│   │   ├── favicon.ico       # Favicon generado en assets
│   │   ├── logo.ico          # Logo.ico generado en assets
│   │   └── logo.svg          # Logo fuente para el favicon
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
- **Uso**: Servido por Vite durante desarrollo y producción

#### `src/assets/favicon.ico`
- **Generado por**: `scripts/generate-favicon.js`
- **Formato**: ICO multi-resolución (16x16, 32x32, 48x48) - idéntico a public/favicon.ico
- **Propósito**: Disponible en la carpeta de assets del proyecto
- **Nota**: Esta es una copia del favicon en la carpeta de assets como fue solicitado

#### `src/assets/logo.ico`
- **Generado por**: `scripts/generate-favicon.js`
- **Formato**: ICO multi-resolución (16x16, 32x32, 48x48) - idéntico a favicon.ico
- **Propósito**: Archivo logo.ico generado automáticamente desde logo.svg
- **Nota**: Este archivo se genera automáticamente durante el proceso de build/dev

#### `scripts/generate-favicon.js`
- **Tipo**: Script Node.js (ES Module)
- **Propósito**: Genera el favicon y logo.ico dinámicamente desde src/assets/logo.svg
- **Ejecución**: Se ejecuta automáticamente durante `npm run dev` y `npm run build`

#### `src/assets/logo.svg`
- **Tipo**: Archivo SVG (imagen vectorial)
- **Propósito**: Logo principal del proyecto, fuente para el favicon
- **Requerido**: Sí, el script de generación de favicon lo usa como entrada

#### `scripts/favicon.svg`
- **Generado por**: Script de generación
- **Propósito**: Copia de referencia del logo usado para el favicon
- **No usado**: En producción (solo referencia)

#### `scripts/Audiowide-Regular.ttf` (obsoleto)
- **Tipo**: Archivo de fuente TrueType
- **Estado**: Ya no se usa en la versión actual
- **Nota**: El favicon ahora se genera desde logo.svg, no desde texto

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

Sí, modifica el archivo `src/assets/logo.svg` directamente. Los cambios se reflejarán automáticamente en el favicon cuando ejecutes:

```bash
npm run generate-favicon
```

### ¿Puedo usar un diseño diferente para el favicon?

Sí, reemplaza o modifica `src/assets/logo.svg` con tu diseño personalizado. El favicon se generará automáticamente desde ese archivo.

### ¿Cómo actualizo el favicon en desarrollo?

Ejecuta:
```bash
npm run generate-favicon
```

Luego recarga la página en el navegador (puede requerir limpiar caché).

### ¿El favicon se regenera en cada build?

Sí, el script `generate-favicon.js` se ejecuta automáticamente en cada `npm run build`, leyendo siempre la versión más reciente de `src/assets/logo.svg`.

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

### Logo SVG incompleto o corrupto

Si el archivo `src/assets/logo.svg` está incompleto o corrupto:

```bash
# Verifica que el archivo SVG tenga etiquetas de apertura y cierre correctas
cat src/assets/logo.svg | grep "</svg>"

# Si falta la etiqueta de cierre, agrégala manualmente
```

El error típico será:
```
Input buffer has corrupt header: XML parse error: Premature end of data in tag svg
```

### Fuente no encontrada (obsoleto)

**Nota**: Las versiones actuales ya no usan fuentes TTF. Si ves un error sobre `Audiowide-Regular.ttf`, actualiza el script `generate-favicon.js` para usar `logo.svg` en su lugar.

---

**Documentación creada para el proyecto nhug-io**
