import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  try {
    // TODO: get list of vulnerabilitites
    // For each vulnerability, get the list of files that are affected
    // For each file, ask gpt to check if the file is vulnerable

    return NextResponse.json({ output: 'Hello Brat!' }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
