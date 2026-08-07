<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-charcoal-900">Carta Completa</h2>
      <div class="flex items-center gap-3">
        <span v-if="saved" class="text-green-600 text-sm font-medium">Guardado</span>
        <button
          @click="saveAll"
          :disabled="saving"
          class="bg-amber text-charcoal-900 font-semibold text-xs px-4 py-2 rounded-md hover:bg-amber-dark transition-colors cursor-pointer disabled:opacity-50"
        >
          {{ saving ? 'Guardando...' : 'Guardar todo' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-charcoal-500 text-sm">Cargando carta...</div>

    <div v-else>
      <!-- Category tabs -->
      <div class="flex flex-wrap gap-1 mb-6 bg-white border border-cream-200 rounded-lg p-2">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCat = cat.id"
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer',
            activeCat === cat.id
              ? 'bg-amber text-charcoal-900'
              : 'text-charcoal-500 hover:text-charcoal-700 hover:bg-cream-100'
          ]"
        >
          {{ cat.label }} ({{ (cartaData[cat.id] || []).length }})
        </button>
      </div>

      <!-- Active category items -->
      <div class="space-y-3">
        <div
          v-for="(item, idx) in cartaData[activeCat] || []"
          :key="idx"
          class="bg-white rounded-lg border border-cream-200 p-4"
        >
          <div class="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div class="sm:col-span-6">
              <label class="block text-xs text-charcoal-500 mb-1">Nombre</label>
              <input
                v-model="item.nombre"
                class="w-full px-3 py-2 border border-cream-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber"
              />
            </div>
            <div class="sm:col-span-3">
              <label class="block text-xs text-charcoal-500 mb-1">Precio</label>
              <input
                v-model="item.precio"
                placeholder="12,00€"
                class="w-full px-3 py-2 border border-cream-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber"
              />
            </div>
            <div class="sm:col-span-3 flex gap-2">
              <button
                v-if="idx > 0"
                @click="moveItem(activeCat, idx, -1)"
                class="px-2 py-2 text-charcoal-400 hover:text-charcoal-700 border border-cream-200 rounded cursor-pointer text-xs"
                title="Subir"
              >▲</button>
              <button
                v-if="idx < (cartaData[activeCat]?.length || 0) - 1"
                @click="moveItem(activeCat, idx, 1)"
                class="px-2 py-2 text-charcoal-400 hover:text-charcoal-700 border border-cream-200 rounded cursor-pointer text-xs"
                title="Bajar"
              >▼</button>
              <button
                @click="removeItem(activeCat, idx)"
                class="px-2 py-2 text-red-400 hover:text-red-600 border border-cream-200 rounded cursor-pointer text-xs"
                title="Eliminar"
              >✕</button>
            </div>
          </div>
          <div v-if="hasDescriptionField" class="mt-2">
            <input
              v-model="item.descripcion"
              placeholder="Descripción (opcional)"
              class="w-full px-3 py-2 border border-cream-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
          <!-- Extra fields for vinos -->
          <div v-if="isVinoCategory" class="mt-2 grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs text-charcoal-500 mb-1">Botella</label>
              <input
                v-model="item.botella"
                placeholder="18,50€"
                class="w-full px-3 py-2 border border-cream-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-amber"
              />
            </div>
            <div>
              <label class="block text-xs text-charcoal-500 mb-1">Copa (Salón/Terraza)</label>
              <input
                v-model="item.copa"
                placeholder="3,20€ / 3,50€"
                class="w-full px-3 py-2 border border-cream-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-amber"
              />
            </div>
          </div>
          <!-- Nota field for especialidades -->
          <div v-if="activeCat === 'especialidades'" class="mt-2">
            <input
              v-model="item.nota"
              placeholder="Nota (ej: Para 2 personas)"
              class="w-full px-3 py-2 border border-cream-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-amber"
            />
          </div>
        </div>

        <div v-if="!cartaData[activeCat]?.length" class="text-charcoal-400 text-sm italic py-6 text-center">
          No hay platos en esta categoría.
        </div>

        <button
          @click="addItem(activeCat)"
          class="w-full py-3 border-2 border-dashed border-cream-300 rounded-lg text-charcoal-500 hover:border-amber hover:text-amber text-sm font-medium transition-colors cursor-pointer"
        >
          + Añadir plato a {{ categories.find(c => c.id === activeCat)?.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface CartaItem {
  nombre: string;
  precio: string;
  descripcion?: string;
  botella?: string;
  copa?: string;
  nota?: string;
}

const categories = [
  { id: 'raciones', label: 'Raciones' },
  { id: 'entradas', label: 'Entradas' },
  { id: 'carnes', label: 'Carnes' },
  { id: 'pescados', label: 'Pescados' },
  { id: 'especialidades', label: 'Especialidades' },
  { id: 'bocadillos', label: 'Bocadillos' },
  { id: 'torradas', label: 'Torradas' },
  { id: 'sandwiches', label: 'Sándwiches' },
  { id: 'extras', label: 'Extras' },
  { id: 'combinados', label: 'Combinados' },
  { id: 'postres', label: 'Postres' },
  { id: 'vinosTintos', label: 'Vinos Tintos' },
  { id: 'vinosBlancos', label: 'Vinos Blancos' },
  { id: 'otrosVinos', label: 'Sangría y otros' },
];

const activeCat = ref('raciones');
const cartaData = ref<Record<string, CartaItem[]>>({});
const loading = ref(true);
const saving = ref(false);
const saved = ref(false);

const hasDescriptionField = computed(() =>
  ['carnes', 'sandwiches'].includes(activeCat.value)
);

const isVinoCategory = computed(() =>
  ['vinosTintos', 'vinosBlancos'].includes(activeCat.value)
);

function addItem(catId: string) {
  if (!cartaData.value[catId]) cartaData.value[catId] = [];
  const item: CartaItem = { nombre: '', precio: '' };
  if (isVinoCategory.value) {
    item.botella = '';
    item.copa = '';
  }
  cartaData.value[catId].push(item);
}

function removeItem(catId: string, idx: number) {
  cartaData.value[catId]?.splice(idx, 1);
}

function moveItem(catId: string, idx: number, dir: number) {
  const arr = cartaData.value[catId];
  if (!arr) return;
  const target = idx + dir;
  if (target < 0 || target >= arr.length) return;
  [arr[idx], arr[target]] = [arr[target], arr[idx]];
}

async function loadCarta() {
  loading.value = true;
  try {
    const snap = await getDoc(doc(db, 'config', 'cartaCompleta'));
    if (snap.exists()) {
      const data = snap.data();
      const parsed: Record<string, CartaItem[]> = {};
      for (const cat of categories) {
        parsed[cat.id] = data[cat.id] || [];
      }
      cartaData.value = parsed;
    } else {
      const empty: Record<string, CartaItem[]> = {};
      for (const cat of categories) {
        empty[cat.id] = [];
      }
      cartaData.value = empty;
    }
  } catch (e) {
    console.error('Error loading carta:', e);
  } finally {
    loading.value = false;
  }
}

async function saveAll() {
  saving.value = true;
  saved.value = false;
  try {
    const payload: Record<string, any> = { updatedAt: serverTimestamp() };
    for (const cat of categories) {
      payload[cat.id] = cartaData.value[cat.id] || [];
    }
    await setDoc(doc(db, 'config', 'cartaCompleta'), payload);
    saved.value = true;
    setTimeout(() => (saved.value = false), 3000);
  } catch (e: any) {
    alert('Error al guardar: ' + (e.message || 'Permisos insuficientes'));
  } finally {
    saving.value = false;
  }
}

onMounted(loadCarta);
</script>
