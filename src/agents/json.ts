import type { ZodSchema } from 'zod';

import { ChatOpenAI } from '@langchain/openai';
import { JsonOutputFunctionsParser } from 'langchain/output_parsers';
import zodToJsonSchema from 'zod-to-json-schema';

import { env } from '@/env';

export function jsonAgent(modelName: string, schema: ZodSchema) {
  const llm = new ChatOpenAI({
    openAIApiKey: env.OPENAI_API_KEY,
    modelName,
    temperature: 0.2,
    modelKwargs: { seed: 1337 }
  });
  const functionCallingModel = llm.bind({
    functions: [
      {
        name: 'output_formatter',
        description: 'Should always be used to properly format output.',
        parameters: zodToJsonSchema(schema)
      }
    ],
    function_call: { name: 'output_formatter' }
  });
  return functionCallingModel.pipe(new JsonOutputFunctionsParser());
}
