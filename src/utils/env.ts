import type { AppEnvironment } from '@/types/app'

export const getAppEnvironment = (): AppEnvironment => {
  return {
    mode: import.meta.env.MODE,
    release: import.meta.env.VITE_RELEASE || null,
    commit: import.meta.env.VITE_BUILD_HASH || null,
    time: import.meta.env.VITE_BUILD_TIME || null
  }
}
