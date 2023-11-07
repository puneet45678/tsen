const HeartFilled = ({ color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      viewBox="0 0 18 18"
      fill={color}
      stroke={color}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.99538 4.43711C7.64581 2.86435 5.39533 2.44128 3.70442 3.88146C2.01351 5.32164 1.77545 7.72955 3.10333 9.43286C4.20738 10.849 7.5486 13.8359 8.64367 14.8026C8.76618 14.9108 8.82744 14.9648 8.89889 14.9861C8.96126 15.0046 9.0295 15.0046 9.09186 14.9861C9.16331 14.9648 9.22457 14.9108 9.34709 14.8026C10.4422 13.8359 13.7834 10.849 14.8874 9.43286C16.2153 7.72955 16.0063 5.30649 14.2863 3.88146C12.5664 2.45643 10.3449 2.86435 8.99538 4.43711Z"
        fill={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default HeartFilled;
