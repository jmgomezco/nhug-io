<script setup>
import ContainerInicio from '@/components/ContainerInicio.vue'
import ContainerTexto from '@/components/ContainerTexto.vue'
import ContainerSelect from '@/components/ContainerSelect.vue'
</script>

<template>
  <ContainerInicio />
  <ContainerTexto 
    titulo="Bienvenido a NHUG.io"
    texto="Esta es una aplicación de ejemplo que utiliza Vue 3 y Vite. Explora las funcionalidades disponibles."
  />
  <ContainerSelect>
    <template #superior>
      <h2 class="titulo-superior">Sección Superior</h2>
      <p class="texto-superior">Contenido de ejemplo en la parte superior</p>
    </template>
    <template #inferior>
      <h3 class="titulo-inferior">Sección Inferior</h3>
      <p class="texto-inferior">Esta sección tiene el color de fondo #C9C8C7</p>
    </template>
  </ContainerSelect>
</template>

<style scoped>
/* Estilos para el contenido de ejemplo del ContainerSelect */
.titulo-superior {
  color: #fff;
  margin: 0;
}

.texto-superior {
  color: #fff;
}

.titulo-inferior {
  margin: 0;
}

.texto-inferior {
  color: #333;
}
</style>
