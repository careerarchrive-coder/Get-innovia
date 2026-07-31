# Innovia Job Board

A Next.js job board that displays live listings pulled from a client-provided XML job feed.

## Environment variables

Set JOB_FEED_URL in your Vercel project settings (Settings, then Environment Variables) to the feed URL provided by the client. Keep it secret and never commit it to this repo.

## Local development

Copy .env.local.example to .env.local and set JOB_FEED_URL, then run npm install followed by npm run dev.
