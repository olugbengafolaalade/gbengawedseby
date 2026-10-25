# Ebele & Gbenga — gbengawedseby.com

React + Vite wedding site with two themes (Traditional · White Wedding), a love-story timeline,
travel info for out-of-town guests, and an RSVP form served by a Vercel function (`api/rsvp.js`).

```bash
npm install
npm run dev      # site only (RSVP needs `vercel dev` to run /api locally)
npm run build
```

## Edit the words
Everything — story chapters, venue details, travel tips, FAQs — is in `src/data/content.js`.
The story chapters are a warm placeholder: replace them with your real moments and dates.
Photos live in `public/images/`.

## RSVPs → Google Sheet (free, ~2 minutes)
1. Create a Google Sheet. Extensions → Apps Script, paste:
```js
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const sh = SpreadsheetApp.getActiveSheet();
  const cols = ['submittedAt','name','email','phone','travellingFrom','traditional','whiteWedding','partySize','guestNames','dietary','needsTravelHelp','message'];
  if (sh.getLastRow() === 0) sh.appendRow(cols);
  sh.appendRow(cols.map(c => d[c] ?? ''));
  return ContentService.createTextOutput('ok');
}
```
2. Deploy → New deployment → Web app → Execute as **Me**, access **Anyone**. Copy the URL.
3. In Vercel → Project → Settings → Environment Variables add `RSVP_WEBHOOK_URL` = that URL, then redeploy.
4. Optional: `VITE_CONTACT_EMAIL` / `VITE_CONTACT_WHATSAPP` show a fallback contact if the form ever fails.

## Deploy
Import the repo in Vercel (framework auto-detected as Vite). Add the domain `gbengawedseby.com`.
Share a theme directly with `?wedding=traditional` or `?wedding=white`.
