# SoundTune - Interactive Vertical Visual Storytelling Platform

A modern, flexible web application for creating interactive vertical narratives with integrated per-panel audio functionality.

## Features

- Flexible content container framework (not hardcoded layouts)
- Per-panel audio integration with independent controls
- Smooth vertical scrolling with animations
- Fully responsive design
- Configurable audio management
- Real-time panel visibility tracking
- TypeScript support

## Quick Start

```bash
npm install
npm run dev
```

## Project Structure

- `src/components/` - Core UI components (Story, Panel)
- `src/types/` - TypeScript definitions
- `src/hooks/` - Hook utilities (useAudioManager)
- `src/data/` - Example story configurations
- `src/App.tsx` - Main application

## Creating a Story

Define your story using the `StoryConfig` interface:

```typescript
const myStory: StoryConfig = {
  id: 'story-1',
  title: 'My Story',
  panels: [
    {
      id: 'panel-1',
      title: 'Chapter One',
      visualContent: <YourComponent />,
      audio: { src: 'audio.mp3', label: 'Audio' },
    },
  ],
};
```

## Panel Content

Each panel can contain:

- Images: `<img>` elements
- Videos: `<video>` elements
- Custom React components
- Text and HTML
- CSS animations
- Interactive elements

## Audio Integration

Each panel can have independent audio with controls. Configure global behavior:

```typescript
autoPlayAudio: false,  // Don't auto-play
pauseOtherAudio: true, // Pause others when one plays
```

## Type Definitions

### StoryConfig

```typescript
interface StoryConfig {
  id: string;
  title: string;
  description?: string;
  panels: PanelContent[];
  theme?: ThemeConfig;
  autoPlayAudio?: boolean;
  pauseOtherAudio?: boolean;
}
```

### PanelContent

```typescript
interface PanelContent {
  id: string;
  title?: string;
  description?: string;
  visualContent: React.ReactNode;
  audio?: AudioConfig;
  backgroundColor?: string;
  minHeight?: string | number;
  customClassName?: string;
  metadata?: Record<string, any>;
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Scripts

- `npm run dev` - Development server
- `npm run build` - Build for production
- `npm run preview` - Preview build locally
- `npm run lint` - Run ESLint

## Examples

See `src/data/exampleStory.tsx` for a complete working example.

## License

MIT

---

Built with React, TypeScript, and Vite.
