import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate
} from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';

export function summaryAgent() {
  const systemMessage =
    'Your task is to provide a executive summary for an auditing report. The summary should contain an overview of the audited protocol given the provided documentation, or if not available, the code.';
  const userMessage =
    'Generate an executive summary given the following information (docs or code) about the protocol: {info}';

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(systemMessage),
      HumanMessagePromptTemplate.fromTemplate(userMessage)
    ],
    inputVariables: ['info']
  });

  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-4-0125-preview',
    temperature: 0,
    modelKwargs: { seed: 1337 }
  });

  return prompt.pipe(llm).pipe(new StringOutputParser());
}
