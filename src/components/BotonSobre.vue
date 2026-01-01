<template>
  <a 
    href="mailto:support@nhug.io" 
    class="boton-sobre"
    aria-label="Enviar correo a soporte"
  >
    <svg 
      viewBox="0 0 24 24" 
      class="sobre-icono"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Rectángulo del sobre -->
      <rect 
        x="2" 
        y="5" 
        width="20" 
        height="14" 
        fill="none" 
        stroke="#ffffff" 
        stroke-width="3"
      />
      <!-- Línea diagonal izquierda (solapa) -->
      <line 
        x1="2" 
        y1="5" 
        x2="12" 
        y2="13" 
        stroke="#ffffff" 
        stroke-width="3"
      />
      <!-- Línea diagonal derecha (solapa) -->
      <line 
        x1="22" 
        y1="5" 
        x2="12" 
        y2="13" 
        stroke="#ffffff" 
        stroke-width="3"
      />
    </svg>
  </a>
</template>

<script setup>
// Componente de botón con sobre para enviar correo
// No requiere props ni lógica adicional
</script>

<style scoped>
/* Contenedor del botón - cuadrado exacto */
.boton-sobre {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
  /* Color de fondo oscuro */
  background-color: #122037;
  /* Borde blanco puro de 1px */
  border: 1px solid #ffffff;
  /* Sin decoración de enlace */
  text-decoration: none;
  /* Cursor de puntero */
  cursor: pointer;
  /* Transición suave en hover */
  transition: transform 0.2s, box-shadow 0.2s;
}

/* Efecto hover - ligero levantamiento */
.boton-sobre:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
}

/* Efecto activo - presionar */
.boton-sobre:active {
  transform: translateY(0);
}

/* Icono SVG del sobre */
.sobre-icono {
  width: 70%;
  height: 70%;
  /* Las líneas del SVG ya están definidas como blancas con grosor de 3px */
}
</style>
