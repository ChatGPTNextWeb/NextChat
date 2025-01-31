import { collectModelTable } from "@/app/utils/model"
import { LLMModel,LLMModelProvider } from "@/app/client/api";

describe('collectModelTable', () => {
  const mockModels: readonly LLMModel[] = [
    {
      name: 'gpt-3.5-turbo',
      available: true,
      provider: {
        id: 'openai',
        providerName: 'OpenAI',
        providerType: 'openai',
      } as LLMModelProvider,
      sorted: 1,
    },
    {
      name: 'gpt-4',
      available: true,
      provider: {
        id: 'openai',
        providerName: 'OpenAI',
        providerType: 'openai',
      } as LLMModelProvider,
      sorted: 1,
    },
    {
      name: 'gpt-3.5-turbo',
      available: true,
      provider: {
        id: 'azure',
        providerName: 'Azure',
        providerType: 'azure',
      } as LLMModelProvider,
      sorted: 2,
    },
    {
      name: 'gpt-4',
      available: true,
      provider: {
        id: 'azure',
        providerName: 'Azure',
        providerType: 'azure',
      } as LLMModelProvider,
      sorted: 2,
    },
    {
      name: 'gemini-pro',
      available: true,
      provider: {
        id: 'google',
        providerName: 'Google',
        providerType: 'google',
      } as LLMModelProvider,
      sorted: 3,
    },
    {
      name: 'claude-3-haiku-20240307',
      available: true,
      provider: {
        id: 'anthropic',
        providerName: 'Anthropic',
        providerType: 'anthropic',
      } as LLMModelProvider,
      sorted: 4,
    },
    {
      name: 'grok-beta',
      available: true,
      provider: {
        id: 'xai',
        providerName: 'XAI',
        providerType: 'xai',
      } as LLMModelProvider,
      sorted: 11,
    },
  ];

  test('all models shoule be available', () => {
    const customModels = '';
    const result = collectModelTable(mockModels, customModels);

    expect(result['gpt-3.5-turbo@openai'].available).toBe(true);
    expect(result['gpt-4@openai'].available).toBe(true);
    expect(result['gpt-3.5-turbo@azure'].available).toBe(true);
    expect(result['gpt-4@azure'].available).toBe(true);
    expect(result['gemini-pro@google'].available).toBe(true);
    expect(result['claude-3-haiku-20240307@anthropic'].available).toBe(true);
    expect(result['grok-beta@xai'].available).toBe(true);
  });
  test('should exclude all models when custom is "-all"', () => {
    const customModels = '-all';
    const result = collectModelTable(mockModels, customModels);

    expect(result['gpt-3.5-turbo@openai'].available).toBe(false);
    expect(result['gpt-4@openai'].available).toBe(false);
    expect(result['gpt-3.5-turbo@azure'].available).toBe(false);
    expect(result['gpt-4@azure'].available).toBe(false);
    expect(result['gemini-pro@google'].available).toBe(false);
    expect(result['claude-3-haiku-20240307@anthropic'].available).toBe(false);
    expect(result['grok-beta@xai'].available).toBe(false);
  });

  test('should exclude all Azure models when custom is "-*azure"', () => {
    const customModels = '-*azure';
    const result = collectModelTable(mockModels, customModels);

    expect(result['gpt-3.5-turbo@openai'].available).toBe(true);
    expect(result['gpt-4@openai'].available).toBe(true);
    expect(result['gpt-3.5-turbo@azure'].available).toBe(false);
    expect(result['gpt-4@azure'].available).toBe(false);
    expect(result['gemini-pro@google'].available).toBe(true);
    expect(result['claude-3-haiku-20240307@anthropic'].available).toBe(true);
    expect(result['grok-beta@xai'].available).toBe(true);
  });

  test('should exclude Google and XAI models when custom is "-*google,-*xai"', () => {
    const customModels = '-*google,-*xai';
    const result = collectModelTable(mockModels, customModels);

    expect(result['gpt-3.5-turbo@openai'].available).toBe(true);
    expect(result['gpt-4@openai'].available).toBe(true);
    expect(result['gpt-3.5-turbo@azure'].available).toBe(true);
    expect(result['gpt-4@azure'].available).toBe(true);
    expect(result['gemini-pro@google'].available).toBe(false);
    expect(result['claude-3-haiku-20240307@anthropic'].available).toBe(true);
    expect(result['grok-beta@xai'].available).toBe(false);
  });

  test('All models except OpenAI should be excluded, and additional models should be added when customized as "-all, +*openai,gpt-4o@azure"', () => {
    const customModels = '-all,+*openai,gpt-4o@azure';
    const result = collectModelTable(mockModels, customModels);

    expect(result['gpt-3.5-turbo@openai'].available).toBe(true);
    expect(result['gpt-4@openai'].available).toBe(true);
    expect(result['gpt-3.5-turbo@azure'].available).toBe(false);
    expect(result['gpt-4@azure'].available).toBe(false);
    expect(result['gemini-pro@google'].available).toBe(false);
    expect(result['claude-3-haiku-20240307@anthropic'].available).toBe(false);
    expect(result['grok-beta@xai'].available).toBe(false);
    expect(result['gpt-4o@azure'].available).toBe(true);
  });
});