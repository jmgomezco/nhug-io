<template>
  <div class="marca">
    {{ textoMarca }}
  </div>
</template>

<script setup>
const props = defineProps({
  textoMarca: {
    type: String,
    default: "nhug.io"
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');
.marca {
  font-family: 'Audiowide', sans-serif;
  font-size: clamp(16px, 4vw, 30px);
  font-weight: 900;
  color: #FFFFFF;
  background: #122037;
  padding: 10px 20px;
  line-height: 1.3;
  letter-spacing: 1.2px;
  text-align: center;
  width: fit-content;
  min-width: 120px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}

@media (max-width: 600px) {
  .marca {
    min-width: 80px;
    font-size: clamp(12px, 7vw, 22px);
    padding: 6px 10px;
  }
}
</style>
