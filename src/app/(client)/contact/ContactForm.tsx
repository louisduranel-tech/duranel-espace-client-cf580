"use client";

import { useRef, useState, useTransition } from "react";
import { sendContactMessage } from "../actions";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<null | { ok: boolean; error?: string }>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await sendContactMessage(formData);
      setStatus(result);
      if (result.ok) formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} className="form-grid" action={handleSubmit}>
      {status?.ok && (
        <p style={{ color: "var(--gain)", fontSize: ".88rem", margin: 0 }}>
          Message envoyé, merci ! Nous revenons vers vous rapidement.
        </p>
      )}
      {status && !status.ok && (
        <p style={{ color: "var(--loss)", fontSize: ".88rem", margin: 0 }}>
          {status.error}
        </p>
      )}
      <input name="name" placeholder="Nom et prénom" required />
      <input name="phone" placeholder="Téléphone" type="tel" />
      <input name="email" placeholder="E-mail" type="email" />
      <textarea name="message" placeholder="Votre message" required />
      <button className="btn btn-primary" type="submit" disabled={isPending}>
        {isPending ? "Envoi..." : "Envoyer le message"}
      </button>
    </form>
  );
}
