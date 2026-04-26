# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability within Streamium, please send a private message on github. All security vulnerabilities will be promptly addressed.

Please include the following information in your report:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Any suggested fixes (if applicable)

## Security Measures

Streamium implements several security measures:

1. **Authentication**
   - JWT-based authentication
   - Secure password hashing
   - Rate limiting on login attempts
   - Password reset with secure tokens

2. **Data Protection**
   - Input validation and sanitization
   - XSS protection
   - CSRF protection
   - SQL injection prevention through Prisma ORM

3. **API Security**
   - Rate limiting on sensitive endpoints
   - Request validation
   - Secure error handling

## Development Guidelines

When contributing to Streamium, please ensure:

1. All passwords are hashed using bcrypt
2. Sensitive data is never logged
3. Environment variables are used for secrets
4. Input is properly validated and sanitized
5. Rate limiting is implemented on sensitive endpoints
6. Error messages don't leak sensitive information

## Known Issues

There are currently no known security issues. Check this section for updates on security-related issues and their status.
