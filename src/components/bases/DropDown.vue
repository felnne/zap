<script setup lang="ts">
import { computed, type ComputedRef, type PropType } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

import type { DropdownItem } from '@/types/app'

import Button from '@/components/bases/Button.vue'
import Link from '@/components/bases/Link.vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array as PropType<DropdownItem[]>,
    default: () => [],
  },
  itemsClasses: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})

let linkClasses: ComputedRef<string[]> = computed(() => {
  return [...props.itemsClasses, 'block', 'text-sm']
})
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton>
        <Button>{{ title }} ▼</Button>
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 z-10 mt-1 w-56 origin-top-right space-y-2 border border-black bg-white p-2 text-xs shadow-sm focus:outline-hidden dark:border-white dark:bg-black"
      >
        <MenuItem v-for="item in items" :key="item.href" v-slot="{ active }">
          <Link :classes="[...linkClasses, active ? 'font-medium' : '']" :href="item.href">{{
            item.title
          }}</Link>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>
