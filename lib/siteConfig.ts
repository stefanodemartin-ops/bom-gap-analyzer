// Site-wide marketing configuration.
// Edit prices, contact details, and the booking link here — nothing else to touch.

export const CONTACT_EMAIL = "stefano@sparesview.com";

// Calendly booking link — every "Book a 15-minute demo" link on the landing page.
export const BOOKING_URL = "https://calendly.com/stefanodemartin/free-15-min-consultation";

// Where "Sign in" goes.
export const APP_URL = "/app";

export type PricingTier = {
  name: string;
  price: string;
  priceNote?: string; // small text after the price, e.g. "/ month, from"
  subtitle: string;
  features: string[];
  cta: string;
  // "start" scrolls to the free-analysis form; "booking" opens the demo calendar;
  // "mailto" opens an email to CONTACT_EMAIL
  ctaKind: "start" | "booking" | "mailto";
  highlighted?: boolean; // dark border + solid button
};

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Free asset analysis",
    price: "$0",
    subtitle: "One critical asset",
    features: ["Full gap report for one asset", "30-minute review call", "No credit card"],
    cta: "Get your free analysis",
    ctaKind: "start",
    highlighted: true,
  },
  {
    name: "Plant pilot",
    price: "$2,000",
    priceNote: "/ month, from",
    subtitle: "Unlimited assets at one plant",
    features: [
      "PDF and Excel reports per asset",
      "Monthly review with a reliability consultant",
      "Prioritized stocking recommendations",
    ],
    cta: "Talk to us about a pilot",
    ctaKind: "booking",
  },
  {
    name: "Multi-site / corporate",
    price: "Custom",
    subtitle: "Several plants, one program",
    features: ["Everything in Plant pilot", "Cross-site spares standardization", "Executive reporting"],
    cta: "Contact us",
    ctaKind: "mailto",
  },
];
