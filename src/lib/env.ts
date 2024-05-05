import { AppEnvironmentLabel } from '@/types/enum'
import type { AppEnvironment } from '@/types/app'

export const getAppEnvironment = (path: string): AppEnvironment => {
  /*
   * Gather build information
   *
   * Taken from environment variables and the current URL path to determine the context the app is operating within.
   *
   * Consists of:
   * - label: local development, production, etc.
   * - commit: the Git commit, set within CI/CD
   * - time: the build time, set within CI/CD as a frozen value
   */
  let label = AppEnvironmentLabel.LocalDevelopment

  if (path.includes('/review')) {
    label = AppEnvironmentLabel.ReviewApp
  } else if (path.includes('/integration/')) {
    label = AppEnvironmentLabel.Integration
  } else if (path.includes('/prod/')) {
    label = AppEnvironmentLabel.Production
  }

  return {
    label: label,
    commit: import.meta.env.VITE_BUILD_HASH || null,
    time: import.meta.env.VITE_BUILD_TIME || null,
  }
}

export const getAppBorderClasses = (env: AppEnvironment): string[] => {
  if (env.label === AppEnvironmentLabel.LocalDevelopment) {
    return ['border-black', 'dark:border-white']
  }

  if (env.label === AppEnvironmentLabel.ReviewApp) {
    return ['border-indigo-500']
  }

  if (env.label === AppEnvironmentLabel.Integration) {
    return ['border-orange-500']
  }

  if (env.label === AppEnvironmentLabel.Production) {
    return ['border-white', 'dark:border-black']
  }

  return []
}
