<template>
  <div class="container-inicio">
    <div class="contenido">
      <Marca />
      <div class="botones-grupo">
        <BotonLogin />
        <BotonSobre />
      </div>
    </div>
  </div>
</template>

<script setup>
import Marca from './Marca.vue'
import BotonLogin from './BotonLogin.vue'
import BotonSobre from './BotonSobre.vue'
</script>

<style scoped>
/* Contenedor principal con color de fondo #122037 */
.container-inicio {
  background-color: #122037;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

/* Contenedor interno para alinear los componentes */
.contenido {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

/* Grupo de botones: BotonLogin y BotonSobre */
.botones-grupo {
  display: flex;
  gap: 15px;
  align-items: center;
}

/* Responsive: en pantallas pequeñas, mantener el diseño horizontal pero ajustar espaciado */
@media (max-width: 768px) {
  .container-inicio {
    padding: 15px;
  }
  
  .botones-grupo {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .container-inicio {
    padding: 10px;
  }
  
  .botones-grupo {
    gap: 10px;
  }
}
</style>
