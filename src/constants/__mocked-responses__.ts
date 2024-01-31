/* eslint-disable unicorn/filename-case */
/* eslint-disable quotes */

const mockedSummary =
  'Based on the provided information, the summary of the auditing report for the Rust smart contracts on the Solana blockchain, specifically for the package named "sysvar_address_checking", would focus on the overview of the smart contracts included within this package. The package, created with Anchor framework version 0.29.0 and Rust edition 2021, contains multiple modules aimed at demonstrating various functionalities and potential security considerations within Solana smart contract development.\n\nThe smart contracts within this package include functionalities such as logging messages, performing Cross-Program Invocation (CPI) in a potentially insecure manner, checking and setting values based on account bump seeds, closing accounts, initializing user accounts with authority checks, and more. Each module within the package addresses a specific aspect of smart contract development, ranging from account data matching, arbitrary CPI calls, bump seed canonicalization, to closing accounts, and initialization patterns that might be insecure or require careful handling to ensure security and correctness.\n\nNotably, the package also explores sysvar address checking, signer authorization, owner checks, and type cosplay, which are crucial for ensuring that smart contracts interact correctly with Solana\'s runtime and other programs in a secure manner. The use of Anchor\'s prelude and solana_program library is prevalent throughout the modules, facilitating the interaction with Solana\'s blockchain.\n\nThe smart contracts are designed with a focus on demonstrating various patterns and practices, some of which are marked as insecure to highlight common pitfalls and areas where developers need to exercise caution. This includes handling of account authorities, data serialization/deserialization, and proper management of account lifecycles.\n\nThis summary does not delve into the key findings or recommendations of the auditing report but provides an overview of the scope and content of the smart contracts within the "sysvar_address_checking" package, highlighting the diverse areas of focus and the use of Rust and Anchor framework for developing on the Solana blockchain.';

