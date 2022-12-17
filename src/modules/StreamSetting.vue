<template>
  <div class="px-4">
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-20 text-sm">Security</label>
      <Select class="rounded w-20" v-model:value="security" :disabled="running">
        <Option value="none">none</Option>
        <Option value="tls">tls</Option>
        <Option value="xtls">xtls</Option>
      </Select>
    </div>
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-20 text-sm">ServerName</label>
      <input
        type="text"
        spellcheck="false"
        :disabled="running"
        v-model="serverName"
        class="leading-7 rounded border border-gray-300 text-sm px-2 w-56 disabled:text-gray-500"
      />
    </div>
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-20 text-sm">Fingerprint</label>
      <Select
        class="rounded w-56"
        v-model:value="fingerprint"
        :disabled="running"
      >
        <Option value="none">none</Option>
        <Option value="chrome">chrome</Option>
        <Option value="firefox">firefox</Option>
        <Option value="safari">safari</Option>
        <Option value="randomized">randomized</Option>
      </Select>
    </div>
    <div class="flex items-center py-2 text-left">
      <label class="mr-6 text-gray-500 w-20 text-sm">Network</label>
      <Select
        class="rounded w-20"
        v-model:value="server.streamSettings.network"
        :disabled="running"
      >
        <Option value="tcp">tcp</Option>
        <Option value="grpc">grpc</Option>
        <Option value="ws">ws</Option>
      </Select>
    </div>
    <Grpc v-if="networkForm == 'grpc'" v-bind="{ server, running }" v-on:update="emit('update')"/>
    <Websocket v-if="networkForm == 'ws'" v-bind="{ server, running }" v-on:update="emit('update')"/>
  </div>
</template>
<script lang="ts" setup>
import { computed, toRefs } from 'vue'
import Select from '../components/Select.vue'
import Option from '../components/Option.vue'
import Grpc from './Grpc.vue'
import Websocket from './Websocket.vue'

const emit = defineEmits<{
  (e: 'update'): void
}>()


interface Prop {
  server: Record<string, any>
  running: boolean
}

const props = defineProps<Prop>()
const { server, running } = toRefs(props)

const network = computed({
  get() {
    return server.value.streamSettings.network
  },
  set(val) {
    server.value.streamSettings.network = val
    emit('update')
  }
})

const serverName = computed({
  get() {
    if (server.value.streamSettings.security === 'tls') {
      return server.value.streamSettings.tlsSettings.serverName
    } else if (server.value.streamSettings.security === 'xtls') {
      return server.value.streamSettings.xtlsSettings.serverName
    }
  },
  set(val: string) {
    if (server.value.streamSettings.security === 'tls') {
      server.value.streamSettings.tlsSettings.serverName = val
    } else if (server.value.streamSettings.security === 'xtls') {
      server.value.streamSettings.xtlsSettings.serverName = val
    }
    emit('update')
  }
})

const fingerprint = computed({
  get() {
    if (server.value.streamSettings.security === 'tls') {
      return server.value.streamSettings.tlsSettings.fingerprint
    } else if (server.value.streamSettings.security === 'xtls') {
      return server.value.streamSettings.xtlsSettings.fingerprint
    }
  },
  set(val: string) {
    if (server.value.streamSettings.security === 'tls') {
      server.value.streamSettings.tlsSettings.fingerprint = (val === 'none' ? '' : val)
    } else if (server.value.streamSettings.security === 'xtls') {
      server.value.streamSettings.xtlsSettings.fingerprint = (val === 'none' ? '' : val)
    }
    emit('update')
  }
})

const security = computed({
  get() {
    return server.value.streamSettings.security
  },
  set(val: string) {
    if (val === 'xtls') {
      server.value.streamSettings.xtlsSettings = server.value.streamSettings.xtlsSettings || { serverName: '' }
      server.value.streamSettings.tlsSettings = null
    }
    if (val === 'tls') {
      server.value.streamSettings.tlsSettings = server.value.streamSettings.tlsSettings || { serverName: '' }
      server.value.streamSettings.xtlsSettings = null
    }
    server.value.streamSettings.security = val
    emit('update')
  }
})

const networkForm = computed(() => {
  return server.value.streamSettings.network
})
</script>