export default function PortfolioCardLike({
    color = "block",
    size = 18,
    fill = false,
  }) {
    if (fill)
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M18 6L6 18M18 18L6 6.00001" stroke="#282828" strokeWidth="1.5" strokeLinecap="round"/>
</svg>
      );
  
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M18 18L6 6.00001" stroke="#282828" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  