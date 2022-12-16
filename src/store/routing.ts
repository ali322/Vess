import { ref, Ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore(
  'routing',
  () => {
    const routes: Ref<Record<string, any>[]> = ref([
      {
        name: 'cn-site',
        type: 'domain',
        value: 'geosite:cn',
        outboundTag: 'direct'
      },
      {
        name: 'cn-ip',
        type: 'ip',
        value: 'geoip:cn,geoip:private',
        outboundTag: 'direct'
      },
      {
        name: 'foreign-site',
        type: 'domain',
        value: 'geosite:geolocation-!cn',
        outboundTag: 'proxy'
      }
    ])
    const domainStrategy = ref('IPIfNonMatch')

    return { routes, domainStrategy }
  },
  { persist: true }
)
