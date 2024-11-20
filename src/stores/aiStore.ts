import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AIUserSettings, AIProviderSettings } from '../types/ai';
import { AIService } from '../services/AIService';

interface AIStore {
    settings: AIUserSettings;
    isConfigured: boolean;
    addProvider: (provider: AIProviderSettings) => void;
    removeProvider: (name: string) => void;
    updateProvider: (name: string, provider: AIProviderSettings) => void;
    setActiveProvider: (name: string) => void;
}

const DEFAULT_SETTINGS: AIUserSettings = {
    activeProvider: '',
    providers: []
};

export const useAIStore = create<AIStore>()(
    persist(
        (set, get) => ({
            settings: DEFAULT_SETTINGS,
            isConfigured: false,

            addProvider: (provider: AIProviderSettings) => {
                set((state) => {
                    const newProviders = [...state.settings.providers, provider];
                    const newSettings = {
                        ...state.settings,
                        providers: newProviders,
                        activeProvider: provider.name // Set as active provider when added
                    };
                    return {
                        settings: newSettings,
                        isConfigured: true // Set isConfigured to true when provider is added
                    };
                });
                AIService.getInstance().setProvider(provider);
            },

            removeProvider: (name: string) => {
                set((state) => {
                    const newProviders = state.settings.providers.filter(p => p.name !== name);
                    const newActiveProvider = state.settings.activeProvider === name
                        ? newProviders[0]?.name || ''
                        : state.settings.activeProvider;

                    const newSettings = {
                        ...state.settings,
                        providers: newProviders,
                        activeProvider: newActiveProvider
                    };

                    if (newActiveProvider) {
                        const provider = newProviders.find(p => p.name === newActiveProvider);
                        if (provider) {
                            AIService.getInstance().setProvider(provider);
                        }
                    }

                    return {
                        settings: newSettings,
                        isConfigured: newProviders.length > 0
                    };
                });
            },

            updateProvider: (name: string, updatedProvider: AIProviderSettings) => {
                set((state) => {
                    const newProviders = state.settings.providers.map(p =>
                        p.name === name ? updatedProvider : p
                    );

                    const newSettings = {
                        ...state.settings,
                        providers: newProviders
                    };

                    if (state.settings.activeProvider === name) {
                        AIService.getInstance().setProvider(updatedProvider);
                    }

                    return {
                        settings: newSettings,
                        isConfigured: true
                    };
                });
            },

            setActiveProvider: (name: string) => {
                set((state) => {
                    const provider = state.settings.providers.find(p => p.name === name);
                    if (provider) {
                        const newSettings = {
                            ...state.settings,
                            activeProvider: name
                        };
                        AIService.getInstance().setProvider(provider);
                        return {
                            settings: newSettings,
                            isConfigured: true // Ensure isConfigured is true when setting active provider
                        };
                    }
                    return state;
                });
            }
        }),
        {
            name: 'ai-settings'
        }
    )
);
