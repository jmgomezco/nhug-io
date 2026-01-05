<template>
  <button 
    class="boton-login"
    aria-label="Login"
    @click="handleLogin"
  >
    Login
  </button>
</template>

<script setup>
// Componente de botón de login
const handleLogin = () => {
  // Placeholder para futura funcionalidad de login
  console.log('Login button clicked')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

/* Contenedor del botón - cuadrado exacto, igual que BotonSobre */
.boton-login {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
  /* Color de fondo oscuro */
  background-color: #122037;
  /* Borde blanco de 1px */
  border: 1px solid #FFFFFF;
  /* Fuente comercial reconocida para aplicaciones de login */
  font-family: 'Roboto', 'Arial', 'Helvetica', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
  /* Sin decoración de botón por defecto */
  text-decoration: none;
  /* Cursor de puntero */
  cursor: pointer;
  /* Transición suave en hover */
  transition: transform 0.2s, box-shadow 0.2s;
}

/* Efecto hover - ligero levantamiento */
.boton-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(18, 32, 55, 0.2);
}

/* Efecto activo - presionar */
.boton-login:active {
  transform: translateY(0);
}
</style>
