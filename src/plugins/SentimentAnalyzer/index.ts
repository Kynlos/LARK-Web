import { Plugin } from '../../core/types';
import { Message, ProcessedMessage } from '../../core/types/message';
import { messageProcessor } from '../../core/MessageProcessor';

export class SentimentAnalyzerPlugin implements Plugin {
  id = 'sentiment-analyzer';
  name = 'Sentiment Analyzer';
  version = '1.0.0';
  description = 'Analyzes the sentiment of messages';
  author = 'LARK Team';

  async initialize(): Promise<void> {
    messageProcessor.registerProcessor(this.analyzeSentiment.bind(this));
    console.log('Sentiment Analyzer plugin initialized');
  }

  private async analyzeSentiment(message: Message): Promise<Partial<ProcessedMessage>> {
    // Simple sentiment analysis example - in a real plugin this would use a proper NLP library
    const positiveWords = ['good', 'great', 'excellent', 'happy', 'love'];
    const negativeWords = ['bad', 'terrible', 'awful', 'sad', 'hate'];

    const words = message.content.toLowerCase().split(/\s+/);
    
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    const totalWords = words.length;
    const sentimentScore = (positiveCount - negativeCount) / (totalWords || 1);

    return {
      analysis: {
        sentiment: sentimentScore,
        customData: {
          positiveWords: positiveCount,
          negativeWords: negativeCount
        }
      }
    };
  }

  async cleanup(): Promise<void> {
    console.log('Sentiment Analyzer plugin cleaned up');
  }
}
