<template>
  <div class="min-h-screen bg-charcoal-900 flex items-center justify-center px-4">
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-sm">
      <div class="text-center mb-8">
        <img src="/images/logo.png" alt="La Flecha de Pedro" class="h-12 mx-auto mb-4" />
        <h1 class="font-sans text-lg font-semibold text-charcoal-900">Panel de Administración</h1>
        <p class="text-charcoal-500 text-sm mt-1">Acceso solo para personal autorizado</p>
      </div>

      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-charcoal-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="w-full px-3 py-2.5 border border-cream-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
            placeholder="admin@laflecha.es"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-charcoal-700 mb-1">Contraseña</label>
          <input
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full px-3 py-2.5 border border-cream-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-amber text-charcoal-900 font-semibold text-sm py-2.5 rounded-md hover:bg-amber-dark transition-colors disabled:opacity-50 cursor-pointer"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const emit = defineEmits<{ authenticated: [] }>();

async function login() {
  error.value = '';
  loading.value = true;
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    emit('authenticated');
  } catch (e: any) {
    if (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password' || e.code === 'auth/user-not-found') {
      error.value = 'Email o contraseña incorrectos';
    } else if (e.code === 'auth/too-many-requests') {
      error.value = 'Demasiados intentos. Espera unos minutos.';
    } else {
      error.value = 'Error al iniciar sesión';
    }
  } finally {
    loading.value = false;
  }
}
</script>
