<template>
  <div class="h-full flex">
    <ServerList :servers="servers" :index="selected" @select="selectOne" @add="addOne" @remove="removeOne" />
    <ServerForm :server="servers[selected]" :uplink="uplink" :downlink="downlink" :index="selected" @run='runOne' @update="changeOne"
      v-if="servers.length > 0" />
    <Confirm ref="confirmRef" />
  </div>
</template>
<script lang="ts">
import { ref, computed, watch, defineComponent, defineAsyncComponent, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { ArrowUpwardOutlined, ArrowDownwardOutlined, AddFilled, PlayArrowRound, StopRound, EditOutlined } from '@vicons/material'
import { tauri, event } from '@tauri-apps/api'
import Modal from '@/components/Modal.vue'
import Confirm from '@/components/Confirm.vue'
import outbound from '@/conf/outbound'
import { mergeSettings } from '@/conf'
import { normalizeByte } from '@/util'
import useServerStore from '@/store/server'
import useRoutingStore from '@/store/routing'
import useSettingStore from '@/store/setting'

export default defineComponent({
  components: {
    ArrowUpwardOutlined, ArrowDownwardOutlined, AddFilled, PlayArrowRound, StopRound, EditOutlined,
    Modal, Confirm,
    ServerForm: defineAsyncComponent(() => import('../modules/ServerForm.vue')),
    ServerList: defineAsyncComponent(() => import('../modules/ServerList.vue')),
  },
  setup(props, context) {
    const confirmRef = ref<InstanceType<typeof Confirm>>()
    
    const serverStore = useServerStore()
    const { selected, servers, running } = storeToRefs(serverStore)
    const settingStore = useSettingStore()
    const {httpPort, socksPort, apiPort, extra} = storeToRefs(settingStore)
    watch(() => servers.value.length, (curr, prev) => {
      if (prev === 0 && curr > 0) {
        selectOne(curr - 1)
      }
    })
    const selectOne = (i: number) => {
      if (running.value === true) return
      selected.value = i
    }
    const addOne = () => {
      serverStore.createServer(outbound)
      selected.value = servers.value.length - 1
    }
    const changeOne = (server: Record<string, any>) => {
      serverStore.saveServer({ server, index: selected.value })
    }
    const removeOne = () => {
      const c = confirmRef.value as any
      c.show('Are u sure?', (isOk: boolean) => {
        if (isOk) {
          serverStore.deleteServer(selected.value)
          selected.value = servers.value.length - 1
        }
      })
    }
    event.listen('run-xray', (evt: { payload: string }) => {
      serverStore.writeOutput(evt.payload)
    })
    const downlink = ref('')
    const uplink = ref('')
    event.listen('stats-xray', (evt: { payload: string }) => {
      const ret = JSON.parse(evt.payload)
      for (let row of ret.stat) {
        if (row.name === 'outbound>>>proxy>>>traffic>>>downlink') {
          downlink.value = `${normalizeByte(row.value)}/s`
        }
        if (row.name === 'outbound>>>proxy>>>traffic>>>uplink') {
          uplink.value = `${normalizeByte(row.value)}/s`
        }
      }
    })
    const getStats = () => {
      tauri.invoke('stats_xray', { api: `127.0.0.1:${apiPort.value}` })
    }
    const startOne = async () => {
      const routingStore = useRoutingStore()
      const { routes, domainStrategy } = storeToRefs(routingStore)
      let config = mergeSettings(
        servers.value[selected.value],
        { domainStrategy: domainStrategy.value, routes: routes.value },
        { httpPort: httpPort.value, socksPort: socksPort.value, apiPort: apiPort.value, extra: extra.value }
      )
      tauri.invoke('run_xray', { config: JSON.stringify(config, null, 2) })
      running.value = true
    }
    const stopOne = () => {
      event.emit('stop-xray')
      serverStore.purgeOutput()
      running.value = false
    }
    let timer: any
    const runOne = () => {
      if (running.value) {
        stopOne()
        if (timer) {
          clearInterval(timer)
        }
      } else {
        startOne()
        timer = setInterval(() => {
          getStats()
        }, 500)
      }
    }

    return {
      selectOne,
      selected,
      getStats,
      addOne,
      changeOne,
      runOne,
      removeOne,
      servers,
      running,
      downlink,
      uplink,
      confirmRef
    }
  }
})
</script>