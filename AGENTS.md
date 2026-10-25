<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the workspace shell in the root layout around the dashboard and existing tool URLs so navigation remains mounted between pages without changing public URLs.
- Keep the five module definitions in a shared browser-safe registry so dashboard cards and sidebar links remain consistent.
- Share theme state through a root-level provider and semantic CSS tokens; restore the browser preference after hydration so every page stays consistent without SSR mismatches.
- Keep the personal-key SEO generator browser-initiated and send its key only to Google's API in a header; validate structured responses and share pure character rules with tests.
