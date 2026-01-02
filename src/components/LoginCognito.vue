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
// Por ahora sin funcionalidad, se expandirá con Cognito en el futuro
const handleLogin = () => {
  // Placeholder para futura integración con AWS Cognito
  console.log('Login button clicked')
}
</script>

<style scoped>
/* Contenedor del botón - cuadrado exacto, igual que BotonSobre */
.boton-login {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
  /* Color de fondo transparente para heredar del contenedor */
  background-color: transparent;
  /* Borde oscuro de 2px para contrastar con fondo claro #D3D3D3 */
  border: 2px solid #122037;
  /* Fuente comercial reconocida para aplicaciones de login */
  font-family: 'Roboto', 'Arial', 'Helvetica', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #122037;
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
