<template>
  <div class="flex space-x-4">
    <div class="flex w-1/3 flex-col">
      <slot name="left"></slot>
    </div>
    <div class="flex w-1/3 flex-col">
      <slot name="middle"></slot>
    </div>
    <div class="flex w-1/3 flex-col">
      <slot name="right"></slot>
    </div>
  </div>
</template>
