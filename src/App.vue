<script setup>
import ContainerInicio from './components/ContainerInicio.vue'
import ContainerSelect from './components/ContainerSelect.vue'
</script>

<template>
  <ContainerInicio />
  <ContainerSelect>
    <template #superior>
      <h2 style="color: #fff; margin: 0;">Sección Superior</h2>
      <p style="color: #fff;">Contenido de ejemplo en la parte superior</p>
    </template>
    <template #inferior>
      <h3 style="margin: 0;">Sección Inferior</h3>
      <p>Esta sección tiene el color de fondo #C9C8C7</p>
    </template>
  </ContainerSelect>
</template>

<style scoped>
/* Estilos específicos del App si son necesarios en el futuro */
</style>
