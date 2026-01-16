# Quick Start Guide

## Enterprise Angular Application

Congratulations! Your enterprise-ready Angular application has been successfully scaffolded.

## 🎯 What's Included

✅ **Modern Angular 21** with standalone components
✅ **NgRx State Management** configured
✅ **Authentication System** with JWT support
✅ **Lazy-loaded Routes** for optimal performance
✅ **Shared Component Library** (Button, Card, Loading, Notifications)
✅ **HTTP Interceptors** for auth, error handling, and loading states
✅ **Route Guards** for authentication and role-based access
✅ **Docker Configuration** ready for deployment
✅ **CI/CD Pipeline** with GitHub Actions
✅ **Code Quality Tools** (ESLint, Prettier)
✅ **Path Aliases** for clean imports
✅ **Environment Configuration** for dev/prod

## 🚀 Getting Started

### Start Development Server

```bash
npm start
```

Visit [http://localhost:4200](http://localhost:4200)

### Build for Production

```bash
npm run build:prod
```

### Run Tests

```bash
npm test
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 📂 Project Structure

```
src/app/
├── core/           # Services, Interceptors, Guards
├── shared/         # Reusable Components, Pipes, Directives
├── features/       # Feature Modules (Auth, Dashboard)
└── store/          # NgRx State Management
```

## 🔑 Key Features

### Authentication

- JWT-based authentication
- Token refresh mechanism
- Auth guards for route protection
- Role-based access control

### State Management

- NgRx store configured
- Example user actions, reducers, effects
- Selectors for efficient state queries

### HTTP Interceptors

- **Auth Interceptor**: Adds JWT token to requests
- **Error Interceptor**: Global error handling
- **Loading Interceptor**: Loading state management

### Shared Components

- **Button**: Styled button with loading states
- **Card**: Container component with hover effects
- **Loading Spinner**: Global loading indicator
- **Notification**: Toast-style notifications

## 🎨 Routing

- `/auth/login` - Login page
- `/dashboard` - Protected dashboard (requires auth)

## 🔧 Configuration

### Environments

Edit `src/environments/environment.ts` for development settings.
Edit `src/environments/environment.prod.ts` for production settings.

### Path Aliases

Use clean imports with configured aliases:

```typescript
import { AuthService } from '@core/services/auth.service';
import { ButtonComponent } from '@shared/components/button/button.component';
```

## 🐳 Docker

```bash
# Build image
npm run docker:build

# Run container
npm run docker:run

# Or use docker-compose
npm run docker:compose
```

## 📝 Next Steps

1. **Customize Authentication**: Update API endpoints in environment files
2. **Add Features**: Create new feature modules in `src/app/features/`
3. **Extend State**: Add new actions, reducers, and effects as needed
4. **Style Components**: Customize SCSS in component files
5. **Configure CI/CD**: Update `.github/workflows/ci-cd.yml` with your deployment targets

## 📚 Documentation

See [README.md](README.md) for comprehensive documentation.

## Tips

- Use `ng generate component features/your-feature/your-component` to create new components
- Follow the established folder structure for consistency
- Leverage path aliases to keep imports clean
- Use lazy loading for new feature modules

## 🤝 Need Help?

- Check [Angular Documentation](https://angular.dev)
- Review [NgRx Documentation](https://ngrx.io)
- See project structure in [README.md](README.md)

Happy coding! 🎉
