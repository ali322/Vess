<template>
  <div class="px-0">
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-20 text-sm">ServiceName</label>
      <input
        type="text"
        spellcheck="false"
        :disabled="running"
        v-model="serviceName"
        class="leading-7 rounded border border-gray-300 text-sm px-2 w-64 disabled:text-gray-500"
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
    if (!server.value.streamSettings.grpcSettings) {
      server.value.streamSettings.grpcSettings = {serviceName: ''}
    }
  })
  
  const serviceName = computed({
    get() {
      return server.value.streamSettings.grpcSettings.serviceName
    },
    set(val: string) {
      server.value.streamSettings.grpcSettings.serviceName = val
    }
  })
  </script>