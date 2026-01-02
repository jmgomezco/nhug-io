<template>
  <div class="container-inicio">
    <div class="contenido">
      <Marca />
      <div class="botones-grupo">
        <LoginCognito />
        <BotonSobre />
      </div>
    </div>
  </div>
</template>

<script setup>
import Marca from './Marca.vue'
import LoginCognito from './LoginCognito.vue'
import BotonSobre from './BotonSobre.vue'
</script>

<style scoped>
/* Contenedor principal con color de fondo #D3D3D3 */
.container-inicio {
  background-color: #D3D3D3;
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

/* Grupo de botones: LoginCognito y BotonSobre */
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
