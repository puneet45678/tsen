export default function Bell({ color = "block", size = 18, fill = false }) {
  if (fill)
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M24 7.99999L8 24M24 24L8 8.00001"
          stroke="#282828"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M24 7.99999L8 24M24 24L8 8.00001"
        stroke="#282828"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
