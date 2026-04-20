# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-04-20

### Changed

- **Repository Rename**: Project renamed from "github-stats-dashboard" to "QuickHubPulse"
- Updated package.json name, description, and repository URLs to reflect new branding
- Updated README.md with new project name, badges, and documentation references
- Updated all repository references throughout the codebase

### Added

- Overview screenshot to README.md for better project visualization
- Meta description tag to index.html for improved SEO

### Fixed

- Updated HTML title in client/index.html to reflect QuickHubPulse branding
- Moved Netlify OAuth script to end of body with defer attribute for improved page load performance

## [1.1.0] - 2026-03-07

### Added

- New `test` script in `package.json` to run Vitest.
- Missing environment variables `VITE_OAUTH_PORTAL_URL` and `VITE_APP_ID` to `.env.example`.
- Sample unit test for environment utility.

### Changed

- Updated `package.json` with correct author, repository, and homepage information.
- Updated version to `1.1.0`.
- Implemented runtime conditional loading for analytics to avoid build warnings while maintaining functionality.

### Fixed

- Analytics configuration mismatch by implementing runtime conditional loading, eliminating build warnings while preserving functionality.

## [1.0.0] - 2025-02-18

### Added

- Initial release of GitHub Stats Dashboard - Simplified
- Responsive grid layout for repository overview
- Real-time search and filtering functionality
- Detailed modal view with comprehensive metrics
- Traffic charts with 14-day trend visualization
- GitHub Personal Access Token authentication
- Dark/light theme support
- Smooth animations with Framer Motion
- Comprehensive environment configuration
- TypeScript strict mode implementation
- Production build optimization
- Docker support with multi-stage builds
- Development debugging tools

### Features

- **Repository Overview**: Views, clones, stars, forks, PRs, and issues at a glance
- **Search & Filter**: Real-time filtering by name or description
- **Detailed Modal**: Comprehensive statistics and traffic trends
- **Responsive Design**: Adapts from mobile to desktop layouts
- **Theme Support**: Dark and light mode with smooth transitions
- **Performance**: Lazy loading, efficient state management, optimized animations

### Technical Stack

- React 19 with TypeScript strict mode
- Tailwind CSS 4 for styling
- Vite for build tooling and development
- Framer Motion for animations
- Recharts for data visualization
- Radix UI components with shadcn/ui
- Express.js server for production deployment

### Security

- Client-side GitHub API integration (no server token storage)
- Environment variable validation
- CORS configuration
- CSP support

### Documentation

- Comprehensive README with setup instructions
- Environment configuration guide
- Troubleshooting section
- API integration documentation
