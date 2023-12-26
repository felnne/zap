<script setup lang="ts">
import SectionTitle from './SectionTitle.vue'
import Idea from './Idea.vue'
</script>

<template>
  <aside class="mb-5 p-5 border-4 border-sky-500">
    <SectionTitle anchor="ideas" title="Ideas" />
    <Idea>BAS Research Topics topic keywords.</Idea>
    <Idea>ISO topic mapped from research topic.</Idea>
    <Idea>Place keywords based on Well-Known Extents.</Idea>
    <Idea complete>Table of contents.</Idea>
    <Idea complete>Dark mode.</Idea>
    <Idea complete>DOI identifier based on file identifier.</Idea>
    <Idea complete>Esri identifier.</Idea>
    <Idea complete>Citation.</Idea>
    <Idea complete>Citation based on real DOI (using CrossCite formatting service).</Idea>
    <Idea complete>Citation based on generated DOI, Title and Contacts.</Idea>
    <Idea>Resource type section</Idea>
    <Idea>Date(s) section</Idea>
    <Idea>Edition section</Idea>
    <Idea>Include `protocol: 'WWW:LINK-1.0-http--link'` in download distribution options.</Idea>
    <Idea>Include WMTS, WFS and Esri in services section.</Idea>
    <Idea>Download proxy items.</Idea>
    <Idea>Colour code distribution options like JWTs.</Idea>
    <p class="mt-4 text-black dark:text-white">
      <em>If there's something else you think would be a good idea let @felnne know.</em>
    </p>
  </aside>
</template>
