# A little love letter

A static website that can be hosted on GitHub Pages.

## Publish with GitHub Pages

1. Create a GitHub repository and upload the contents of this folder to its `main` branch.
2. In the repository, open **Settings → Pages** and set the publishing source to **GitHub Actions**.
3. The included workflow deploys the site whenever you push to `main`. You can also run it manually from the repository's **Actions** tab using **Publish to GitHub Pages → Run workflow**.
4. After the workflow succeeds, open the URL shown in the **github-pages** deployment environment (usually `https://<your-account>.github.io/<repository>/`).

If your default branch is not named `main`, update the branch in `.github/workflows/pages.yml` to match.

The site has no build step or external dependencies; keep `index.html`, `style.css`, `script.js`, and the `assets`, `photos`, and `song` folders together in the repository.
