import { ref, watch } from 'vue';
import type { Destination } from '../types/destination';

const KEY = 'recent-destinations';
const recent = ref<Destination[]>([]);

function load(){
  try { const raw = localStorage.getItem(KEY); if(raw) recent.value = JSON.parse(raw); } catch(e){ /* ignore */ }
}
function add(dest: Destination){ recent.value = [dest, ...recent.value.filter(d => d.id !== dest.id)].slice(0,5); }
watch(recent, () => { try { localStorage.setItem(KEY, JSON.stringify(recent.value)); } catch(e){} }, { deep: true });
load();
export function useRecent(){ return { recent, add }; }
