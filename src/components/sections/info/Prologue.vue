<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'

import { AppEnvironmentLabel, Stability, SectionType } from '@/types/enum'
import type { AppEnvironment } from '@/types/app'
import { getSetting } from '@/lib/data'

import SectionBorder from '@/components/bases/SectionBorder.vue'
import SectionTitle from '@/components/bases/SectionTitle.vue'
import GuidanceText from '@/components/bases/GuidanceText.vue'
import Link from '@/components/bases/Link.vue'

const props = defineProps({
  appEnv: {
    type: Object as () => AppEnvironment,
    required: true,
  },
})

const prodUrl = getSetting('app_production_url')

const gitlabUrl = getSetting('app_gitlab_url')

const unreleasedChangesUrl = `${gitlabUrl}/-/blob/main/CHANGELOG.md#unreleased`

let title: ComputedRef<string> = computed(() => {
  if (props.appEnv.label == AppEnvironmentLabel.LocalDevelopment) {
    return '👩‍💻 Local Development 👨‍💻'
  }
  if (props.appEnv.label == AppEnvironmentLabel.ReviewApp) {
    return '‼️ Review Application ‼️'
  }
  if (props.appEnv.label == AppEnvironmentLabel.Integration) {
    return '🚨  Integration 🚨'
  }
  if (props.appEnv.label == AppEnvironmentLabel.Production) {
    return '⚠️ Experimental ⚠️ '
  }
  return 'Unknown Environment'
})
</script>

<template>
  <SectionBorder :type="SectionType.Info">
    <SectionTitle
      :type="SectionType.Info"
      version="2.1"
      :stability="Stability.Stable"
      anchor="prologue"
      :title="title"
      :add-toc="false"
    />
    <div class="space-y-4">
      <template v-if="appEnv.label == AppEnvironmentLabel.LocalDevelopment">
        <GuidanceText>Meow!</GuidanceText>
      </template>
      <template v-else-if="appEnv.label == AppEnvironmentLabel.ReviewApp">
        <p class="font-bold">
          This is a preview of a new feature or change, and may not work properly.
        </p>
        <p>Review apps are used to try out new features or other changes to this tool.</p>
        <p>
          As they are under active development, they will not be well tested and may break or behave
          strangely.
        </p>
        <p>
          See the relevant issue and/or merge request in the
          <Link :href="gitlabUrl">GitLab Project</Link> for information about what this review app
          has changed and how to give feedback. There may (but usually isn't) multiple reviews
          active at once.
        </p>
        <GuidanceText
          >Unless you have been asked to review this change, you should use the
          <Link :href="prodUrl">Production Version</Link> of this tool instead.</GuidanceText
        >
      </template>
      <template v-else-if="appEnv.label == AppEnvironmentLabel.Integration">
        <p class="font-bold">This is a preview of the next version of this tool.</p>
        <p>
          This preview version, termed <em>integration</em>, contains all changes since the last
          production release, a list of which can be found in the project
          <Link :href="unreleasedChangesUrl">change log</Link>.
        </p>
        <p>
          Everything in this preview version should work correctly, but may be missing context
          whilst other changes are made prior to the next release.
        </p>
        <GuidanceText
          >Unless you have been asked to test this preview version, you should use the
          <Link :href="prodUrl">Production Version</Link> of this tool instead.</GuidanceText
        >
      </template>
      <template v-else-if="appEnv.label == AppEnvironmentLabel.Production">
        <p class="font-bold">This tool is experimental and must not be relied upon.</p>
        <p>
          It may become properly supported if it proves useful enough. Features may change or stop
          working unexpectedly.
        </p>
        <p>
          This tool is aimed at producing one-off records. Bulk creation should use tools like the
          <Link href="https://gitlab.data.bas.ac.uk/uk-pdc/metadata-infrastructure/metadata-library"
            >BAS Metadata Library</Link
          >
          instead.
        </p>
        <GuidanceText>Meow! Look out for text like this for top tips and guidance.</GuidanceText>
      </template>
      <template v-else>
        <div>Something</div>
      </template>
    </div>
  </SectionBorder>
</template>
