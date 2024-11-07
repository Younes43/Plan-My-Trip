export type AIProvider = 'openai' | 'gemini';

interface AIConfig {
    provider: AIProvider;
    models: {
        openai: string;
        gemini: string;
    };
}

export const aiConfig: AIConfig = {
    provider: (process.env.AI_PROVIDER as AIProvider) || 'openai',
    models: {
        openai: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        gemini: process.env.GEMINI_MODEL || 'gemini-1.5-pro'
    }
};