<script setup lang="ts">
import SectionTitle from './SectionTitle.vue'
import Idea from './Idea.vue'
</script>

<template>
  <aside class="mb-5 p-5 border-4 border-sky-500">
    <SectionTitle anchor="ideas" title="Ideas" />
    <Idea
      >Keywords section with 'Living and working in Antarctica' and 'Topographic mapping'
      options.</Idea
    >
    <Idea>Citation section related to DOI.</Idea>
    <Idea>Place keywords based on Well-Known Extents.</Idea>
    <Idea>Include `protocol: 'WWW:LINK-1.0-http--link'` in download distribution options.</Idea>
    <Idea>Include WMTS, WFS and Esri in services section.</Idea>
    <Idea>Download proxy items.</Idea>
    <Idea>Colour code distribution options like JWTs.</Idea>
    <Idea complete>Table of contents.</Idea>
    <Idea complete>Dark mode.</Idea>
    <Idea>DOI identifier based on file identifier.</Idea>
    <Idea>Esri identifier.</Idea>
    <p class="mt-4 text-black dark:text-white">
      <em>If there's something else you think would be a good idea let @felnne know.</em>
    </p>
  </aside>
</template>
