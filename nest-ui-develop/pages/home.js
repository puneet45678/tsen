import React, { useEffect } from "react";
import HomePageComponent from "../components/HomePage";
import { useSelector } from "react-redux";


const Home = () => {
  const user = useSelector((state) => state.user);
  useEffect(() => {
    console.log("inside home effect");
    (function () {
      window.sib = {
        equeue: [],
        client_key: "mrced643f50svmx12yj33lm8",
      };
      /* OPTIONAL: email for identify request*/
      window.sib.email_id = user.email;
      console.log("Home Email: ", user.email);
      window.sendinblue = {};
      for (
        var j = ["track", "identify", "trackLink", "page"], i = 0;
        i < j.length;
        i++
      ) {
        (function (k) {
          window.sendinblue[k] = function () {
            var arg = Array.prototype.slice.call(arguments);
            (
              window.sib[k] ||
              function () {
                var t = {};
                t[k] = arg;
                window.sib.equeue.push(t);
              }
            )(arg[0], arg[1], arg[2], arg[3]);
          };
        })(j[i]);
      }
      var n = document.createElement("script"),
        i = document.getElementsByTagName("script")[0];
      (n.type = "text/javascript"),
        (n.id = "sendinblue-js"),
        (n.async = !0),
        (n.src =
          "https://sibautomation.com/sa.js?key=" + window.sib.client_key),
        i.parentNode.insertBefore(n, i),
        window.sendinblue.page();
    })();
  }, []);

  return (
    <>
      <HomePageComponent />

    </>
  );
};

export default Home;
