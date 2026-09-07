# Wildfire Watch

**Version 0.5.5**
- Moved pre-requisite checklists and information resources to their own Prep Guide page
- Added functionality to allow local device alerting without a central server or users' personal information

**Version 0.5.0**

A family wildfire evacuation dashboard for the Trailside/Sagebrook area of Park City, Utah. Wildfire Watch pulls together live weather, fire, air-quality, and traffic data into three focused views so a household can move from casual monitoring to an active evacuation decision without hunting across a dozen different sites.

This is a single-file, installable PWA — no backend, no build step, no accounts. It's meant to work when it matters, including with a spotty connection.

## The three tabs

### 🚨 Baseline Watch
Day-to-day ambient monitoring, for when there's no known fire nearby.
- Active NWS alerts for your location (only visually prominent when one exists)
- DIY fire-weather risk gauge (wind, humidity, temperature, days since rain) with a manual rain log
- Deeper Sources: one-click links to NASA FIRMS satellite fire detection, Utah Fire Info, the Great Basin GACC outlook, WFAS, US Drought Monitor, and your NWS zone forecast
- Fuel Moisture / Energy Release Component (ERC) lookup via the nearest RAWS station, with an optional live Synoptic API connection
- Family Readiness Checklist — a year-round prep list (go-bags, fuel, routes, contacts, alert sign-ups, masks, insurance photos), persisted locally

### 🔥 Active Incident Watch
For when a fire has actually been reported nearby.
- Active NWS alerts (same conditional-prominence treatment as Baseline)
- **Ready / Set / Go stage tracker** — a manually-set household status (Aware → Ready → Set → Go → Return) with stage-specific action checklists, arrow-button navigation, and its own persisted state
- Step 1: find the fire — Watch Duty, InciWeb, and NIFC links
- Fire Growth & Wind Direction — embedded Windy map with fullscreen
- "Should You Leave Even Without an Official Alert?" — a hard/soft trigger checklist plus a live wind-driven threat calculator, for the real-world gap where official alerts arrive late or not at all
- Get Alerted Directly — Summit County Alert (Everbridge) sign-up, the county's emergency page, the FEMA app, Wireless Emergency Alerts info, the AirNow fire/smoke map, and KSL's live wildfire coverage

### 🚗 Evacuation Watch
For when you're actively evacuating or staging to.
- Evacuation routes out of Trailside/Sagebrook (Highway 40/I-80 primary, Kearns Blvd/SR-248 alternate)
- Live traffic camera hubs (UDOT Wasatch Back, UDOT CommuterLink, Wasatch Roads)

## Design principles this app follows

- **Criticality-first ordering**: within each tab, panels are ordered by how urgently their information is needed to make a decision — alerts first, then status/orientation, then supporting detail, then setup-required tools last.
- **Info-gathering before decision-checklists**: panels that help you learn facts (fire location, wind direction) are positioned before panels that ask you to judge those facts.
- **Distinct color language, kept separate by meaning**: the ambient risk gauge, the Ready/Set/Go stage tracker, tab selection, and primary action buttons each use their own color palette so no color accidentally means two different things in different parts of the app.
- **Accessible by default**: 16px+ base font, 40–44px touch targets, visible focus states, WCAG AA-or-better contrast on all colored UI elements.
- **Not a source of truth**: this is explicitly a convenience aggregator. Every panel that could be mistaken for an official source says so, and official alerts/evacuation orders always take precedence over anything in this app.

## Tech stack

- Vanilla HTML/CSS/JavaScript — no framework, no build step, single file (`wildfire-watch.html`)
- PWA: `manifest.json` + `service-worker.js` (network-first for HTML/CSS/JS/JSON and live API calls, cache-first for everything else, so it degrades gracefully offline)
- `localStorage` (via a small `window.storage`-style wrapper) for rain log history, fuel-station config, stage-tracker state, and the readiness checklist

## Live data sources

| Source | Used for |
|---|---|
| [National Weather Service API](https://api.weather.gov) | Active alerts, point forecast |
| [Open-Meteo](https://open-meteo.com) | Daily precipitation history (rain-log lookback), geocoding |
| [Synoptic Data](https://synopticdata.com) | Optional live fuel moisture/ERC from a chosen RAWS station |
| [AirNow](https://airnow.gov) | Air quality dial widget, fire/smoke map |
| [Windy](https://windy.com) | Embedded wind map |
| [Watch Duty](https://watchduty.org), [InciWeb](https://inciweb.wildfire.gov), [NIFC](https://nifc.gov) | Named-fire lookup |
| [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov) | Satellite fire detection |
| UDOT (Wasatch Back, CommuterLink) | Road status, traffic cameras |

## License

MIT — see [LICENSE](LICENSE). Use it, adapt it, borrow the patterns for your own community's wildfire dashboard.

## Known limitations / open items

- No native camera thumbnail embed yet — UDOT's image API requires a free developer key (see the caveat in the Evacuation Watch tab). Can be wired in if/when a key is obtained.
- Fuel Moisture/ERC requires manually identifying a nearby RAWS station; there's no automatic "nearest station" lookup yet.
- Single hardcoded default location (Park City/Trailside-Sagebrook); the header location selector lets you override this per-session, but there's no saved multi-location/multi-household support.
- No automated tests — this is a hand-maintained single file.
