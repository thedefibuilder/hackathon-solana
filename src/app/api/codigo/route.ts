import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

export type TCodigoGenerateRequest = {
  prompt: string;
};

export async function POST(request: NextRequest) {
  try {
    const prompt = (await request.json()) as TCodigoGenerateRequest;

    // TODO - Call Codigo agent to generate code

    return NextResponse.json({ data: 'HELLO BRATISH' }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
