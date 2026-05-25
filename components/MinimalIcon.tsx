// components/MinimalIcon.tsx

type IconName =
  | "calculator"
  | "activity"
  | "steps"
  | "training"
  | "hydration"
  | "macros"
  | "shield"
  | "trend"
  | "target"
  | "warning"
  | "check"
  | "info";

type MinimalIconProps = {
  name: IconName;
  className?: string;
};

export function MinimalIcon({
  name,
  className = "h-5 w-5",
}: MinimalIconProps) {
  const commonProps = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "calculator") {
    return (
      <svg {...commonProps}>
        <rect x="5" y="3" width="14" height="18" rx="3" />
        <path d="M8.5 7h7" />
        <path d="M8.5 11h.01" />
        <path d="M12 11h.01" />
        <path d="M15.5 11h.01" />
        <path d="M8.5 15h.01" />
        <path d="M12 15h.01" />
        <path d="M15.5 15h.01" />
      </svg>
    );
  }

  if (name === "activity") {
    return (
      <svg {...commonProps}>
        <path d="M3 12h3l2.2-5 4 10 2.2-5H21" />
      </svg>
    );
  }

  if (name === "steps") {
    return (
      <svg {...commonProps}>
        <path d="M8.5 14.5c-1.8.4-3 .1-3.5-.8-.6-1 .1-2.5 1.6-3.3 1.7-.9 3.1-.6 3.8.7.7 1.4-.1 3-1.9 3.4Z" />
        <path d="M16.8 10.2c-1.9.2-3-.3-3.4-1.3-.4-1.1.5-2.4 2.1-3 1.8-.7 3.2-.2 3.7 1.2.5 1.5-.5 2.9-2.4 3.1Z" />
        <path d="M10 18c1.8.8 3.5 1.1 5.2.8" />
      </svg>
    );
  }

  if (name === "training") {
    return (
      <svg {...commonProps}>
        <path d="M6 8v8" />
        <path d="M18 8v8" />
        <path d="M3.5 10v4" />
        <path d="M20.5 10v4" />
        <path d="M6 12h12" />
      </svg>
    );
  }

  if (name === "hydration") {
    return (
      <svg {...commonProps}>
        <path d="M12 3.5s6 6.2 6 10.4A6 6 0 0 1 6 13.9C6 9.7 12 3.5 12 3.5Z" />
        <path d="M9.5 14.5a2.7 2.7 0 0 0 2.7 2.2" />
      </svg>
    );
  }

  if (name === "macros") {
    return (
      <svg {...commonProps}>
        <circle cx="7" cy="12" r="3.5" />
        <circle cx="16.5" cy="8" r="2.5" />
        <circle cx="16.5" cy="17" r="2.5" />
        <path d="M10.2 10.7 14 8.9" />
        <path d="M10.2 13.3 14 16.1" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg {...commonProps}>
        <path d="M12 3.5 19 6v5.4c0 4.4-2.8 7.7-7 9.1-4.2-1.4-7-4.7-7-9.1V6l7-2.5Z" />
        <path d="m9.5 12 1.7 1.7 3.5-3.8" />
      </svg>
    );
  }

  if (name === "trend") {
    return (
      <svg {...commonProps}>
        <path d="M4 17 9 12l3 3 7-8" />
        <path d="M15 7h4v4" />
      </svg>
    );
  }

  if (name === "target") {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    );
  }

  if (name === "warning") {
    return (
      <svg {...commonProps}>
        <path d="M12 4 21 20H3L12 4Z" />
        <path d="M12 9v5" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg {...commonProps}>
        <path d="m5 12 4.2 4L19 6" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 10.8v5" />
      <path d="M12 7.8h.01" />
    </svg>
  );
}