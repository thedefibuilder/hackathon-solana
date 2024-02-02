/* eslint-disable unicorn/filename-case */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable quotes */

import type { TVulnerability } from '@/agents/audit';

const mockedSummary =
  'Based on the provided information, the summary of the auditing report for the Rust smart contracts on the Solana blockchain, specifically for the package named "sysvar_address_checking", would focus on the overview of the smart contracts included within this package. The package, created with Anchor framework version 0.29.0 and Rust edition 2021, contains multiple modules aimed at demonstrating various functionalities and potential security considerations within Solana smart contract development.\n\nThe smart contracts within this package include functionalities such as logging messages, performing Cross-Program Invocation (CPI) in a potentially insecure manner, checking and setting values based on account bump seeds, closing accounts, initializing user accounts with authority checks, and more. Each module within the package addresses a specific aspect of smart contract development, ranging from account data matching, arbitrary CPI calls, bump seed canonicalization, to closing accounts, and initialization patterns that might be insecure or require careful handling to ensure security and correctness.\n\nNotably, the package also explores sysvar address checking, signer authorization, owner checks, and type cosplay, which are crucial for ensuring that smart contracts interact correctly with Solana\'s runtime and other programs in a secure manner. The use of Anchor\'s prelude and solana_program library is prevalent throughout the modules, facilitating the interaction with Solana\'s blockchain.\n\nThe smart contracts are designed with a focus on demonstrating various patterns and practices, some of which are marked as insecure to highlight common pitfalls and areas where developers need to exercise caution. This includes handling of account authorities, data serialization/deserialization, and proper management of account lifecycles.\n\nThis summary does not delve into the key findings or recommendations of the auditing report but provides an overview of the scope and content of the smart contracts within the "sysvar_address_checking" package, highlighting the diverse areas of focus and the use of Rust and Anchor framework for developing on the Solana blockchain.';

const mockedFiles = [
  'programs/solana-program/src/account_data_matching.rs',
  'programs/solana-program/src/arbitrary_cpi.rs',
  'programs/solana-program/src/bump_seed_canonicalization.rs',
  'programs/solana-program/src/closing_accounts.rs',
  'programs/solana-program/src/initialization.rs',
  'programs/solana-program/src/lib.rs',
  'programs/solana-program/src/owner_checks.rs',
  'programs/solana-program/src/signer_authorization.rs',
  'programs/solana-program/src/sysvar_address_checking.rs',
  'programs/solana-program/src/type_cosplay.rs'
] as const;

