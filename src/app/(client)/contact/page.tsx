import { getContactInfo } from "@/lib/data/public";
import { IconMail, IconPhone, IconPin } from "@/components/icons";
import { ContactForm } from "./ContactForm";

function parseHours(hours: string | null): string[] {
  if (!hours) return [];
  return hours.split("\n").filter(Boolean);
}

export default async function ContactPage() {
  const contact = await getContactInfo();
  const telHref = contact?.phone ? `tel:${contact.phone.replace(/\s+/g, "")}` : undefined;
  const mailHref = contact?.email ? `mailto:${contact.email}` : undefined;
  const hoursLines = parseHours(contact?.hours ?? null);

  return (
    <section className="fade-in">
      <div className="two-col">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card contact-hero">
            <div className="eyebrow">DURANEL</div>
            <h2 style={{ margin: "2px 0 12px" }}>Contacter l&apos;équipe</h2>
            <div className="contact-actions">
              {telHref && (
                <a className="btn btn-primary" href={telHref}>
                  <IconPhone />
                  Appeler DURANEL
                </a>
              )}
              {mailHref && (
                <a className="btn btn-ghost" href={mailHref}>
                  <IconMail />
                  Envoyer un e-mail
                </a>
              )}
            </div>
          </div>
          <div className="card" style={{ padding: "6px 18px" }}>
            <div className="info-list">
              {contact?.address && (
                <div className="info-row">
                  <IconPin />
                  <div>
                    <div className="lbl">Adresse</div>
                    <div className="val">{contact.address}</div>
                  </div>
                </div>
              )}
              {contact?.phone && (
                <div className="info-row">
                  <IconPhone />
                  <div>
                    <div className="lbl">Téléphone</div>
                    <div className="val tabular">{contact.phone}</div>
                  </div>
                </div>
              )}
              {contact?.email && (
                <div className="info-row">
                  <IconMail />
                  <div>
                    <div className="lbl">E-mail</div>
                    <div className="val">{contact.email}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {hoursLines.length > 0 && (
            <div className="card" style={{ padding: "16px 18px" }}>
              <h3 style={{ margin: "0 0 4px", fontSize: "1rem" }}>Horaires</h3>
              <table className="hours-table">
                <tbody>
                  {hoursLines.map((line) => {
                    const [day, ...rest] = line.split(":");
                    return (
                      <tr key={line}>
                        <td>{day}</td>
                        <td>{rest.join(":").trim()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ margin: "0 0 4px", fontSize: "1rem" }}>Nous écrire</h3>
          <p className="example-note" style={{ margin: "0 0 14px" }}>
            Nous vous répondons dès que possible.
          </p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
