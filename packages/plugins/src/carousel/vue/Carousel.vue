<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { CarouselProps } from "../../core/types";

const props = withDefaults(defineProps<CarouselProps>(), {
  interval: 5000,
  indicators: true,
  controls: true,
});

const active = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const count = computed(() => props.items.length);

function go(i: number) {
  active.value = (i + count.value) % count.value;
}

function start() {
  stop();
  if (props.interval > 0 && count.value > 1) {
    timer = setInterval(() => go(active.value + 1), props.interval);
  }
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

onMounted(start);
onBeforeUnmount(stop);
</script>

<template>
  <div class="ag-carousel" @mouseenter="stop" @mouseleave="start">
    <div class="ag-carousel__track" :style="{ transform: `translateX(-${active * 100}%)` }">
      <div v-for="(item, i) in items" :key="item.key ?? i" class="ag-carousel__item">
        <img v-if="item.src" :src="item.src" :alt="item.alt ?? ''" />
        <div v-else style="min-height: 240px; display: flex; align-items: center; justify-content: center; background: var(--ag-gradient-primary); color: #fff; font-size: 20px; font-weight: 600;">
          <component :is="item.content" v-if="typeof item.content === 'object'" />
          <template v-else>{{ item.content }}</template>
        </div>
        <div v-if="item.caption" class="ag-carousel__caption">
          <h5>{{ item.caption }}</h5>
          <p v-if="item.description">{{ item.description }}</p>
        </div>
      </div>
    </div>
    <button
      v-if="controls"
      type="button"
      class="ag-carousel__control ag-carousel__control--prev"
      aria-label="previous"
      @click="go(active - 1)"
    >‹</button>
    <button
      v-if="controls"
      type="button"
      class="ag-carousel__control ag-carousel__control--next"
      aria-label="next"
      @click="go(active + 1)"
    >›</button>
    <div v-if="indicators" class="ag-carousel__indicators">
      <button
        v-for="(item, i) in items"
        :key="i"
        type="button"
        class="ag-carousel__indicator"
        :class="{ 'is-active': i === active }"
        :aria-label="`slide ${i + 1}`"
        @click="go(i)"
      />
    </div>
  </div>
</template>