const mockedFileVulnerabilities = {
  'programs/solana-program/src/account_data_matching.rs': [
    {
      title: 'Insecure Deserialization',
      severity: 'High',
      description:
        'The `log_message` function in the `account_data_matching_insecure` module deserializes data directly from the `token` account without any validation. This can lead to various security vulnerabilities, such as arbitrary code execution or denial of service, if the data is tampered with.',
      location: {
        file: 'programs/solana-program/src/account_data_matching.rs',
        start_line: 8,
        end_line: 11
      },
      recommendation:
        'Implement strict schema validation for the deserialized data. Consider using a secure deserialization framework or library that provides built-in protections against common deserialization vulnerabilities.'
    }
  ],
  'programs/solana-program/src/arbitrary_cpi.rs': [
    {
      title: 'Lack of Signature Verification',
      severity: 'High',
      description:
        'The function `cpi` in the `arbitrary_cpi_insecure` module does not perform any signature verification on the authority account before executing a token transfer. This omission could allow unauthorized parties to initiate transfers if they can call this function, leading to potential loss of funds.',
      location: {
        file: 'programs/solana-program/src/arbitrary_cpi.rs',
        start_line: 10,
        end_line: 20
      },
      recommendation:
        'Implement signature verification for the authority account using `require_signer` or a similar mechanism to ensure that only authorized parties can initiate transfers.'
    },
    {
      title: 'Missing Ownership or Delegate Check',
      severity: 'Medium',
      description:
        "The smart contract does not verify if the `source` account has delegated authority to the `authority` account for token transfers. Without this check, there's a risk that tokens could be transferred without proper authorization.",
      location: {
        file: 'programs/solana-program/src/arbitrary_cpi.rs',
        start_line: 10,
        end_line: 20
      },
      recommendation:
        'Add a check to ensure that the `source` account has explicitly delegated transfer authority to the `authority` account, or that the `authority` account is the owner of the `source` account.'
    }
  ],
  'programs/solana-program/src/bump_seed_canonicalization.rs': [
    {
      title: 'Insecure Bump Seed Canonicalization',
      severity: 'Medium',
      description:
        "The `set_value` function in `bump_seed_canonicalization_insecure` module uses a user-supplied `bump` parameter to create a program address. This approach is insecure because it relies on external input to generate a critical piece of the program's security model, potentially allowing an attacker to manipulate the bump value to gain unauthorized access or cause other unintended behaviors.",
      location: {
        file: 'programs/solana-program/src/bump_seed_canonicalization.rs',
        start_line: 8,
        end_line: 14
      },
      recommendation:
        'Consider using a deterministic approach to generate the bump seed, such as the `find_program_address` function provided by the Solana SDK, which ensures a secure and predictable way to generate program addresses without relying on external input.'
    }
  ],
  'programs/solana-program/src/closing_accounts.rs': [
    {
      title: 'Unchecked Error for `checked_add`',
      severity: 'Medium',
      description:
        'The use of `unwrap()` on the result of `checked_add()` can lead to a panic if the addition overflows. This can cause the program to terminate unexpectedly.',
      location: {
        file: 'programs/solana-program/src/closing_accounts.rs',
        start_line: 10,
        end_line: 12
      },
      recommendation:
        'Use a match or if let construct to handle the potential `None` case from `checked_add()` safely, or consider using `saturating_add` which handles overflow by saturating at the numeric bounds instead of panicking.'
    },
    {
      title: 'Improper Account Closure',
      severity: 'High',
      description:
        'The account is zeroed out without properly closing it. This leaves the account in a state where it still exists on the blockchain but with a balance of 0 lamports, potentially leading to resource waste and confusion.',
      location: {
        file: 'programs/solana-program/src/closing_accounts.rs',
        start_line: 13,
        end_line: 13
      },
      recommendation:
        "After zeroing the account's lamports, use the `close` method provided by Anchor to properly remove the account from the blockchain."
    }
  ],
  'programs/solana-program/src/initialization.rs': [
    {
      title: 'Lack of Proper Error Handling',
      severity: 'Medium',
      description:
        'The function `initialize` uses `unwrap()` for handling potential errors when deserializing the `User` struct and when serializing it back into the storage. This approach can lead to panics if the deserialization or serialization fails, which is not recommended in production code as it can cause the program to exit unexpectedly.',
      location: {
        file: 'programs/solana-program/src/initialization.rs',
        start_line: 10,
        end_line: 14
      },
      recommendation:
        'Replace `unwrap()` with proper error handling. Consider using `?` to propagate errors or handle them explicitly to ensure the program behaves predictably in case of errors.'
    },
    {
      title: 'Potential Security Risk in User Reinitialization',
      severity: 'High',
      description:
        'The `initialize` function allows for the reinitialization of the `User` struct without any checks to prevent it. This could lead to security vulnerabilities where an attacker could change the `authority` field of a `User` after it has been initialized, potentially taking control of the account.',
      location: {
        file: 'programs/solana-program/src/initialization.rs',
        start_line: 10,
        end_line: 14
      },
      recommendation:
        'Implement a check to ensure that the `User` account has not been previously initialized, or if it has, that the reinitialization is authorized by the current authority.'
    }
  ],
  'programs/solana-program/src/lib.rs': [
    {
      title: 'Lack of Functionality',
      severity: 'High',
      description:
        'The provided smart contract does not contain any functions or methods within the declared module `program_test`. This means it lacks any functionality or logic to perform operations, making it ineffective for any practical use.',
      location: {
        file: 'programs/solana-program/src/lib.rs',
        start_line: 14,
        end_line: 16
      },
      recommendation:
        'Implement necessary functions and logic within the `program_test` module to fulfill the intended purpose of the smart contract.'
    }
  ],
  'programs/solana-program/src/owner_checks.rs': [
    {
      title: 'Missing Ownership Transfer Validation',
      severity: 'Medium',
      description:
        'The function `log_message` in the `owner_checks_insecure` module checks if the caller (authority) is the owner of the token account but does not validate if the ownership of the token account has been transferred securely. This could potentially allow an attacker to manipulate the ownership check by temporarily becoming the owner of the token account, passing the check, and then transferring the ownership back.',
      location: {
        file: 'programs/solana-program/src/owner_checks.rs',
        start_line: 8,
        end_line: 13
      },
      recommendation:
        'Implement a secure ownership transfer mechanism that ensures the ownership has not been tampered with. This could involve using a more secure check that validates the history of ownership transfers or adding additional checks to ensure the integrity of the ownership before performing sensitive operations.'
    },
    {
      title: 'Lack of Error Handling for Unpacking',
      severity: 'Low',
      description:
        'The function `log_message` uses `SplTokenAccount::unpack` without proper error handling for cases where unpacking fails due to invalid account data. This could lead to uninformative error messages or missed opportunities for handling specific error conditions more gracefully.',
      location: {
        file: 'programs/solana-program/src/owner_checks.rs',
        start_line: 8,
        end_line: 9
      },
      recommendation:
        'Implement more comprehensive error handling around the `SplTokenAccount::unpack` call. This could involve catching specific error types and providing more informative error messages or taking corrective actions in case of certain errors.'
    }
  ],
  'programs/solana-program/src/signer_authorization.rs': [
    {
      title: 'Missing Authorization Check',
      severity: 'High',
      description:
        'The function `log_message` in the `signer_authorization_insecure` module logs a message without performing any authorization checks to verify if the caller is allowed to execute this function. This could potentially allow any user to call this function, which might lead to unauthorized actions or information disclosure.',
      location: {
        file: 'programs/solana-program/src/signer_authorization.rs',
        start_line: 5,
        end_line: 8
      },
      recommendation:
        "Implement an authorization check to ensure that only authorized users can call the `log_message` function. This can be done by verifying the caller's public key against a list of authorized keys or by using a signature verification mechanism."
    }
  ],
  'programs/solana-program/src/sysvar_address_checking.rs': [
    {
      title: 'Incorrect Sysvar Address Validation',
      severity: 'High',
      description:
        "The function `check_sysvar_address` logs the key of the account passed as `rent` but does not perform any validation to ensure it is the expected Solana Rent Sysvar. This could lead to potential vulnerabilities where an attacker could pass any account and have its address logged, possibly misleading the contract's logic or intentions.",
      location: {
        file: 'programs/solana-program/src/sysvar_address_checking.rs',
        start_line: 6,
        end_line: 8
      },
      recommendation:
        "Implement a check to ensure the `rent` account passed to `check_sysvar_address` is indeed the Solana Rent Sysvar. This can be done by comparing the account's key with the known Rent Sysvar address (`SysvarRent111111111111111111111111111111111`) before proceeding with any logic."
    }
  ],
  'programs/solana-program/src/type_cosplay.rs': [
    {
      title: 'Use of unwrap() on Option',
      severity: 'Medium',
      description:
        'The use of unwrap() on an Option type can cause the program to panic if the Option is None. This occurs when trying to deserialize the user account data. Panicking in a blockchain environment can lead to denial of service or other unexpected behavior.',
      location: {
        file: 'programs/solana-program/src/type_cosplay.rs',
        start_line: 10,
        end_line: 10
      },
      recommendation:
        'Consider using match statements or if let Some() patterns to handle the None case gracefully.'
    },
    {
      title: 'Improper Authorization Check',
      severity: 'High',
      description:
        "The smart contract checks if the user account's owner is the program itself, which is a good practice. However, it also checks if the user's authority matches the authority account provided in the transaction without any cryptographic verification. This could potentially allow unauthorized updates to user data if the authority account is compromised.",
      location: {
        file: 'programs/solana-program/src/type_cosplay.rs',
        start_line: 10,
        end_line: 10
      },
      recommendation:
        'Implement cryptographic signature verification to ensure that the authority account is indeed authorized to make updates to the user data.'
    }
  ]
} satisfies TMockedFileVulnerabilities;

type TMockedFileKey = (typeof mockedFiles)[number];
type TMockedFileVulnerabilities = Record<TMockedFileKey, TVulnerability[]>;

export type { TMockedFileKey };
export { mockedSummary, mockedFiles, mockedFileVulnerabilities };