const mockedVulnerabilities = [
  [
    {
      title: 'Insecure Deserialization',
      severity: 'High',
      description:
        'The `log_message` function in the `account_data_matching_insecure` module deserializes data directly from the `token` account without any validation. This can lead to various security vulnerabilities, including but not limited to, denial of service, code execution, or escalation of privileges if the data is crafted in a malicious way.',
      location: {
        file: 'programs/solana-program/src/account_data_matching.rs',
        start_line: 8,
        end_line: 11
      },
      recommendation:
        'Implement strict validation checks on the deserialized data to ensure it conforms to expected formats and values. Additionally, consider using safer deserialization methods or libraries that inherently check for data integrity and authenticity.'
    }
  ],
  [
    {
      title: 'Lack of Signature Verification',
      severity: 'High',
      description:
        'The function `cpi` in the module `arbitrary_cpi_insecure` does not perform any signature verification on the authority account before executing a token transfer. This could allow unauthorized transfers if the authority account is not properly secured or validated.',
      location: {
        file: 'programs/solana-program/src/arbitrary_cpi.rs',
        start_line: 10,
        end_line: 20
      },
      recommendation:
        'Implement signature verification for the authority account using `require_signer` or similar mechanisms to ensure that the caller is authorized to perform the transfer.'
    }
  ],
  [
    {
      title: 'Insecure Bump Seed Canonicalization',
      severity: 'Medium',
      description:
        'The function `set_value` in the `bump_seed_canonicalization_insecure` module uses a bump seed for address generation without ensuring the seed is canonical. This could potentially lead to address collisions or the generation of predictable addresses, which might be exploited by attackers to manipulate or predict contract behavior.',
      location: {
        file: 'programs/solana-program/src/bump_seed_canonicalization.rs',
        start_line: 8,
        end_line: 14
      },
      recommendation:
        'Ensure that the bump seed used for address generation is canonical and unpredictable. This might involve using a secure random number generator or incorporating additional, unpredictable data into the seed. Additionally, consider implementing checks to prevent address collisions.'
    }
  ],
  [
    {
      title: 'Unchecked Addition for Lamports',
      severity: 'High',
      description:
        'The smart contract performs an unchecked addition of lamports when transferring the balance from one account to another. This can lead to integer overflow if the total amount exceeds the maximum value that can be stored in a u64, potentially causing unexpected behavior or loss of funds.',
      location: {
        file: 'programs/solana-program/src/closing_accounts.rs',
        start_line: 10,
        end_line: 12
      },
      recommendation:
        'Use a checked addition method and handle the potential `None` case to prevent overflow. For example, you can use `checked_add` followed by an `ok_or` to convert the `None` into a `ProgramError`.'
    },
    {
      title: 'Direct Manipulation of Lamports',
      severity: 'Medium',
      description:
        "The contract directly manipulates the lamports of accounts, which is generally discouraged due to the potential for mistakes or security vulnerabilities. It's safer to use the provided Solana runtime functions for transferring lamports to ensure proper checks and balances.",
      location: {
        file: 'programs/solana-program/src/closing_accounts.rs',
        start_line: 9,
        end_line: 13
      },
      recommendation:
        "Consider using the `solana_program::system_instruction::transfer` function for transferring lamports between accounts to leverage Solana's built-in security features."
    }
  ],
  [
    {
      title: 'Lack of Proper Error Handling',
      severity: 'Medium',
      description:
        'The function `initialize` uses `unwrap()` for handling potential errors when deserializing the `User` struct and when serializing it back into storage. This can lead to panics if the data is not in the expected format or if serialization fails, potentially causing denial of service.',
      location: {
        file: 'programs/solana-program/src/initialization.rs',
        start_line: 10,
        end_line: 14
      },
      recommendation:
        'Replace `unwrap()` with proper error handling to ensure the program can gracefully handle unexpected or invalid data.'
    },
    {
      title: 'Missing Ownership Verification',
      severity: 'High',
      description:
        'The `initialize` function does not verify if the caller (or `authority`) is the legitimate owner of the `user` account before performing operations on it. This could allow unauthorized users to modify the `user` account data.',
      location: {
        file: 'programs/solana-program/src/initialization.rs',
        start_line: 10,
        end_line: 14
      },
      recommendation:
        'Implement a check to verify that the `authority` signing the transaction is the current owner of the `user` account or has the necessary permissions.'
    }
  ],
  [
    {
      title: 'Lack of Functionality',
      severity: 'High',
      description:
        "The program module 'program_test' is empty and does not contain any instructions or functionalities. This could indicate incomplete implementation or a placeholder module that was never developed.",
      location: {
        file: 'programs/solana-program/src/lib.rs',
        start_line: 14,
        end_line: 17
      },
      recommendation:
        "Implement the intended functionalities within the 'program_test' module or remove it if it's not needed."
    }
  ],
  [
    {
      title: 'Missing Ownership Transfer Validation',
      severity: 'High',
      description:
        'The function `log_message` in the `owner_checks_insecure` module checks if the caller (authority) is the owner of the token account but does not validate if the ownership of the token has been transferred securely. This can lead to unauthorized access if the token ownership is not properly validated.',
      location: {
        file: 'programs/solana-program/src/owner_checks.rs',
        start_line: 8,
        end_line: 14
      },
      recommendation:
        'Implement a secure ownership transfer validation mechanism. This could involve checking a signature that proves the current caller is the legitimate owner or has been authorized by the legitimate owner. Additionally, consider using the `Authority` trait provided by Anchor for more secure and standardized ownership checks.'
    }
  ],
  [
    {
      title: 'Missing Authorization Check',
      severity: 'High',
      description:
        'The function `log_message` in the `signer_authorization_insecure` module logs a message without performing any authorization checks. This could potentially allow any user to call this function, possibly leading to unauthorized actions or information disclosure.',
      location: {
        file: 'programs/solana-program/src/signer_authorization.rs',
        start_line: 5,
        end_line: 9
      },
      recommendation:
        'Implement an authorization check to ensure that only authorized users can call the `log_message` function. This can be done by verifying the `authority` account against a list of allowed signers or by checking if the `authority` has signed the transaction.'
    }
  ],
  [
    {
      title: 'Incorrect Sysvar Address Validation',
      severity: 'Medium',
      description:
        'The function `check_sysvar_address` in the `sysvar_address_checking` module prints the key of the provided account but does not perform any validation to ensure that the provided account is indeed the expected sysvar (e.g., the Rent sysvar). This could lead to potential vulnerabilities where an attacker might pass an incorrect or malicious account, expecting it to be a sysvar account.',
      location: {
        file: 'programs/solana-program/src/sysvar_address_checking.rs',
        start_line: 5,
        end_line: 7
      },
      recommendation:
        "Implement a validation check to ensure that the `rent` account provided to `check_sysvar_address` is indeed the Rent sysvar. This can be done by comparing the account's key with the known Rent sysvar address (`sysvar::rent::ID`)."
    }
  ],
  [
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
        "The smart contract checks if the user account's owner is the program itself, which is a good practice. However, it also checks if the user's authority matches the authority provided in the context. This could be bypassed if an attacker manages to manipulate the account data directly, leading to unauthorized updates.",
      location: {
        file: 'programs/solana-program/src/type_cosplay.rs',
        start_line: 10,
        end_line: 10
      },
      recommendation:
        'Ensure a more robust authorization mechanism, such as verifying a signature from the authority or utilizing more secure account data validation methods.'
    }
  ]
];

export { mockedSummary, mockedVulnerabilities };
