# Model Train Market - Listing Onboarding System

An AI-powered internal tool for processing model train inventory with automated listing generation for SixBit export.

## Overview

This Progressive Web App (PWA) streamlines the process of converting raw product photos into complete, SixBit-ready listings. Built for operators processing 200+ items per day with enterprise-grade efficiency.

## User Story

### As an Admin User, I want to:

1. **Sign In** to the system securely
   - Navigate to the login page
   - Enter your credentials
   - Access the dashboard upon successful authentication

2. **View Dashboard** to get an overview of operations
   - See quick stats: Processed Today, Pending Review, Export Ready, Avg Accuracy
   - Access quick actions: Start New Upload, Review Listings, Export Queue
   - View recent activity feed
   - Understand the 4-step workflow visually

3. **Upload Product Photos** for AI processing
   - Drag and drop multiple product images (main view, detail shots, packaging, paperwork)
   - Support for JPG, PNG, HEIC, WebP formats (max 50MB per file)
   - Preview uploaded images with ability to remove individual files
   - Click "Process with AI" to start automated analysis

4. **Review AI-Generated Listings** before approval
   - View AI-detected features and condition grading
   - Edit auto-generated title, condition (C1-C10 scale), and item specifics
   - Review extracted data: Brand, Scale, Road Name, Road Number, etc.
   - Verify dimensions and weight
   - Edit multi-section description
   - Approve or reject listings with keyboard shortcuts (Cmd+S save, Cmd+A approve)

5. **Export Approved Listings** to SixBit
   - View all approved listings ready for export
   - Select multiple listings for batch export
   - Download as CSV or XML format
   - Configure column mapping for SixBit import
   - Export all or selected listings

## Workflow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Upload    │ →  │     AI      │ →  │   Review    │ →  │   Export    │
│   Photos    │    │  Processing │    │  & Approve  │    │  to SixBit  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
     Step 1            Step 2            Step 3            Step 4
```

## Features

### Authentication
- Secure login with username/password
- Session persistence with local storage
- Protected routes via middleware
- Auto-redirect for authenticated users

### Upload Screen (`/upload`)
- Drag-and-drop photo upload
- Multi-file support with preview
- File validation (type, size)
- Visual upload progress

### AI Processing
- Automatic feature detection
- Condition grading (C1-C10 scale)
- OCR for road numbers, model numbers, logos
- Confidence scoring per field

### Review Screen (`/review`)
- Two-column layout: Image Intelligence + Listing Generator
- Interactive image viewer with zoom
- AI detection overlays
- Editable form fields with validation
- Real-time auto-save

### Export Screen (`/export`)
- Searchable listing table (cards on mobile)
- Bulk selection and export
- CSV and XML download options
- Column mapping configuration
- Export statistics
- Responsive design: table on desktop, cards on mobile

### PWA Support
- Offline functionality via service worker
- Install prompt for home screen
- Responsive design (mobile, tablet, desktop)

## Routes

| Route | Description | Authentication |
|-------|-------------|----------------|
| `/login` | Sign in page | Public |
| `/` | Dashboard/Home | Protected |
| `/upload` | Photo upload | Protected |
| `/review` | Listing review | Protected |
| `/export` | Export queue | Protected |

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **State**: React Context API
- **PWA**: Service Worker

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd "MTM Listing"

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
├── app/
│   ├── page.tsx          # Dashboard
│   ├── login/
│   │   └── page.tsx      # Login page
│   ├── upload/
│   │   └── page.tsx      # Upload screen
│   ├── review/
│   │   └── page.tsx      # Review screen
│   ├── export/
│   │   └── page.tsx      # Export screen
│   ├── layout.tsx        # Root layout
│   ├── providers.tsx     # Context providers
│   ├── error.tsx         # Error boundary
│   ├── loading.tsx       # Loading state
│   └── not-found.tsx     # 404 page
├── middleware.ts         # Route protection
├── src/
│   ├── components/
│   │   ├── screens/      # Page components
│   │   ├── listing/      # Listing form components
│   │   ├── ui/           # Shadcn UI components
│   │   └── ...           # Other components
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ToastContext.tsx
│   └── utils/
│       └── csvExport.ts  # Export utilities
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd + S` | Save draft |
| `Cmd + A` | Approve listing |
| `Cmd + /` | Show shortcuts help |
| `D` | Toggle AI detections |

## SixBit Integration

### Export Formats
- **CSV**: Compatible with SixBit bulk import
- **XML**: Advanced field mapping support

### Field Mapping

| App Field | SixBit Field |
|-----------|--------------|
| SKU | ItemNumber |
| Title | Title |
| Condition | ConditionCode |
| Brand | Brand |
| Scale | Scale |
| Weight | Weight |

## Item Specifics Captured

- Brand, Line, Scale, Gauge
- Road Name, Road Number
- Locomotive Type, Phase
- DCC Status, Decoder Brand
- Coupler Type, Lighting
- Material, Paint, Packaging
- Condition details and testing status

## Browser Support

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

## Mobile Support

- iOS 14+ (Safari, Chrome)
- Android 8+ (Chrome, Samsung Internet)
- Touch-optimized with 44px minimum targets

## Design Philosophy

**Speed First**: Every interaction optimized for operators processing hundreds of items daily. One-click approvals, keyboard shortcuts, and bulk operations reduce cognitive load.

**AI-Assisted, Human-Verified**: AI suggestions with confidence scores allow humans to make final decisions. Trust but verify.

**Progressive Disclosure**: Complex details hidden behind expandable sections. Show what's needed, hide the rest.

---

Built for Model Train Market internal operations team.

*Version 2.0 - January 2026*
