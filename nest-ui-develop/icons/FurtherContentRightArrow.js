export default function Heart({ color = "block", size = 18, fill = false }) {
  if (fill)
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M8.33331 5L12.7441 9.41074C13.0695 9.73618 13.0695 10.2638 12.7441 10.5893L8.33331 15"
          stroke="#E5E5E7"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M8.33331 5L12.7441 9.41074C13.0695 9.73618 13.0695 10.2638 12.7441 10.5893L8.33331 15"
        stroke="#E5E5E7"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
