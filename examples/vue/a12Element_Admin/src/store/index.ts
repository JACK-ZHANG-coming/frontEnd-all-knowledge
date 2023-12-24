import type { App } from 'vue';
import { createPinia } from 'pinia';

export const store = createPinia();

export function setupStore(app: App<Element>) {
  app.use(store);
}

export * from './modules';
