export interface AIProviderSettings {
    name: string;
    apiEndpoint: string;
    apiKey: string;
    modelName?: string;
    temperature?: number;
    maxTokens?: number;
}

export interface AIUserSettings {
    activeProvider: string;
    providers: AIProviderSettings[];
}

export interface AICompletionRequest {
    prompt: string;
    temperature?: number;
    maxTokens?: number;
    stop?: string[];
}

export interface AICompletionResponse {
    text: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

export interface AIChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface AIChatRequest {
    messages: AIChatMessage[];
    temperature?: number;
    maxTokens?: number;
}

export interface AIChatResponse {
    message: AIChatMessage;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
