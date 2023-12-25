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
    <Idea>Dynamic table of contents.</Idea>
    <Idea
      >Add option to include an identifier for a DOI based on the file identifier (e.g. ADD).</Idea
    >
    <Idea>Add checkbox to include an identifier for a related Esri item.</Idea>
    <p class="mt-4">
      <em>If there's something else you think would be a good idea let @felnne know.</em>
    </p>
  </aside>
</template>
