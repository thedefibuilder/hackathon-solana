import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate
} from '@langchain/core/prompts';
import { z } from 'zod';

import { jsonAgent } from './json';

export const auditJsonSchema = z.object({
  issues: z
    .array(
      z.object({
        title: z.string().describe('Short description of the issue. Example: "Reentrancy attack"'),
        severity: z.enum(['High', 'Medium', 'Low']).describe('Severity of the issue'),
        description: z.string().describe('Detailed description of the issue'),
        location: z.object({
          file: z.string().describe('File where the issue was found'),
          start_line: z.number().describe('Line where the issue starts'),
          end_line: z.number().describe('Line where the issue ends')
        }),
        recommendation: z.optional(z.string()).describe('Recommendation to fix the issue. Optional')
      })
    )
    .describe('List of issues found in the smart contract')
});

export type TVulnerability = z.infer<typeof auditJsonSchema.shape.issues.element>;

export const AUDITOR_SYSTEM_MESSAGE =
  'Your task is to analyze and assess Solana smart contracts for auditing purposes by following the code given from the user.';

export function auditorAgent() {
  const userMessage =
    'Generate a smart contract auditing report in JSON format by carefully including the title, severity, location and description of the issue, where applicable provide a recommendation, given the following code: {code}';

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(AUDITOR_SYSTEM_MESSAGE),
      HumanMessagePromptTemplate.fromTemplate(userMessage)
    ],
    inputVariables: ['code']
  });

  return prompt.pipe(jsonAgent('gpt-4-0125-preview', auditJsonSchema));
}
