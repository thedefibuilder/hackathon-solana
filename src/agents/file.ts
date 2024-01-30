import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate
} from '@langchain/core/prompts';
import { z } from 'zod';

import { jsonAgent } from './json';

export const fileAgentSchema = z.object({
  files: z
    .array(z.string().describe('Exact pathname as given in input.'))
    .describe('List of files that need to be read')
});

export function fileAgent() {
  const systemMessage =
    'Your task is to provide a list of files that need to be read in order to perform a specific task.';
  const userMessage =
    'Given the following list of files, specify which ones need to be read in order to perform the following task. \n  Task: {task} \n Files: {files}';

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(systemMessage),
      HumanMessagePromptTemplate.fromTemplate(userMessage)
    ],
    inputVariables: ['task', 'files']
  });

  return prompt.pipe(jsonAgent('gpt-4-0125-preview', fileAgentSchema));
}
