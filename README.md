# CampusQ - Smart Campus Queue Management

<p align="center">
  <img src="public/og-image.png" alt="CampusQ logo" width="480" />
</p>

<p align="center">
  <a href="https://github.com/ashwinasthana/CampusQ/"><img alt="GitHub stars" src="https://img.shields.io/github/stars/ashwinasthana/CampusQ?style=flat-square" /></a>
  <a href="https://github.com/ashwinasthana/CampusQ/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/ashwinasthana/CampusQ?style=flat-square" /></a>
  <a href="https://github.com/ashwinasthana/CampusQ/blob/main/LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" /></a>
  <a href="https://campus-q-two.vercel.app"><img alt="Live demo" src="https://img.shields.io/badge/demo-live-brightgreen?style=flat-square" /></a>
</p>

> Transform your campus experience with intelligent queue management. No more waiting in lines.

[Visit Live](https://campus-q-two.vercel.app/)

---

## Table of Contents
- [About](#about)
- [Problem Statement](#problem-statement)
- [Demo](#demo)
- [Screenshots](#screenshots)
- [Key Features](#key-features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [Tech Stack](#tech-stack)
- [Performance](#performance)
- [License](#license)
- [Support](#support)

---

## About
CampusQ revolutionizes campus queue management by providing a smart, digital solution that eliminates physical waiting lines. Students, faculty, and staff can join virtual queues, track wait times in real-time, and receive notifications when it's their turn - all from their mobile devices.

Our platform serves cafeterias, libraries, administrative offices, labs, and any campus facility where queuing is necessary, making campus life more efficient and stress-free.

---

## Problem Statement
Campus queues are a daily frustration:
- ⏰ **Time Waste** - Students spend hours waiting in physical lines
- 😤 **Stress & Anxiety** - Uncertainty about wait times creates pressure
- 📱 **Digital Gap** - Most campuses still rely on outdated queue systems
- 🦠 **Health Concerns** - Physical queues increase contact and crowding
- 📊 **Poor Analytics** - Facilities can't optimize operations without data

CampusQ solves these problems with intelligent, data-driven queue management.

---

## Demo
**Live Platform:** [https://campus-q-two.vercel.app](https://campus-q-two.vercel.app)

**Test Accounts:**
- Student: `student@campus.edu` / `demo123`
- Staff: `staff@campus.edu` / `demo456`
- Admin: `admin@campus.edu` / `admin789`

**Demo Scenarios:**
1. Join a cafeteria queue and track your position
2. Receive real-time notifications
3. View facility analytics (admin only)

---

## Screenshots

**Dashboard Overview**
<p align="center">
  <img src="public/dashboard.png" alt="Dashboard" width="720" />
</p>

**Queue Interface**
<p align="center">
  <img src="public/queue-interface.png" alt="Queue interface" width="720" />
</p>

**Mobile Experience**
<p align="center">
  <img src="public/mobile-view.png" alt="Mobile view" width="360" />
</p>

---

## Key Features

### For Students & Staff
- **Smart Queue Joining** - Scan QR codes or search facilities to join queues
- **Real-time Updates** - Live position tracking and wait time estimates
- **Smart Notifications** - Push alerts when your turn approaches
- **Queue History** - Track your queue patterns and time savings
- **Multi-facility Support** - Manage queues across different campus locations

### For Facility Managers
- **Analytics Dashboard** - Comprehensive insights into queue patterns
- **Capacity Management** - Set and adjust serving capacity dynamically
- **Staff Controls** - Manage queue flow and handle special cases
- **Custom Notifications** - Send updates to waiting users
- **Performance Metrics** - Track efficiency improvements

### For Administrators
- **Campus-wide Overview** - Monitor all facilities from a single dashboard
- **User Management** - Handle student, staff, and manager accounts
- **System Configuration** - Customize settings for different facilities
- **Reporting Tools** - Generate detailed usage and efficiency reports
- **Integration APIs** - Connect with existing campus systems

---

## Installation

### Prerequisites
- Node.js >= 18
- MongoDB or PostgreSQL database
- Redis for session management
- Firebase account (for notifications)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/ashwinasthana/CampusQ.git
cd CampusQ

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

### Docker Setup (Alternative)
```bash
# Using Docker Compose
docker-compose up -d

# The application will be available at http://localhost:3000
```

---

## Configuration

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/campusq
REDIS_URL=redis://localhost:6379

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Firebase (for notifications)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key

# Email Service (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Campus Integration (optional)
CAMPUS_API_URL=https://your-campus-api.edu
CAMPUS_API_KEY=your-api-key
```

---

## Usage Guide

### For Students
1. **Register/Login** with your campus email
2. **Find Facilities** using search or campus map
3. **Join Queue** by scanning QR code or selecting from list
4. **Track Progress** in real-time on your dashboard
5. **Receive Notifications** when your turn approaches

### For Facility Staff
1. **Access Staff Dashboard** with your facility credentials
2. **Monitor Active Queues** and current wait times
3. **Manage Queue Flow** by calling next person or handling issues
4. **Adjust Capacity** based on staffing and demand
5. **View Analytics** to optimize operations

### For Campus Administrators
1. **System Overview** - Monitor all campus facilities
2. **User Management** - Add/remove users and assign roles
3. **Facility Setup** - Configure new locations and services
4. **Reports & Analytics** - Generate usage and efficiency reports
5. **System Configuration** - Adjust platform-wide settings

---

## API Documentation

### Authentication
All API requests require authentication via JWT tokens.

```javascript
// Get auth token
POST /api/auth/login
{
  "email": "user@campus.edu",
  "password": "password"
}
```

### Queue Operations
```javascript
// Join a queue
POST /api/queue/join
{
  "facilityId": "facility-123",
  "serviceType": "general"
}

// Get queue status
GET /api/queue/status/:queueId

// Leave queue
DELETE /api/queue/leave/:queueId
```

### Facility Management
```javascript
// Get facility info
GET /api/facilities/:facilityId

// Update facility capacity
PUT /api/facilities/:facilityId/capacity
{
  "capacity": 15,
  "estimatedServiceTime": 5
}
```

**Full API Documentation:** [Visit API Docs](https://campus-q-two.vercel.app/api-docs)

---

## Contributing

We welcome contributions! Here's how to get started:

### Development Setup
```bash
# Fork the repository
git clone https://github.com/ashwinasthana/CampusQ.git

# Clone your fork
git clone https://github.com/YOUR-USERNAME/CampusQ.git

# Create a feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git commit -m "Add: your feature description"

# Push and create PR
git push origin feature/your-feature-name
```

### Contribution Guidelines
- Follow the existing code style and conventions
- Add tests for new features
- Update documentation for any API changes
- Ensure mobile responsiveness for UI changes
- Test across different browsers and devices

### Priority Areas
- **Mobile App Development** - React Native implementation
- **Advanced Analytics** - Machine learning for wait time prediction
- **Accessibility** - Screen reader and keyboard navigation support
- **Internationalization** - Multi-language support
- **Integration APIs** - Connect with popular campus management systems

---

## Roadmap

### Phase 1 (Current) - Core Platform
- ✅ Basic queue management
- ✅ Real-time updates
- ✅ Admin dashboard
- ✅ Mobile-responsive design

### Phase 2 (Q2 2025) - Enhanced Features
- 🔄 Advanced notifications (SMS, WhatsApp)
- 🔄 Queue reservation system
- 🔄 Integration with campus ID systems
- 🔄 Offline queue tracking

### Phase 3 (Q3 2025) - Intelligence & Scale
- ⏳ AI-powered wait time prediction
- ⏳ Multi-campus support
- ⏳ Advanced analytics and reporting
- ⏳ Mobile app (iOS/Android)

### Phase 4 (Q4 2025) - Ecosystem
- ⏳ Third-party integrations
- ⏳ API marketplace
- ⏳ White-label solutions
- ⏳ Machine learning insights

---

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Hook Form** - Form management
- **Zustand** - State management

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma** - Database ORM
- **NextAuth.js** - Authentication
- **Socket.io** - Real-time communications
- **Redis** - Session and cache management

### Database & Infrastructure
- **PostgreSQL** - Primary database
- **Firebase** - Push notifications
- **Vercel** - Hosting and deployment
- **Upstash Redis** - Serverless Redis
- **Cloudinary** - Image management

### Monitoring & Analytics
- **Vercel Analytics** - Performance monitoring
- **Sentry** - Error tracking
- **PostHog** - User analytics

---

## Performance

### Key Metrics
- **Load Time** - < 2 seconds initial load
- **Real-time Updates** - < 100ms latency
- **Mobile Performance** - 95+ Lighthouse score
- **API Response** - < 200ms average
- **Uptime** - 99.9% availability

### Optimization Features
- Server-side rendering for faster initial loads
- Image optimization and lazy loading
- API response caching with Redis
- Progressive Web App capabilities
- Efficient database queries with connection pooling

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

### Getting Help
- 📖 **Documentation** - Check this README and API docs
- 🐛 **Bug Reports** - [Open an issue](https://github.com/ashwinasthana/CampusQ/issues)
- 💡 **Feature Requests** - [Request a feature](https://github.com/ashwinasthana/CampusQ/issues)
- 💬 **Discussion** - [GitHub Discussions](https://github.com/ashwinasthana/CampusQ/discussions)

### Enterprise Support
For campus-wide deployments and custom integrations, contact us at:
- 📧 Email: ashwinasthanax@gmail.com
- 🌐 Website: [https://campus-q-two.vercel.app/](https://campus-q-two.vercel.app/)

---

## Acknowledgments

- **Campus Communities** - For inspiring this solution
- **Open Source Contributors** - Building the future of campus tech
- **Beta Testing Universities** - Early adopters who provided valuable feedback
- **Design Inspiration** - Modern queue management systems worldwide

---

*"Eliminating wait times, one queue at a time."* 🚀

Join thousands of students and staff who have transformed their campus experience with CampusQ. Every minute saved in queues is a minute gained for learning, connecting, and growing.
