<template>
  <div class="px-8">
    <div class="text-left pt-4 pb-6 flex">
      <div class="flex-1 flex items-center">
        <label class="text-gray-500 w-32 text-sm">Domain Strategy</label>
        <Select class="rounded pr-8 w-40" v-model:value="domainStrategy">
          <Option value="AsIs">AsIs</Option>
          <Option value="IPIfNonMatch">IPIfNonMatch</Option>
          <Option value="IPOnDemand">IPOnDemand</Option>
        </Select>
      </div>
      <button class="btn-success" @click="startCreate">
        <PlusOutlined class="w-4 h-4" />
      </button>
    </div>
    <div class="grid grid-cols-4 gap-4">
      <div class="rounded border border-gray-300 py-2" v-for="(v, k) in routes" :key="k" @click="chose(k, v)">
        <p class="text-sm pb-1">{{ v.outboundTag }} - {{ v.type }}</p>
        <p class="text-xs text-gray-500">{{ v.name }}</p>
      </div>
    </div>
    <Modal :actived="modalActivated" @close="modalActivated = false">
      <div class="py-4">
        <div class="px-4">
          <div class="flex items-center py-2 text-left">
            <label class="text-gray-500 w-20 text-sm">Name</label>
            <input type="text" v-model="current.name" spellcheck="false"
              class="py-1 rounded border border-gray-300 text-sm px-2 w-64 disabled:text-gray-500" />
          </div>
          <div class="flex items-center py-2 text-left">
            <label class="text-gray-500 w-20 text-sm">Tag</label>
            <Select class="rounded pr-8 w-60" v-model:value="current.outboundTag">
              <Option value="direct">direct</Option>
              <Option value="proxy">proxy</Option>
              <Option value="block">block</Option>
            </Select>
          </div>
          <div class="flex items-center py-2 text-left">
            <label class="text-gray-500 w-20 text-sm">Type</label>
            <Select class="rounded pr-8 w-60" v-model:value="current.type">
              <Option value="domain">domain</Option>
              <Option value="ip">ip</Option>
            </Select>
          </div>
          <div class="flex items-center py-2 text-left">
            <label class="text-gray-500 w-20 text-sm">Value</label>
            <input type="text" v-model="current.value" spellcheck="false"
              class="py-1 rounded border border-gray-300 text-sm px-2 w-64 disabled:text-gray-500" />
          </div>
          <div class="pt-4 flex justify-center items-center">
            <button class="btn-success" @click="save">
              <span class="mx-1 leading-7 text-sm">Save</span>
            </button>
            <button class="btn-danger ml-4" @click="del">
              <span class="mx-1 leading-7 text-sm">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
import { ref, Ref, computed, watch } from 'vue'
import { PlusOutlined } from '@vicons/material'
import { storeToRefs } from 'pinia'
import Modal from '../components/Modal.vue'
import Select from '../components/Select.vue'
import Option from '../components/Option.vue'
import useRoutingStore from '@/store/routing'

const store = useRoutingStore()
const modalActivated = ref(false)
const { routes, domainStrategy } = storeToRefs(store)

const chose = (k: number, val: Record<string, any>) => {
  selected.value = k
  current.value = Object.assign({}, val)
  isEditMode.value = true
  modalActivated.value = true
}

const startCreate = () => {
  isEditMode.value = false
  current.value = initForm
  modalActivated.value = true
}

const save = () => {
  if (isEditMode.value) {
    routes.value[selected.value] = current.value
  } else {
    routes.value.push(current.value)
  }
  modalActivated.value = false
}

const del = () => {
  routes.value.splice(selected.value, 1)
  modalActivated.value = false
}

const isEditMode = ref(false)
const selected = ref(0)
const initForm = {
  outboundTag: 'direct',
  name: '',
  type: 'domain',
  value: ''
}
const current: Ref<Record<string, any>> = ref(initForm)
</script>