<script setup lang="ts">
import { ref } from 'vue'

import Abstract from './components/Abstract.vue'
import AppTitle from './components/AppTitle.vue'
import ChangeLog from './components/ChangeLog.vue'
import Contacts from './components/Contacts.vue'
import Downloads from './components/Downloads.vue'
import FileIdentifier from './components/FileIdentifier.vue'
import GeographicExtent from './components/GeographicExtent.vue'
import Ideas from './components/Ideas.vue'
import Identifiers from './components/Identifiers.vue'
import Licence from './components/Licence.vue'
import Lineage from './components/Lineage.vue'
import Preface from './components/Preface.vue'
import Resources from './components/Resources.vue'
import Services from './components/Services.vue'
import Title from './components/Title.vue'

const fileIdentifier = ref('')
</script>

<template>
  <main class="font-sans-serif m-10 mt-0">
    <AppTitle />
    <Preface />
    <FileIdentifier @update:fileIdentifier="fileIdentifier = $event" />
    <Identifiers :fileIdentifier="fileIdentifier" />
    <Title />
    <Abstract />
    <Contacts />
    <Licence />
    <GeographicExtent />
    <Downloads />
    <Services />
    <Lineage />
    <Resources />
    <Ideas />
    <ChangeLog />
  </main>
</template>
