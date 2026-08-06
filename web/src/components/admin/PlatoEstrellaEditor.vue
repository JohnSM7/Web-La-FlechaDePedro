<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-charcoal-900">Plato Estrella</h2>
      <span v-if="saved" class="text-green-600 text-sm font-medium">Guardado</span>
    </div>

    <div v-if="loading" class="text-charcoal-500 text-sm">Cargando...</div>

    <div v-else class="bg-white rounded-lg border border-cream-200 p-6 space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-charcoal-500 mb-1">Nombre del plato</label>
          <input
            v-model="plato.nombre"
            class="w-full px-3 py-2 border border-cream-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber"
            placeholder="Cachopo Especial"
          />
        </div>
        <div>
          <label class="block text-xs text-charcoal-500 mb-1">Subtítulo</label>
          <input
            v-model="plato.subtitulo"
            class="w-full px-3 py-2 border border-cream-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber"
            placeholder="Flecha"
          />
        </div>
      </div>

      <div>
        <label class="block text-xs text-charcoal-500 mb-1">Descripción principal</label>
        <textarea
          v-model="plato.descripcion"
          rows="3"
          class="w-full px-3 py-2 border border-cream-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber resize-none"
          placeholder="Dos filetes de ternera asturiana..."
        ></textarea>
      </div>

      <div>
        <label class="block text-xs text-charcoal-500 mb-1">Detalle / acompañamiento</label>
        <input
          v-model="plato.detalle"
          class="w-full px-3 py-2 border border-cream-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber"
          placeholder="Servido con pimientos de Padrón..."
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs text-charcoal-500 mb-1">Precio (texto mostrado)</label>
          <input
            v-model="plato.precio"
            class="w-full px-3 py-2 border border-cream-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber"
            placeholder="28€"
          />
        </div>
        <div>
          <label class="block text-xs text-charcoal-500 mb-1">Imagen</label>
          <div class="flex gap-2">
            <input
              v-model="plato.imagen"
              placeholder="/images/plato-estrella.jpg"
              class="flex-1 px-3 py-2 border border-cream-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber"
            />
            <label class="bg-cream-100 text-charcoal-700 text-xs px-3 py-2 rounded hover:bg-cream-200 transition-colors cursor-pointer flex items-center">
              Subir
              <input type="file" accept="image/*" class="hidden" @change="uploadImage" />
            </label>
          </div>
        </div>
      </div>

      <div v-if="uploading" class="text-xs text-charcoal-500">Subiendo imagen...</div>

      <!-- Preview -->
      <div v-if="plato.imagen" class="mt-4">
        <label class="block text-xs text-charcoal-500 mb-2">Vista previa</label>
        <img :src="plato.imagen" :alt="plato.nombre" class="w-full max-w-md h-48 object-cover rounded border border-cream-200" />
      </div>

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
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';

const loading = ref(true);
const saving = ref(false);
const saved = ref(false);
const uploading = ref(false);

const plato = ref({
  nombre: 'Cachopo Especial',
  subtitulo: 'Flecha',
  descripcion: '',
  detalle: '',
  precio: '28€',
  imagen: '/images/plato-estrella.jpg',
});

async function uploadImage(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  uploading.value = true;
  try {
    const filename = `estrella-${Date.now()}.${file.name.split('.').pop()}`;
    const fileRef = storageRef(storage, `platos/${filename}`);
    await uploadBytes(fileRef, file);
    plato.value.imagen = await getDownloadURL(fileRef);
  } catch (e: any) {
    alert('Error al subir: ' + (e.message || 'Error'));
  } finally {
    uploading.value = false;
  }
}

async function loadPlato() {
  loading.value = true;
  try {
    const snap = await getDoc(doc(db, 'config', 'platoEstrella'));
    if (snap.exists()) {
      Object.assign(plato.value, snap.data());
    }
  } catch (e) {
    console.error('Error loading plato estrella:', e);
  } finally {
    loading.value = false;
  }
}

async function save() {
  saving.value = true;
  saved.value = false;
  try {
    await setDoc(doc(db, 'config', 'platoEstrella'), {
      ...plato.value,
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

onMounted(loadPlato);
</script>
