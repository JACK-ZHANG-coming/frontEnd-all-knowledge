import type { GlobConfig } from '#/config';

import { getAppEnvConfig } from '@/utils/env';

export const useGlobSetting = (): Readonly<GlobConfig> => {
  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_VIRTUAL_SERVER,
    VITE_GLOB_SERVER_LIST,
    VITE_GLOB_WEBSOCKET_URL,
    VITE_GLOB_JRJ_CONFIG,
  } = getAppEnvConfig();

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_TITLE.replace(/\s/g, '_').replace(/-/g, '_'),
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    uploadUrl: VITE_GLOB_UPLOAD_URL,
    virtualIp: VITE_GLOB_VIRTUAL_SERVER,
    ipList: VITE_GLOB_SERVER_LIST,
    wsUrl: VITE_GLOB_WEBSOCKET_URL,
    jrjConfig: VITE_GLOB_JRJ_CONFIG,
  };
  return glob as Readonly<GlobConfig>;
};
