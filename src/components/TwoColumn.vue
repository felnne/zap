<template>
  <div class="flex space-x-4">
    <div class="w-1/2 flex flex-col">
      <slot name="left"></slot>
    </div>
    <div class="w-1/2 flex flex-col">
      <slot name="right"></slot>
    </div>
  </div>
</template>
