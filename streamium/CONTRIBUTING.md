# Contributing to Streamium

Thank you for your interest in contributing to Streamium! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/gmonarque/streamium.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Copy `.env.example` to `.env` and configure your environment variables
5. Install dependencies: `npm install`
6. Initialize the database: `npx prisma migrate dev`
7. Start the development server: `npm run dev`

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments only when necessary to explain complex logic

### Commit Messages

- Use clear and descriptive commit messages
- Start with a verb in present tense (e.g., "Add", "Fix", "Update")
- Reference issue numbers when applicable

Example:
```
Add password strength validation
Fix rate limiting on login endpoint
Update user profile UI components
```

### Pull Requests

1. Update your branch with the latest main branch
2. Ensure all tests pass
3. Update documentation if needed
4. Create a pull request with a clear description of changes
5. Link any related issues

### Testing

- Write tests for new features
- Ensure existing tests pass
- Test your changes in different browsers
- Check mobile responsiveness

### Security

- Follow security guidelines in SECURITY.md
- Never commit sensitive data
- Use environment variables for secrets
- Implement rate limiting for new endpoints
- Validate and sanitize all user input

## Project Structure

```
streamium/
├── src/
│   ├── lib/          # Components, services, stores
│   ├── routes/       # SvelteKit routes and API
│   └── app.html      # App template
├── prisma/
│   └── schema.prisma # Database schema
└── static/           # Static assets
```

## Need Help?

- Check existing issues and pull requests
- Read the documentation
- Ask questions in discussions
- Follow the code of conduct

## Code of Conduct

- Be respectful and inclusive
- No harassment or discrimination
- Constructive feedback only
- Follow project maintainers' decisions

Thank you for contributing to Streamium!
