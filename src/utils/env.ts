import type { AppEnvironment } from '@/types/app'

export const getAppEnvironment = (): AppEnvironment => {
  /*
   * Load build information
   *
   * - mode: https://vitejs.dev/guide/env-and-mode#modes
   * - commit: the Git commit available within CI/CD
   * - time: the build time set within CI/CD as a frozen value
   */
  return {
    mode: import.meta.env.MODE,
    commit: import.meta.env.VITE_BUILD_HASH || null,
    time: import.meta.env.VITE_BUILD_TIME || null,
  }
}
