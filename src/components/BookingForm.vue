<template>
  <form @submit.prevent="submit" class="space-y-4 max-w-lg mx-auto bg-white p-6 rounded-xl shadow">
    <div>
      <label class="text-sm font-medium">目的地</label>
      <select v-model="destinationId" class="mt-1 w-full px-3 py-2 rounded border">
        <option value="" disabled>选择目的地</option>
        <option v-for="d in destinations" :key="d.id" :value="d.id">{{ d.name }}</option>
      </select>
    </div>
    <div>
      <label class="text-sm font-medium">姓名</label>
      <input v-model="name" type="text" class="mt-1 w-full px-3 py-2 rounded border" />
      <p v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</p>
    </div>
    <div>
      <label class="text-sm font-medium">邮箱</label>
      <input v-model="email" type="email" class="mt-1 w-full px-3 py-2 rounded border" />
      <p v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</p>
    </div>
    <div>
      <label class="text-sm font-medium">手机 (可选)</label>
      <input v-model="phone" type="text" class="mt-1 w-full px-3 py-2 rounded border" />
      <p v-if="errors.phone" class="text-xs text-red-500">{{ errors.phone }}</p>
    </div>
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label class="text-sm font-medium">出行日期</label>
        <input v-model="date" type="date" class="mt-1 w-full px-3 py-2 rounded border" />
        <p v-if="errors.date" class="text-xs text-red-500">{{ errors.date }}</p>
      </div>
      <div class="w-28">
        <label class="text-sm font-medium">人数</label>
        <input v-model.number="people" type="number" min="1" class="mt-1 w-full px-3 py-2 rounded border" />
        <p v-if="errors.people" class="text-xs text-red-500">{{ errors.people }}</p>
      </div>
    </div>
    <div>
      <label class="text-sm font-medium">备注 (可选)</label>
      <textarea v-model="note" rows="3" class="mt-1 w-full px-3 py-2 rounded border"></textarea>
    </div>
    <div v-if="price" class="text-sm text-primaryGreen">预估价格: ¥{{ price }}</div>
    <button :disabled="submitting" class="w-full px-4 py-2 rounded bg-primaryGreen text-white disabled:opacity-50">{{ submitting ? '提交中...' : '提交预定' }}</button>
    <p v-if="resultMsg" :class="['text-sm', success ? 'text-primaryGreen' : 'text-red-500']">{{ resultMsg }}</p>
  </form>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { destinations } from '../data/destinations';
import { isEmail, isPhone } from '../utils/validation';

const destinationId = ref('');
const name = ref('');
const email = ref('');
const phone = ref('');
const date = ref('');
const people = ref(1);
const note = ref('');
const submitting = ref(false);
const success = ref(false);
const resultMsg = ref('');
const errors = ref<Record<string,string>>({});

const price = computed(() => {
  const dest = destinations.find(d => d.id === destinationId.value);
  if (!dest || !dest.basePrice) return 0;
  return dest.basePrice * people.value;
});

function validate(){
  const e: Record<string,string> = {};
  if (!destinationId.value) e.destination = '请选择目的地';
  if (!name.value) e.name = '姓名必填';
  if (!email.value) e.email = '邮箱必填'; else if (!isEmail(email.value)) e.email = '邮箱格式不正确';
  if (phone.value && !isPhone(phone.value)) e.phone = '手机号格式不正确';
  if (!date.value) e.date = '请选择日期';
  if (people.value < 1) e.people = '人数至少为 1';
  errors.value = e;
  return Object.keys(e).length === 0;
}

async function submit(){
  if (!validate()) return;
  submitting.value = true;
  resultMsg.value = '';
  success.value = false;
  await new Promise(r => setTimeout(r, 800));
  const failed = Math.random() < 0.1;
  if (failed){ resultMsg.value = '预定失败，请稍后再试'; }
  else {
    resultMsg.value = '预定成功！我们将尽快联系您';
    success.value = true;
    name.value=''; email.value=''; phone.value=''; date.value=''; people.value=1; note.value=''; destinationId.value='';
  }
  submitting.value = false;
}
</script>
