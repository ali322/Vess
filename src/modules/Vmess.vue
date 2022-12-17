<template>
  <div class="px-4">
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-20 text-sm">Host</label>
      <input
        type="text"
        spellcheck="false"
        :disabled="running"
        v-model="host"
        class="leading-7 rounded border border-gray-300 text-sm px-2 w-56 disabled:text-gray-500"
      />
    </div>
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-20 text-sm">Port</label>
      <input
        type="text"
        spellcheck="false"
        :disabled="running"
        v-model="port"
        class="leading-7 rounded border border-gray-300 text-sm px-2 w-20 disabled:text-gray-500"
      />
    </div>
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-20 text-sm">ID</label>
      <input
        type="text"
        spellcheck="false"
        :disabled="running"
        v-model="server.settings.vnext[0].users[0].id"
        class="leading-7 rounded border border-gray-300 text-sm px-2 w-80 disabled:text-gray-500"
      />
    </div>
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-20 text-sm">AlterId</label>
      <input
        type="text"
        spellcheck="false"
        :disabled="running"
        v-model="alterId"
        class="leading-7 rounded border border-gray-300 text-sm px-2 w-20 disabled:text-gray-500"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, toRefs } from 'vue'
import Select from '@/components/Select.vue'
import Option from '@/components/Option.vue'


interface Prop{
  server: Record<string, any>,
  running: boolean
}

const props = defineProps<Prop>()
const { server, running } = toRefs(props)

const emit = defineEmits<{
  (e:'update'):void
}>()

const host = computed({
  get() {
    return server.value.settings.vnext[0].address
  },
  set(val: string) {
    server.value.settings.vnext[0].address = val
    emit('update')
  }
})
const port = computed({
  get() {
    return server.value.settings.vnext[0].port
  },
  set(val: string) {
    server.value.settings.vnext[0].port = (val === '' ? 0 : parseInt(val))
    emit('update')
  }
})

const alterId = computed({
  get() {
    return server.value.settings.vnext[0].users[0].alterId
  },
  set(val: string) {
    server.value.settings.vnext[0].users[0].alterId = (val === '' ? 0 : parseInt(val))
    emit('update')
  }
})
</script>