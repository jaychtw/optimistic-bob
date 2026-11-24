# Optimistic Bob / 樂觀鮑伯

Open `index.html` to play locally. The browser uses the same-origin `/ob3000Respond` on the studio portal and automatically falls back to bilingual templates when the proxy is unavailable. Submitted text goes to Gemini when the proxy is active. Browser microphone support varies. No conversation history is stored by the toy.

## Production

The studio repository owns Hosting. Deploying standalone Hosting over the studio would replace its catalog. Deploy the function from this checkout and Hosting from the studio checkout.

```sh
npm install --prefix functions
firebase functions:secrets:set GEMINI_API_KEY --project jollychubbystudio
firebase deploy --only functions:ob3000Respond --project jollychubbystudio
firebase functions:artifacts:setpolicy --location us-central1 --days 1 --project jollychubbystudio
```

The studio Hosting configuration must rewrite `/ob3000Respond` to the `ob3000Respond` function in `us-central1` after the function exists. The production artifact policy can be inspected under Artifact Registry → us-central1 → gcf-artifacts → cleanup policies.
