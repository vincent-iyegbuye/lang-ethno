# Interactive editorial redesign

The visual system pairs deep teal with coral, golden yellow, and warm paper. Colored chapter openings, typographic word cards, and conversation bubbles make the personal essay feel like an explorable story.

## Reader interactions

- Switch between the writer's intent and the stranger's interpretation in the opening.
- Jump directly to three interactive moments and see session-only completion feedback.
- Select a meaning, explore all four expressions, and switch listeners.
- Replay and restart the remembered conversation; compare adapting versus explaining.
- Use the mobile menu with keyboard support, including Escape to close it.

All essay paragraphs remain intact. No new external dependencies, fonts, tracking, or invented recordings are introduced. Reduced-motion preferences disable transitions and animation. `styles.css` supplies the base layout; `interactive.css` supplies the visual treatment; `enhancements.js` adds the new interactions alongside `script.js`.

## Inspiration

- [Google Arts & Culture Play](https://artsandculture.google.com/play): inviting exploration through small interactive experiences.
- [The Duolingo Method](https://blog.duolingo.com/duolingo-teaching-method/): learning by doing and immediate feedback.

These are conceptual references, not copied templates or assets.

## Preview

Run `python -m http.server 8000` in this folder, then open http://localhost:8000. No build step is required. Existing GitHub Pages deployment can serve the repository files directly.
