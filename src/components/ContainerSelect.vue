<template>
  <div class="container-select">
      <div class="texto-message">
        Para tu entrada: <span class="texto-color">{{ texto }}</span> , hemos seleccionado estos candidatos semánticamente cercanos.
      </div>
      <div class="codes-wrapper" v-if="candidatos && candidatos.length">
        <div class="codes-list">
          <div
            v-for="(item, idx) in candidatos"
            :key="item.codigo"
            class="code-item"
            :class="{ activo: indiceElegido === idx && codigoGrabado }"
            @mouseover="indiceHover = idx"
            @mouseleave="indiceHover = null"
          >
            <div class="code-info">
              <span class="code-number" v-text="String(item.codigo ?? '')"></span>
              <span class="code-description" v-text="obtenerDescripcion(item.descripcion)"></span>
            </div>
            <button
              class="select-button"
              type="button"
              :disabled="codigoGrabado || cargando"
              @click.stop="elegirCodigo(item, idx)"
            >
              Elegir
            </button>
          </div>
        </div>
      </div>

    <div class="no-codes-message" v-else>
      <p>No se encontraron códigos para tu entrada.</p>
    </div>

    <div class="action-buttons">
      <button
        class="new-search-button"
        @click="reiniciar"
      >
        Prueba con otro texto
      </button>
    </div>

    <div class="marca-wrapper">
      <Marca />
    </div>

    <transition name="fade">
      <div
        v-if="estadoConfirmacion"
        class="popup-confirm"
        :class="{
          success: estadoConfirmacion === 'saving',
          error: estadoConfirmacion === 'error'
        }"
        role="status"
        aria-live="polite"
      >
        <template v-if="estadoConfirmacion === 'saving'">Guardando tu elección</template>
        <template v-else>Fallo al grabar. Intenta de nuevo.</template>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { API_BASE_URL } from '../constants.js'
import Marca from './Marca.vue'

const props = defineProps({
  sessionId: { type: String, required: true },
  candidatos: { type: Array, required: true },
  texto: { type: String, default: '' }
})
const emit = defineEmits(['reset'])
const indiceElegido = ref(null)
const indiceHover = ref(null)
const estadoConfirmacion = ref(null)
const cargando = ref(false)
const codigoGrabado = ref(false)
let temporizador = null

onBeforeUnmount(() => {
  if (temporizador) {
    clearTimeout(temporizador)
  }
})

function obtenerDescripcion(desc) {
  return String(desc ?? '')
}

function mostrarError() {
  estadoConfirmacion.value = 'error'
  cargando.value = false
  indiceElegido.value = null
  if (temporizador) clearTimeout(temporizador)
  temporizador = setTimeout(() => {
    estadoConfirmacion.value = null
  }, 1800)
}

async function elegirCodigo(item, idx) {
  if (codigoGrabado.value || cargando.value) return
  
  indiceElegido.value = idx
  cargando.value = true
  estadoConfirmacion.value = 'saving'

  const response = await fetch(`${API_BASE_URL}/select`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: props.sessionId,
      codigo: item.codigo
    })
  })
  
  if (!response.ok) {
    throw new Error(`/select request failed with status ${response.status}`)
  }

  codigoGrabado.value = true

  if (temporizador) clearTimeout(temporizador)
  temporizador = setTimeout(() => {
    estadoConfirmacion.value = null
    cargando.value = false
    emit('reset')
  }, 750)
}

function reiniciar() {
  indiceElegido.value = null
  codigoGrabado.value = false
  estadoConfirmacion.value = null
  cargando.value = false
  if (temporizador) clearTimeout(temporizador)
  emit('reset')
}
</script>

<style scoped>
.container-select {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: clamp(780px, 92vw, 1200px);
  margin: 20px auto 0;
  padding: 0 18px;
  min-height: 100vh;
  font-family: monospace;
  gap: 20px;
  overflow-x: hidden;
}
.texto-message {
  width: 100%;
  font-family: monospace;
  color: #fff;
  font-size: clamp(14px, 2.5vw, 20px);
  margin-bottom: 20px;
}
.texto-color {
  color: #ffdb9f;
}
.no-codes-message {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: clamp(16px, 3vw, 24px);
  font-family: monospace;
  color: #fff;
  width: 100%;
  min-height: 60px;
  text-align: center;
}
.codes-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: visible;
}
.codes-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: clamp(6px, 1vh, 12px);
  font-size: clamp(12px, 2vw, 18px);
  border-radius: 0px;
  border: 6px solid #ffa500;
}
.code-item {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
  padding: clamp(8px, 1vw, 14px);
  background-color: var(--bg-light);
  transition: all 0.18s ease;
  box-sizing: border-box;
  border-bottom: 2px solid #122037;
}
.code-item:last-child {
  border-bottom: none;
}
.code-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  word-break: break-word;
  align-items: flex-start;
  text-align: left;
}
.code-number {
  color: #000;
  font-weight: bold;
}
.code-description {
  color: #000;
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
  white-space: pre-wrap;
}
.code-item.activo .select-button {
  background-color: var(--focus-green);
  border-color: var(--focus-green);
  color: var(--bg-light) !important;
}
.select-button {
  background-color: #006ce0;
  color: var(--bg-light) !important;
  border: none;
  padding: clamp(10px, 1.2vw, 14px) clamp(12px, 2.6vw, 18px);
  border-radius: 6px;
  font-family: monospace;
  font-weight: bold;
  font-size: clamp(15px, 1.9vw, 18px);
  cursor: pointer;
  transition: all 0.18s ease;
  flex: 0 0 auto;
  white-space: nowrap;
  max-width: 180px;
  box-sizing: border-box;
}
/* Cambio: solo este botón usa el color de hover amarillo */
.select-button:hover {
  background-color: #228B22;
  color: #228B22;
}
.select-button:focus-visible {
  cursor: none;
}
.action-buttons {
  display: flex;
  justify-content: center;
  align-self: center;
}
.new-search-button {
  background-color: #006ce0;
  color: #a8a8a8;
  border: none;
  padding: clamp(8px, 2vh, 16px) clamp(16px, 4vw, 24px);
  border-radius: 8px;
  font-family: monospace;
  font-size: clamp(15px, 3vw, 22px);
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  justify-content: center;
}
.new-search-button:hover {
  background-color: #0052a8;
  color: #a8a8a8;
}
.marca-wrapper {
  justify-content: center;
  align-self: center;
}
.popup-confirm {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.85);
  color: #148c14;
  font-size: clamp(20px, 4vw, 32px);
  font-weight: bold;
  font-family: monospace;
  z-index: 9999;
}
.popup-confirm.error {
  color: #ff4444;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

