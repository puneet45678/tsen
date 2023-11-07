import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Image from "next/image";
import AcademicCap from "../../icons/AcademicCap";
import ThreeDSpace from "../../icons/ThreeDSpace";
import SpeakerIcon from "../../icons/SpeakerIcon";
import ShoppingCartDashed from "../../icons/ShoppingCartDashed";
import Bars_Alt from "../../icons/Bars_Alt";
import Chevron_Right from "../../icons/Chevron_Right";

const Menu = (props) => {
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const menuItems = [
    {
      title: "My Portfolio",
      value: "portfolio",
      route: "portfolio",
      icon: <AcademicCap />,
    },
    {
      title: "My Models",
      value: "models",
      route: "models",
      icon: <ThreeDSpace />,
    },
    {
      title: "My Campaigns",
      value: "myCampaigns",
      route: "myCampaigns",
      icon: <SpeakerIcon />,
    },
    {
      title: "Purchases",
      value: "purchases",
      route: "purchases",
      icon: <ShoppingCartDashed />,
      subItems: [
        {
          title: "Models",
          route: "models",
        },
        {
          title: "Campaigns",
          route: "campaigns",
        },
      ],
    },
    {
      title: "Statistics",
      value: "statistics",
      route: "statistics",
      icon: <Bars_Alt />,
    },
  ];

  const changePage = (destination) => {
    console.log("destination", destination, "props.page", props.page);
    if (props.page === destination) return false;
    if (props.changesToPage) {
      if (confirm("There are unsaved changes, do you want to continue?")) {
        router.push(`/my-nest/${destination}`);
        props.setChangesToPage(false);
        return true;
      } else {
        return false;
      }
    }
    router.push(`/my-nest/${destination}`);
    return true;
  };

  return (
    <div
      className="flex flex-col gap-6 z-30 h-full w-[250px] min-w-[250px] border-r-[1px] border-light-neutral-600 py-8"
      id="myNestMenu"
    >
      <div className="flex gap-2 mx-8 px-4 py-2 border-[1px] border-light-neutral-700 rounded-[5px] shadow-xs">
        <div className="h-10 w-10 aspect-square rounded-full overflow-hidden bg-gray-300">
          {user?.displayInformation?.profilePicture?.croppedPictureUrl && (
            <Image
              src={user?.displayInformation?.profilePicture?.croppedPictureUrl}
              height={40}
              width={40}
              className="rounded-full"
            />
          )}
        </div>
        <div className="flex flex-col justify-between items-start grow">
          {user?.accountInformation?.fullName && (
            <span className="text-dark-neutral-700 text-lg font-semibold">
              {user.accountInformation.fullName}
            </span>
          )}
          {user?.username && (
            <span className="text-dark-neutral-50 text-sm font-medium">
              @{user.username}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-4 px-8 py-3">
          <h1 className="text-dark-neutral-900 text-uppercase font-semibold">
            MY NEST
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          {menuItems.map((item, index) => {
            if (item.subItems && item.subItems.length > 0) {
              return (
                <div key={index}>
                  <DropDownItem
                    item={item}
                    page={props.page}
                    queries={props.queries}
                  />
                </div>
              );
            } else {
              return (
                <div
                  key={index}
                  onClick={() => changePage(item.route)}
                  className={`flex gap-4 px-8 py-3 cursor-pointer ${
                    props.page === item.route
                      ? "text-primary-purple-600 border-l-2 border-primary-purple-600 bg-primary-purple-50"
                      : "text-dark-neutral-50"
                  }`}
                >
                  <div className="flex-center h-6 w-6">{item.icon}</div>
                  <p className="text-lg font-semibold ">{item.title}</p>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

const DropDownItem = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (props.page === props.item.route) {
      setIsOpen(true);
    }
  }, [props.page, props.item.route]);

  return (
    <div className="flex flex-col">
      <div
        className={`flex gap-4 px-8 py-3 cursor-pointer ${
          props.page === props.item.route
            ? "text-primary-purple-600 border-l-2 border-primary-purple-600 bg-primary-purple-50"
            : "text-dark-neutral-50"
        }`}
        onClick={() => setIsOpen((current) => !current)}
      >
        <div className="flex-center h-6 w-6">{props.item.icon}</div>
        <p className="text-lg font-semibold grow">{props.item.title}</p>
        <div className="flex-center h-5 w-5">
          <Chevron_Right />
        </div>
      </div>
      <div
        className={`grid transition-all ease-in-out duration-500 ${
          isOpen ? "grid-rows-[1fr] pt-4" : "grid-rows-[0fr]"
        }`}
      >
        <div className="flex flex-col gap-2 overflow-hidden">
          {props.item.subItems.map((subItem, index) => (
            <div key={`dropDown${index}`} className="cursor-pointer">
              {props.queries.length > 0 &&
              props.queries[0] === subItem.route ? (
                <Link
                  href={`/my-nest/${props.item.route}/${subItem.route}`}
                  className="flex items-center gap-[10px] pl-14 text-sm font-semibold text-primary-purple-500"
                >
                  <div className="w-2 h-2 aspect-square bg-primary-purple-600 rounded-full"></div>
                  <span>{subItem.title}</span>
                </Link>
              ) : (
                <Link
                  href={`/my-nest/${props.item.route}/${subItem.route}`}
                  className="pl-14 text-sm font-semibold text-dark-neutral-50 inline-block"
                >
                  <span>{subItem.title}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
