"use client";

import { useState } from "react";
import { trackEvent } from "../../lib/analytics/events";
import { safeOptions } from "../../lib/content/options";
import {
  buildWhatsAppInquiryMessage,
  buildWhatsAppUrl,
} from "../../lib/contact/whatsapp";
import { WhatsAppIcon } from "../icons";

const initialValues = {
  name: "",
  service: "",
  motive: "",
  sensitiveDataAccepted: false,
  privacyAccepted: false,
};

export function WhatsAppInquiryForm({ whatsappNumber, services }) {
  const serviceOptions = safeOptions(services);
  const [values, setValues] = useState(initialValues);
  const [started, setStarted] = useState(false);
  const [feedback, setFeedback] = useState("");

  function markStarted() {
    if (!started) {
      setStarted(true);
      trackEvent("form_start");
    }
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function submitForm(event) {
    event.preventDefault();
    setFeedback("");

    const selectedService = serviceOptions.find(
      (service) => service.slug === values.service,
    );
    const message = buildWhatsAppInquiryMessage({
      name: values.name,
      service: selectedService?.name || values.service,
      motive: values.motive,
    });
    const whatsappUrl = buildWhatsAppUrl(whatsappNumber, message);

    if (!whatsappUrl) {
      setFeedback("WhatsApp no está disponible temporalmente.");
      return;
    }

    trackEvent("click_whatsapp", { location: "contact_form" });
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <form
      className="contact-form whatsapp-inquiry-form"
      onSubmit={submitForm}
      onFocus={markStarted}
    >
      <label>
        Nombre completo
        <input
          name="name"
          value={values.name}
          onChange={updateField}
          autoComplete="name"
          maxLength={80}
          required
        />
      </label>

      <label>
        Servicio de interés
        <select
          name="service"
          value={values.service}
          onChange={updateField}
          required
        >
          <option value="">Selecciona una opción</option>
          {serviceOptions.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Motivo de consulta
        <textarea
          name="motive"
          value={values.motive}
          onChange={updateField}
          rows={5}
          maxLength={500}
          aria-describedby="whatsapp-motive-help"
          required
        />
      </label>
      <p id="whatsapp-motive-help" className="field-help">
        Comparte sólo lo necesario. No incluyas diagnósticos, medicamentos,
        antecedentes ni información de otras personas. Máximo 500 caracteres.
      </p>

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="sensitiveDataAccepted"
          checked={values.sensitiveDataAccepted}
          onChange={updateField}
          required
        />
        <span>
          Consiento expresamente el tratamiento del motivo de consulta, que puede
          revelar datos personales sensibles, únicamente para atender mi solicitud.
        </span>
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="privacyAccepted"
          checked={values.privacyAccepted}
          onChange={updateField}
          required
        />
        <span>
          He leído y acepto el{" "}
          <a href="/aviso-de-privacidad" target="_blank" rel="noreferrer">
            Aviso de Privacidad
          </a>
          .
        </span>
      </label>

      <button className="button button-primary submit-button" type="submit">
        <WhatsAppIcon size={24} />
        Continuar en WhatsApp
      </button>

      {feedback ? (
        <p className="form-feedback form-feedback-error" role="alert">
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
