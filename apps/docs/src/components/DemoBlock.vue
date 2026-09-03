<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useFramework, type Framework } from "../framework";

const props = withDefaults(
  defineProps<{
    title: string;
    codes?: Partial<Record<Framework, string>>;
    stack?: boolean;
  }>(),
  { codes: () => ({}) },
);

const framework = useFramework();
const tab = ref<Framework>(framework.value);
const showCode = ref(true);

watch(framework, (v) => {
  if (props.codes?.[v]) tab.value = v;
});

const code = computed(() => props.codes?.[tab.value] ?? "");
const tabs = computed(
  () => (["vue", "react", "svelte"] as Framework[]).filter((t) => props.codes?.[t]),
);
</script>

<template>
  <section class="doc-demo">
    <div class="doc-demo__preview" :class="{ 'is-stack': stack }">
      <slot />
    </div>
    <div class="doc-demo__bar">
      <span>{{ title }}</span>
      <div class="doc-demo__tabs">
        <button
          v-for="t in tabs"
          :key="t"
          :class="{ 'is-active': tab === t }"
          @click="tab = t; showCode = true"
        >
          {{ t }}
        </button>
        <button @click="showCode = !showCode">{{ showCode ? "隐藏代码" : "显示代码" }}</button>
      </div>
    </div>
    <pre v-if="showCode && code"><code>{{ code }}</code></pre>
  </section>
</template>
