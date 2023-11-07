import React, { useEffect, useState } from "react";
// import banner from "../public/images/banner.png";
import banner from "../public/images/banner2.png";
import img1 from "../public/images/img1.webp";
import img2 from "../public/images/img2.webp";
import img3 from "../public/images/img3.webp";
import img4 from "../public/images/img4.webp";
import img5 from "../public/images/img5.webp";
import img6 from "../public/images/img6.webp";
import img7 from "../public/images/img7.webp";
import img8 from "../public/images/img8.webp";
import img9 from "../public/images/img9.webp";
import img10 from "../public/images/img10.webp";
import img11 from "../public/images/img11.webp";
import img12 from "../public/images/img12.webp";
import img14 from "../public/images/img14.webp";
import img15 from "../public/images/img15.webp";
import img16 from "../public/images/img16.webp";
import image17 from "../public/images/image17.webp";
import image18 from "../public/images/image18.webp";
import image19 from "../public/images/image19.webp";
import image20 from "../public/images/image20.webp";
import image21 from "../public/images/image21.webp";
import image22 from "../public/images/image22.webp";
import image23 from "../public/images/image23.webp";
import image24 from "../public/images/image24.webp";
import image25 from "../public/images/image25.webp";
import Image from "next/image";
import anime from "animejs";
import HomePage from "../components/HomePage";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import PushNotificationLayout from "../components/PushNotificationsLayout";
import WebPushComponent from "../components/WebPushComponent";
import WebPushNotification from "../components/WebPushNotification";
import { onMessageListener } from "../UtilityFunctions/firebase";
import {messaging} from "../UtilityFunctions/firebase";

const AnimationPage = () => {
  const router = useRouter();


  //animation script in useEffect function which occur before the homePage.
  const [animationEnded, setAnimationEnded] = useState(false); //varibale to store, whether the animation is completed or not
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationEnded(true);
      router.push("/home");
    }, 4500);
    anime({
      targets: ".loader_column-inner",
      width: "100vw",
      height: ["150%", "100%"],
      easing: "easeInOutSine",
      duration: 2500,
      delay: 0,
    });
    anime({
      targets: ".loader_column-inner.is-edge",
      translateY: ["70%", "0%"],
      easing: "cubicBezier(.86,.13,.404,.773)",
      duration: 2500,
      delay: 0,
    });
    anime({
      targets: ".loader_column-inner.is-center",
      translateY: ["40%", "0%"],
      easing: "cubicBezier(.86,.13,.404,.773)",
      duration: 2500,
      delay: 0,
    });
    anime({
      targets: ".loader_column-inner.is-reversed",
      translateY: ["-40%", "10%"],
      easing: "cubicBezier(.86,.13,.404,.773)",
      duration: 2500,
      delay: 0,
    });
    anime({
      targets: ".loader_img.is-middle",
      scale: ["1.5", "1"],
      easing: "cubicBezier(.445,.05,.058,.96)",
      duration: 2000,
      delay: 2000,
    });
    anime({
      targets: ".loader_flex",
      scale: ["0.23", "1"],
      easing: "cubicBezier(.445,.05,.058,.96)",
      duration: 2000,
      delay: 2000,
    });
  }, []);

  return (
    <>

      <div className={`${animationEnded ? "hidden" : "loader"} bg-black`}>
        <div className="loader_flex">
          <div className="loader_column">
            <div className="loader_column-inner is-edge">
              <div className="loader_img-wrap ">
                <Image
                  src={img1}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              <div className="loader_img-wrap ">
                <Image
                  src={img2}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              <div className="loader_img-wrap ">
                <Image
                  src={img4}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              <div className="loader_img-wrap ">
                <Image
                  src={img3}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              <div className="loader_img-wrap ">
                <Image
                  src={img5}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
            </div>
          </div>
          <div className="loader_column is-alt" style={{ zIndex: -99 }}>
            <div className="loader_column-inner is-reversed">
              <div className="loader_img-wrap">
                <Image
                  src={img6}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              <div className="loader_img-wrap">
                <Image
                  src={img8}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              <div className="loader_img-wrap">
                <Image
                  src={img7}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              <div className="loader_img-wrap">
                <Image
                  src={img9}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              <div className="loader_img-wrap">
                <Image
                  src={img10}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
            </div>
          </div>
          <div className="loader_column">
            <div className="loader_column-inner is-center">
              <div className="loader_img-wrap">
                <Image
                  src={img11}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              <div className="loader_img-wrap">
                <Image
                  src={img12}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              {/* center image */}
              <div className="loader_img-wrap" style={{ zIndex: 99999 }}>
                <Image
                  src={banner}
                  loading="eager"
                  alt=""
                  className="loader_img is-middle"
                />
              </div>
              <div className="loader_img-wrap">
                <Image
                  src={img14}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              <div className="loader_img-wrap">
                <Image
                  src={img15}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
            </div>
          </div>
          <div className="loader_column is-alt" style={{ zIndex: -99 }}>
            <div className="loader_column-inner is-reversed">
              <div className="loader_img-wrap">
                <Image
                  src={img16}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              <div className="loader_img-wrap">
                <Image
                  src={image17}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              <div className="loader_img-wrap">
                <Image
                  src={image18}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              <div className="loader_img-wrap">
                <Image
                  src={image19}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              <div className="loader_img-wrap">
                <Image
                  src={image20}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
            </div>
          </div>
          <div className="loader_column" style={{ zIndex: -999 }}>
            <div className="loader_column-inner is-edge">
              <div className="loader_img-wrap">
                <Image
                  src={image21}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              <div className="loader_img-wrap">
                <Image
                  src={image22}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              <div className="loader_img-wrap ">
                <Image
                  src={image23}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              <div className="loader_img-wrap ">
                <Image
                  src={image24}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
              <div className="loader_img-wrap">
                <Image
                  src={image25}
                  loading="eager"
                  alt=""
                  className="loader_img"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* if the animation is ended then it shows the homePage */}
      {/* <div className={`${animationEnded ? "block" : "hidden"}`}>
        router.push("/home");
      </div> */}
    </>
  );
};

export default AnimationPage;
