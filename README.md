# Enterprise Angular Application

A production-ready Angular application built with enterprise-level best practices, modern architecture patterns, and comprehensive tooling.

## 🚀 Features

- **Modern Angular 21+** with standalone components
- **NgRx State Management** with effects and selectors
- **Authentication & Authorization** with JWT and role-based access control
- **Lazy Loading** for optimal performance
- **Reactive Programming** with RxJS
- **Type Safety** with TypeScript strict mode
- **Code Quality** with ESLint and Prettier
- **Comprehensive Testing** setup with Vitest
- **Docker Support** for containerization
- **CI/CD Pipeline** with GitHub Actions
- **Path Aliases** for clean imports
- **Environment Configuration** for different stages

## 📁 Project Structure

```
enterprise/
├── .github/
│   ├── workflows/
│   │   └── ci-cd.yml           # CI/CD pipeline
│   └── copilot-instructions.md # GitHub Copilot instructions
├── src/
│   ├── app/
│   │   ├── core/               # Singleton services, interceptors, guards
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   ├── error.interceptor.ts
│   │   │   │   └── loading.interceptor.ts
│   │   │   └── services/
│   │   │       ├── api.service.ts
│   │   │       ├── auth.service.ts
│   │   │       ├── error.service.ts
│   │   │       ├── loading.service.ts
│   │   │       ├── logger.service.ts
│   │   │       └── notification.service.ts
│   │   ├── features/           # Feature modules (lazy-loaded)
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── auth.routes.ts
│   │   │   └── dashboard/
│   │   │       ├── dashboard.component.ts
│   │   │       └── dashboard.routes.ts
│   │   ├── shared/             # Reusable components, pipes, directives
│   │   │   ├── components/
│   │   │   │   ├── button/
│   │   │   │   ├── card/
│   │   │   │   ├── loading-spinner/
│   │   │   │   └── notification/
│   │   │   ├── directives/
│   │   │   │   ├── has-role.directive.ts
│   │   │   │   └── highlight.directive.ts
│   │   │   └── pipes/
│   │   │       ├── safe-html.pipe.ts
│   │   │       └── truncate.pipe.ts
│   │   ├── store/              # NgRx state management
│   │   │   ├── actions/
│   │   │   ├── effects/
│   │   │   ├── reducers/
│   │   │   ├── selectors/
│   │   │   └── index.ts
│   │   ├── app.config.ts       # App configuration
│   │   ├── app.routes.ts       # App routing
│   │   └── app.ts              # Root component
│   ├── environments/           # Environment configurations
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   └── index.html
├── .eslintrc.json             # ESLint configuration
├── .prettierrc                # Prettier configuration
├── Dockerfile                 # Docker build configuration
├── docker-compose.yml         # Docker Compose configuration
├── nginx.conf                 # Nginx configuration for production
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

## 🛠️ Prerequisites

- **Node.js** >= 20.x
- **npm** >= 11.x
- **Angular CLI** >= 21.x
- **Docker** (optional, for containerization)

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd enterprise
```

1. Install dependencies:

```bash
npm install
```

## 🏃 Development

Start the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## 🏗️ Build

Build the project for production:

```bash
npm run build:prod
```

The build artifacts will be stored in the `dist/` directory.

## 🧪 Testing

Run unit tests:

```bash
npm test
```

Run tests in CI mode:

```bash
npm run test:ci
```

## 🔍 Code Quality

Run linting:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

Check formatting:

```bash
npm run format:check
```

## 🐳 Docker

Build Docker image:

```bash
npm run docker:build
```

Run Docker container:

```bash
npm run docker:run
```

Run with Docker Compose:

```bash
npm run docker:compose
```

## 🏛️ Architecture

### Core Module

Contains singleton services, HTTP interceptors, and route guards:

- **AuthService**: Handles authentication and token management
- **ApiService**: Centralized HTTP client wrapper
- **LoadingService**: Global loading state management
- **NotificationService**: Application-wide notifications
- **ErrorService**: Error logging and handling
- **LoggerService**: Configurable logging

### Shared Module

Reusable components, pipes, and directives:

- **Components**: Button, Card, LoadingSpinner, Notification
- **Directives**: HasRole, Highlight
- **Pipes**: Truncate, SafeHtml

### Feature Modules

Lazy-loaded modules for specific features:

- **Auth Module**: Login, authentication
- **Dashboard Module**: Main dashboard

### State Management

NgRx for predictable state management:

- **Actions**: Define state changes
- **Reducers**: Handle state transitions
- **Effects**: Side effects and async operations
- **Selectors**: Query state efficiently

## 🔐 Authentication

The application uses JWT-based authentication with:

- Token storage in localStorage
- Automatic token refresh
- Auth guards for protected routes
- Role-based access control

## 🚦 Routing

Configured with lazy loading for optimal performance:

- `/auth/login` - Login page
- `/dashboard` - Dashboard (protected)

## 🌍 Environment Configuration

Configure different environments in:

- `src/environments/environment.ts` - Development
- `src/environments/environment.prod.ts` - Production

## 📝 Path Aliases

Use clean imports with configured path aliases:

```typescript
import { AuthService } from '@core/services/auth.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { DashboardComponent } from '@features/dashboard/dashboard.component';
```

## 🚀 CI/CD

GitHub Actions workflow includes:

- Automated testing
- Code linting
- Production builds
- Docker image creation
- Deployment automation

## 🔒 Security

- HTTP interceptors for auth headers
- Security headers in nginx configuration
- Content Security Policy (CSP)
- XSS protection
- CSRF protection

## 📚 Best Practices

- **Strict TypeScript** configuration
- **OnPush** change detection strategy where applicable
- **Reactive forms** for form handling
- **Async pipe** for subscriptions
- **trackBy** functions in ngFor loops
- **Lazy loading** for features
- **Code splitting** for optimal bundle size

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- NgRx Team for state management
- Community contributors
