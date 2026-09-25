# LIFESOURCE

A blood donation coordination platform connecting verified blood requests with willing donors across Nigeria.

Built with [Next.js](https://nextjs.org) (App Router), TypeScript, Tailwind CSS, and Zustand.

## What it does

LIFESOURCE solves a specific problem: blood requests in Nigeria often happen through unverified WhatsApp groups and phone chains, which makes them slow, unreliable, and open to abuse. This platform gives communities — hospitals, churches, NGOs, workplaces — a structured way to:

- **Register verified donors** with blood type, location, and availability
- **Match requests to donors** based on blood type and proximity
- **Keep contact details private** — donors and requesters never see each other's info directly
- **Give community admins** the tools to manage members and requests within their group
- **Give super admins** platform-wide oversight of communities, hospitals, and operations

## User roles

| Role | Entry point | Purpose |
|------|-------------|---------|
| **Donor** | `/auth-entry` | Register, get notified of matching requests, donate |
| **Requester** | `/auth-entry` → need blood | Create blood requests (requires community membership) |
| **Community Admin** | `/community-admin/verify` | Manage donors and requests within a community |
| **Super Admin** | `/super-admin/login` | Oversee communities, hospitals, platform operations |

## Getting started

First, install dependencies:

```bash
npm install
