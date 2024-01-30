import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  try {
    // TODO: Return list of vulnerabiltities that are searched
    return NextResponse.json({ output: 'Hello Brat!' }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
