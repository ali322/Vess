<template>
  <div class="px-0">
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-20 text-sm">Path</label>
      <input
        type="text"
        spellcheck="false"
        :disabled="running"
        v-model="path"
        class="leading-7 rounded border border-gray-300 text-sm px-2 w-56 disabled:text-gray-500"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, toRefs, onBeforeMount } from 'vue'

const emit = defineEmits<{
  (e:'update'):void
}>()

interface Prop{
  server: Record<string, any>,
  running: boolean
}

const props = defineProps<Prop>()
const { server, running } = toRefs(props)

onBeforeMount(() => {
  if (!server.value.streamSettings.wsSettings) {
    server.value.streamSettings.wsSettings = {path: ''}
  }
})

const path = computed({
  get() {
    return server.value.streamSettings.wsSettings.path
  },
  set(val: string) {
    server.value.streamSettings.wsSettings.path = val
  }
})
</script>