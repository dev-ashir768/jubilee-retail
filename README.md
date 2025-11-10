# Jubilee General Retail Frontend

A comprehensive retail management system built with Next.js and React, designed for managing users, branches, orders, policies, and other retail operations. This application provides a full-featured admin dashboard for retail business management.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) - React framework with App Router
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) - Beautiful and accessible UI components
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) - Utility-first CSS framework
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) - Powerful data synchronization
- **Data Tables**: [TanStack Table](https://tanstack.com/table) - Headless table library
- **Form Handling**: [React Hook Form](https://react-hook-form.com) with [Zod](https://zod.dev) validation
- **Select Components**: [React Select](https://react-select.com) - Flexible select input control
- **Icons**: [Lucide React](https://lucide.dev) - Beautiful icon library
- **Animations**: [Framer Motion](https://framer.com/motion) - Production-ready motion library
- **HTTP Client**: [Axios](https://axios-http.com) - Promise-based HTTP client
- **Charts**: [Recharts](https://recharts.org) - Composable charting library
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs) - Small, fast and scalable state management
- **Runtime**: [Node.js](https://nodejs.org) - JavaScript runtime

## Features

- 🔐 **Authentication System** - Secure login with OTP verification
- 👥 **User Management** - Complete CRUD operations for users, agents, and API users
- 🏢 **Branch Management** - Manage retail branches with advanced forms and data tables
- 📊 **Dashboard Analytics** - Comprehensive dashboard with KPIs, charts, and reports
- 📋 **Data Tables** - Advanced tables with sorting, filtering, export functionality, and pagination
- 📱 **Responsive Design** - Mobile-first responsive interface
- 🎨 **Dark/Light Mode** - Theme switching capability
- 🔄 **Real-time Updates** - Optimistic UI updates with TanStack Query
- 📝 **Forms** - Type-safe forms with validation and react-select integration
- 🎯 **TypeScript** - Full type safety throughout the application
- 📈 **Reporting** - Advanced reporting with filters and Excel export
- 🛒 **Order Management** - Complete order lifecycle management
- 📞 **Customer Service** - Call management and lead tracking
- 🎫 **Coupons Management** - Coupon creation and management system
- 🚚 **Courier Management** - Courier service integration
- 🏷️ **Product Management** - Product categories, products, and pricing
- 📋 **Policy Management** - Insurance policy management and status tracking
- 🔄 **Renewal Management** - Policy renewal tracking and management
- 🗺️ **Relation Mappings** - Entity relationship management
- 💳 **Payment Modes** - Multiple payment method support
- 📍 **Location Management** - Cities, business regions, and geographic data
- 📊 **Motor Quotes** - Vehicle insurance quoting system
- 🏦 **IGIS Integration** - Insurance gateway integration
- 🔧 **Web App Mappers** - External system integrations

## Project Structure

```
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Authentication routes (login, OTP)
│   ├── (dashboard)/            # Dashboard routes
│   │   ├── agents-dos/         # Agents and Development Officers
│   │   ├── branches-clients/   # Branch and Client management
│   │   ├── cites-couiers/      # Cities and Couriers
│   │   ├── coupons-management/ # Coupon management
│   │   ├── customer-service/   # Customer service operations
│   │   ├── dashboard/          # Main dashboard
│   │   ├── igis/               # IGIS integration
│   │   ├── leads/              # Lead management
│   │   ├── mapping/            # Relation mappings
│   │   ├── motor-quote/        # Motor insurance quotes
│   │   ├── orders/             # Order management
│   │   ├── products-plans/     # Products and plans
│   │   ├── reporting/          # Reporting and analytics
│   │   ├── user-profile/       # User profile management
│   │   └── users/              # User management
│   └── (public)/               # Public routes
├── components/                 # Reusable UI components
│   ├── ui/                     # Feature-specific components
│   │   ├── agent/              # Agent management components
│   │   ├── api-user-products/  # API user products
│   │   ├── auth/               # Authentication components
│   │   ├── branch/             # Branch management
│   │   ├── business-region/    # Business region management
│   │   ├── call-us/            # Call management
│   │   ├── cbo/                # CBO operations
│   │   ├── city/               # City management
│   │   ├── client/             # Client management
│   │   ├── common/             # Common components
│   │   ├── coupons/            # Coupon components
│   │   ├── courier/            # Courier management
│   │   ├── create-orders/      # Order creation
│   │   ├── dashboard/          # Dashboard components
│   │   ├── datatable/          # Data table utilities
│   │   ├── development-officers/ # Development officers
│   │   ├── filters/            # Filter components
│   │   ├── foundations/        # Base UI components
│   │   ├── igis-make/          # IGIS make management
│   │   ├── igis-sub-make/      # IGIS sub-make management
│   │   ├── lead-info/          # Lead information
│   │   ├── lead-motor-info/    # Motor lead info
│   │   ├── modal-dialog/       # Modal dialogs
│   │   ├── motor-quote/        # Motor quote components
│   │   ├── orders-list/        # Orders listing
│   │   ├── payment-modes/      # Payment modes
│   │   ├── plans/              # Plan management
│   │   ├── policies/           # Policy management
│   │   ├── premium-range-protection/ # Premium range protection
│   │   ├── product/            # Product management
│   │   ├── product-category/   # Product categories
│   │   ├── product-options/    # Product options
│   │   ├── product-types/      # Product types
│   │   ├── relation-mappings/  # Relation mappings
│   │   ├── renewal/            # Renewal management
│   │   ├── reporting/          # Reporting components
│   │   └── shadcn/             # shadcn/ui components
│   ├── ui/                     # Additional UI components
│   └── utils/                  # Component utilities
├── helperFunctions/            # API helper functions
│   ├── agentFunction.ts        # Agent operations
│   ├── allMenusFunction.ts     # Menu management
│   ├── apiUserProductsFunction.ts # API user products
│   ├── branchFunction.ts       # Branch operations
│   ├── businessRegionFunction.ts # Business region
│   ├── callUsFunction.ts       # Call management
│   ├── cityFunction.ts         # City operations
│   ├── clientFunction.ts       # Client operations
│   ├── commonFunctions.ts      # Common utilities
│   ├── couponsFunction.ts      # Coupon operations
│   ├── courierFunction.ts      # Courier operations
│   ├── dashboardFunctions.ts   # Dashboard data
│   ├── developmentOfficerFunction.ts # Development officers
│   ├── igisFunction.ts         # IGIS integration
│   ├── leadsFunction.ts        # Lead management
│   ├── motorQuoteFunctions.ts  # Motor quotes
│   ├── ordersFunctions.ts      # Order operations
│   ├── paymentModesFunction.ts # Payment modes
│   ├── plansFunction.ts        # Plan operations
│   ├── premiumRangeProtectionsFunction.ts # Premium protection
│   ├── productCategoriesFunction.ts # Product categories
│   ├── productOptionsFunction.ts # Product options
│   ├── productsFunction.ts     # Product operations
│   ├── productTypesFunction.ts # Product types
│   ├── relationMappingsFunction.ts # Relation mappings
│   ├── userFunction.ts         # User operations
│   └── webAppMappersFunction.ts # Web app mappers
├── hooks/                      # Custom React hooks
│   ├── *IdStore.ts             # ID state management hooks
│   ├── *FilterState.ts         # Filter state hooks
│   └── use-mobile.ts           # Mobile detection hook
├── lib/                        # Utility libraries
├── providers/                  # React context providers
├── public/                     # Static assets
├── schemas/                    # Zod validation schemas
│   ├── *Schema.ts              # Validation schemas for each feature
├── types/                      # TypeScript type definitions
│   ├── *Types.ts               # Type definitions for each feature
└── utils/                      # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Key Features

### Authentication
- Email/phone-based login
- OTP verification system
- Secure session management

### User Management
- User listing with advanced data table
- Add, edit, and manage users
- Role-based access control
- API user management
- Agent management
- Development officer management

### Branch Management
- Branch listing with sortable and filterable data table
- Add new branches with comprehensive form validation
- Edit existing branch information
- Manager assignment with react-select dropdown
- Auto-fill manager names based on username selection

### Dashboard Analytics
- KPI cards with key metrics
- Monthly orders and policies charts
- Payment mode distribution
- Policy status breakdown
- Top 5 agents and branches
- Product share analysis
- Recent orders tracking

### Data Tables
- Sorting and filtering capabilities
- Column visibility controls
- Export functionality (Excel/CSV)
- Pagination with customizable page sizes
- Global search functionality
- Advanced filtering options

### Order Management
- Order creation with bulk upload
- Order listing and tracking
- Order verification and status management
- Excel upload functionality
- Order detail dialogs

### Product Management
- Product categories management
- Product creation and editing
- Product options configuration
- Product types management
- Premium range protection

### Policy Management
- Policy listing and status tracking
- Policy status changes
- Renewal policy management
- CBO policy operations

### Reporting
- Advanced reporting with multiple filters
- Excel export functionality
- Date range filtering
- Comprehensive analytics

### UI/UX
- Modern, clean interface
- Consistent design system
- Responsive layouts across all devices
- Loading states and error handling
- Toast notifications with Sonner
- Smooth animations with Framer Motion

## Development Guidelines

### Code Structure
- Use TypeScript for type safety
- Follow React best practices
- Implement proper error boundaries
- Use React Hook Form for forms
- Validate data with Zod schemas

### Styling
- Use Tailwind CSS utilities
- Follow shadcn/ui design patterns
- Maintain consistent spacing and colors
- Ensure responsive design

### State Management
- Use TanStack Query for server state
- Use Zustand for global client state
- Use React state for local UI state
- Implement optimistic updates where appropriate

### API Integration
- Use Axios for HTTP requests
- Implement proper error handling
- Use TanStack Query for caching and synchronization
- Follow RESTful API patterns

## Contributing

1. Follow the existing code style
2. Write type-safe code
3. Include proper error handling
4. Test your changes thoroughly
5. Update documentation as needed

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TanStack Query Guide](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)
- [Recharts Documentation](https://recharts.org)

## Deployment

The application can be deployed on any platform that supports Next.js:

- [Vercel](https://vercel.com) (recommended)
- [Netlify](https://netlify.com)
- [AWS](https://aws.amazon.com)
- [Google Cloud](https://cloud.google.com)

For detailed deployment instructions, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).