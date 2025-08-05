<template>
  <div style="max-width: 600px; margin: auto">
    <h1>Gestión de Microservicios</h1>

    <form @submit.prevent="crearMicroservicio">
      <label>Nombre:</label>
      <input v-model="nombre" required /><br />

      <label>Endpoint:</label>
      <input v-model="endpoint" required /><br />

      <label>Código JS (export default async function(params) {...}):</label><br />
      <textarea v-model="codigo" rows="10" style="width: 100%" required></textarea><br />

      <button type="submit">Crear Microservicio</button>
    </form>

    <hr />

    <h2>Microservicios Registrados</h2>
    <ul>
      <li v-for="ms in lista" :key="ms">
        <code>/ejecutar/{{ ms }}</code>
        <button @click="probar(ms)">Probar</button>
      </li>
    </ul>

    <div v-if="resultado">
      <h3>Resultado:</h3>
      <pre>{{ resultado }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      nombre: '',
      endpoint: '',
      codigo: 'export default async function(params) { return "Hola " + (params.nombre || "invitado"); }',
      lista: [],
      resultado: null
    }
  },
  methods: {
    async cargarMicroservicios() {
      const res = await axios.get('http://localhost:8080/microservicios')
      this.lista = res.data.endpoints
    },
    async crearMicroservicio() {
      await axios.post('http://localhost:8080/microservicios', {
        name: this.nombre,
        code: this.codigo,
        endpoint: this.endpoint
      })
      this.nombre = ''
      this.endpoint = ''
      this.cargarMicroservicios()
    },
    async probar(ms) {
      const res = await axios.get(`http://localhost:8080/ejecutar/${ms}?nombre=Estudiante`)
      this.resultado = JSON.stringify(res.data, null, 2)
    }
  },
  mounted() {
    this.cargarMicroservicios()
  }
}
</script>
