import { TrackedLink } from "../analytics/TrackedLink";
import { WhatsAppIcon } from "../icons";
import { buildWhatsAppUrl } from "../../lib/contact/whatsapp";

export function FloatingWhatsApp({ contactSettings }) {
  const whatsappUrl = buildWhatsAppUrl(
    contactSettings.whatsappNumber,
    contactSettings.whatsappMessage,
  );

  if (!whatsappUrl) {
    return null;
  }

  return (
    <TrackedLink
      className="floating-whatsapp"
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      eventName="click_whatsapp"
      eventParameters={{ location: "floating" }}
      aria-label="Agendar por WhatsApp"
    >
      <WhatsAppIcon />
      <span>WhatsApp</span>
    </TrackedLink>
  );
}
