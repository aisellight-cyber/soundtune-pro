# SoundTune - Admin & Viewer Sections

## New Features: Manhwa Panel Management

SoundTune now includes dedicated **Admin** and **Viewer** sections for creating and experiencing vertical manhwa stories with automatic audio playback.

## Admin Section 🛠️

The admin panel allows creators to manage stories and panels with a clean, intuitive interface.

### Features

- **Story Management**
  - Create multiple stories with unique titles
  - View all stories in a sidebar
  - Delete stories and individual panels
  - Auto-save to browser localStorage

- **Panel Management**
  - Upload tall PNG images (9:16 aspect ratio recommended for manhwa)
  - Add optional audio narration per panel
  - Add title and description to each panel
  - Visual thumbnail grid of all panels
  - Drag-and-drop ready (can be expanded)

- **Security**
  - Password-protected admin access (default: `admin123`)
  - Simple but secure authentication screen
  - Logout functionality

### How to Use Admin

1. From the home page, click **"Create Story"** → Admin Panel
2. Enter the admin password: `admin123`
3. Create a new story by entering a title and clicking "New Story"
4. For each panel:
   - Add optional title and description
   - Upload a tall PNG image (manhwa format)
   - Optionally upload audio narration
   - Click "Add Panel to Story"
5. View thumbnails of all panels in the story
6. Delete panels or entire stories as needed
7. Everything auto-saves to your browser

### Storage

- Stories are stored in **localStorage** (browser storage)
- Each panel's image and audio are Base64-encoded
- Data persists across browser sessions
- Storage limit typically 5-10MB depending on browser

## Viewer Section 👁️

The viewer mode provides a clean, distraction-free reading experience.

### Features

- **Clean Reading Experience**
  - Full-screen, image-focused layout
  - No visible audio player UI
  - Beautiful gradient backgrounds
  - Optimized for vertical panels

- **Audio Integration**
  - Audio plays automatically when panel loads
  - Visual indicator shows when audio is playing
  - Animated waveform display
  - Audio continues even if you navigate panels

- **Navigation**
  - Previous/Next buttons
  - Keyboard support (Arrow Left/Right, Space)
  - Touch swipe support (Left/Right)
  - Progress bar showing story progress
  - Panel counter

- **Responsive Design**
  - Adapts to desktop, tablet, and mobile
  - Touch-optimized for mobile readers
  - Maintains aspect ratio of images

### How to Use Viewer

1. From home page, click **"Read Stories"** → Reader Mode
2. Select a story from the available list
3. Experience the story:
   - Audio plays automatically
   - Use arrow keys or swipe to navigate
   - No audio player visible (clean experience)
4. Return to story list anytime with back button

## Architecture

### Component Structure

```
App.tsx (main app with mode switching)
├── Home.tsx (landing page with navigation)
├── Admin.tsx (creator dashboard)
│   └── Admin.css
├── Viewer.tsx (reader experience)
│   └── Viewer.css
└── Story.tsx (demo story component)
```

### Data Flow

**Admin Section:**
```
Upload Image/Audio
    ↓
File Conversion to Base64
    ↓
Store in React State
    ↓
Save to localStorage
```

**Viewer Section:**
```
Load from localStorage
    ↓
Display Story List
    ↓
Load Selected Story
    ↓
Auto-play Audio per Panel
    ↓
Navigate Between Panels
```

## Technical Details

### localStorage Structure

```typescript
{
  "soundtune_stories": [
    {
      "id": "story-1234567890",
      "title": "My Manhwa",
      "panels": [
        {
          "id": "panel-1",
          "title": "Chapter 1",
          "description": "...",
          "imageBase64": "data:image/png;base64,...",
          "audioBase64": "data:audio/mpeg;base64,...",
          "imageFileName": "panel1.png",
          "audioFileName": "narration.mp3"
        }
      ],
      "createdAt": "2026-02-14T..."
    }
  ]
}
```

### Supported File Formats

**Images:**
- PNG (recommended for transparency)
- JPG/JPEG
- WebP
- GIF
- BMP

