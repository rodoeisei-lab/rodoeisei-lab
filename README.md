# rodoeisei-lab

## CI (Jekyll build)
1. Open a pull request.
2. Go to the **Actions** tab and confirm the `Jekyll Build` workflow turns green.
3. If it fails, check the logs for `Install dependencies` (bundle install) and `Build site` (jekyll build) first.

## Local preview
1. `bundle install`
2. `bundle exec jekyll serve --host 0.0.0.0 --port 4000`
3. Open `http://localhost:4000`

Note: The production build should be verified via the GitHub Pages Actions logs.

## Deploy (GitHub Pages)
- Merges to `main` / `master` trigger `Deploy GitHub Pages`.
- `Jekyll Build` is for validation; publishing is done by the deploy workflow.
- If the site does not change after merge, check the deploy workflow run and the repository Pages setting.

## Recent updates
- Aligned navigation labels with the actual Amazon/products page intent.
- Connected /products cards to Amazon categories and removed placeholder links.
- Added fallback handling for updates without titles and a template snippet.
- Added a copyable inquiry template to the contact page.

## Development advice (safe, small, verifiable)
1. Create a feature branch for every task; never push direct edits to `main` / `master`.
2. Keep one objective per change set (for example: "fix glossary search typo"), and avoid unrelated edits.
3. For breaking changes (API, config, dependencies, URLs, data formats), write a short note that covers reason, impact, and alternatives before implementation.
4. Read only the minimum required files first, then expand scope with a clear reason.
5. Run lightweight checks that match the change (`jekyll build`, targeted page preview, or relevant script checks) and record the command + result.
6. In pull requests, always include: summary, changed files, key diffs, and reproduction / verification steps.
