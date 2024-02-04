import type { App } from 'vue'
import * as Sentry from '@sentry/vue'

export function initSentry(app: App) {
  /*
   * Configures Sentry JS SDK
   *
   * - enables standard error tracking
   * - configures contextual information such as the release and environment
   * - configures the Sentry feedback reporting tool
   */
  Sentry.init({
    dsn: 'https://36f93b70327ebb4a5e4c8c8a8db7f8fe@o39753.ingest.sentry.io/4506485894086656',
    app: app,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_BUILD_HASH || 'dev',
    integrations: [
      new Sentry.Feedback({
        showBranding: false,
        showEmail: false,
        isNameRequired: true,
        buttonLabel: 'Feedback',
        submitButtonLabel: 'Send Feedback',
        formTitle: 'Send Feedback',
        namePlaceholder: 'Connie',
        messageLabel: 'Feedback',
        messagePlaceholder: 'I like it but...',
        successMessageText: "I'll have a think.",
      }),
    ],
  })
}
