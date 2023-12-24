<script setup lang="ts">
import { ref } from 'vue'

import AppTitle from './components/AppTitle.vue'
import ChangeLog from './components/ChangeLog.vue'
import Contacts from './components/Contacts.vue'
import Downloads from './components/Downloads.vue'
import FileIdentifier from './components/FileIdentifier.vue'
import Freetext from './components/Freetext.vue'
import GeographicExtent from './components/GeographicExtent.vue'
import Ideas from './components/Ideas.vue'
import Identifiers from './components/Identifiers.vue'
import Licence from './components/Licence.vue'
import Preface from './components/Preface.vue'
import Resources from './components/Resources.vue'
import Services from './components/Services.vue'

const fileIdentifier = ref('')
</script>

<template>
  <main class="font-sans-serif m-10 mt-0">
    <AppTitle />
    <Preface />
    <FileIdentifier @update:fileIdentifier="fileIdentifier = $event" />
    <Identifiers :fileIdentifier="fileIdentifier" />
    <Contacts />
    <Licence />
    <GeographicExtent />
    <Downloads />
    <Services />
    <Freetext />
    <Resources />
    <Ideas />
    <ChangeLog />
  </main>
</template>
