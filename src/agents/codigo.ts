import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate
} from '@langchain/core/prompts';
import { z } from 'zod';

import { jsonAgent } from './json';
import cidlJsonSchema from './schemas/cidl';

export function codigoAgent() {
  const systemMessage =
    'You task is to generate the interface specification for a solana smart contract, using the Codige Interface Description Language (CIDL), based on some user prompt.' +
    'You should follow the schema rigorously and provide a valid CIDL specification for the given prompt. The CIDL specification should be in the form of a JSON object.' +
    'You should put placeholders values inside <> for addresses or program ids that are unknown.' +
    'You should focus on providing the necessary methods with corresponding types and inputs to satisfy the user prompt.';

  const userMessage = 'Generate a CIDL specification for the given prompt: {prompt}';

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      HumanMessagePromptTemplate.fromTemplate(userMessage),
      SystemMessagePromptTemplate.fromTemplate(systemMessage)
    ],
    inputVariables: ['prompt']
  });

  return prompt.pipe(jsonAgent('gpt-4-0125-preview', cidlJsonSchema));
}
