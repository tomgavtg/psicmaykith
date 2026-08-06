const REQUIRED_SERVICE_SLUGS = new Set([
  "terapia-para-adultos",
  "terapia-para-adolescentes",
  "terapia-de-pareja",
]);

function hasText(value, minimumLength = 1) {
  return (
    typeof value === "string" &&
    value.trim().length >= minimumLength &&
    !value.includes("[POR DEFINIR")
  );
}

function hasMaintenanceCopy(value) {
  return typeof value === "string" && /mantenimiento/i.test(value);
}

function hasGoogleCalendarBookingUrl(value) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      ["calendar.app.google", "calendar.google.com"].includes(url.hostname)
    );
  } catch {
    return false;
  }
}

export function getPublicationIssues(content) {
  const issues = [];
  const profile = content?.professionalProfile;
  const services = Array.isArray(content?.services) ? content.services : [];
  const contact = content?.contactSettings;
  const seo = content?.seoSettings;
  const privacy = content?.privacyNotice;
  const site = content?.siteSettings;

  if (!site) {
    issues.push("site-settings-missing");
  } else {
    if (!hasText(site.siteName) || !hasText(site.headerName)) {
      issues.push("site-identity-incomplete");
    }
    if (
      !hasText(site.globalNotice, 20) ||
      !hasText(site.crisisNotice, 40) ||
      hasMaintenanceCopy(site.globalNotice) ||
      hasMaintenanceCopy(site.crisisNotice)
    ) {
      issues.push("safety-copy-incomplete");
    }
  }

  if (!profile) {
    issues.push("professional-profile-missing");
  } else {
    if (
      !hasText(profile.fullName, 5) ||
      !hasText(profile.heroTitle, 20) ||
      !hasText(profile.shortBio, 40) ||
      !hasText(profile.approach, 40)
    ) {
      issues.push("professional-copy-incomplete");
    }
    if (!hasText(profile.licenseNumber, 4)) {
      issues.push("professional-license-unverified");
    }
    if (!profile.portrait?.url || !hasText(profile.portrait.alt, 10)) {
      issues.push("professional-portrait-incomplete");
    }
    if (
      !Array.isArray(profile.validationItems) ||
      profile.validationItems.length < 3
    ) {
      issues.push("professional-validation-copy-incomplete");
    }
    if (!Array.isArray(profile.education) || profile.education.length < 1) {
      issues.push("professional-education-unverified");
    }
  }

  const publishedServiceSlugs = new Set(
    services
      .map((service) => service?.slug)
      .filter((slug) => typeof slug === "string"),
  );
  if (
    services.length < REQUIRED_SERVICE_SLUGS.size ||
    [...REQUIRED_SERVICE_SLUGS].some(
      (slug) => !publishedServiceSlugs.has(slug),
    )
  ) {
    issues.push("required-services-incomplete");
  }

  if (
    services.some(
      (service) =>
        service?.modality?.length !== 1 ||
        service.modality[0] !== "En línea" ||
        !Number.isFinite(service?.fee?.amount) ||
        service.fee.amount <= 0 ||
        service.fee.currency !== "MXN",
    )
  ) {
    issues.push("service-offer-incomplete");
  }

  if (
    services.some((service) => !hasGoogleCalendarBookingUrl(service.bookingUrl))
  ) {
    issues.push("service-booking-incomplete");
  }

  if (
    !contact ||
    !hasText(contact.email, 5) ||
    !hasText(contact.whatsappNumber, 10) ||
    !Array.isArray(contact.modalities) ||
    contact.modalities.length < 1
  ) {
    issues.push("contact-settings-incomplete");
  }

  if (
    !seo ||
    !hasText(seo.metaTitle, 20) ||
    !hasText(seo.metaDescription, 80) ||
    !hasText(seo.businessType, 5)
  ) {
    issues.push("seo-settings-incomplete");
  }

  issues.push(...getPrivacyNoticeIssues(privacy));

  return issues;
}

export function getPrivacyNoticeIssues(privacy) {
  const issues = [];

  if (!privacy) {
    return ["privacy-notice-missing"];
  }

  if (privacy.status !== "approved") {
    issues.push("privacy-notice-not-approved");
  }
  const privacyVersion = Number.parseFloat(
    String(privacy.versionLabel || "").replace(/^v/i, ""),
  );
  if (!Number.isFinite(privacyVersion) || privacyVersion < 1.1) {
    issues.push("privacy-notice-version-outdated");
  }
  if (
    !hasText(privacy.controllerIdentity, 8) ||
    /^mk\.?$/i.test(privacy.controllerIdentity.trim())
  ) {
    issues.push("privacy-controller-incomplete");
  }
  if (!hasText(privacy.controllerAddress, 10)) {
    issues.push("privacy-controller-address-incomplete");
  }
  if (
    !hasText(privacy.contactEmail, 5) ||
    !/^\d{10,15}$/.test(privacy.contactWhatsapp || "") ||
    !hasText(privacy.versionLabel) ||
    !privacy.effectiveDate ||
    !Array.isArray(privacy.content) ||
    privacy.content.length < 3
  ) {
    issues.push("privacy-content-incomplete");
  }

  return issues;
}

export function isPrivacyNoticePublishable(privacy) {
  return getPrivacyNoticeIssues(privacy).length === 0;
}

export function isContentPublishable(content) {
  return getPublicationIssues(content).length === 0;
}

export function isProductionLaunchEnabled() {
  return (
    process.env.SITE_MODE === "production" &&
    process.env.CONTENT_APPROVED === "true"
  );
}

export { REQUIRED_SERVICE_SLUGS };
