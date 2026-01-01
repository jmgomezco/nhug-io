<template>
  <div class="container-select">
    <div class="contenido-superior">
      <slot name="superior">
        <!-- Contenido superior del contenedor -->
      </slot>
    </div>
    <div class="contenido-inferior">
      <slot name="inferior">
        <!-- Contenido inferior del contenedor con fondo #C9C8C7 -->
      </slot>
    </div>
  </div>
</template>

<script setup>
/**
 * Componente ContainerSelect
 * 
 * Este componente proporciona un contenedor con dos secciones:
 * - Una sección superior con fondo transparente
 * - Una sección inferior con fondo de color #C9C8C7
 * 
 * DOCUMENTACIÓN DEL CAMBIO DE COLOR:
 * ====================================
 * 
 * Propósito del cambio:
 * - La parte inferior del componente utiliza el color de fondo #C9C8C7 para
 *   crear una separación visual clara entre las diferentes secciones del contenedor.
 * - Este diseño permite organizar el contenido de manera jerárquica, donde la
 *   sección inferior puede contener elementos de selección o información secundaria.
 * 
 * Motivo para seleccionar el color #C9C8C7:
 * - El color #C9C8C7 es un gris cálido y neutral que proporciona un contraste suave
 *   con el fondo principal de la aplicación (#122037 - azul oscuro).
 * - Este tono gris claro (aproximadamente 79% de luminosidad) es:
 *   • Suficientemente claro para destacarse del fondo oscuro
 *   • Lo suficientemente neutro para no competir con otros elementos visuales
 *   • Cálido pero profesional, proporcionando una sensación acogedora sin ser distractor
 * - RGB equivalente: rgb(201, 200, 199) - una mezcla equilibrada de tonos grises
 * 
 * Impacto en el diseño general de la aplicación:
 * - Mejora la jerarquía visual: La división de colores ayuda a los usuarios a
 *   distinguir entre diferentes áreas funcionales del contenedor
 * - Consistencia con el sistema de diseño: El gris neutral complementa el esquema
 *   de colores existente sin introducir elementos discordantes
 * - Accesibilidad mejorada: El contraste entre el fondo oscuro superior y el
 *   fondo gris claro inferior facilita la lectura y la navegación
 * - Flexibilidad: El uso de slots permite que el componente sea reutilizable en
 *   diferentes contextos de la aplicación manteniendo la misma identidad visual
 */
</script>

<style scoped>
/* Contenedor principal del componente */
.container-select {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* Sección superior - fondo transparente para heredar del contexto */
.contenido-superior {
  background-color: transparent;
  padding: 20px;
  box-sizing: border-box;
}

/* 
 * Sección inferior - fondo #C9C8C7
 * Este color gris claro crea una separación visual clara y proporciona
 * un área distintiva para contenido de selección o información secundaria
 */
.contenido-inferior {
  background-color: #C9C8C7;
  padding: 20px;
  box-sizing: border-box;
  min-height: 100px;
}

/* Responsive: ajustar padding en pantallas pequeñas */
@media (max-width: 768px) {
  .contenido-superior,
  .contenido-inferior {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .contenido-superior,
  .contenido-inferior {
    padding: 10px;
  }
}
</style>
