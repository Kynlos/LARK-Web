import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAIStore } from '../aiStore';
import { AIProviderSettings } from '../../types/ai';
import { act } from '@testing-library/react';

vi.mock('../../services/AIService', () => ({
  AIService: {
    getInstance: vi.fn(() => ({
      setProvider: vi.fn(),
    })),
  },
}));

describe('aiStore', () => {
  beforeEach(() => {
    useAIStore.setState({
      settings: {
        activeProvider: '',
        providers: [],
      },
      isConfigured: false,
    });
  });

  describe('Provider Management', () => {
    it('should add a provider', () => {
      const provider: AIProviderSettings = {
        name: 'OpenAI',
        apiEndpoint: 'https://api.openai.com',
        apiKey: 'test-key',
        modelName: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 2000,
      };

      act(() => {
        useAIStore.getState().addProvider(provider);
      });

      const { settings, isConfigured } = useAIStore.getState();
      expect(settings.providers).toHaveLength(1);
      expect(settings.providers[0]).toEqual(provider);
      expect(settings.activeProvider).toBe('OpenAI');
      expect(isConfigured).toBe(true);
    });

    it('should remove a provider', () => {
      const provider1: AIProviderSettings = {
        name: 'OpenAI',
        apiEndpoint: 'https://api.openai.com',
        apiKey: 'test-key-1',
        modelName: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 2000,
      };

      const provider2: AIProviderSettings = {
        name: 'Anthropic',
        apiEndpoint: 'https://api.anthropic.com',
        apiKey: 'test-key-2',
        modelName: 'claude-2',
        temperature: 0.7,
        maxTokens: 2000,
      };

      useAIStore.setState({
        settings: {
          activeProvider: 'OpenAI',
          providers: [provider1, provider2],
        },
        isConfigured: true,
      });

      act(() => {
        useAIStore.getState().removeProvider('OpenAI');
      });

      const { settings } = useAIStore.getState();
      expect(settings.providers).toHaveLength(1);
      expect(settings.providers[0].name).toBe('Anthropic');
      expect(settings.activeProvider).toBe('Anthropic');
    });

    it('should update active provider when removed provider was active', () => {
      const provider1: AIProviderSettings = {
        name: 'OpenAI',
        apiEndpoint: 'https://api.openai.com',
        apiKey: 'test-key-1',
        modelName: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 2000,
      };

      const provider2: AIProviderSettings = {
        name: 'Anthropic',
        apiEndpoint: 'https://api.anthropic.com',
        apiKey: 'test-key-2',
        modelName: 'claude-2',
        temperature: 0.7,
        maxTokens: 2000,
      };

      useAIStore.setState({
        settings: {
          activeProvider: 'OpenAI',
          providers: [provider1, provider2],
        },
        isConfigured: true,
      });

      act(() => {
        useAIStore.getState().removeProvider('OpenAI');
      });

      const { settings } = useAIStore.getState();
      expect(settings.activeProvider).toBe('Anthropic');
    });

    it('should update a provider', () => {
      const originalProvider: AIProviderSettings = {
        name: 'OpenAI',
        apiEndpoint: 'https://api.openai.com',
        apiKey: 'old-key',
        modelName: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 2000,
      };

      useAIStore.setState({
        settings: {
          activeProvider: 'OpenAI',
          providers: [originalProvider],
        },
        isConfigured: true,
      });

      const updatedProvider: AIProviderSettings = {
        ...originalProvider,
        apiKey: 'new-key',
        temperature: 0.9,
      };

      act(() => {
        useAIStore.getState().updateProvider('OpenAI', updatedProvider);
      });

      const { settings } = useAIStore.getState();
      expect(settings.providers[0].apiKey).toBe('new-key');
      expect(settings.providers[0].temperature).toBe(0.9);
    });

    it('should set active provider', () => {
      const provider1: AIProviderSettings = {
        name: 'OpenAI',
        apiEndpoint: 'https://api.openai.com',
        apiKey: 'test-key-1',
        modelName: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 2000,
      };

      const provider2: AIProviderSettings = {
        name: 'Anthropic',
        apiEndpoint: 'https://api.anthropic.com',
        apiKey: 'test-key-2',
        modelName: 'claude-2',
        temperature: 0.7,
        maxTokens: 2000,
      };

      useAIStore.setState({
        settings: {
          activeProvider: 'OpenAI',
          providers: [provider1, provider2],
        },
        isConfigured: true,
      });

      act(() => {
        useAIStore.getState().setActiveProvider('Anthropic');
      });

      const { settings, isConfigured } = useAIStore.getState();
      expect(settings.activeProvider).toBe('Anthropic');
      expect(isConfigured).toBe(true);
    });
  });

  describe('Configuration State', () => {
    it('should not be configured initially', () => {
      const { isConfigured } = useAIStore.getState();
      expect(isConfigured).toBe(false);
    });

    it('should be configured after adding provider', () => {
      const provider: AIProviderSettings = {
        name: 'OpenAI',
        apiEndpoint: 'https://api.openai.com',
        apiKey: 'test-key',
        modelName: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 2000,
      };

      act(() => {
        useAIStore.getState().addProvider(provider);
      });

      const { isConfigured } = useAIStore.getState();
      expect(isConfigured).toBe(true);
    });

    it('should not be configured after removing all providers', () => {
      const provider: AIProviderSettings = {
        name: 'OpenAI',
        apiEndpoint: 'https://api.openai.com',
        apiKey: 'test-key',
        modelName: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 2000,
      };

      useAIStore.setState({
        settings: {
          activeProvider: 'OpenAI',
          providers: [provider],
        },
        isConfigured: true,
      });

      act(() => {
        useAIStore.getState().removeProvider('OpenAI');
      });

      const { isConfigured } = useAIStore.getState();
      expect(isConfigured).toBe(false);
    });
  });
});
