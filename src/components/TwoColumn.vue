<template>
  <div class="flex space-x-4">
    <div class="flex w-1/2 flex-col">
      <slot name="left"></slot>
    </div>
    <div class="flex w-1/2 flex-col">
      <slot name="right"></slot>
    </div>
  </div>
</template>
