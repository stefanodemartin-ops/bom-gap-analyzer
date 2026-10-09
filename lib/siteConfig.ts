// Site-wide marketing configuration.
// Edit prices, contact details, and the booking link here — nothing else to touch.

export const CONTACT_EMAIL = "stefanodemartin@gmail.com";

// Paste your Calendly (or Google Calendar appointment) link here when ready.
// While empty, the "Book a demo" flow shows the contact form only.
export const BOOKING_URL = "";

export type PricingTier = {
  name: string;
  price: string;
  priceNote?: string;
  features: string[];
  cta: string;
  // "demo" scrolls to the demo form; "mailto" opens an email
  ctaKind: "demo" | "mailto";
  highlighted?: boolean;
};

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Free asset analysis",
    price: "$0",
    features: [
      "One critical asset",
      "Full gap report — missing, mismatched, and extra parts",
      "30-minute review call",
    ],
    cta: "Get your free analysis",
    ctaKind: "demo",
  },
  {
    name: "Plant pilot",
    price: "$2,000",
    priceNote: "starting at, per month",
    features: [
      "Unlimited assets at one plant",
      "Gap reports for every asset (PDF + Excel)",
      "Monthly review with a reliability consultant",
    ],
    cta: "Book a demo",
    ctaKind: "demo",
    highlighted: true,
  },
  {
    name: "Multi-site / corporate",
    price: "Contact us",
    features: [
      "Multiple plants and sites",
      "Corporate reliability rollout",
      "Volume pricing",
    ],
    cta: "Contact us",
    ctaKind: "mailto",
  },
];
