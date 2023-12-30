<script setup lang="ts">
import SectionBorder from '../components/SectionBorder.vue'
import SectionTitle from '../components/SectionTitle.vue'
import Idea from './Idea.vue'
</script>

<template>
  <SectionBorder border-colour-class="border-sky-500">
    <SectionTitle anchor="ideas" title="Ideas" />
    <div class="space-y-4">
      <div class="space-y-2">
        <Idea>BAS Research Topics topic keywords.</Idea>
        <Idea>ISO topic mapped from research topic.</Idea>
        <Idea>Place keywords based on Well-Known Extents.</Idea>
        <Idea complete>Table of contents.</Idea>
        <Idea complete>Dark mode.</Idea>
        <Idea complete>DOI identifier based on file identifier.</Idea>
        <Idea complete>Esri identifier.</Idea>
        <Idea complete>Citation.</Idea>
        <Idea complete>Citation based on real DOI (using CrossCite formatting service).</Idea>
        <Idea complete
          >Citation based on Resource Type, generated DOI, Title, Edition, Publication date and
          Contacts.</Idea
        >
        <Idea complete>Resource type section.</Idea>
        <Idea complete>(Published) date section.</Idea>
        <Idea>Additional dates.</Idea>
        <Idea complete>Edition section.</Idea>
        <Idea>Include `protocol: 'WWW:LINK-1.0-http--link'` in download distribution options.</Idea>
        <Idea>Include WMTS, WFS and Esri in services section.</Idea>
        <Idea>Download proxy items.</Idea>
        <Idea>Colour code distribution options like JWTs.</Idea>
        <Idea>Aggregations section.</Idea>
        <Idea>Collections resource type.</Idea>
        <Idea>Validation.</Idea>
        <Idea>Preserving input values (like GitLab editor).</Idea>
        <Idea>Button to load sample data for all sections.</Idea>
        <Idea>Record history (deep link to GitLab file history).</Idea>
      </div>
      <p>
        <em
          >If there's something else you think would be a good idea let
          <strong>@felnne</strong> know.</em
        >
      </p>
    </div>
  </SectionBorder>
</template>
