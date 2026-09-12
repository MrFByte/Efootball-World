import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SunIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.6M12 18.9v2.6M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12h2.6M18.9 12h2.6M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
    </svg>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

export function BallIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 6.4 15.6 9l-1.4 4.2h-4.4L8.4 9Z" fill="currentColor" stroke="none" />
      <path d="M12 2.8v3.6M12 21.2v-3.4M2.8 12h3.6M21.2 12h-3.6M4.8 4.8l2.6 2.6M19.2 19.2l-2.6-2.6M19.2 4.8l-2.6 2.6M4.8 19.2l2.6-2.6" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.2 19.5 6v6c0 5-3.2 8-7.5 9-4.3-1-7.5-4-7.5-9V6Z" />
      <path d="M9 12.2 11 14l4-4.2" />
    </svg>
  );
}

export function TrophyIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 4h10v4.2a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4.5A2.5 2.5 0 0 0 7 10.2M17 6h2.5A2.5 2.5 0 0 1 17 10.2" />
      <path d="M12 13.2V17M8.6 20h6.8" />
    </svg>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8.4" r="3.2" />
      <path d="M2.8 19c1.1-3.7 3.6-5.2 6.2-5.2S15.1 15.3 16.2 19" />
      <path d="M15.4 6.4a3.1 3.1 0 0 1 0 6" />
      <path d="M17.6 13.9c2.1.4 3.6 1.9 4.4 5.1" />
    </svg>
  );
}

export function ChartIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 12h15M13.5 5.5 20 12l-6.5 6.5" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M19.5 12h-15M10.5 5.5 4 12l6.5 6.5" />
    </svg>
  );
}

// Kept in the official brand colors rather than currentColor — the "G" mark
// is only recognizable with them, on both light and dark buttons.
export function GoogleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M22.5 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.9a5.05 5.05 0 0 1-2.19 3.32v2.76h3.55c2.08-1.92 3.24-4.74 3.24-8.09Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.76c-.98.66-2.24 1.06-3.73 1.06-2.87 0-5.3-1.94-6.17-4.53H2.16v2.85A11 11 0 0 0 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.83 14.11a6.6 6.6 0 0 1 0-4.22V7.04H2.16a11 11 0 0 0 0 9.92l3.67-2.85Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.96 1 12 1a11 11 0 0 0-9.84 6.04l3.67 2.85C6.7 7.3 9.13 5.36 12 5.36Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function LogOutIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4.5H5.5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1H9" />
      <path d="M16 16.5 21 12l-5-4.5M21 12H9" />
    </svg>
  );
}
