"use client";

import { useCallback, useEffect, useState } from "react";
import { trackEvent } from "../../lib/analytics/events";
import {
  APPOINTMENT_SERVICE_EVENT,
  getTodayInMexico,
} from "../../lib/contact/appointment";
import { TurnstileWidget } from "./TurnstileWidget";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  service: "",
  modality: "",
  preferredDate: "",
  preferredSchedule: "",
  message: "",
  privacyAccepted: false,
  website: "",
};

export function ContactForm({
  services,
  modalities,
  scheduleOptions,
  successMessage,
  errorMessage,
  hasWhatsApp,
}) {
  const [values, setValues] = useState(initialValues);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const [started, setStarted] = useState(false);
  const [selectionAnnouncement, setSelectionAnnouncement] = useState("");
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
  const minimumDate = getTodayInMexico();

  const onToken = useCallback((token) => {
    setTurnstileToken(token);
  }, []);

  useEffect(() => {
    function selectRequestedService(event) {
      const service = services.find(
        (item) => item.slug === event.detail?.serviceSlug,
      );

      if (!service) {
        return;
      }

      setValues((current) => ({ ...current, service: service.slug }));
      setSelectionAnnouncement(
        `Se seleccionó ${service.name}. Completa tus preferencias para solicitar la cita.`,
      );
    }

    window.addEventListener(APPOINTMENT_SERVICE_EVENT, selectRequestedService);
    return () =>
      window.removeEventListener(
        APPOINTMENT_SERVICE_EVENT,
        selectRequestedService,
      );
  }, [services]);

  function markStarted() {
    if (!started) {
      setStarted(true);
      trackEvent("form_start", {
        service_slug: values.service || undefined,
      });
    }
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function submitForm(event) {
    event.preventDefault();
    setStatus("submitting");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, turnstileToken }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || errorMessage);
      }

      setStatus("success");
      setFeedback(result.message || successMessage);
      setValues(initialValues);
      setTurnstileToken("");
      setResetKey((current) => current + 1);
      setStarted(false);
      trackEvent("generate_lead", {
        method: "form",
        service_slug: values.service,
      });
    } catch (error) {
      setStatus("error");
      setFeedback(error.message || errorMessage);
      setResetKey((current) => current + 1);
    }
  }

  return (
    <form
      className="contact-form"
      onSubmit={submitForm}
      onFocus={markStarted}
      noValidate={false}
    >
      <p className="sr-only" role="status" aria-live="polite">
        {selectionAnnouncement}
      </p>

      <div className="form-row">
        <label>
          Nombre
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
          Correo electrónico
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={updateField}
            autoComplete="email"
            inputMode="email"
            maxLength={160}
            required
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Teléfono <span className="optional">(opcional)</span>
          <input
            type="tel"
            name="phone"
            value={values.phone}
            onChange={updateField}
            autoComplete="tel"
            inputMode="tel"
            maxLength={25}
          />
        </label>
        <label>
          Servicio de interés
          <select
            id="service"
            name="service"
            value={values.service}
            onChange={updateField}
            required
          >
            <option value="">Selecciona una opción</option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-row">
        <label>
          Modalidad preferida
          <select
            name="modality"
            value={values.modality}
            onChange={updateField}
            required
          >
            <option value="">Selecciona una opción</option>
            {modalities.map((modality) => (
              <option key={modality} value={modality}>
                {modality}
              </option>
            ))}
          </select>
        </label>
        <label>
          Fecha preferida <span className="optional">(opcional)</span>
          <input
            type="date"
            name="preferredDate"
            value={values.preferredDate}
            onChange={updateField}
            min={minimumDate}
            aria-describedby="preferred-date-help"
          />
          <span id="preferred-date-help" className="field-help">
            La fecha se confirmará después de revisar disponibilidad.
          </span>
        </label>
      </div>

      <label>
        Horario preferido
        <select
          name="preferredSchedule"
          value={values.preferredSchedule}
          onChange={updateField}
          required
        >
          <option value="">Selecciona una opción</option>
          {scheduleOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label>
        Mensaje <span className="optional">(opcional)</span>
        <textarea
          name="message"
          value={values.message}
          onChange={updateField}
          maxLength={500}
          rows={4}
          aria-describedby="message-help"
        />
      </label>
      <p id="message-help" className="field-help">
        No compartas información clínica o sensible en este formulario.
      </p>

      <label className="honeypot" aria-hidden="true">
        Sitio web
        <input
          name="website"
          value={values.website}
          onChange={updateField}
          tabIndex={-1}
          autoComplete="off"
        />
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
          <a href="/aviso-de-privacidad" target="_blank">
            Aviso de Privacidad
          </a>
          .
        </span>
      </label>

      <TurnstileWidget
        siteKey={siteKey}
        onToken={onToken}
        resetKey={resetKey}
      />

      <button
        className="button button-primary submit-button"
        type="submit"
        disabled={status === "submitting" || !siteKey || !turnstileToken}
      >
        {status === "submitting" ? "Enviando…" : "Solicitar cita"}
      </button>

      {feedback ? (
        <div
          className={`form-feedback form-feedback-${status}`}
          role={status === "error" ? "alert" : "status"}
          tabIndex={-1}
        >
          {feedback}
          {status === "error" && hasWhatsApp
            ? " También puedes contactarnos por WhatsApp."
            : ""}
        </div>
      ) : null}
    </form>
  );
}
