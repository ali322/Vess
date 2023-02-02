<template>
  <div class="px-0">
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-20 text-sm">MultiMode</label>
      <Select
        class="rounded w-20"
        v-model:value="multiMode"
        :disabled="running"
      >
        <Option :value="true">开</Option>
        <Option :value="false">关</Option>
      </Select>
    </div>
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-20 text-sm">ServiceName</label>
      <input
        type="text"
        spellcheck="false"
        :disabled="running"
        v-model="serviceName"
        class="leading-7 rounded border border-gray-300 text-sm px-2 w-56 disabled:text-gray-500"
      />
    </div>
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-20 text-sm">IdleTimeout</label>
      <input
        type="text"
        spellcheck="false"
        :disabled="running"
        v-model="idleTimeout"
        class="leading-7 rounded border border-gray-300 text-sm px-2 w-56 disabled:text-gray-500"
      />
    </div>
  </div>
  </template>
  <script lang="ts" setup>
  import { computed, toRefs, onBeforeMount } from 'vue'
  import Select from '@/components/Select.vue'
  import Option from '@/components/Option.vue'
  
  const emit = defineEmits<{
    (e:'update'):void
  }>()
  
  interface Prop{
    server: Record<string, any>,
    running: boolean
  }
  
  const props = defineProps<Prop>()
  const { server, running } = toRefs(props)
  
  const serviceName = computed({
    get() {
      return server.value.streamSettings.grpcSettings.serviceName
    },
    set(val: string) {
      server.value.streamSettings.grpcSettings.serviceName = val
    }
  })
  const multiMode = computed({
    get() {
      return server.value.streamSettings.grpcSettings.multiMode || false
    },
    set(val: boolean) {
      server.value.streamSettings.grpcSettings.multiMode = val
    }
  })
  const idleTimeout = computed({
    get() {
      return server.value.streamSettings.grpcSettings.idle_timeout || 10
    },
    set(val: string) {
      server.value.streamSettings.grpcSettings.idle_timeout = parseInt(val)
    }
  })
  </script>