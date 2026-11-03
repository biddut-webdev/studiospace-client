# StudioSpace

StudioSpace is a studio rental and booking platform where users can explore studios, book spaces, and manage their own studio listings.

## Live Website

**Live URL:** `ADD_YOUR_DEPLOYED_CLIENT_URL`

## Key Features

- Browse and explore available studios.
- Search and discover studios by category.
- View detailed studio information, pricing, amenities, and availability.
- User authentication with email/password and Google.
- Add, edit, and delete studio listings.
- Book studios and manage booking requests.
- Hosts can confirm, complete, or manage bookings.
- Prevent overlapping confirmed bookings.
- Save favorite studios to a personal wishlist.
- Download PDF invoices for confirmed bookings.
- Responsive design for mobile, tablet, and desktop.
- Light and dark theme support.
- Toast notifications and custom confirmation dialogs.

## Technology Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Better Auth
- Sonner
- Lucide React
- jsPDF
- next-themes

### Backend
- Node.js
- Express.js
- MongoDB
- Better Auth
- JSON Web Token (JWT)
- Cookie Parser
- Multer
- ImgBB API

## Run Locally

### Prerequisites
- Node.js
- npm
- MongoDB database
- ImgBB API key

### 1. Clone the repository

```bash
git clone https://github.com/biddut-webdev/studiospace-client.git
cd studiospace-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the client root directory:

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend Setup

The backend source code is available here:

[StudioSpace Server Repository](https://github.com/biddut-webdev/studiospace-server)

Follow the server repository README to configure and run the backend.

## Examiner Test Credentials

**Email:** `ADD_EXAMINER_EMAIL`

**Password:** `ADD_EXAMINER_PASSWORD`

## Author

StudioSpace — Developed as a Programming Hero Batch 14 Assignment Project.