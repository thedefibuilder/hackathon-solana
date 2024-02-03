import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import YAML from 'yaml';

import { codigoAgent } from '@/agents/codigo';
import cidlJsonSchema from '@/agents/schemas/cidl';
import { mockedCidlYaml } from '@/constants/__mocked-responses__';
import { env } from '@/env';

export type TCodigoGenerateRequest = {
  prompt: string;
};

export async function POST(request: NextRequest) {
  if (env.NODE_ENV === 'production') {
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
  return NextResponse.json({ data: mockedCidlYaml }, { status: 200 });
}
