<template>
  <div class="px-4">
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-20 text-sm">Host</label>
      <input
        type="text"
        spellcheck="false"
        :disabled="running"
        v-model="host"
        class="leading-7 rounded border border-gray-300 text-sm px-2 w-64 disabled:text-gray-500"
      />
    </div>
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-20 text-sm">Port</label>
      <input
        type="text"
        spellcheck="false"
        :disabled="running"
        v-model="port"
        class="leading-7 rounded border border-gray-300 text-sm px-2 w-64 disabled:text-gray-500"
      />
    </div>
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-20 text-sm">Password</label>
      <input
        type="text"
        spellcheck="false"
        :disabled="running"
        v-model="password"
        class="leading-7 rounded border border-gray-300 text-sm px-2 w-64 disabled:text-gray-500"
      />
    </div>
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-20 text-sm">Flow</label>
      <Select class="rounded pr-8 w-60" v-model:value="flow" :disabled="running">
        <Option value="none">none</Option>
        <Option value="xtls-rprx-direct">xtls-rprx-direct</Option>
        <Option value="xtls-rprx-vision">xtls-rprx-vison</Option>
        <Option value="xtls-rprx-direct-udp443">xtls-rprx-direct-udp443</Option>
      </Select>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, toRefs } from 'vue'

const emit = defineEmits<{
  (e:'update'):void
}>()

interface Prop{
  server: Record<string, any>,
  running: boolean,
}

const props = defineProps<Prop>()
const { server, running } = toRefs(props)

const host = computed({
  get() {
    return server.value.settings.servers[0].address
  },
  set(val: string) {
    server.value.settings.servers[0].address = val
    emit('update')
  }
})
const port = computed({
  get() {
    return server.value.settings.servers[0].port
  },
  set(val: string) {
    server.value.settings.servers[0].port = parseInt(val)
    emit('update')
  }
})

const password = computed({
  get() {
    return server.value.settings.servers[0].password
  },
  set(val) {
    server.value.settings.servers[0].password = val
    emit('update')
  }
})
const flow = computed({
  get() {
    return server.value.settings.servers[0].flow
  },
  set(val: string) {
    server.value.settings.servers[0].flow = (val === 'none' ? '' : val)
    emit('update')
  }
})
</script>