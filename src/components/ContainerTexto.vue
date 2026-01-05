<template>
  <div class="container-texto">
    <div class="contenido-texto">
      <h2 v-if="titulo" class="titulo">{{ titulo }}</h2>
      <p class="texto">{{ texto }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  titulo: {
    type: String,
    default: ''
  },
  texto: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
/* Contenedor de texto con fondo consistente */
.container-texto {
  background-color: #ffffff;
  width: 100%;
  padding: 30px 20px;
  box-sizing: border-box;
}

/* Contenedor interno para el texto */
.contenido-texto {
  max-width: 1200px;
  margin: 0 auto;
  text-align: left;
}

/* Estilo del título */
.titulo {
  color: #122037;
  font-size: 24px;
  margin: 0 0 15px 0;
  font-weight: bold;
}

/* Estilo del texto */
.texto {
  color: #333;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
}

/* Responsive: ajustar tamaños en pantallas pequeñas */
@media (max-width: 768px) {
  .container-texto {
    padding: 25px 15px;
  }
  
  .titulo {
    font-size: 20px;
  }
  
  .texto {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .container-texto {
    padding: 20px 10px;
  }
  
  .titulo {
    font-size: 18px;
  }
  
  .texto {
    font-size: 14px;
  }
}
</style>
