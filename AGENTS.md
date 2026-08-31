# AGENTS.md

## Repository instructions

### Before making changes
- Read only the minimum files needed for the task, then expand scope when necessary.
- Keep one objective per change set.
- Preserve the existing Jekyll/Liquid structure unless the task explicitly requires structural change.

### UI / frontend work
- **Before any UI, layout, CSS, component, navigation, or visual change, read `DESIGN.md`.**
- Treat `DESIGN.md` as the repository's design guidance.
- Prefer existing CSS variables, classes, includes, and layout patterns over inventing new ones.
- Check `assets/css/main.css` and `assets/css/components.css` for an existing pattern before adding CSS.
- Do not add a new persistent color, radius, shadow, spacing convention, or component style without a clear reason.
- If a persistent design rule changes, update `DESIGN.md` in the same change set.
- Avoid generic AI-generated UI patterns such as excessive cards, pills, gradients, shadows, decorative icons, and unnecessary hero ornamentation.
- Verify responsive behavior, especially around 360px mobile width.
- Maintain keyboard focus styles, readable contrast, semantic HTML, and approximately 44px minimum interactive targets.

### Content
- Keep Japanese copy clear, practical, and concise.
- For laws, regulations, official limits, and other changeable occupational-health information, prefer primary official sources and avoid unsupported certainty.
- Do not turn technical pages into marketing copy.

### Validation
- Run the lightest relevant checks for the change.
- For site-wide or template/CSS changes, run `bundle exec jekyll build` when the environment allows it.
- Respect the existing CI Quality Gate and fix introduced broken internal links/assets.

### Pull requests
Include:
1. Summary
2. Changed files
3. Key design/behavior changes
4. Verification performed
5. Any known limitations
