# Ecom Shopping

A browser-based shopping demo built with JavaScript modules, HTML, and CSS.

## Run locally

Requires Node.js 22 or later. No dependencies to install.

```sh
npm start
```

Open http://127.0.0.1:8080. Serve the project over HTTP; opening the HTML file directly will not load the modules or JSON catalog.

```sh
npm test
```

## Features

- Search products by name and keywords.
- Select quantities and keep the cart between visits.
- Edit quantities, remove items, and choose delivery options.
- Recalculate prices, shipping, and estimated tax in integer cents.
- Submit demo orders, view saved orders, and add products again.
- View a simulated delivery timeline for each ordered item.

The catalog uses bundled JSON by default. “Load live catalog” requests the public demo API and falls back to the local catalog on failure. Placing an order requires the demo API to be available. There is no payment integration.

## JavaScript structure

- `data/`: product models, cart state, delivery options, and saved orders.
- `scripts/catalog.js`, `checkout.js`, `orders.js`, `tracking.js`: page entry points and DOM events.
- `scripts/checkout/`: cart rendering, pure price calculations, and order submission.
- `scripts/shared/`: shared header updates.
- `scripts/utils/`: storage, currency, dates, and safe HTML rendering.
- `tests/`: Node's built-in test runner, covering cart changes, totals, storage failures, and catalog fallback.

The product model uses inheritance for clothing-specific size charts. Page events use delegation. API requests use async/await, response checks, and timeouts.

## Demo limitations

Cart and orders live in localStorage on one browser and origin, with no account or cross-device synchronization. Clearing browser data removes them. Delivery status is calculated from elapsed time, not a carrier feed. The 10% tax is illustrative. The public order endpoint is a demo service; a failed response after submission can leave the remote result uncertain.

## Credits and project history

Reworked from my earlier JavaScript shopping learning project. This repository's initial feature commits reconstruct that work with updated branding and completed interactions; they are not the original development timeline.

The original exercise, sample catalog, product images, and demo API come from [SuperSimpleDev's JavaScript course](https://github.com/SuperSimpleDev/javascript-amazon-project). The storefront styling and current application modules were revised for this version. Retained sample assets are credited to their source; this repository does not claim ownership of those assets.
