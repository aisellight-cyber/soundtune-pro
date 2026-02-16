# Quick Start Guide - SoundTune

## Getting Started

Your SoundTune storytelling platform is ready to use! The development server is running at `http://localhost:5174/`.

## What You Have

✅ **Flexible Panel System** - Not hardcoded layouts
✅ **Per-Panel Audio** - Independent audio controls for each panel
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Example Story** - Interactive demo with multiple content types
✅ **TypeScript Support** - Full type safety
✅ **Hot Module Reloading** - Changes instantly refresh in browser

## Creating Your First Story

### 1. Create a Story Configuration

Create a new file `src/data/myStory.tsx`:

```typescript
import type { StoryConfig } from '../types';

export const myStory: StoryConfig = {
  id: 'my-story',
  title: 'My Awesome Story',
  description: 'Built with SoundTune',
  panels: [
    {
      id: 'opening',
      title: 'Once Upon a Time',
      description: 'In a land far away...',
      visualContent: (
        <div style={{ fontSize: '48px' }}>🌍</div>
      ),
      backgroundColor: '#667eea',
      audio: {
        src: 'https://example.com/audio.mp3',
        label: 'Opening narration',
      },
    },
    {
      id: 'chapter-2',
      title: 'The Adventure Begins',
      visualContent: (
        <img src="image.jpg" alt="Adventure" />
      ),
      backgroundColor: '#764ba2',
    },
  ],
  autoPlayAudio: false,
  pauseOtherAudio: true,
};
```

### 2. Use Your Story in App.tsx

```typescript
import { Story } from './components';
import { myStory } from './data/myStory';

function App() {
  return <Story config={myStory} />;
}
```

### 3. View in Browser

The page instantly updates! Your story is now live at `http://localhost:5174/`

## Panel Content Options

Each panel's `visualContent` can be:

```typescript
// Images
visualContent: <img src="image.jpg" />

// Videos
visualContent: <video src="video.mp4" controls />

// Custom Components
visualContent: <MyInteractiveComponent />

// Text & Styling
visualContent: (
  <div style={{ fontSize: '32px', color: 'white' }}>
    Your Content Here
  </div>
)

// Emojis & Unicode
visualContent: <div style={{ fontSize: '64px' }}>🎭</div>
```

## Audio Configuration

```typescript
audio: {
  src: 'path/to/audio.mp3',    // Required
  label: 'Scene Description',    // Optional
  duration: 180,                 // Optional (seconds)
  autoplay: false,               // Optional
}
```

## Styling Options

### Per-Panel Styling

```typescript
{
  id: 'panel-1',
  backgroundColor: '#1a1a2e',    // Custom background
  minHeight: '150vh',            // Taller than viewport
  customClassName: 'my-panel',   // Custom CSS class
}
```

### Global Theme

```typescript
theme: {
  primaryColor: '#667eea',
  secondaryColor: '#764ba2',
  backgroundColor: '#ffffff',
  textColor: '#1a1a1a',
  transitionSpeed: 600,
}
```

### Custom CSS

Edit `src/components/Panel.css` and `src/components/Story.css`

## Available Commands

```bash
# Start development server with auto-reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Interactive Elements Example

```typescript
import { useState } from 'react';

const InteractivePanel = () => {
  const [likes, setLikes] = useState(0);
  
  return (
    <div>
      <button onClick={() => setLikes(likes + 1)}>
        👍 {likes} Likes
      </button>
    </div>
  );
};

// Use in story:
{
  id: 'interactive',
  visualContent: <InteractivePanel />,
}
```

## Advanced Features

### Track Panel Visibility

```typescript
<Story
  config={myStory}
  onPanelInView={(panelId, progress) => {
    console.log(`Panel ${panelId} is ${progress * 100}% visible`);
  }}
/>
```

### Use Audio Manager Hook

```typescript
import { useAudioManager } from './hooks/useAudioManager';

function MyComponent() {
  const { pauseAllExcept, playAudio } = useAudioManager();
  
  return (
    <button onClick={() => pauseAllExcept('panel-1')}>
      Play Panel 1
    </button>
  );
}
```

## Tips & Tricks

1. **Use Relative Paths** - Place audio files in `public/` folder
2. **Optimize Images** - Compress images for faster loading
3. **Test Mobile** - Resize browser to test responsive behavior
4. **Use Emojis** - Great for simple, colorful visuals
5. **Group Related Panels** - Use similar backgroundColor for flow

## Example Audio Sources

- **Free Audio**: Pixabay, Unsplash Music, Freesound
- **Local Files**: Place in `public/` folder
- **CDN**: Use full URLs
- **Format Support**: MP3, WAV, OGG, M4A

## Deployment

Build your project:

```bash
npm run build
```

Deploy the `dist/` folder to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Your own server

## Troubleshooting

**Audio not playing?**
- Check file path/URL
- Verify CORS settings
- Check browser autoplay policies
- Use absolute URLs for external audio

**Styling looks off?**
- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS specificity
- Use browser DevTools to debug

**Changes not showing?**
- Save the file
- Check browser console for errors
- Restart dev server if needed

## Next Steps

1. ✅ Explore the example story at `src/data/exampleStory.tsx`
2. ✅ Create your first story following the guide above
3. ✅ Add images and audio to your panels
4. ✅ Customize colors and styling
5. ✅ Deploy when ready!

## Documentation

- Full Type Definitions: See `src/types/index.ts`
- Example Story: `src/data/exampleStory.tsx`
- README: `README.md`
- Copilot Instructions: `.github/copilot-instructions.md`

## Questions?

Refer to:
- **Framework Architecture**: `.github/copilot-instructions.md`
- **API Reference**: `README.md`
- **Example Code**: `src/data/exampleStory.tsx`

Happy storytelling! 🎬🎵
