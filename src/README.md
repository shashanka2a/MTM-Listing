# Model Train Listing Onboarding – AI Import System

A complete Progressive Web App (PWA) for processing model train inventory with AI-powered listing generation for SixBit export.

## Overview

This internal tool streamlines the process of converting raw product photos into complete, SixBit-ready listings. Built for operators processing 200+ items per day with enterprise-grade efficiency.

## Features

### 🚀 Complete Workflow
- **Upload Screen**: Drag-and-drop photo upload with multi-file support
- **AI Processing**: Automatic feature detection, condition grading, and data extraction
- **Review Screen**: Two-column interface for image intelligence and listing editing
- **Export Screen**: Bulk export to SixBit CSV/XML with column mapping

### 🤖 AI Intelligence
- **Visual Detection**: Identifies defects, scratches, box wear, and damage
- **OCR Extraction**: Reads road numbers, model numbers, and logos
- **Condition Grading**: C1-C10 scale with AI-suggested grades and evidence
- **Confidence Scoring**: Per-field confidence levels for data accuracy

### 📱 Progressive Web App
- **Offline Support**: Service worker caching for offline functionality
- **Install Prompt**: Add to home screen on mobile and desktop
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Touch Optimized**: 44px minimum touch targets for mobile

### ⚡ Power User Features
- **Keyboard Shortcuts**: Cmd+S (save), Cmd+A (approve), Cmd+D (toggle detections)
- **Bulk Operations**: Select and export multiple listings at once
- **Search & Filter**: Real-time search across SKU, title, brand
- **Progress Tracking**: Visual workflow progress indicator

### 🎨 Professional UI/UX
- **Model Train Market Aesthetic**: Warm burgundy (#8b4513) accents on off-white (#faf8f6)
- **Data-Dense Layout**: Optimized for high-volume processing
- **Loading States**: Smooth transitions and progress indicators
- **Toast Notifications**: Success/error feedback
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## Component Architecture

### Screens
- `UploadScreen` - Photo upload interface with preview
- `ReviewScreen` - Main AI review and editing interface
- `ExportScreen` - Bulk export and listing management

### Core Components
- `ImageViewer` - AI detection overlay with zoom and carousel
- `ListingForm` - SixBit field generator with live editing
- `ActionBar` - Sticky bottom action bar for approve/reject/save

### Listing Sections
- `TitleGenerator` - Template-based title builder
- `ConditionGrading` - C1-C10 slider with evidence bullets
- `ItemSpecifics` - 19-field dynamic form with validation
- `DimensionsWeight` - Measurements with source attribution
- `Description` - Multi-section structured description editor

### UX Enhancements
- `PWAInstallPrompt` - Smart install banner
- `OfflineIndicator` - Connection status indicator
- `KeyboardShortcuts` - Help modal with keyboard commands
- `Toast` - Notification system
- `LoadingState` - Unified loading component
- `SearchBar` - Reusable search with filters
- `ProgressTracker` - Step indicator
- `Stats` - Dashboard statistics
- `EmptyState` - Zero-state placeholder

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icon library
- **Service Worker** - PWA functionality

## Data Flow

```
1. Upload Photos → 
2. AI Processing (2-3s) → 
3. Review & Edit → 
4. Approve → 
5. Export Queue → 
6. SixBit CSV/XML
```

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

### Item Specifics Captured
- Brand, Line, Scale, Gauge
- Road Name, Road Number
- Locomotive Type, Phase
- DCC Status, Decoder Brand
- Coupler Type, Lighting
- Material, Paint, Packaging
- Condition details and testing status

## Performance Optimization

- **Image Loading**: Lazy loading with fallback component
- **State Management**: Minimal re-renders
- **Bundle Size**: Code splitting by route
- **Caching**: Service worker caching strategy
- **Mobile**: Touch-optimized interactions

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation throughout
- Screen reader support with ARIA labels
- Color contrast ratios meet standards
- Focus indicators on all interactive elements
- Reduced motion support

## Browser Support

- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

## Mobile Support

- iOS 14+ (Safari, Chrome)
- Android 8+ (Chrome, Samsung Internet)
- Progressive enhancement for older browsers

## Future Enhancements

- [ ] Batch upload from folder
- [ ] Advanced AI training on custom datasets
- [ ] Multi-language support
- [ ] eBay direct integration
- [ ] Analytics dashboard
- [ ] User preferences and templates
- [ ] Photo editing tools
- [ ] Barcode/QR scanning

## Design Philosophy

**Speed First**: Every interaction optimized for operators processing hundreds of items daily. One-click approvals, keyboard shortcuts, and bulk operations reduce cognitive load.

**AI-Assisted, Human-Verified**: AI suggestions with confidence scores allow humans to make final decisions. Trust but verify.

**Progressive Disclosure**: Complex details hidden behind expandable sections. Show what's needed, hide the rest.

**Responsive by Default**: Mobile-first design that scales to desktop workstations seamlessly.

---

Built for Model Train Market internal operations team.
