<template>
  <section class="py-20 md:py-32 bg-cream-50">
    <div class="max-w-4xl mx-auto px-5 md:px-10">
      <!-- Header -->
      <div class="text-center mb-12">
        <p class="font-sans text-xs tracking-[0.3em] uppercase text-terracotta mb-3 flex items-center justify-center gap-3">
          <span class="w-8 h-px bg-terracotta/40"></span>Menú del día<span class="w-8 h-px bg-terracotta/40"></span>
        </p>
        <h2 class="font-display text-3xl md:text-5xl text-charcoal-900 mb-3">
          <span class="text-amber">{{ menu.precio }}&euro;</span> con todo incluido
        </h2>
        <p class="text-charcoal-500 text-sm mb-2">{{ menu.precioTerraza }}&euro; en terraza</p>
        <p class="text-charcoal-700 text-base md:text-lg max-w-xl mx-auto">
          De lunes a viernes, mediodía. Elige entrante, principal, bebida y postre.
        </p>
      </div>

      <!-- Categorías con platos -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div v-for="cat in categorias" :key="cat.id" class="bg-white border border-cream-200 rounded-lg p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" :d="cat.icon" />
              </svg>
            </div>
            <h3 class="font-sans font-semibold text-charcoal-900 text-sm uppercase tracking-wider">{{ cat.label }}</h3>
          </div>
          <ul class="space-y-2">
            <li
              v-for="plato in platosByCategoria(cat.id)"
              :key="plato.nombre"
              class="text-charcoal-700 text-sm pl-2 border-l-2 border-cream-200"
            >
              {{ plato.nombre }}
              <span v-if="plato.descripcion" class="text-charcoal-400 text-xs block">{{ plato.descripcion }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center">
        <a
          href="/carta"
          class="inline-flex items-center gap-2 px-6 py-3 border border-charcoal-300 text-charcoal-700 font-sans font-semibold text-xs tracking-widest uppercase rounded transition-all duration-300 hover:bg-charcoal-900 hover:text-white hover:border-charcoal-900"
        >
          Ver carta completa
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { menuDefecto, type MenuDiaData } from '../lib/menu-defecto';
import type { PlatoMenu } from '../lib/menu-types';

const menu = ref<MenuDiaData>({ ...menuDefecto });

const categorias = [
  { id: 'entrante', label: 'Entrantes', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z' },
  { id: 'principal', label: 'Principales', icon: 'M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z' },
  { id: 'bebida', label: 'Bebidas', icon: 'M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5' },
  { id: 'postre', label: 'Postres', icon: 'M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12' },
];

function platosByCategoria(cat: string) {
  return menu.value.platos
    .filter((p) => p.categoria === cat)
    .sort((a, b) => a.orden - b.orden);
}

async function loadMenu() {
  try {
    const timeout = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 3000)
    );
    const fetch = getDoc(doc(db, 'menuDia', 'actual'));
    const snap = await Promise.race([fetch, timeout]);
    if (snap && typeof snap === 'object' && 'exists' in snap && snap.exists()) {
      const data = snap.data();
      menu.value = {
        precio: data.precio ?? menuDefecto.precio,
        precioTerraza: data.precioTerraza ?? menuDefecto.precioTerraza,
        activo: data.activo ?? true,
        platos: data.platos?.length ? data.platos : menuDefecto.platos,
      };
    }
  } catch {
    // Firestore not available, default data already shown
  }
}

onMounted(loadMenu);
</script>
