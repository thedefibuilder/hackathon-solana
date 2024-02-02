import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import YAML from 'yaml';

import { codigoAgent } from '@/agents/codigo';
import cidlJsonSchema from '@/agents/schemas/cidl';

export type TCodigoGenerateRequest = {
  prompt: string;
};

export async function POST(request: NextRequest) {
  try {
    const { prompt } = (await request.json()) as TCodigoGenerateRequest;
    const cidlResponse = await codigoAgent().invoke({ prompt });
    const cidlJson = cidlJsonSchema.parse(cidlResponse);
    const cidlYaml = YAML.stringify(cidlJson);

    return NextResponse.json({ data: cidlYaml }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
