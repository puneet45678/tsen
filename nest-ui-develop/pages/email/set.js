

const EmailSet = () => {
  const handleResendClick = () => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
  return (
    <div>
      <button onClick={handleResendClick} className="button-lg button-primary">
        Resend Email
      </button>
    </div>
  );
};

export default EmailSet;
