import { AIProviderSettings, AICompletionRequest, AICompletionResponse, AIChatRequest, AIChatResponse } from '../types/ai';

export class AIService {
    private static instance: AIService;
    private currentProvider: AIProviderSettings | null = null;

    private constructor() {}

    static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    setProvider(provider: AIProviderSettings) {
        this.currentProvider = provider;
    }

    private async makeRequest(endpoint: string, data: any): Promise<any> {
        if (!this.currentProvider) {
            throw new Error('No AI provider configured');
        }

        const response = await fetch(`${this.currentProvider.apiEndpoint}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.currentProvider.apiKey}`
            },
            body: JSON.stringify({
                ...data,
                model: this.currentProvider.modelName,
                temperature: data.temperature ?? this.currentProvider.temperature ?? 0.7,
                max_tokens: data.maxTokens ?? this.currentProvider.maxTokens ?? 2000
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
            throw new Error(error.error?.message || 'Failed to get AI response');
        }

        return response.json();
    }

    async getCompletion(request: AICompletionRequest): Promise<AICompletionResponse> {
        const response = await this.makeRequest('/v1/completions', {
            prompt: request.prompt,
            temperature: request.temperature,
            max_tokens: request.maxTokens,
            stop: request.stop
        });

        return {
            text: response.choices[0].text,
            usage: response.usage
        };
    }

    async getChatCompletion(request: AIChatRequest): Promise<AIChatResponse> {
        const response = await this.makeRequest('/v1/chat/completions', {
            messages: request.messages,
            temperature: request.temperature,
            max_tokens: request.maxTokens
        });

        return {
            message: response.choices[0].message,
            usage: response.usage
        };
    }

    // Writing assistance specific methods
    async improveWriting(text: string): Promise<string> {
        const response = await this.getChatCompletion({
            messages: [
                { role: 'system', content: 'You are a professional editor helping to improve writing.' },
                { role: 'user', content: `Please improve this text while maintaining its original meaning and style: ${text}` }
            ]
        });
        return response.message.content;
    }

    async suggestContinuation(text: string): Promise<string> {
        const response = await this.getChatCompletion({
            messages: [
                { role: 'system', content: 'You are a creative writing assistant helping to continue the story.' },
                { role: 'user', content: `Suggest a natural continuation for this text: ${text}` }
            ]
        });
        return response.message.content;
    }

    async brainstormIdeas(topic: string): Promise<string[]> {
        const response = await this.getChatCompletion({
            messages: [
                { role: 'system', content: 'You are a creative writing assistant helping to generate ideas.' },
                { role: 'user', content: `Generate 5 creative ideas related to: ${topic}` }
            ]
        });
        return response.message.content.split('\n').filter(line => line.trim());
    }
}
