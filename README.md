# Zorch Farms

A frontend-only provision-request platform for Lagos customers. Customers select product measurements, collect them in a persisted request summary, provide contact details, then continue the conversation with Zorch Farms through WhatsApp.

## Run locally

```bash
npm install
npm run dev
```

Build for deployment with `npm run build`.

## Configure delivery

Copy `.env.example` to `.env.local` and populate the EmailJS values and WhatsApp number. The WhatsApp number must use international digits only, for example `2348012345678`.

The EmailJS template receives these variables:

- `customer_name`
- `customer_phone`
- `customer_email`
- `request_items`
- `customer_notes`
- `request_timestamp`

When EmailJS is not configured, the request still opens a professionally formatted WhatsApp message. This makes local demos safe while keeping the production setup explicit.

## Structure

- `src/data/products.ts` is the only file to edit when adding catalogue products.
- `src/features/request` owns request state, local persistence, and the summary drawer.
- `src/features/catalog` owns product-card behaviour and measurement selection.
- `src/services/requestDelivery.ts` owns email and WhatsApp delivery formatting.
- `src/shared/ui` contains the small reusable UI primitives.
