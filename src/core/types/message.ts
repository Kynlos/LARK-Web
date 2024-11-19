export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface ProcessedMessage extends Message {
  analysis: {
    sentiment?: number;
    keywords?: string[];
    categories?: string[];
    customData?: Record<string, unknown>;
  };
}

export interface MessageProcessor {
  registerProcessor(processor: (message: Message) => Promise<Partial<ProcessedMessage>>): void;
  processMessage(message: Message): Promise<ProcessedMessage>;
}
