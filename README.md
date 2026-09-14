# High On Beans (HOB) — Review-then-Pay Gate

Static mobile-first page: guests leave a Google review, then see a PhonePe QR to pay.

## Local preview

1. Open the folder:
   ```bash
   cd hob-review-pay
   ```
2. Open `index.html` in a browser (double-click, or):
   ```bash
   # Python
   python3 -m http.server 8080
   # then visit http://localhost:8080

   # or npx
   npx --yes serve .
   ```
3. Flow check:
   - QR section is **hidden** on first load.
   - Tap **Leave a Google review** → Google opens in a new tab; QR unlocks here.
   - Or tap **I've opened the review — show QR** if the popup was blocked.
   - Refreshing the same tab keeps the QR visible (`sessionStorage` key `hob_review_opened`).

## Files

| File | Purpose |
|------|---------|
| `index.html` | Markup |
| `styles.css` | Warm coffee theme, mobile-first |
| `app.js` | Unlock + sessionStorage |
| `assets/phonepe-qr.jpeg` | PhonePe / UPI QR |

## Host anywhere (static)

No build step, no backend.

### Netlify

1. Drag the `hob-review-pay` folder onto [Netlify Drop](https://app.netlify.com/drop), **or**
2. Connect a Git repo and set publish directory to the folder containing `index.html`.

### GitHub Pages

1. Push this folder to a repo (root or `/docs`).
2. Settings → Pages → Deploy from branch → select the branch and folder.
3. Site URL will be `https://<user>.github.io/<repo>/` (or custom domain).

### Other

Upload the folder contents to any static host (Cloudflare Pages, Vercel static, S3 + CloudFront, nginx `root`, etc.). Ensure `assets/phonepe-qr.jpeg` is served next to `index.html`.

## Notes

- Pure client-side; unlock is convenience UX, not payment verification.
- Review link opens with `target="_blank"` and `rel="noopener noreferrer"`.
- Brand palette: warm browns and creams for High On Beans.
