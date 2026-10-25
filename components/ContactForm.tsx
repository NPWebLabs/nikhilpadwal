"use client";
import { useState } from "react";
import { profile } from "@/lib/data";
import { whatsappUrl, WhatsAppIcon } from "./WhatsAppButton";

const topics = ["Business website", "eCommerce store", "SaaS / web app", "AI integration", "Speed & SEO", "Something else"];

// No backend: the form composes the message and hands it to WhatsApp or the visitor's mail app.
export default function ContactForm() {
  const [form, setForm] = useState({ name: "", contact: "", topic: topics[0], message: "" });
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const compose = () =>
    `Hi Nikhil, I'm ${form.name.trim()}.\nTopic: ${form.topic}\n${form.contact.trim() ? `Reach me at: ${form.contact.trim()}\n` : ""}\n${form.message.trim()}`;

  const send = (via: "whatsapp" | "email") => {
    if (!form.name.trim() || !form.message.trim()) {
      setError("Please add your name and a short message.");
      return;
    }
    setError("");
    const text = compose();
    if (via === "whatsapp") window.open(whatsappUrl(text), "_blank", "noopener");
    else window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`Project enquiry: ${form.topic}`)}&body=${encodeURIComponent(text)}`;
  };

  return (
    <form className="contact-form" onSubmit={(e) => { e.preventDefault(); send("whatsapp"); }} noValidate>
      <div className="contact-form__row">
        <label>
          <span>Name</span>
          <input type="text" name="name" autoComplete="name" required value={form.name} onChange={set("name")} placeholder="Your name" />
        </label>
        <label>
          <span>Email or phone <small>(optional)</small></span>
          <input type="text" name="contact" autoComplete="email" value={form.contact} onChange={set("contact")} placeholder="you@company.com" />
        </label>
      </div>
      <label>
        <span>What do you need?</span>
        <select name="topic" value={form.topic} onChange={set("topic")}>
          {topics.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" rows={5} required value={form.message} onChange={set("message")} placeholder="A few lines about the project, timeline and budget." />
      </label>
      {error && <p className="contact-form__error" role="alert">{error}</p>}
      <div className="contact-form__actions">
        <button type="submit" className="btn btn--wa"><WhatsAppIcon /> Send on WhatsApp</button>
        <button type="button" className="btn btn--light" onClick={() => send("email")}>Send by email</button>
      </div>
    </form>
  );
}
