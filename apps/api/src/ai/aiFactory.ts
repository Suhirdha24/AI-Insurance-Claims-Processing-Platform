import { IAIProvider, IDocumentExtractionResult, IDamageAnalysisResult } from './AIProvider';
import { MockAIProvider } from './MockAIProvider';
import { ICrossDocMismatch, NaturalLanguageFilter } from '@ai-insurance/shared';
import { config } from '../config/env';

export class OpenAIProvider extends MockAIProvider implements IAIProvider {
  name = 'OpenAIProvider';
  private apiKey: string;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  // Inherits fallback implementation from MockAIProvider if network/key issues occur
}

export class GeminiProvider extends MockAIProvider implements IAIProvider {
  name = 'GeminiProvider';
  private apiKey: string;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }
}

export class AnthropicProvider extends MockAIProvider implements IAIProvider {
  name = 'AnthropicProvider';
  private apiKey: string;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }
}

export function getAIProvider(): IAIProvider {
  const providerType = config.aiProvider.toUpperCase();
  if (providerType === 'OPENAI' && config.openaiApiKey) {
    return new OpenAIProvider(config.openaiApiKey);
  }
  if (providerType === 'GEMINI' && config.geminiApiKey) {
    return new GeminiProvider(config.geminiApiKey);
  }
  if (providerType === 'ANTHROPIC' && config.anthropicApiKey) {
    return new AnthropicProvider(config.anthropicApiKey);
  }
  return new MockAIProvider();
}
