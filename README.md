# DeFi Builder | Solana Hackathon

## Overview

Our project introduces an innovative AI Auditor designed specifically for Solana projects. Leveraging cutting-edge AI technologies, this tool analyzes project structures to identify vulnerabilities, categorizing them into high, medium, and low risk. It not only highlights these vulnerabilities but also provides actionable recommendations and summarizes the audited protocol. Moreover, our AI Auditor is capable of generating comprehensive PDF audit reports and automating the creation of GitHub issues for identified vulnerabilities, pinpointing their exact locations in the codebase.

!!! TBA: Images or demo video

## Goals

- **Vulnerability Identification**: Automatically detect vulnerabilities within the project structure, classifying them based on severity.
- **Recommendation Generation**: Provide tailored recommendations for addressing identified vulnerabilities.
- **Protocol Summarization**: Summarize the audited protocol to offer insights into its overall structure and security posture.
- **Report Generation**: Create detailed PDF reports summarizing the audit findings.
- **GitHub Integration**: Streamline remediation processes by opening GitHub issues for specific vulnerabilities, including precise code location references.
- **Codigo Interface Description Language Generator**: For projects not yet developed, our tool includes a generator for creating interface descriptions in YAML, ensuring compliance with Solana specifications. This facilitates rapid development of boilerplate code, client types, and documentation.

## Features

- **GitHub Authentication**: Securely connect with GitHub to select and audit repositories using the Anchor framework.
- **AI-Powered Auditing**: Utilizing already crafted prompts and structured outputs for deep analysis and auditing.
- **Automatic GitHub Issue Creation**: Employing automated issue reporting on GitHub, directly linking to vulnerabilities in the code.
- **Codigo Generator**: Generate interface descriptions in YAML, validated for compliance, to support the development of Solana projects.

## How It Works

1. **GitHub Connection**: Users begin by logging in with their GitHub account.
2. **Repository Selection**: Users can select an existing repository for auditing or utilize our [example repository](https://github.com/urataps/solana-audit-examples/) for demonstration purposes.
3. **Audit Execution**: Upon selecting a repository, the user can initiate the audit, which is then processed by our AI backend.
4. **Report and Remediation**: The user receives a comprehensive audit report and can review automatically created GitHub issues for each identified vulnerability.

For projects without an existing repository, our Codigo interface generator comes into play:

- Generate a YAML file using our AI tool that validates the output so that it corresponds with the CIDL specifications.
- Use the generated file in [Studio Codigo](https://studio.codigo.ai) with the command `codigo solana generate cidl.yaml` to produce boilerplate code and documentation.

## Technology Stack

- **Frontend**: Next.js with TailwindCSS, Shadcn for styling.
- **Backend**: Next.js, utilizing several endpoints for auditing functionalities.
- **Database**: Prisma with MySQL for data persistence.
- **AI Integration**: LangChain for AI-driven analysis.
- **GitHub Integration**: Octokit for GitHub API interactions.

## Getting Started

To begin using our AI Auditor for your Solana projects visit the [LIVE APP !!! Link TBA](https://www.youtube.com/watch?v=dQw4w9WgXcQ). In order to test it locally follow the steps below. Check `env.example` for required environment setup.

```
git clone git@github.com:thedefibuilder/hackathon-solana.git
cd hackathon-solana
pnpm install
pnpm build
pnpm preview
```

## 🔥 Contributing

Contributions are welcome! Please follow the standard fork-and-pull-request workflow to contribute.

## 🧾 License

DeFi Builder © 2024 by DeFi Builder is licensed under CC BY-NC-SA 4.0. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
