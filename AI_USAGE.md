# AI_USAGE.md - AI Transparency & Engineering Log

## 🤖 AI Development Assistance Summary

This document details the AI tools, prompts, validation mechanisms, and provider abstractions used in constructing the **SHIELD AI Insurance Claims Processing Platform**.

---

## 🏛️ AI Architecture & Provider Abstraction

To ensure business reliability and prevent vendor lock-in, all AI capabilities are encapsulated behind an `IAIProvider` interface:

```typescript
export interface IAIProvider {
  name: string;
  extractDocumentData(fileBuffer: Buffer, mimeType: string, fileName: string, docType: string): Promise<IDocumentExtractionResult>;
  analyzeDamageImage(fileBuffer: Buffer, mimeType: string): Promise<IDamageAnalysisResult>;
  performCrossDocValidation(extractions: IDocumentExtractionResult[]): Promise<ICrossDocMismatch[]>;
  generateClaimAssistantReply(context: string, userMessage: string): Promise<string>;
  convertNaturalLanguageToFilter(naturalQuery: string): Promise<NaturalLanguageFilter>;
}
```

### Supported Providers:
1. **`MockAIProvider`**: Default provider designed for 100% offline local development and automated testing without external API key requirements.
2. **`OpenAIProvider`**: Integrates with GPT-4o for multimodal vision damage analysis and structured document extraction.
3. **`GeminiProvider`**: Integrates with Google Gemini 1.5 Flash/Pro for high-speed document extraction.
4. **`AnthropicProvider`**: Integrates with Claude 3.5 Sonnet for deep cross-document reasoning.

---

## 🛡️ AI Reliability & Safety Safeguards

1. **Strict Zod Output Validation**: Raw AI responses are never directly written to MongoDB. Every output passes through explicit Zod schemas (`documentExtractionSchema`, `damageAnalysisSchema`, `naturalLanguageFilterSchema`).
2. **Deterministic Risk Layer**: The system does NOT rely on AI to generate arbitrary risk scores. Instead, AI signals feed into a transparent, deterministic scoring engine.
3. **Human-in-the-Loop Authority**: The platform explicitly enforces that **AI output is advisory only**. All claim approvals, rejections, and information requests require manual execution by a human claims adjuster.
4. **Safe Natural Language Filtering**: AI converts search queries into structured JSON filter objects with predefined operators. Raw AI-generated database queries are strictly prohibited.
