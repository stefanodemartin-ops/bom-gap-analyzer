"use client";

import { useState } from "react";

const FIELD =
  "w-full rounded-sm border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500";
const LABEL = "block text-[11px] uppercase tracking-[0.08em] font-semibold text-slate-500 mb-1";

export default function DemoForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Honeypot — real users never fill this hidden field
    if (data.website) return;

    setStatus("sending");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

  if (status === "sent") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 border-l-4 border-l-emerald-500 rounded-sm px-5 py-6 text-center">
        <p className="text-base font-semibold text-emerald-800">Thank you — we got your request.</p>
        <p className="text-sm text-emerald-700 mt-1">
          Stefano will get back to you within one business day to schedule your demo.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label htmlFor="lead-name" className={LABEL}>Name *</label>
        <input id="lead-name" name="name" required className={FIELD} placeholder="Jane Smith" />
      </div>
      <div>
        <label htmlFor="lead-email" className={LABEL}>Work email *</label>
        <input id="lead-email" name="email" type="email" required className={FIELD} placeholder="jane.smith@company.com" />
      </div>
      <div>
        <label htmlFor="lead-company" className={LABEL}>Company</label>
        <input id="lead-company" name="company" className={FIELD} placeholder="Acme Chemicals" />
      </div>
      <div>
        <label htmlFor="lead-plant" className={LABEL}>Plant / site</label>
        <input id="lead-plant" name="plant" className={FIELD} placeholder="Houston Plant 2" />
      </div>
      <div>
        <label htmlFor="lead-role" className={LABEL}>Role</label>
        <input id="lead-role" name="role" className={FIELD} placeholder="Maintenance Manager" />
      </div>
      <div>
        <label htmlFor="lead-plants" className={LABEL}>Number of plants</label>
        <input id="lead-plants" name="numPlants" className={FIELD} placeholder="1" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="lead-message" className={LABEL}>Message</label>
        <textarea
          id="lead-message"
          name="message"
          rows={4}
          className={FIELD}
          placeholder="Tell us about the asset or plant you'd like to start with."
        />
      </div>

      {/* Honeypot field — hidden from real users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {errorMsg && (
        <div className="sm:col-span-2 bg-red-50 border border-red-200 border-l-4 border-l-red-500 rounded-sm px-4 py-2.5 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className={[
            "w-full sm:w-auto px-6 py-2.5 rounded-sm text-sm font-semibold transition-colors",
            status === "sending"
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-sky-500 text-white hover:bg-sky-600 cursor-pointer",
          ].join(" ")}
        >
          {status === "sending" ? "Sending…" : "Request a demo"}
        </button>
      </div>
    </form>
  );
}
