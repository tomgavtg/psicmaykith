"use client";

import { trackEvent } from "../../lib/analytics/events";

export function TrackedLink({
  eventName,
  eventParameters,
  children,
  ...props
}) {
  return (
    <a
      {...props}
      onClick={() => trackEvent(eventName, eventParameters)}
    >
      {children}
    </a>
  );
}
