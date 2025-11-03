export function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M5 12H3V15H5V12ZM5 9H3V12H5V9Z"
        fill="currentColor"
      />
      <path
        d="M19 12H21V15H19V12ZM19 9H21V12H19V9Z"
        fill="currentColor"
      />
      <path
        d="M7 12H5V9H2V7H5V4H7V7H17V4H19V7H22V9H19V12H17V9H7V12Z"
        transform="rotate(90 12 12)"
        fill="currentColor"
      />
    </svg>
  );
}
