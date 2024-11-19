export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  initialize: () => Promise<void>;
  cleanup?: () => Promise<void>;
}

export interface PluginManager {
  registerPlugin: (plugin: Plugin) => void;
  unregisterPlugin: (pluginId: string) => void;
  getPlugin: (pluginId: string) => Plugin | undefined;
  getAllPlugins: () => Plugin[];
}
