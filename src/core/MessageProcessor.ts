import { Message, MessageProcessor, ProcessedMessage } from './types/message';

class MessageProcessorImpl implements MessageProcessor {
  private processors: ((message: Message) => Promise<Partial<ProcessedMessage>>)[] = [];

  registerProcessor(processor: (message: Message) => Promise<Partial<ProcessedMessage>>): void {
    this.processors.push(processor);
  }

  async processMessage(message: Message): Promise<ProcessedMessage> {
    const baseProcessedMessage: ProcessedMessage = {
      ...message,
      analysis: {
        sentiment: undefined,
        keywords: undefined,
        categories: undefined,
        customData: undefined
      }
    };

    try {
      const results = await Promise.all(
        this.processors.map(processor => processor(message))
      );

      return results.reduce<ProcessedMessage>((acc, result) => ({
        ...acc,
        ...(result.metadata && { metadata: { ...acc.metadata, ...result.metadata } }),
        analysis: {
          sentiment: result.analysis?.sentiment ?? acc.analysis.sentiment,
          keywords: result.analysis?.keywords ?? acc.analysis.keywords,
          categories: result.analysis?.categories ?? acc.analysis.categories,
          customData: result.analysis?.customData ?? acc.analysis.customData
        }
      }), baseProcessedMessage);
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }
}

export const messageProcessor = new MessageProcessorImpl();
