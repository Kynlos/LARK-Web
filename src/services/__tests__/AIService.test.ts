import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AIService } from '../AIService';
import { AIProviderSettings } from '../../types/ai';

global.fetch = vi.fn();

describe('AIService', () => {
  let aiService: AIService;
  let mockProvider: AIProviderSettings;

  beforeEach(() => {
    aiService = AIService.getInstance();
    mockProvider = {
      name: 'TestProvider',
      apiEndpoint: 'https://api.test.com',
      apiKey: 'test-key-123',
      modelName: 'test-model',
      temperature: 0.7,
      maxTokens: 2000,
    };
    vi.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = AIService.getInstance();
      const instance2 = AIService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Provider Management', () => {
    it('should set provider', () => {
      expect(() => {
        aiService.setProvider(mockProvider);
      }).not.toThrow();
    });

    it('should throw error when making request without provider', async () => {
      const aiServiceNew = AIService.getInstance();
      (aiServiceNew as any).currentProvider = null;

      await expect(
        aiServiceNew.getChatCompletion({
          messages: [{ role: 'user', content: 'test' }],
        })
      ).rejects.toThrow('No AI provider configured');
    });
  });

  describe('Chat Completion', () => {
    it('should make successful chat completion request', async () => {
      aiService.setProvider(mockProvider);

      const mockResponse = {
        choices: [
          {
            message: {
              role: 'assistant',
              content: 'Test response',
            },
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await aiService.getChatCompletion({
        messages: [{ role: 'user', content: 'Hello' }],
      });

      expect(result.message.content).toBe('Test response');
      expect(result.usage).toEqual(mockResponse.usage);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-key-123',
          }),
        })
      );
    });

    it('should handle API errors', async () => {
      aiService.setProvider(mockProvider);

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: {
            message: 'API Error',
          },
        }),
      });

      await expect(
        aiService.getChatCompletion({
          messages: [{ role: 'user', content: 'Hello' }],
        })
      ).rejects.toThrow('API Error');
    });
  });

  describe('Writing Assistance', () => {
    beforeEach(() => {
      aiService.setProvider(mockProvider);
    });

    it('should improve writing', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              role: 'assistant',
              content: 'Improved text here',
            },
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await aiService.improveWriting('Original text');

      expect(result).toBe('Improved text here');
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should suggest continuation', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              role: 'assistant',
              content: 'Continuation text',
            },
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await aiService.suggestContinuation('Story beginning');

      expect(result).toBe('Continuation text');
    });

    it('should brainstorm ideas', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              role: 'assistant',
              content: '1. First idea\n2. Second idea\n3. Third idea',
            },
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await aiService.brainstormIdeas('Topic');

      expect(result).toHaveLength(3);
      expect(result[0]).toBe('1. First idea');
      expect(result[1]).toBe('2. Second idea');
      expect(result[2]).toBe('3. Third idea');
    });
  });

  describe('Chat Function', () => {
    it('should handle chat with previous messages', async () => {
      aiService.setProvider(mockProvider);

      const mockResponse = {
        choices: [
          {
            message: {
              role: 'assistant',
              content: 'Response with context',
            },
          },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await aiService.chat({
        message: 'New message',
        previousMessages: [
          { role: 'user', content: 'Previous message' },
          { role: 'assistant', content: 'Previous response' },
        ],
      });

      expect(result.message).toBe('Response with context');

      const fetchCall = (global.fetch as any).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody.messages).toHaveLength(4);
      expect(requestBody.messages[0].role).toBe('system');
      expect(requestBody.messages[1].content).toBe('Previous message');
    });
  });
});
