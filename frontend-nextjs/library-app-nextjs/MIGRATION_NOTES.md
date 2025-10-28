# Migration Notes: React to Next.js

## ✅ Completed

### 1. Structure Setup
- ✅ Next.js 14 project structure with App Router
- ✅ All route pages created (home, search, shelf, messages, admin, checkout, reviewlist)
- ✅ Auth0 integration with Next.js Auth0 SDK
- ✅ Bootstrap CSS and JavaScript properly integrated

### 2. Components Migrated
- ✅ Navbar (with Auth0 user context)
- ✅ Footer
- ✅ HomePage components:
  - Carousel
  - ExploreTopBooks
  - Heros
  - LibraryServices
  - ReturnBook
- ✅ SearchBooksPage and SearchBook component
- ✅ Utility components:
  - SpinnerLoading
  - Pagination
  - StarsReview

### 3. Configuration
- ✅ API configuration with environment variable support
- ✅ CSS styles migrated from React app
- ✅ Images copied to public folder
- ✅ Bootstrap dependencies added

### 4. Pages Created
All main pages have been created with proper layout structure:
- `/` - Redirect to `/home`
- `/home` - Homepage with all components
- `/search` - Book search page
- `/shelf` - User bookshelf (placeholder)
- `/messages` - Messages page (placeholder)
- `/admin` - Admin page (placeholder)
- `/checkout/[bookId]` - Book checkout (placeholder)
- `/reviewlist/[bookId]` - Review list (placeholder)

## ⚠️ Remaining Work

### Pages to Complete
The following pages are created but need full component implementation:
1. **ShelfPage** (`app/shelf/page.tsx`) - Needs Loans, History, and LoansModal components
2. **MessagesPage** (`app/messages/page.tsx`) - Needs Messages and PostNewMessage components
3. **AdminPage** (`app/admin/page.tsx`) - Needs all admin management components
4. **BookCheckoutPage** (`app/checkout/[bookId]/page.tsx`) - Complex page with checkout and review functionality
5. **ReviewListPage** (`app/reviewlist/[bookId]/page.tsx`) - Review listing page

### Missing Components
The following components need to be migrated from the React app:
- `Utils/LeaveAReview.tsx`
- `Utils/OutOfStockModal.tsx`
- `Utils/Review.tsx`
- `ShelfPage/components/*`
- `MessagesPage/components/*`
- `ManageLibraryPage/components/*`
- `BookCheckoutPage/components/*`

### Environment Variables
Create a `.env.local` file in the root of `library-app-nextjs/` with:

```bash
AUTH0_SECRET='use [openssl rand -hex 32] to generate'
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://dev-nkq0liomsorgp780.us.auth0.com
AUTH0_CLIENT_ID=mh6Mj02Vdecux6G7YJ8LPxtmyUGPpseq
AUTH0_CLIENT_SECRET='your-auth0-client-secret'

NEXT_PUBLIC_BOOK_SERVICE=http://localhost:8082/api
NEXT_PUBLIC_ADMIN_SERVICE=http://localhost:8083/api
NEXT_PUBLIC_REVIEW_SERVICE=http://localhost:8084/api
NEXT_PUBLIC_MESSAGE_SERVICE=http://localhost:8085/api
```

## 🚀 Running the Application

1. Install dependencies:
```bash
cd frontend-nextjs/library-app-nextjs
npm install
```

2. Create `.env.local` file with the configuration above

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## 📝 Key Differences: React vs Next.js

### Routing
- **React**: `react-router-dom` with `<Route>` components
- **Next.js**: File-based routing in `app/` directory
- Dynamic routes: `app/checkout/[bookId]/page.tsx`

### Client Components
- **React**: All components are client-side by default
- **Next.js**: Use `'use client'` directive for components that use hooks or browser APIs

### Link Component
- **React**: `<Link to="/path">`
- **Next.js**: `<Link href="/path">`
- Import from `next/link`

### Auth0 Integration
- **React**: `useAuth0` hook from `@auth0/auth0-react`
- **Next.js**: `useUser` hook from `@auth0/nextjs-auth0/client`
- API routes in `app/api/auth/[...auth0]/route.ts`

### Images
- **React**: `require('./image.png')` or `import`
- **Next.js**: Use `/Images/...` paths (relative to public folder)

## 🔄 Migration Pattern

When migrating a component:
1. Add `'use client'` directive at the top
2. Replace `react-router-dom` imports with `next/link`
3. Replace `useAuth0` with `useUser` from `@auth0/nextjs-auth0/client`
4. Update image paths to use `/` prefix (public folder)
5. Update API calls to use `NEXT_PUBLIC_*` environment variables

## 📦 Dependencies Added

- `bootstrap@^5.3.0` - For UI components
- All Auth0 and Stripe dependencies already included

## 🎯 Next Steps

1. Implement the remaining page components
2. Test authentication flow
3. Test API integration with backend services
4. Add missing utility components
5. Update environment variables with actual values

