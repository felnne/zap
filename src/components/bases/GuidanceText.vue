<script setup lang="ts">
import { getSetting } from '@/lib/data'

const app_assets_base = getSetting('app_assets_base')

const logo_src = `${app_assets_base}/logo.png`
</script>

<template>
  <div class="flex items-center space-x-1 text-orange-700 italic dark:text-orange-500">
    <img class="h-6 rounded-full object-cover" :src="logo_src" />
    <p><slot></slot></p>
  </div>
</template>
