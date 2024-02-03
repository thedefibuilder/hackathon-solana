export type TPrompt = { title: string; description: string };

export const predefinedPrompts: TPrompt[] = [
  {
    title: 'Decentralized Voting System',
    description:
      'Outline the data structures and functions needed for a decentralized voting system on Solana. Include details for registering voters, casting votes, and calculating election results. Specify the kind of information to track for each voter and vote, including security measures to ensure one vote per person and to prevent unauthorized access.'
  },
  {
    title: 'Crowdfunding Platform',
    description:
      'Describe the architecture for a crowdfunding platform built on Solana. Focus on the smart contract ability to create funding campaigns, accept contributions, and distribute funds upon reaching goals. Detail the attributes necessary for tracking campaign progress, contributor records, and mechanisms for refunding contributions if goals are not met.'
  },
  {
    title: 'Decentralized Marketplace',
    description:
      'Draft a framework for a decentralized marketplace on Solana, detailing smart contract interactions for listing items, making purchases, and managing escrow for transactions. Explain how to handle listings, user accounts, and transaction validation, including dispute resolution and refunds.'
  },
  {
    title: 'Decentralized Autonomous Organization (DAO)',
    description:
      'Propose a structure for a DAO operating on Solana, with emphasis on governance tokens, proposal submissions, voting mechanisms, and execution of community decisions. Highlight the setup for membership, proposal criteria, voting thresholds, and the execution process for approved proposals.'
  },
  {
    title: 'Peer-to-Peer Lending Platform',
    description:
      'Conceive a peer-to-peer lending platform using Solana smart contracts, specifying the process for loan listings, credit assessments, funding loans, and repayment schedules. Include details on interest calculations, collateral management, default handling, and the role of smart contracts in automating these processes.'
  }
];
