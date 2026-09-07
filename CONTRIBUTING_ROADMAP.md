# Contribution Readiness & Idea Backlog

This file tracks two things: what's needed before this project is genuinely ready for outside contributors, and a running backlog of ideas/decisions we've surfaced but not yet acted on. Review it periodically — pull items into active work, add new ones as they come up, and move finished items into a CHANGELOG once one exists.

## Readiness for outside contributors

- [x] LICENSE (MIT) — added
- [ ] `CONTRIBUTING.md` — how to propose a change, local dev setup (there isn't one yet — it's a single static HTML file, worth saying that explicitly), coding conventions (vanilla JS/CSS, no build step, no framework)
- [ ] Decide how to handle the Park City/Summit County-specific content (hardcoded coordinates, local routes, county alert links) so someone in a different WUI community can fork this sensibly — e.g. pull location-specific values into one clearly-marked config block instead of scattering them through the file
- [ ] `CODE_OF_CONDUCT.md` — standard for public repos, low effort (can adopt Contributor Covenant as-is)
- [ ] Issue templates (bug report / feature request)
- [ ] Basic PR template
- [ ] A statement on scope — what kind of contributions you actually want (bug fixes? new data sources? support for other counties/regions?) so contributors aren't guessing

## Open ideas carried over from earlier review (not yet decided)

- `CHANGELOG.md` — capture the version history so far (0.3.2 → 0.4.0 → 0.5.0), each with real behavioral changes worth recording before they're forgotten
- "Last verified" date on external links (UDOT pages, county alert signup, etc.) — these are exactly the kind of links that silently rot
- Screenshots or a short GIF in the README
- A "how to deploy" section — manifest's `start_url`/`scope` assume a `/wildfire-watch/` path; document where/how this is actually hosted
- Native camera thumbnail embed on Evacuation Watch (needs a free UDOT developer API key)
- Automatic "nearest RAWS station" lookup for Fuel Moisture/ERC, instead of manual station-map lookup
- Multi-location/household support (currently one hardcoded default + a session-only override)
- Add more routes
- Logic to suggest a route
- Convert to GO?

## How to use this file

- Add new ideas here as they come up, even half-formed ones — better to capture them than lose them
- When you want to work a session, start by skimming this file and picking what matters most right now
- Once something's done, delete it from here (git history keeps the record) or move it to a CHANGELOG entry
