<template>
  <div class="h-full w-full p-6">
    <div class="flex items-center pb-4">
      <label class="text-gray-500 text-sm">Socks Port</label>
      <div class="flex-1 flex justify-end items-center">
        <input type="text" v-model="socksPort" class="py-1 rounded border border-gray-300 text-xs px-2 w-16" />
      </div>
    </div>
    <div class="flex items-center pb-4">
      <label class="text-gray-500 text-sm">Http Port</label>
      <div class="flex-1 flex justify-end items-center">
        <input type="text" v-model="httpPort" class="py-1 rounded border border-gray-300 text-xs px-2 w-16" />
      </div>
    </div>
    <div class="flex items-center pb-4">
      <label class="text-gray-500 text-sm">API Port</label>
      <div class="flex-1 flex justify-end items-center">
        <input type="text" v-model="apiPort" class="py-1 rounded border border-gray-300 text-xs px-2 w-16" />
      </div>
    </div>
    <div class="flex items-center pb-4">
      <label class="text-gray-500 text-sm">Extra Config</label>
      <div class="flex-1 flex justify-end items-center">
        <div class="ml-2 flex justify-center items-center" @click="changeExtra">
          <ReadMoreOutlined class="w-5 h-5 cursor-pointer"></ReadMoreOutlined>
        </div>
      </div>
    </div>
    <div class="flex items-center pb-4">
      <label class="text-gray-500 text-sm">Export Config</label>
      <div class="flex-1 flex justify-end items-center">
        <div class="ml-4" @click="exportConfig">
          <OutputFilled class="w-5 h-5 cursor-pointer"></OutputFilled>
        </div>
      </div>
    </div>
    <div class="flex items-center pb-4">
      <label class="text-gray-500 text-sm">Import Servers</label>
      <div class="flex-1 flex justify-end items-center">
        <div class="ml-4" @click="importServers">
          <UploadFilled class="w-5 h-5 cursor-pointer"></UploadFilled>
        </div>
      </div>
    </div>
    <div class="flex items-center pb-4">
      <label class="text-gray-500 text-sm">Export Servers</label>
      <div class="flex-1 flex justify-end items-center">
        <div class="ml-4" @click="exportServers">
          <DownloadFilled class="w-5 h-5 cursor-pointer"></DownloadFilled>
        </div>
      </div>
    </div>
    <div class="flex items-center pb-4">
      <label class="text-gray-500 text-sm">Reset Settings</label>
      <div class="flex-1 flex justify-end items-center">
        <div class="ml-4" @click="restore">
          <RestoreFilled class="w-5 h-5 cursor-pointer"></RestoreFilled>
        </div>
      </div>
    </div>
    <div class="flex items-center pb-4">
      <label class="text-gray-500 text-sm">Clear Cache</label>
      <div class="flex-1 flex justify-end items-center">
        <div class="ml-4" @click="clearCache">
          <DeleteOutlined class="w-5 h-5 cursor-pointer"></DeleteOutlined>
        </div>
      </div>
    </div>
    <Toast ref="toastRef" />
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue'
import { path, dialog, tauri, fs } from '@tauri-apps/api'
import { ReadMoreOutlined, RestoreFilled, UploadFilled, DownloadFilled, OutputFilled, DeleteOutlined } from '@vicons/material'
import useSettingStore from '@/store/setting'
import useServerStore from '@/store/server'
import useRoutingStore from '@/store/routing'
import Toast from '../components/Toast.vue'
import { mergeSettings } from '@/conf'
import { storeToRefs } from 'pinia'
import { clearCache } from '@/util'

export default defineComponent({
  components: { ReadMoreOutlined, RestoreFilled, UploadFilled, DownloadFilled, DeleteOutlined, OutputFilled, Toast },
  setup(props, context) {
    const toastRef = ref<InstanceType<typeof Toast>>()
    const settingStore = useSettingStore()
    const serverStore = useServerStore()
    const routingStore = useRoutingStore()
    const { httpPort, socksPort, apiPort, extra } = storeToRefs(settingStore)

    const changeExtra = async () => {
      const t = toastRef.value as any
      try {
        const homeDir = await path.homeDir()
        const extraFile = await dialog.open({
          defaultPath: await path.join(homeDir)
        })
        if (extraFile) {
          let next = {}
          try {
            const content = await tauri.invoke("import_file", { path: extraFile })
            next = JSON.parse(content as string)
          } catch (e) { }
          extra.value = next
          t.show('change extra config success')
        }
      } catch (e) {
        t.error(e)
      }
    }
    const exportConfig = async () => {
      const t = toastRef.value as any
      try {
        const { servers, selected } = storeToRefs(serverStore)
        const { routes, domainStrategy } = storeToRefs(routingStore)
        let config = mergeSettings(
          servers.value[selected.value],
          { domainStrategy: domainStrategy.value, routes: routes.value },
          { httpPort: httpPort.value, socksPort: socksPort.value, apiPort: apiPort.value, extra: extra.value }
        )
        const homeDir = await path.homeDir()
        const exportDir = await dialog.open({
          title: 'export to directory',
          defaultPath: await path.join(homeDir),
          directory: true
        })
        if (exportDir) {
          await tauri.invoke("export_file", { path: `${exportDir as string}/config.json`, content: JSON.stringify(config, null, 2) })
          t.show("export config success")
        }
      } catch (e) {
        t.error(e)
      }
    }
    const restore = () => {
      settingStore.restoreSetting()
    }
    const importServers = async () => {
      const t = toastRef.value as any
      try {
        const homeDir = await path.homeDir()
        const importFile = await dialog.open({
          defaultPath: await path.join(homeDir)
        })
        if (importFile) {
          const content = await tauri.invoke("import_file", { path: importFile })
          const servers = JSON.parse(content as string)
          serverStore.loadServer(servers)
          t.show("import servers success")
        }
      } catch (e) {
        t.error(e)
      }
    }

    const exportServers = async () => {
      const t = toastRef.value as any
      try {
        const homeDir = await path.homeDir()
        const exportDir = await dialog.open({
          title: 'export to directory',
          defaultPath: await path.join(homeDir),
          directory: true
        })
        if (exportDir) {
          await tauri.invoke("export_file", {
            path: `${exportDir as string}/server.json`,
            content: JSON.stringify(serverStore.servers, null, 2)
          })
          t.show("export success")
        }
      } catch (e) {
        t.error(e)
      }
    }
    const clearCache = () => {
      const t = toastRef.value as any
      clearCache()
      t.show('clear local cache success')
    }
    return {
      changeExtra, restore, socksPort, httpPort, apiPort, extra, importServers, exportServers, exportConfig, clearCache, toastRef
    }
  }
})
</script>