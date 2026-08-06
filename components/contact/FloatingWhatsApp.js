import { WhatsAppIcon } from "../icons";

export function FloatingWhatsApp({ contactSettings }) {
  if (!contactSettings.whatsappNumber) {
    return null;
  }

  return (
    <a
      className="floating-whatsapp"
      href="#whatsapp-contact"
      aria-label="Ir al formulario de contacto por WhatsApp"
    >
      <WhatsAppIcon />
      <span>WhatsApp</span>
    </a>
  );
}
