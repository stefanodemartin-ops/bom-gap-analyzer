"use client";

import { useState } from "react";
import { BOOKING_URL } from "@/lib/siteConfig";

// Free-analysis request form. Posts to /api/leads (same Neon `leads` table as before);
// "Company or plant" is stored in the `company` column.

const INPUT =
  "h-[46px] w-full box-border rounded-lg border border-[#D4D4D8] bg-white px-3.5 text-[15px] text-[#0A0A0A] focus:outline-2 focus:outline-offset-1 focus:outline-[#0A0A0A] focus:border-[#0A0A0A]";
const LABEL = "text-[13.5px] font-medium";

export default function DemoForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    // Honeypot — real users never fill this hidden field
    if (data.website) return;

    setStatus("sending");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, message: "Free asset analysis request" }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setErrorMsg(body?.error ?? "Something went wrong. Please try again or email us directly.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setErrorMsg("Network error. Please try again or email us directly.");
      setStatus("error");
    }
  };

  const card =
    "rounded-xl border border-[#E4E4E7] bg-white p-8 flex flex-col gap-4 shadow-[0_24px_60px_-28px_rgba(10,10,10,0.18)]";

  if (status === "sent") {
    return (
      <div className={card} role="status">
        <p className="m-0 text-[20px] font-semibold tracking-[-0.02em]">Thanks — we got your request.</p>
        <p className="m-0 text-[15px] leading-[1.6] text-[#52525B]">
          Stefano will email you within one business day with what to upload for your free asset analysis.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={card}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-name" className={LABEL}>Name</label>
        <input id="f-name" name="name" type="text" autoComplete="name" required className={INPUT} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-email" className={LABEL}>Work email</label>
        <input id="f-email" name="email" type="email" autoComplete="email" required className={INPUT} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-company" className={LABEL}>Company or plant</label>
        <input id="f-company" name="company" type="text" autoComplete="organization" className={INPUT} />
      </div>

      {/* Honeypot field — hidden from real users */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {errorMsg && (
        <p className="m-0 rounded-lg bg-[#FEF2F2] px-3.5 py-2.5 text-[14px] text-[#B42318]" role="alert">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 inline-flex h-12 w-full items-center justify-center whitespace-nowrap rounded-lg border-0 bg-[#0A0A0A] px-[22px] text-[15px] font-medium text-white hover:bg-[#27272A] cursor-pointer disabled:cursor-not-allowed disabled:bg-[#71717A]"
      >
        {status === "sending" ? "Sending…" : "Get your free asset analysis"}
      </button>
      <div className="text-center text-[12.5px] text-[#71717A]">
        Prefer to talk first?{" "}
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-[#52525B]">
          Book a 15-minute demo
        </a>
      </div>
    </form>
  );
}