**Audio:**
- MP3
- WAV
- OGG/OGA
- M4A
- FLAC

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 12+)
- Chrome Mobile (latest)

## Storage Limits & Considerations

### Browser localStorage Limits

- Chrome: ~10MB
- Firefox: ~10MB
- Safari: ~5MB
- Edge: ~10MB

### Tips for Large Projects

1. **Compress Images**
   - Use tools like TinyPNG or ImageOptim
   - Target 500KB-1MB per panel
   - 9:16 aspect ratio typically 400-800px wide

2. **Optimize Audio**
   - Use MP3 format at 128kbps bitrate
   - Typical narration: 50-200KB per panel

3. **Track Usage**
   - Monitor browser storage in DevTools
   - Clear old stories to make space

### Example Storage Requirements

- Single 10-panel story with audio
- 600x1067px PNG images (100KB each)
- 30-second MP3 audio (200KB each)
- **Total:** ~3MB storage

## Limitations & Future Enhancements

### Current Limitations

- Data stored locally in browser (not cloud)
- No user accounts or multi-device sync
- No collaborative editing
- No video support (images only)

### Planned Features

- Cloud storage integration (Firebase, AWS)
- User authentication and accounts
- Story sharing with custom URLs
- Advanced panel editor with effects
- Video panel support
- Page templates and themes
- Analytics integration
- Comments/notifications
- Offline reading mode

## Security Notes

⚠️ **Important:**
- Default admin password `admin123` is for demo only
- For production, implement proper authentication
- localStorage is accessible to any script (do not store sensitive data)
- Use HTTPS when deploying
- Implement server-side validation for any user uploads

## Troubleshooting

### Audio Not Playing
- Check browser autoplay policy (may be blocked by browser)
- Verify audio file format is supported
- Check file size isn't exceeding browser limits
- Try MP3 format first (most compatible)

### Stories Not Saving
- Check if browser allows localStorage
- Look at browser console for errors
- Try clearing cache and restarting
- Test with smaller files first

### Image Distorted
- Ensure image aspect ratio is 9:16 (manhwa format)
- Try using different image compression
- Check browser zoom level isn't affecting display

### Performance Issues
- Reduce image file sizes
- Remove unused stories
- Clear browser cache
- Close unnecessary tabs/extensions

## Workflow Examples

### Example 1: Create a Single-Panel Story

1. Go to Admin Panel → Enter password
2. Create story titled "My First Panel"
3. Upload a PNG image (800x1422px)
4. Click "Add Panel"
5. Go to Viewer and read it

### Example 2: Create a Story with Audio

1. Admin Panel → New Story "Story with Narration"
2. Add Panel 1:
   - Title: "Opening Scene"
   - Image: cover.png
   - Audio: opening_narration.mp3
3. Add Panel 2:
   - Title: "The Adventure Begins"
   - Image: scene2.png
   - Audio: scene2_narration.mp3
4. View in Reader → Audio plays automatically per panel

### Example 3: Manage Multiple Stories

1. Create stories: "Journey", "Mystery", "Dream"
2. Add 5-10 panels to each
3. Browse in Viewer to select and read
4. Admin can edit, delete, or add more panels anytime

## Performance Tips

1. **Optimal Image Size**
   - Width: 600-800px
   - Height: aspect 9:16 ratio
   - Compression: 60-80% quality
   - Format: PNG with compression or WebP

2. **Audio Optimization**
   - MP3 128kbps bitrate
   - Mono for narration, Stereo for music
   - 30-120 seconds per panel ideal
   - Normalize volume for consistency

3. **Loading Experience**
   - Keep images under 500KB each
   - Total story under 50MB for smooth experience
   - First panel loads quickly = better UX

## Getting Help

- Check `.github/copilot-instructions.md` for architecture details
- Review example story in `src/data/exampleStory.tsx`
- See `README.md` for base framework documentation
- Check browser console for error messages

---

Ready to create your first manhwa story? Start with the **Admin Panel**! 🎨📖
