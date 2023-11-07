export default function PortfolioCardLike({
    color = "block",
    size = 18,
    fill = false,
  }) {
    if (fill)
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M2.33301 6.66741L2.33301 10.7507M4.37467 6.42673V10.2507C4.37467 10.8951 4.89701 11.4174 5.54134 11.4174H10.144C10.6922 11.4174 11.1665 11.0357 11.2837 10.5001L12.0948 6.79206C12.1744 6.42827 11.8973 6.08407 11.5249 6.08407H9.33301C8.68868 6.08407 8.16634 5.56174 8.16634 4.91741V4.11083C8.16634 3.50677 7.92638 2.92744 7.49924 2.50031C7.24242 2.24348 6.81404 2.28951 6.61763 2.59503L4.55997 5.79584C4.43899 5.98402 4.37467 6.20302 4.37467 6.42673Z" stroke="#282828" strokeWidth="1.5" strokeLinecap="round"/>
</svg>
      );
  
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2.33301 6.66741L2.33301 10.7507M4.37467 6.42673V10.2507C4.37467 10.8951 4.89701 11.4174 5.54134 11.4174H10.144C10.6922 11.4174 11.1665 11.0357 11.2837 10.5001L12.0948 6.79206C12.1744 6.42827 11.8973 6.08407 11.5249 6.08407H9.33301C8.68868 6.08407 8.16634 5.56174 8.16634 4.91741V4.11083C8.16634 3.50677 7.92638 2.92744 7.49924 2.50031C7.24242 2.24348 6.81404 2.28951 6.61763 2.59503L4.55997 5.79584C4.43899 5.98402 4.37467 6.20302 4.37467 6.42673Z" stroke="#282828" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  