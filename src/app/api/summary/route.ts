import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  return NextResponse.json({ output: 'Hello Brat!' }, { status: 200 });
}
