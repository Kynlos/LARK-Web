import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAIStore } from '../../stores/aiStore';
import { AIProviderSettings } from '../../types/ai';
import { AIService } from '../../services/AIService';

vi.mock('../../services/AIService', () => ({
  AIService: {
    getInstance: vi.fn(() => ({
      setProvider: vi.fn(),
      improveWriting: vi.fn().mockResolvedValue('Improved text'),
      suggestContinuation: vi.fn().mockResolvedValue('Continuation'),
      brainstormIdeas: vi.fn().mockResolvedValue(['Idea 1', 'Idea 2']),
      getChatCompletion: vi.fn().mockResolvedValue({
        message: { content: 'Response' },
        usage: { total_tokens: 100 },
      }),
    })),
  },
}));

describe('AI Workflow Integration', () => {
  beforeEach(() => {
    useAIStore.setState({
      settings: {
        activeProvider: '',
        providers: [],
      },
      isConfigured: false,
    });
  });

  it('should complete provider setup and AI usage workflow', async () => {
    const { result } = renderHook(() => useAIStore());

    const provider: AIProviderSettings = {
      name: 'OpenAI',
      apiEndpoint: 'https://api.openai.com',
      apiKey: 'test-key',
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 2000,
    };

    expect(result.current.isConfigured).toBe(false);

    act(() => {
      result.current.addProvider(provider);
    });

    expect(result.current.isConfigured).toBe(true);
    expect(result.current.settings.providers).toHaveLength(1);
    expect(result.current.settings.activeProvider).toBe('OpenAI');

    const aiService = AIService.getInstance();
    const improvedText = await aiService.improveWriting('Original text');
    expect(improvedText).toBe('Improved text');
  });

  it('should handle multiple providers and switching', () => {
    const { result } = renderHook(() => useAIStore());

    const provider1: AIProviderSettings = {
      name: 'OpenAI',
      apiEndpoint: 'https://api.openai.com',
      apiKey: 'key-1',
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 2000,
    };

    const provider2: AIProviderSettings = {
      name: 'Anthropic',
      apiEndpoint: 'https://api.anthropic.com',
      apiKey: 'key-2',
      modelName: 'claude-2',
      temperature: 0.7,
      maxTokens: 2000,
    };

    act(() => {
      result.current.addProvider(provider1);
    });

    expect(result.current.settings.activeProvider).toBe('OpenAI');

    act(() => {
      result.current.addProvider(provider2);
    });

    expect(result.current.settings.providers).toHaveLength(2);

    act(() => {
      result.current.setActiveProvider('Anthropic');
    });

    expect(result.current.settings.activeProvider).toBe('Anthropic');
  });

  it('should handle provider update workflow', () => {
    const { result } = renderHook(() => useAIStore());

    const originalProvider: AIProviderSettings = {
      name: 'OpenAI',
      apiEndpoint: 'https://api.openai.com',
      apiKey: 'old-key',
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 2000,
    };

    act(() => {
      result.current.addProvider(originalProvider);
    });

    const updatedProvider: AIProviderSettings = {
      ...originalProvider,
      apiKey: 'new-key',
      temperature: 0.9,
    };

    act(() => {
      result.current.updateProvider('OpenAI', updatedProvider);
    });

    const provider = result.current.settings.providers.find(
      (p) => p.name === 'OpenAI'
    );
    expect(provider?.apiKey).toBe('new-key');
    expect(provider?.temperature).toBe(0.9);
  });

  it('should handle provider removal and auto-select new active', () => {
    const { result } = renderHook(() => useAIStore());

    const provider1: AIProviderSettings = {
      name: 'Provider1',
      apiEndpoint: 'https://api.provider1.com',
      apiKey: 'key-1',
      modelName: 'model-1',
      temperature: 0.7,
      maxTokens: 2000,
    };

    const provider2: AIProviderSettings = {
      name: 'Provider2',
      apiEndpoint: 'https://api.provider2.com',
      apiKey: 'key-2',
      modelName: 'model-2',
      temperature: 0.7,
      maxTokens: 2000,
    };

    act(() => {
      result.current.addProvider(provider1);
      result.current.addProvider(provider2);
    });

    act(() => {
      result.current.setActiveProvider('Provider1');
    });

    expect(result.current.settings.activeProvider).toBe('Provider1');

    act(() => {
      result.current.removeProvider('Provider1');
    });

    expect(result.current.settings.activeProvider).toBe('Provider2');
    expect(result.current.isConfigured).toBe(true);
  });

  it('should become unconfigured when all providers are removed', () => {
    const { result } = renderHook(() => useAIStore());

    const provider: AIProviderSettings = {
      name: 'OpenAI',
      apiEndpoint: 'https://api.openai.com',
      apiKey: 'test-key',
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 2000,
    };

    act(() => {
      result.current.addProvider(provider);
    });

    expect(result.current.isConfigured).toBe(true);

    act(() => {
      result.current.removeProvider('OpenAI');
    });

    expect(result.current.isConfigured).toBe(false);
    expect(result.current.settings.activeProvider).toBe('');
    expect(result.current.settings.providers).toHaveLength(0);
  });
});
