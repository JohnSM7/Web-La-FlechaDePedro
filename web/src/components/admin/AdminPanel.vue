<template>
  <div v-if="!user" class="min-h-screen">
    <AdminLogin @authenticated="checkAuth" />
  </div>

  <div v-else class="min-h-screen bg-cream-50">
    <!-- Top bar -->
    <header class="bg-charcoal-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div class="flex items-center gap-3">
        <img src="/images/logo.png" alt="Logo" class="h-8 brightness-0 invert" />
        <span class="font-sans font-semibold text-sm tracking-wide">ADMIN</span>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-white/60 text-xs hidden sm:block">{{ user.email }}</span>
        <button
          @click="logout"
          class="text-xs text-white/60 hover:text-white border border-white/20 px-3 py-1.5 rounded transition-colors cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </header>

    <!-- Tabs -->
    <nav class="bg-white border-b border-cream-200 px-6">
      <div class="max-w-5xl mx-auto flex gap-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer',
            activeTab === tab.id
              ? 'border-amber text-charcoal-900'
              : 'border-transparent text-charcoal-500 hover:text-charcoal-700'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </nav>

    <!-- Content -->
    <main class="max-w-5xl mx-auto px-6 py-8">
      <MenuDiaEditor v-if="activeTab === 'menuDia'" />
      <CartaEditor v-if="activeTab === 'carta'" />
      <PlatoEstrellaEditor v-if="activeTab === 'estrella'" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import AdminLogin from './AdminLogin.vue';
import MenuDiaEditor from './MenuDiaEditor.vue';
import CartaEditor from './CartaEditor.vue';
import PlatoEstrellaEditor from './PlatoEstrellaEditor.vue';

const user = ref<User | null>(null);
const activeTab = ref('menuDia');

const tabs = [
  { id: 'menuDia', label: 'Menú del Día' },
  { id: 'carta', label: 'Carta Completa' },
  { id: 'estrella', label: 'Plato Estrella' },
];

function checkAuth() {
  user.value = auth.currentUser;
}

async function logout() {
  await signOut(auth);
  user.value = null;
}

onMounted(() => {
  onAuthStateChanged(auth, (u) => {
    user.value = u;
  });
});
</script>
