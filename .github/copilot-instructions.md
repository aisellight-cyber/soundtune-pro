# SoundTune - Storytelling Platform Copilot Instructions

## Project Overview

SoundTune is an interactive vertical visual storytelling platform with integrated per-panel audio. It's built on a flexible content container framework (not hardcoded layouts).

## Key Architecture

### Core Components

- **Story Component** (`src/components/Story.tsx`) - Main container that manages panels and audio
- **Panel Component** (`src/components/Panel.tsx`) - Individual panel renderer with audio support
- **Type System** (`src/types/index.ts`) - Full TypeScript interfaces for extensibility

### Framework Philosophy

- **Flexible, not rigid** - Users define content via `StoryConfig`, not hardcoded HTML
- **Content agnostic** - Panels accept `React.ReactNode` for visual content
- **Audio first** - Each panel can have independent audio with configurable management
- **Callback driven** - Components expose callbacks for external state management

## Common Tasks

### Adding a New Story

1. Create a new `StoryConfig` in `src/data/`
2. Define panels with visual content and optional audio
3. Import and use in `App.tsx`

```typescript
const story: StoryConfig = {
  id: 'new-story',
  title: 'Story Title',
  panels: [
    {
      id: 'panel-1',
      visualContent: <YourComponent />,
      audio: { src: 'audio.mp3' }
    }
  ]
};
```

### Customizing Styles

- Global: Modify `src/index.css`
- Component: Edit `src/components/*.css`
- Per-panel: Use `backgroundColor` and `customClassName` in `PanelContent`

### Adding Interactive Elements

Panels accept any React component. Add interactivity directly:

```typescript
const InteractivePanel = () => {
  const [state, setState] = useState(false);
  return (
    <button onClick={() => setState(!state)}>
      {state ? 'On' : 'Off'}
    </button>
  );
};
```

### Managing Audio Globally

Use the `useAudioManager` hook in custom components for fine-grained control.

## File Structure Conventions

- `src/types/` - TypeScript interfaces only
- `src/components/` - React components with collocated CSS
- `src/hooks/` - Custom React hooks
- `src/data/` - Story configurations and demo data

## Development Workflow

1. `npm run dev` - Start dev server with HMR
2. Create/edit story configs - Auto-hot-reloads
3. Test in browser at `http://localhost:5174/`
4. `npm run build` when ready for production

## Testing

The framework includes example story with multiple panel types and audio. Test by:

1. Scrolling through panels
2. Playing audio in different panels
3. Testing responsive behavior (resize browser)
4. Checking audio pause behavior

## Performance Notes

- Audio uses `preload="metadata"` for fast loading
- Smooth scroll via CSS transitions
- Panel visibility tracked efficiently with Intersection Observer logic
- Minimal re-renders via React hooks

## Audio Integration Details

Each panel's audio:

- Controlled by native HTML5 `<audio>` element
- Optional `pauseOtherAudio` setting pauses competing tracks
- Tracks can be from any source (local, CDN, etc.)
- Full browser audio controls available

## Extending the Framework

### Custom Panel Types

Create specialized components and pass as `visualContent`:

```typescript
const CustomPanel: React.FC = () => {
  // Your custom logic
  return <div>Custom content</div>;
};
```

### Theme Customization

Modify `ThemeConfig` in `StoryConfig` or override CSS.

### Adding New Story Config Types

Extend `StoryConfig` interface in `src/types/index.ts` as needed.

## Browser Compatibility

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires CSS Grid, Flexbox, and HTML5 Audio support.

## Build & Deployment

```bash
npm run build      # Creates optimized dist/
npm run preview    # Test production build
```

Deploy the `dist/` folder to any static hosting.

## Common Issues

**Audio Not Playing**: Check CORS, audio file format, browser autoplay policies

**Styling Issues**: Check CSS specificity, component className conflicts

**Performance**: Long story? Consider lazy-loading with custom intersection observer

## Future Enhancement Ideas

- Keyboard navigation
- Full-screen panel mode
- Playlist/queue management
- Caption/subtitle support
- Accessibility improvements
- Analytics integration
