import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate
} from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';

import { env } from '@/env';

export const SUMMARY_SYSTEM_MESSAGE =
  'Your task is to provide a executive summary for an auditing report. The summary should contain only an overview of the audited protocol, without including key findings and recommendations.';

export function summaryAgent() {
  const userMessage =
    'Generate a summary given the following information (docs or code) about the protocol: {info}';

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(SUMMARY_SYSTEM_MESSAGE),
      HumanMessagePromptTemplate.fromTemplate(userMessage)
    ],
    inputVariables: ['info']
  });

  const llm = new ChatOpenAI({
    openAIApiKey: env.OPENAI_API_KEY,
    modelName: 'gpt-4-0125-preview',
    temperature: 0.2,
    modelKwargs: { seed: 1337 }
  });

  return prompt.pipe(llm).pipe(new StringOutputParser());
}
