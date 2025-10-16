import { ref, computed } from 'vue';
import { destinations } from '../data/destinations';
import type { Destination } from '../types/destination';

export function useDestinations(){
  const search = ref('');
  const category = ref<string | null>(null);
  const selected = ref<Destination | null>(null);

  const filtered = computed(() => destinations.filter(d => {
    const sOk = !search.value || d.name.toLowerCase().includes(search.value.toLowerCase());
    const cOk = !category.value || d.category === category.value;
    return sOk && cOk;
  }));

  function selectDestination(d: Destination){ selected.value = d; }
  function clear(){ selected.value = null; }

  return { search, category, filtered, selected, selectDestination, clear };
}
