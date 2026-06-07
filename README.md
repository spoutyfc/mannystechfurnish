# Manny's Tech Furnish - SaaS Platform

A premium, modern tech services platform built with Next.js 16, Neon Postgres, Better Auth, Framer Motion, and Stripe integration.

## Features

### Public Site
- **Landing Page**: Beautiful hero section with glassmorphism design and smooth animations
- **Portfolio Page**: Showcase completed projects with technologies and links
- **Services Page**: Display service offerings with flexible pricing options
- **Contact Page**: Professional inquiry form with real-time submission
- **Navigation**: Responsive navbar with links throughout the site

### Admin Dashboard
- **Authentication**: Email/password based with Better Auth (Better than other solutions built-in)
- **Portfolio Management**: Full CRUD for projects with images, descriptions, and technologies
- **Services Management**: Manage service offerings with pricing types and icons
- **Inquiry Tracking**: View, categorize, and manage client inquiries in real-time
- **Settings**: Configure site settings and Stripe integration details

### Technical Stack
- **Frontend**: Next.js 16 (App Router), React 19, Framer Motion, GSAP
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Authentication**: Better Auth with Neon Postgres
- **Database**: Neon Postgres with Drizzle ORM
- **API**: RESTful routes for public portfolio/services data
- **Animations**: Framer Motion for page transitions and micro-interactions

## Installation

### Prerequisites
- Node.js 18+
- pnpm (recommended)
- Neon database URL
- BETTER_AUTH_SECRET (generate with `openssl rand -base64 32`)

### Setup

1. **Clone and install**:
```bash
git clone <repo>
cd manny-tech-furnish
pnpm install
```

2. **Environment variables** (`.env.local`):
```
DATABASE_URL=postgresql://user:password@host/database
BETTER_AUTH_SECRET=your-generated-secret
```

3. **Run development server**:
```bash
pnpm dev
```

4. **Open browser**:
- Public site: http://localhost:3000
- Sign up: http://localhost:3000/sign-up
- Admin dashboard: http://localhost:3000/dashboard

## Key Pages

### Public Routes
- `/` - Landing page with hero, features, CTA
- `/portfolio` - Portfolio grid of projects
- `/services` - Service offerings
- `/contact` - Contact form

### Auth Routes
- `/sign-in` - Email/password login
- `/sign-up` - Registration
- `/dashboard` - Protected overview page

### Admin Routes (Protected)
- `/dashboard/portfolio` - Manage portfolio projects
- `/dashboard/services` - Manage services
- `/dashboard/inquiries` - View client inquiries
- `/dashboard/settings` - Site configuration

### Public APIs
- `GET /api/public/portfolio` - Fetch projects
- `GET /api/public/services` - Fetch services
- `POST /api/public/contact` - Submit contact inquiry

## Database Schema

### Better Auth Tables
- `user` - User accounts with email verification
- `session` - Active sessions
- `account` - OAuth/provider accounts
- `verification` - Email verification tokens

### App Tables
- `portfolio_projects` - Portfolio projects with images and technologies
- `services` - Service offerings with pricing types
- `testimonials` - Client testimonials
- `contact_inquiries` - Client inquiries from contact form
- `orders` - Customer orders (for Stripe integration)
- `subscriptions` - Recurring subscriptions
- `site_settings` - Site configuration and Stripe keys

## Security Features

- Session-based authentication with Better Auth
- Per-user data scoping (getUserId() pattern)
- Password hashing by Better Auth
- CSRF protection
- Secure cookies with proper SameSite attributes
- Server-side data validation with Zod

## Next Steps for Deployment

1. **Stripe Integration**:
   - Add Stripe API keys to `.env.local`
   - Create Stripe products and prices
   - Map services to Stripe price IDs in admin settings

2. **Email Notifications**:
   - Add email service (SendGrid, Resend, etc.)
   - Send inquiry confirmations to admins
   - Send order receipts to customers

3. **Deployment**:
   - Connect GitHub repo to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy with `vercel deploy`

4. **Custom Domain**:
   - Update BETTER_AUTH_URL if using custom domain
   - Configure DNS records with Vercel

## Performance Notes

- Uses Turbopack for fast builds
- Optimized images with Next.js Image component
- Static generation where possible
- Smooth animations with Framer Motion GPU acceleration
- Database queries with proper indexing

## Browser Support

- Chrome/Edge 90+
- Firefox 89+
- Safari 14+
- Mobile browsers (responsive design)

## License

Private - Manny's Tech Furnish

## Support

For issues or questions, contact: contact@example.com
