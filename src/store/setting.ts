import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'

export default defineStore(
  'setting',
  () => {
    const socksPort = ref(1088)
    const httpPort = ref(1089)
    const apiPort = ref(1085)
    const extra: Ref<Record<string, any>> = ref({})

    const restoreSetting = () => {
      socksPort.value = 1088
      httpPort.value = 1089
      apiPort.value = 1085
      extra.value = {}
    }
    return { socksPort, httpPort, apiPort, extra, restoreSetting }
  },
  { persist: true }
)
