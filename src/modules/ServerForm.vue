<template>
  <div class="py-2 flex-1">
    <div class="flex px-4 pb-2 pt-2 justify-end items-center">
      <div class="flex-1 text-left flex">
        <label class="mr-6 text-gray-500 w-20">Tag</label>
        <input type="text" spellcheck="false" :disabled="running" v-model="tag"
          class="leading-7 rounded border border-gray-300 text-sm px-2 w-20 disabled:text-gray-500" />
      </div>
      <div v-if="running" class="pr-4 text-xs text-gray-500 flex items-center"> <ArrowUpwardOutlined class="w-3 h-4"></ArrowUpwardOutlined> {{ uplink }}</div>
      <div v-if="running" class="pr-4 text-xs text-gray-500 flex items-center"> <ArrowDownwardOutlined class="w-3 h-4"></ArrowDownwardOutlined>{{ downlink }}</div>
      <button class="w-16 h-[30px] flex items-center" :class="running ? 'btn-danger' : 'btn-success'" @click="run">
        <StopRound class="w-5 h-5" v-if="running"></StopRound>
        <PlayArrowRound class="w-5 h-5" v-else></PlayArrowRound>
        <span class="mx-1 leading-7">{{ running ? 'stop' : 'run' }}</span>
      </button>
    </div>
    <div class="px-4">
      <div class="flex items-center py-2 text-left">
        <label class="mr-6 text-gray-500 w-20 text-sm">Protocol</label>
        <Select class="rounded w-20" v-model:value="protocol" :disabled="running">
          <Option value="vless">vless</Option>
          <Option value="trojan">trojan</Option>
          <Option value="vmess">vmess</Option>
        </Select>
      </div>
    </div>
    <component :is="protocolForm" v-bind="{ server, running }" v-on:update="onServerUpdate" />
    <StreamSetting :server="server" :running="running" @update="onServerUpdate" />
    <Toast ref="toastRef" />
  </div>
</template>
<script lang="ts">
import { ref, computed, toRefs, defineComponent, PropType, nextTick } from 'vue'
import { PlayArrowRound, StopRound, SaveOutlined, ArrowUpwardOutlined, ArrowDownwardOutlined } from '@vicons/material'
import { debounce } from 'ts-debounce'
import { storeToRefs } from 'pinia'
import useServerStore from '@/store/server'
import Select from '@/components/Select.vue'
import Option from '@/components/Option.vue'
import Confirm from '@/components/Confirm.vue'
import Toast from '@/components/Toast.vue'
import Vless from './Vless.vue'
import Trojan from './Trojan.vue'
import Vmess from './Vmess.vue'
import StreamSetting from './StreamSetting.vue'
import { outboundByProtocol } from '@/conf'

export default defineComponent({
  components: {
    PlayArrowRound, StopRound, SaveOutlined, ArrowUpwardOutlined, ArrowDownwardOutlined,
    Select, Option, Toast, Confirm, Trojan, Vmess, Vless, StreamSetting
  },
  props: {
    server: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({})
    },
    downlink: String,
    uplink: String,
    index: Number
  },
  setup(props, context) {
    const { server, uplink, downlink } = toRefs(props)
    const toastRef = ref<InstanceType<typeof Toast>>()

    const store = useServerStore()
    const { running } = storeToRefs(store)
    const run = () => {
      context.emit('run')
    }
    const tag = computed({
      get() {
        return server.value.tag
      },
      set(val) {
        server.value.tag = val
        onServerUpdate()
      }
    })
    const protocol = computed({
      get() {
        return server.value.protocol
      },
      set(val: string) {
        server.value.protocol = val
        server.value.settings = outboundByProtocol(val)
        onServerUpdate()
      }
    })
    const d = debounce(() => {
      store.saveServer({ server: server.value, index: props.index })
    }, 300, { isImmediate: false })
    const onServerUpdate = () => {
      d()
    }
    const protocolForm = computed(() => {
      return server.value.protocol.replace(/( |^)[a-z]/g, (l: string) => l.toUpperCase())
    })
    return {
      run, tag, protocol, running, uplink, downlink, toastRef, protocolForm, onServerUpdate
    }
  }
})

</script>