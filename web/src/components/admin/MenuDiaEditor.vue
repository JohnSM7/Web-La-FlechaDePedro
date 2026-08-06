<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-charcoal-900">Menú del Día</h2>
      <span v-if="saved" class="text-green-600 text-sm font-medium">Guardado correctamente</span>
    </div>

    <div v-if="loading" class="text-charcoal-500 text-sm">Cargando...</div>

    <div v-else class="space-y-6">
      <!-- Precios -->
      <div class="bg-white rounded-lg border border-cream-200 p-6">
        <h3 class="font-semibold text-sm text-charcoal-700 mb-4">Precios</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs text-charcoal-500 mb-1">Precio interior (€)</label>
            <input
              v-model.number="menu.precio"
              type="number"
              step="0.5"
              class="w-full px-3 py-2 border border-cream-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
          <div>
            <label class="block text-xs text-charcoal-500 mb-1">Precio terraza (€)</label>
            <input
              v-model.number="menu.precioTerraza"
              type="number"
              step="0.5"
              class="w-full px-3 py-2 border border-cream-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
        </div>
      </div>

      <!-- Platos por categoría -->
      <div v-for="cat in categorias" :key="cat.id" class="bg-white rounded-lg border border-cream-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-sm text-charcoal-700">{{ cat.label }}</h3>
          <button
            @click="addPlato(cat.id)"
            class="text-xs text-amber hover:text-amber-dark font-medium cursor-pointer"
          >
            + Añadir opción
          </button>
        </div>

        <div v-if="platosByCategoria(cat.id).length === 0" class="text-charcoal-400 text-sm italic">
          Sin opciones. Pulsa "+ Añadir opción" para crear una.
        </div>

        <div v-for="(plato, idx) in platosByCategoria(cat.id)" :key="idx" class="flex items-start gap-3 mb-3 last:mb-0">
          <div class="flex-1 grid grid-cols-2 gap-2">
            <input
              v-model="plato.nombre"
              placeholder="Nombre"
              class="px-3 py-2 border border-cream-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber"
            />
            <input
              v-model="plato.descripcion"
              placeholder="Descripción"
              class="px-3 py-2 border border-cream-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
          <button
            @click="removePlato(plato)"
            class="text-red-400 hover:text-red-600 text-lg leading-none mt-2 cursor-pointer"
            title="Eliminar"
          >&times;</button>
        </div>
      </div>

      <!-- Save -->
      <button
        @click="save"
        :disabled="saving"
        class="bg-amber text-charcoal-900 font-semibold text-sm px-6 py-2.5 rounded-md hover:bg-amber-dark transition-colors disabled:opacity-50 cursor-pointer"
      >
        {{ saving ? 'Guardando...' : 'Guardar cambios' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { PlatoMenu } from '../../lib/menu-types';

const loading = ref(true);
const saving = ref(false);
const saved = ref(false);

const menu = ref({
  precio: 25,
  precioTerraza: 26.5,
  activo: true,
  platos: [] as PlatoMenu[],
});

const categorias = [
  { id: 'entrante' as const, label: 'Entrantes' },
  { id: 'principal' as const, label: 'Principales' },
  { id: 'bebida' as const, label: 'Bebidas' },
  { id: 'postre' as const, label: 'Postres' },
];

function platosByCategoria(cat: string) {
  return menu.value.platos.filter((p) => p.categoria === cat);
}

function addPlato(cat: PlatoMenu['categoria']) {
  menu.value.platos.push({
    nombre: '',
    descripcion: '',
    categoria: cat,
    orden: platosByCategoria(cat).length,
  });
}

function removePlato(plato: PlatoMenu) {
  const idx = menu.value.platos.indexOf(plato);
  if (idx > -1) menu.value.platos.splice(idx, 1);
}

async function loadMenu() {
  loading.value = true;
  try {
    const snap = await getDoc(doc(db, 'menuDia', 'actual'));
    if (snap.exists()) {
      const data = snap.data();
      menu.value.precio = data.precio ?? 25;
      menu.value.precioTerraza = data.precioTerraza ?? 26.5;
      menu.value.activo = data.activo ?? true;
      menu.value.platos = data.platos ?? [];
    }
  } catch (e) {
    console.error('Error loading menu:', e);
  } finally {
    loading.value = false;
  }
}

async function save() {
  saving.value = true;
  saved.value = false;
  try {
    await setDoc(doc(db, 'menuDia', 'actual'), {
      ...menu.value,
      updatedAt: serverTimestamp(),
    });
    saved.value = true;
    setTimeout(() => (saved.value = false), 3000);
  } catch (e: any) {
    alert('Error al guardar: ' + (e.message || 'Permisos insuficientes'));
  } finally {
    saving.value = false;
  }
}

onMounted(loadMenu);
</script>
