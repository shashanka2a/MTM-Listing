# Color Migration Guide

## Burgundy Color Change: #8b4513 → #800000

This document tracks the migration from the old burgundy (#8b4513) to the new burgundy (#800000).

### Color Mapping

| Old Color | New Color | Usage |
|-----------|-----------|-------|
| #8b4513 | #800000 | Primary burgundy (buttons, text, borders) |
| #723a0f | #660000 | Hover state for primary |
| #6b3410 | #900000 | Secondary burgundy (alternate buttons) |
| #5a2d0e | #700000 | Hover state for secondary |

### Automated Replacement

To replace all colors across the codebase, run:

```bash
node scripts/replace-colors.js
```

This script will:
- Find all `.tsx`, `.ts`, and `.css` files
- Replace all instances of old colors with new ones
- Report the number of replacements made

### Manual Verification

After running the script, verify the following files:
- `/styles/globals.css` - Scrollbar and focus styles
- `/manifest.json` - PWA theme color
- All component files in `/components/` directory

### Files Updated

- ✅ `/styles/globals.css` - Global styles
- ✅ `/manifest.json` - PWA theme  
- ✅ `/utils/colors.ts` - Color constants
- ⚠️ Component files - Run replacement script

### Testing Checklist

After color migration:
- [ ] Check all primary buttons (Upload, Approve, Submit)
- [ ] Verify hover states work correctly
- [ ] Test focus rings on form inputs
- [ ] Check scrollbar color in long content
- [ ] Verify role switcher active state
- [ ] Test mobile navigation active state
- [ ] Check progress tracker completed steps
- [ ] Verify SKU link colors in admin view

### Rollback

To rollback, reverse the color mapping:
```bash
# Replace #800000 back to #8b4513
# Replace #660000 back to #723a0f
# Replace #900000 back to #6b3410
# Replace #700000 back to #5a2d0e
```
