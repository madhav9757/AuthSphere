# Security Specifications

AuthSphere implements security at every layer of the OS stack.

## Authentication (PKCE S256)
Enforces Proof Key for Code Exchange to prevent MITM and code injection attacks on public clients.

## Cryptography
- **Password Storage**: Uses Argon2id / Bcrypt
- **Token Integrity**: RSA-SHA256 (RS256) with 2048-bit private keys.
- **Data at Rest**: AES-256-GCM authenticated encryption for sensitive project configurations.

*(Documentation to be expanded)*
