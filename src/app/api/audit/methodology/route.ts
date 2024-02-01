import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    const methodology =
      '## Audit Methodology\n\n' +
      'The AI begins by collecting all files related to the Solana smart contract to be audited. This includes not only the primary contract files but also any dependencies, libraries, and related documentation.\n\n' +
      'Utilizing a database of known vulnerabilities (e.g., reentrancy, overflow/underflow, improper access control), the AI scans the contract line by line. Each potential vulnerability is classified based on severity (high, medium, low) using predefined criteria (e.g., impact on contract functionality, exploitability).\n\n' +
      '### Risk Classification and Reporting\n\n' +
      'Issue Description: For each identified issue, the AI generates a detailed description, including the location in the code, the nature of the problem, and why it is considered a risk.\n\n' +
      'Severity Rating: Based on the potential impact and exploitability, classify each issue as high, medium, or low risk.\n\n' +
      'Recommendations: For each identified issue, the AI suggests mitigation strategies or corrective actions, referencing best practices or secure coding guidelines specific to Solana smart contracts.';

    return NextResponse.json({ data: methodology }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
