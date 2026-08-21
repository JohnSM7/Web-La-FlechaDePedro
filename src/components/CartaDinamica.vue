<template>
  <div>
    <!-- Navigation tabs (fixed because overflow-x:hidden on body breaks sticky) -->
    <nav ref="categoryNav" class="fixed top-20 left-0 right-0 z-40 bg-cream-50/95 backdrop-blur-md border-b border-cream-200 shadow-sm transition-all duration-300" :class="showCategoryNav ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'">
      <div class="max-w-7xl mx-auto px-5 md:px-10 overflow-x-auto">
        <div class="flex min-w-max">
          <a
            v-for="cat in visibleCategories"
            :key="cat.id"
            :href="`#${cat.id}`"
            :class="[
              'carta-nav-link px-5 py-3.5 text-xs font-sans font-semibold tracking-widest uppercase border-b-2 transition-all duration-200 text-center',
              activeSection === cat.id
                ? 'bg-charcoal-900 text-white border-amber'
                : 'text-charcoal-600 border-transparent hover:text-charcoal-900'
            ]"
            :data-section="cat.id"
            @click.prevent="scrollToSection(cat.id)"
          >
            {{ cat.navLabel }}
          </a>
        </div>
      </div>
    </nav>

    <!-- Loading state -->
    <div v-if="loading" class="py-20 text-center text-charcoal-500 text-sm">Cargando carta...</div>

    <template v-else>
      <!-- Raciones -->
      <section id="raciones" class="py-16 md:py-24 bg-cream-50">
        <div class="max-w-4xl mx-auto px-5 md:px-10">
          <div class="text-center mb-10">
            <p class="font-sans text-xs tracking-[0.3em] uppercase text-terracotta mb-3 flex items-center justify-center gap-3">
              <span class="w-8 h-px bg-terracotta/40"></span>Para compartir<span class="w-8 h-px bg-terracotta/40"></span>
            </p>
            <h2 class="font-display text-3xl md:text-4xl text-charcoal-900">Raciones</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            <div v-for="item in carta.raciones" :key="item.nombre" class="flex justify-between items-baseline border-b border-cream-200/60 pb-2">
              <span class="text-charcoal-800 text-sm font-medium">{{ item.nombre }}</span>
              <span class="text-terracotta font-semibold text-sm ml-4 whitespace-nowrap">{{ item.precio }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Entradas -->
      <section id="entradas" class="py-16 md:py-24 bg-cream-100">
        <div class="max-w-4xl mx-auto px-5 md:px-10">
          <div class="text-center mb-10">
            <p class="font-sans text-xs tracking-[0.3em] uppercase text-terracotta mb-3 flex items-center justify-center gap-3">
              <span class="w-8 h-px bg-terracotta/40"></span>Para empezar<span class="w-8 h-px bg-terracotta/40"></span>
            </p>
            <h2 class="font-display text-3xl md:text-4xl text-charcoal-900">Entradas</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            <div v-for="item in carta.entradas" :key="item.nombre" class="flex justify-between items-baseline border-b border-cream-200/60 pb-2">
              <span class="text-charcoal-800 text-sm font-medium">{{ item.nombre }}</span>
              <span class="text-terracotta font-semibold text-sm ml-4 whitespace-nowrap">{{ item.precio }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Carnes -->
      <section id="carnes" class="py-16 md:py-24 bg-cream-50">
        <div class="max-w-4xl mx-auto px-5 md:px-10">
          <div class="text-center mb-10">
            <p class="font-sans text-xs tracking-[0.3em] uppercase text-terracotta mb-3 flex items-center justify-center gap-3">
              <span class="w-8 h-px bg-terracotta/40"></span>A la brasa y al horno<span class="w-8 h-px bg-terracotta/40"></span>
            </p>
            <h2 class="font-display text-3xl md:text-4xl text-charcoal-900">Carnes</h2>
          </div>
          <div class="space-y-3">
            <div v-for="item in carta.carnes" :key="item.nombre" class="border-b border-cream-200/60 pb-2">
              <div class="flex justify-between items-baseline">
                <span class="text-charcoal-800 text-sm font-medium">{{ item.nombre }}</span>
                <span class="text-terracotta font-semibold text-sm ml-4 whitespace-nowrap">{{ item.precio }}</span>
              </div>
              <p v-if="item.descripcion" class="text-charcoal-500 text-xs mt-0.5 italic">{{ item.descripcion }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Pescados -->
      <section id="pescados" class="py-16 md:py-24 bg-cream-100">
        <div class="max-w-4xl mx-auto px-5 md:px-10">
          <div class="text-center mb-10">
            <p class="font-sans text-xs tracking-[0.3em] uppercase text-terracotta mb-3 flex items-center justify-center gap-3">
              <span class="w-8 h-px bg-terracotta/40"></span>Del mar<span class="w-8 h-px bg-terracotta/40"></span>
            </p>
            <h2 class="font-display text-3xl md:text-4xl text-charcoal-900">Pescados</h2>
          </div>
          <div class="space-y-3 max-w-lg mx-auto">
            <div v-for="item in carta.pescados" :key="item.nombre" class="flex justify-between items-baseline border-b border-cream-200/60 pb-2">
              <span class="text-charcoal-800 text-sm font-medium">{{ item.nombre }}</span>
              <span class="text-terracotta font-semibold text-sm ml-4 whitespace-nowrap">{{ item.precio }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Especialidades -->
      <section id="especialidades" class="py-16 md:py-24 bg-cream-50">
        <div class="max-w-4xl mx-auto px-5 md:px-10">
          <div class="text-center mb-10">
            <p class="font-sans text-xs tracking-[0.3em] uppercase text-terracotta mb-3 flex items-center justify-center gap-3">
              <span class="w-8 h-px bg-terracotta/40"></span>Ofertas especiales de la casa<span class="w-8 h-px bg-terracotta/40"></span>
            </p>
            <h2 class="font-display text-3xl md:text-4xl text-charcoal-900">Especialidades para 2</h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div v-for="item in carta.especialidades" :key="item.nombre" class="bg-white border border-cream-200 rounded-lg p-6 text-center">
              <h3 class="font-display text-lg text-charcoal-900 mb-1">{{ item.nombre }}</h3>
              <p class="text-terracotta font-semibold text-xl mb-1">{{ item.precio }}</p>
              <p v-if="item.nota" class="text-charcoal-500 text-xs italic">{{ item.nota }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Bocadillos + Torradas -->
      <section id="bocadillos" class="py-16 md:py-24 bg-cream-100">
        <div class="max-w-4xl mx-auto px-5 md:px-10">
          <div class="text-center mb-10">
            <p class="font-sans text-xs tracking-[0.3em] uppercase text-terracotta mb-3 flex items-center justify-center gap-3">
              <span class="w-8 h-px bg-terracotta/40"></span>En pan de barra<span class="w-8 h-px bg-terracotta/40"></span>
            </p>
            <h2 class="font-display text-3xl md:text-4xl text-charcoal-900">Bocadillos</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            <div v-for="item in carta.bocadillos" :key="item.nombre" class="flex justify-between items-baseline border-b border-cream-200/60 pb-2">
              <span class="text-charcoal-800 text-sm font-medium">{{ item.nombre }}</span>
              <span class="text-terracotta font-semibold text-sm ml-4 whitespace-nowrap">{{ item.precio }}</span>
            </div>
          </div>

          <div v-if="carta.torradas?.length" class="mt-14">
            <h3 class="font-display text-2xl text-charcoal-900 text-center mb-6">Torradas</h3>
            <div class="space-y-3 max-w-lg mx-auto">
              <div v-for="item in carta.torradas" :key="item.nombre" class="flex justify-between items-baseline border-b border-cream-200/60 pb-2">
                <span class="text-charcoal-800 text-sm font-medium">{{ item.nombre }}</span>
                <span class="text-terracotta font-semibold text-sm ml-4 whitespace-nowrap">{{ item.precio }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sandwiches -->
      <section id="sandwiches" class="py-16 md:py-24 bg-cream-50">
        <div class="max-w-4xl mx-auto px-5 md:px-10">
          <div class="text-center mb-10">
            <p class="font-sans text-xs tracking-[0.3em] uppercase text-terracotta mb-3 flex items-center justify-center gap-3">
              <span class="w-8 h-px bg-terracotta/40"></span>Calientes<span class="w-8 h-px bg-terracotta/40"></span>
            </p>
            <h2 class="font-display text-3xl md:text-4xl text-charcoal-900">Sándwiches y más</h2>
          </div>
          <div class="space-y-3 max-w-lg mx-auto">
            <div v-for="item in carta.sandwiches" :key="item.nombre" class="border-b border-cream-200/60 pb-2">
              <div class="flex justify-between items-baseline">
                <span class="text-charcoal-800 text-sm font-medium">{{ item.nombre }}</span>
                <span class="text-terracotta font-semibold text-sm ml-4 whitespace-nowrap">{{ item.precio }}</span>
              </div>
              <p v-if="item.descripcion" class="text-charcoal-500 text-xs mt-0.5 italic">{{ item.descripcion }}</p>
            </div>
          </div>

          <div v-if="carta.extras?.length" class="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
            <div v-for="item in carta.extras" :key="item.nombre" class="bg-white border border-cream-200 rounded-lg p-5 text-center">
              <h3 class="font-display text-lg text-charcoal-900">{{ item.nombre }}</h3>
              <p class="text-terracotta font-semibold text-lg">{{ item.precio }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Combinados -->
      <section id="combinados" class="py-16 md:py-24 bg-cream-100">
        <div class="max-w-4xl mx-auto px-5 md:px-10">
          <div class="text-center mb-10">
            <p class="font-sans text-xs tracking-[0.3em] uppercase text-terracotta mb-3 flex items-center justify-center gap-3">
              <span class="w-8 h-px bg-terracotta/40"></span>4 platos combinados<span class="w-8 h-px bg-terracotta/40"></span>
            </p>
            <h2 class="font-display text-3xl md:text-4xl text-charcoal-900">Para degustar</h2>
          </div>
          <div class="space-y-3 max-w-2xl mx-auto">
            <div v-for="item in carta.combinados" :key="item.nombre" class="flex justify-between items-start border-b border-cream-200/60 pb-3 gap-4">
              <span class="text-charcoal-800 text-sm font-medium">{{ item.nombre }}</span>
              <span class="text-terracotta font-semibold text-sm whitespace-nowrap">{{ item.precio }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Postres -->
      <section id="postres" class="py-16 md:py-24 bg-cream-50">
        <div class="max-w-4xl mx-auto px-5 md:px-10">
          <div class="text-center mb-10">
            <p class="font-sans text-xs tracking-[0.3em] uppercase text-terracotta mb-3 flex items-center justify-center gap-3">
              <span class="w-8 h-px bg-terracotta/40"></span>Para terminar<span class="w-8 h-px bg-terracotta/40"></span>
            </p>
            <h2 class="font-display text-3xl md:text-4xl text-charcoal-900">Postres</h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 max-w-lg mx-auto">
            <div v-for="item in carta.postres" :key="item.nombre" class="flex justify-between items-baseline border-b border-cream-200/60 pb-2">
              <span class="text-charcoal-800 text-sm font-medium">{{ item.nombre }}</span>
              <span class="text-terracotta font-semibold text-sm ml-4 whitespace-nowrap">{{ item.precio }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Vinos -->
      <section id="vinos" class="py-16 md:py-24 bg-cream-100">
        <div class="max-w-4xl mx-auto px-5 md:px-10">
          <div class="text-center mb-10">
            <p class="font-sans text-xs tracking-[0.3em] uppercase text-terracotta mb-3 flex items-center justify-center gap-3">
              <span class="w-8 h-px bg-terracotta/40"></span>Bodega<span class="w-8 h-px bg-terracotta/40"></span>
            </p>
            <h2 class="font-display text-3xl md:text-4xl text-charcoal-900">Vinos</h2>
          </div>

          <!-- Tintos -->
          <div v-if="carta.vinosTintos?.length" class="mb-12">
            <h3 class="font-display text-2xl text-charcoal-900 mb-1">Valdepeñas / Tintos</h3>
            <p class="text-charcoal-500 text-xs mb-4">Botella · Copa Salón · Copa Terraza</p>
            <div class="space-y-3">
              <div v-for="vino in carta.vinosTintos" :key="vino.nombre" class="flex justify-between items-baseline border-b border-cream-200/60 pb-2 gap-4">
                <span class="text-charcoal-800 text-sm font-medium">{{ vino.nombre }}</span>
                <span class="text-terracotta font-semibold text-xs ml-4 whitespace-nowrap">
                  {{ vino.botella || vino.precio }}{{ vino.copa ? ` · ${vino.copa}` : '' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Blancos -->
          <div v-if="carta.vinosBlancos?.length" class="mb-12">
            <h3 class="font-display text-2xl text-charcoal-900 mb-1">Rosado / Blanco / Albariños</h3>
            <p class="text-charcoal-500 text-xs mb-4">Botella · Copa Salón · Copa Terraza</p>
            <div class="space-y-3">
              <div v-for="vino in carta.vinosBlancos" :key="vino.nombre" class="flex justify-between items-baseline border-b border-cream-200/60 pb-2 gap-4">
                <span class="text-charcoal-800 text-sm font-medium">{{ vino.nombre }}</span>
                <span class="text-terracotta font-semibold text-xs ml-4 whitespace-nowrap">
                  {{ vino.botella || vino.precio }}{{ vino.copa ? ` · ${vino.copa}` : '' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Otros -->
          <div v-if="carta.otrosVinos?.length">
            <h3 class="font-display text-2xl text-charcoal-900 mb-4">Sangría y más</h3>
            <div class="space-y-3 max-w-md">
              <div v-for="item in carta.otrosVinos" :key="item.nombre" class="flex justify-between items-baseline border-b border-cream-200/60 pb-2">
                <span class="text-charcoal-800 text-sm font-medium">{{ item.nombre }}</span>
                <span class="text-terracotta font-semibold text-sm ml-4 whitespace-nowrap">{{ item.precio }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-16 bg-charcoal-900 text-center">
        <div class="max-w-2xl mx-auto px-5">
          <h2 class="font-display text-3xl text-white mb-4">
            ¿Te hemos abierto el <span class="text-amber italic">apetito</span>?
          </h2>
          <p class="text-white/70 text-sm mb-8">Reserva tu mesa y disfruta de nuestra cocina tradicional.</p>
          <a
            href="/#ubicaciones"
            class="inline-flex items-center gap-2 px-10 py-4 bg-amber text-charcoal-900 font-sans font-semibold text-sm tracking-widest uppercase rounded transition-all duration-300 hover:bg-amber-dark hover:-translate-y-0.5 hover:shadow-lg"
          >
            Reservar Mesa
          </a>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cartaDefecto } from '../lib/carta-defecto';

interface CartaItem {
  nombre: string;
  precio: string;
  descripcion?: string;
  botella?: string;
  copa?: string;
  nota?: string;
}

type CartaData = Record<string, CartaItem[]>;

const carta = ref<CartaData>(cartaDefecto);
const loading = ref(false);
const activeSection = ref('raciones');
const showCategoryNav = ref(false);
const categoryNav = ref<HTMLElement | null>(null);
let isManualScroll = false;

const visibleCategories = computed(() => [
  { id: 'raciones', navLabel: 'Raciones' },
  { id: 'entradas', navLabel: 'Entradas' },
  { id: 'carnes', navLabel: 'Carnes' },
  { id: 'pescados', navLabel: 'Pescados' },
  { id: 'especialidades', navLabel: 'Especialidades' },
  { id: 'bocadillos', navLabel: 'Bocadillos' },
  { id: 'sandwiches', navLabel: 'Sandwiches' },
  { id: 'combinados', navLabel: 'Combinados' },
  { id: 'postres', navLabel: 'Postres' },
  { id: 'vinos', navLabel: 'Vinos' },
]);

function scrollNavLink(id: string) {
  const navLink = document.querySelector(`.carta-nav-link[data-section="${id}"]`) as HTMLElement | null;
  if (navLink) {
    const container = navLink.closest('.overflow-x-auto');
    if (container) {
      const linkLeft = navLink.offsetLeft;
      const linkWidth = navLink.offsetWidth;
      const containerWidth = container.clientWidth;
      container.scrollTo({ left: linkLeft - containerWidth / 2 + linkWidth / 2, behavior: 'smooth' });
    }
  }
}

function scrollToSection(id: string) {
  isManualScroll = true;
  activeSection.value = id;
  scrollNavLink(id);
  const el = document.getElementById(id);
  if (el) {
    const navHeight = 130;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
    const html = document.documentElement;
    html.style.scrollBehavior = 'auto';
    window.scrollTo(0, top);
    html.style.scrollBehavior = '';
    setTimeout(() => { isManualScroll = false; }, 500);
  } else {
    isManualScroll = false;
  }
}

async function loadCarta() {
  try {
    const timeout = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 3000)
    );
    const fetch = getDoc(doc(db, 'config', 'cartaCompleta'));
    const snap = await Promise.race([fetch, timeout]);
    if (snap && typeof snap === 'object' && 'exists' in snap && snap.exists()) {
      const data = snap.data();
      const merged: CartaData = { ...cartaDefecto };
      for (const key of Object.keys(merged)) {
        if (data[key]?.length) {
          merged[key] = data[key];
        }
      }
      carta.value = merged;
    }
  } catch (e) {
    // Firestore not available, static data already shown
  }
}

function handleScroll() {
  const contentCarta = document.getElementById('content-carta');
  if (contentCarta) {
    showCategoryNav.value = contentCarta.getBoundingClientRect().top <= 80;
  }
}

onMounted(() => {
  loadCarta();
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  const sectionIds = visibleCategories.value.map(c => c.id);
  const observer = new IntersectionObserver(
    (entries) => {
      if (isManualScroll) return;
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id;
          scrollNavLink(entry.target.id);
        }
      }
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
