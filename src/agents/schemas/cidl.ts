import { z } from 'zod';

// Solana specific fields are not supported yet.
// Imports are not supported yet.
// Extended types are not supported yet.

const contactSchema = z.object({
  name: z.string().optional().describe('Name of the maintainer. Optional but recommended.'),
  web: z.string().url().optional().describe('URL of the maintainer. Optional but recommended.'),
  email: z
    .string()
    .email()
    .optional()
    .describe('Email of the maintainer. Optional but recommended.'),
  git: z.string().url().optional().describe('Git URL of this CIDL repository.')
});

const licenseSchema = z.object({
  name: z.string().describe('Name of the license. Specify UNLICENSE if not known.'),
  identifier: z.string().describe('SPDX identifier of the license. Specify UNLICENSE if not known.')
});

const nativeTypeSchema = z.union([
  z.literal('string'),
  z.literal('bytes'),
  z.literal('bool'),
  z.literal('u8'),
  z.literal('u16'),
  z.literal('u32'),
  z.literal('u64'),
  z.literal('u128'),
  z.literal('u256'),
  z.literal('i8'),
  z.literal('i16'),
  z.literal('i32'),
  z.literal('i64'),
  z.literal('i128'),
  z.literal('i256'),
  z.literal('f32'),
  z.literal('f64')
]);

const fieldSchema = z.object({
  name: z.string().describe('Name of the field.'),
  type: nativeTypeSchema.describe('Type of the field.'),
  description: z.string().describe('Description of the field.'),
  format: z.string().optional().describe('Format of the field, if applicable.'),
  attributes: z
    .record(z.number())
    .optional()
    .describe('Attributes defining constraints like max or min values.')
});

const typeSchema = z.object({
  summary: z.string().describe('Summary description of the type.'),
  fields: z.array(fieldSchema).describe('Fields within the type.')
});

const inputSchema = z.object({
  name: z.string().describe('Name of the input parameter.'),
  type: nativeTypeSchema.describe('Type of the input.'),
  description: z.string().describe('Description of the input parameter.')
});

const methodSchema = z.object({
  name: z.string().describe('Name of the method.'),
  version: z.string().optional().describe('Version of the method.'),
  summary: z.string().describe('Summary description of the method.'),
  inputs: z.array(inputSchema).optional().describe('List of input parameters for the method.')
});

const errorSchema = z
  .object({
    id: z.string().describe('Error identifier.'),
    msg: z.string().describe('Error message.')
  })
  .describe('Custom error definition.');

const cidlJsonSchema = z.object({
  cidl: z.string().describe('CIDL version, e.g., 0.8 being the latest.'),
  info: z
    .object({
      name: z.string().describe('Name of the smart contract.'),
      title: z.string().describe('Title or name of the smart contract.'),
      version: z.string().describe('Version of the smart contract.'),
      summary: z.string().optional().describe('Smart contract description summary.'),
      contact: contactSchema.optional().describe('Contact information for the smart contract.'),
      license: licenseSchema.optional().describe('License information for the smart contract.')
    })
    .describe('General information about the CIDL document.'),
  types: z
    .record(typeSchema)
    .optional()
    .describe(
      'Defines new data structures, referenced by methods. In this current version we support only Accounts types.'
    ),
  methods: z.array(methodSchema).describe('Array of methods or instructions.'),
  errors: z.array(errorSchema).describe('Array of custom error definitions.')
});

export default cidlJsonSchema;
