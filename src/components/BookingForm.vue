<template>
  <Form @submit="onSubmit" class="space-y-4 max-w-lg mx-auto bg-white p-6 rounded-xl shadow" v-slot="{ errors }">
    <div>
      <label class="text-sm font-medium">目的地</label>
      <Field name="destinationId" as="select" :rules="'required'" class="mt-1 w-full px-3 py-2 rounded border">
        <option value="" disabled>选择目的地</option>
        <option v-for="d in destinations" :key="d.id" :value="d.id">{{ d.name }}</option>
      </Field>
      <ErrorMessage name="destinationId" class="text-xs text-red-500" />
    </div>
    <div>
      <label class="text-sm font-medium">姓名</label>
      <Field name="name" as="input" type="text" :rules="'required'" class="mt-1 w-full px-3 py-2 rounded border" />
      <ErrorMessage name="name" class="text-xs text-red-500" />
    </div>
    <div>
      <label class="text-sm font-medium">邮箱</label>
      <Field name="email" as="input" type="email" :rules="'required|email'" class="mt-1 w-full px-3 py-2 rounded border" />
      <ErrorMessage name="email" class="text-xs text-red-500" />
    </div>
    <div>
      <label class="text-sm font-medium">手机 (可选)</label>
      <Field name="phone" as="input" type="text" rules="phone" class="mt-1 w-full px-3 py-2 rounded border" />
      <ErrorMessage name="phone" class="text-xs text-red-500" />
    </div>
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label class="text-sm font-medium">出行日期</label>
        <Field name="date" as="input" type="date" rules="required" class="mt-1 w-full px-3 py-2 rounded border" />
        <ErrorMessage name="date" class="text-xs text-red-500" />
      </div>
      <div class="w-28">
        <label class="text-sm font-medium">人数</label>
        <Field name="people" as="input" type="number" rules="'required|min1'" class="mt-1 w-full px-3 py-2 rounded border" />
        <ErrorMessage name="people" class="text-xs text-red-500" />
      </div>
    </div>
    <div>
      <label class="text-sm font-medium">备注 (可选)</label>
      <Field name="note" as="textarea" rows="3" class="mt-1 w-full px-3 py-2 rounded border" />
    </div>
    <div v-if="price" class="text-sm text-primaryGreen">预估价格: ¥{{ price }}</div>
    <button :disabled="submitting || Object.keys(errors).length>0" class="w-full px-4 py-2 rounded bg-primaryGreen text-white disabled:opacity-50">{{ submitting ? '提交中...' : '提交预定' }}</button>
    <p v-if="resultMsg" :class="['text-sm', success ? 'text-primaryGreen' : 'text-red-500']">{{ resultMsg }}</p>
  </Form>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate';
import { destinations } from '../data/destinations';
import { isEmail, isPhone } from '../utils/validation';

defineRule('required', value => {
  if (value === null || value === undefined || value === '') return '必填';
  return true;
});
defineRule('email', value => {
  if (!value) return '邮箱必填';
  return isEmail(String(value)) ? true : '邮箱格式不正确';
});
defineRule('phone', value => {
  if (!value) return true; // optional
  return isPhone(String(value)) ? true : '手机号格式不正确';
});
defineRule('min1', value => {
  const num = Number(value);
  return num >= 1 ? true : '人数至少为 1';
});

configure({ validateOnBlur: true, validateOnChange: true, validateOnInput: false, validateOnModelUpdate: true });

const submitting = ref(false);
const success = ref(false);
const resultMsg = ref('');

// Form values will be passed to onSubmit.
const price = computed(() => {
  // price needs destinationId & people; will access last submitted/active form state using a helper closure variable via onSubmit arg when needed.
  return 0; // dynamic reactive price computed below using current form state via destinations.
});

// We need a reactive reference to current form values for price calculation.
const currentValues = ref<{ destinationId?: string; people?: number }>({});
const dynamicPrice = computed(() => {
  const dest = destinations.find(d => d.id === currentValues.value.destinationId);
  if (!dest || !dest.basePrice) return 0;
  const count = currentValues.value.people ?? 0;
  return dest.basePrice * count;
});

// expose dynamicPrice as price
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _replacePrice = price; // placeholder to keep prior variable name if used externally

function onSubmit(values: Record<string, any>, { resetForm }: { resetForm: () => void }) {
  submitting.value = true;
  resultMsg.value = '';
  success.value = false;
  currentValues.value = { destinationId: values.destinationId, people: Number(values.people) };
  setTimeout(() => {
    const failed = Math.random() < 0.1;
    if (failed) {
      resultMsg.value = '预定失败，请稍后再试';
    } else {
      resultMsg.value = '预定成功！我们将尽快联系您';
      success.value = true;
      resetForm();
      currentValues.value = {};
    }
    submitting.value = false;
  }, 800);
}
</script>
<script lang="ts">
// expose computed price for template binding
export default {
  computed: {
    price() {
      return (this as any).dynamicPrice ?? 0;
    },
    dynamicPrice() {
      return (this as any).$setup?.dynamicPrice?.value ?? 0;
    }
  }
};
</script>
