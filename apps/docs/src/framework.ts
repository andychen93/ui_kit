import { inject, provide, ref, type InjectionKey, type Ref } from "vue";

export type Framework = "vue" | "react" | "svelte";

const KEY: InjectionKey<Ref<Framework>> = Symbol("framework");

export function provideFramework() {
  const stored = localStorage.getItem("argon-kit-fw") as Framework | null;
  const framework = ref<Framework>(stored ?? "vue");
  provide(KEY, framework);

  function select(next: Framework) {
    framework.value = next;
    localStorage.setItem("argon-kit-fw", next);
  }

  return { framework, select };
}

export function useFramework() {
  const fw = inject(KEY);
  if (!fw) throw new Error("framework");
  return fw;
}
