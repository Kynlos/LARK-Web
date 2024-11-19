import { Plugin, PluginManager } from './types';

class PluginManagerImpl implements PluginManager {
  private plugins: Map<string, Plugin> = new Map();

  async registerPlugin(plugin: Plugin): Promise<void> {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin with id ${plugin.id} is already registered`);
    }

    try {
      await plugin.initialize();
      this.plugins.set(plugin.id, plugin);
      console.log(`Plugin ${plugin.name} (${plugin.id}) registered successfully`);
    } catch (error) {
      console.error(`Failed to initialize plugin ${plugin.name}:`, error);
      throw error;
    }
  }

  async unregisterPlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) {
      throw new Error(`Plugin with id ${pluginId} is not registered`);
    }

    try {
      if (plugin.cleanup) {
        await plugin.cleanup();
      }
      this.plugins.delete(pluginId);
      console.log(`Plugin ${plugin.name} (${pluginId}) unregistered successfully`);
    } catch (error) {
      console.error(`Failed to cleanup plugin ${plugin.name}:`, error);
      throw error;
    }
  }

  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }
}

export const pluginManager = new PluginManagerImpl();
