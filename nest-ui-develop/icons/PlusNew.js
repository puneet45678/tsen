export default function PortfolioCardLike({
  color = "block",
  size = 18,
  fill = false,
}) {
  if (fill)
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          d="M9 3V15M15 9L3 9"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        d="M9 3V15M15 9L3 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
