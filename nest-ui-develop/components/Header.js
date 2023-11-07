import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { clearUser, isLoggedIn } from "../store/userSlice";
import axios from "axios";
import { changeSearchResults, changeSearchWord } from "../store/searchSlice";
import { useRouter } from "next/router";
import AdvanceSearch from "./AdvanceSearch";
import debounce from "lodash.debounce";
import SearchIconHeader from "../icons/SearchIconHeader";
import dynamic from "next/dynamic";
import PlusNew from "../icons/PlusNew";
import HeartHeader from "../icons/HeartHeader";
import CartHeader from "../icons/CartHeader";
import Avatar from "./Avatar";
const LiveBellNotifications = dynamic(() => import("./LiveBellNotification"), {
  ssr: false,
});

const Header = (props) => {
  const searchRef = useRef();
  const suggestionRef = useRef();
  const advanceSearchRef = useRef();
  const showProfileMenuRef = useRef();
  const router = useRouter();
  // const selectedImage = useSelector((state) => state.counter.displayPic);
  const [show, setShow] = useState(false);
  const [navShow, setNavShow] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dot, setDot] = useState(true);
  const searchSuggestions = useSelector((state) => state.search.searchResults);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isUserLoggedIn = useSelector(isLoggedIn);
  const [profilePicture, setProfilePicture] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [advanceSearch, setAdvanceSearch] = useState(false);
  const [onWhichPage, setOnWhichPage] = useState("");
  // const { client, userData } = useStreamContext()
  // console.log("BellClient: ",client)
  // console.log("UserData out of Effect: ",userData)

  // const [newNotifications, setNewNotifications] = useState(0)
  const handleLogOut = async () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/signout`)
      .then((res) => {
        setShow(false);
        dispatch(clearUser());
        router.push("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const search = debounce(async (e) => {
    if (e.target.value !== "") {
      dispatch(changeSearchWord(e.target.value));
      setShowSuggestions(true);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SEACH_SERVICE}/search?query=${e.target.value}&index=campaign`
      );

      if (typeof res == "undefined") console.log("undefined res");
      else {
        console.log(res.data.search_result.hits);
        dispatch(changeSearchResults(res.data.search_result.hits));
      }
    }
  }, 800);

  useEffect(() => {
    dispatch(changeSearchWord(document.getElementById("search").value));
    if (user.email && user.firstName && user.lastName && user.username)
      setDot(false);
    console.log("UserData: ", user);
  }, []);

  useEffect(() => {
    setProfilePicture(
      user?.displayInformation?.profilePicture?.croppedPictureUrl
        ? user.displayInformation.profilePicture.croppedPictureUrl
        : user?.displayInformation?.profilePicture?.pictureUrl
        ? user.displayInformation.profilePicture.pictureUrl
        : ""
    );
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, [router.pathname, router.query]);

  //useEffect for making suggestions and porfileMenu hide if user clicks outside the suggestion box
  useEffect(() => {
    const page = router.route;
    console.log("headerPage: ", page);
    if (page === "/campaigns") {
      setOnWhichPage("campaigns");
    } else if (page === "/marketplace") {
      setOnWhichPage("marketplace");
    }
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
      if (
        showProfileMenuRef.current &&
        !showProfileMenuRef.current.contains(event.target)
      ) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-[72px] px-[60px] sticky w-full top-0 bg-white flex justify-between items-center gap-6 z-40 border-b-[1px] border-light-neutral-600">
      <div className="flex items-center gap-3">
        <Link href="/home" className="relative h-[48px] w-[48px]">
          <Image src="/images/logo.png" alt="Ikarus Logo" fill />
        </Link>
        <Link
          href="/home"
          className="text-xl text-dark-neutral-800 ml-3 font-extrabold"
        >
          IkarusNest
        </Link>
      </div>
      <div className="flex text-dark-neutral-700 gap-[32px] px-[16px] py-[11px] text-center">
        <button
          onClick={() => {
            router.push("/marketplace");
          }}
          className={`${
            onWhichPage === "/marketplace"
              ? "text-primary-purple-600"
              : "text-dark-neutral-700"
          } text-button-text-md font-[600]`}
        >
          Marketplace
        </button>
        <button
          onClick={() => {
            router.push("/campaigns/explore");
          }}
          className={`${
            onWhichPage === "/campaigns"
              ? "text-primary-purple-600"
              : "text-dark-neutral-700"
          } text-button-text-md font-[600]`}
        >
          Campaigns
        </button>
      </div>
      <div
        ref={suggestionRef}
        className="grow border-light-neutral-700 px-[16px] gap-[8px] hidden lg:flex items-center border-[1px] rounded-[2px] relative text-secondary-text-icons-button-text focus-within:border-black focus-within:text-black"
      >
        <SearchIconHeader />
        <input
          type="text"
          id="search"
          name="search"
          placeholder="Search By Text, 'Extact Phrases' in Campaigns or by Users "
          className="grow px-1 py-[10px] focus:outline-none bg-light-neutral-50 text-[14px] border-none"
          onChange={search}
        />

        {/* <BsSearch style={{ fontSize: "18px", margin: "3px 5px" }} /> */}
        <button
          onClick={() => {
            advanceSearch === true
              ? setAdvanceSearch(false)
              : setAdvanceSearch(true);
          }}
          ref={advanceSearchRef}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="SearchBar_SearchIcon-0-2-555 mr-2"
          >
            <title>Advanced Search</title>
            <path
              d="M0 13C0 12.5938 0.3125 12.25 0.75 12.25H2.59375C2.90625 11.25 3.875 10.5 5 10.5C6.09375 10.5 7.0625 11.25 7.375 12.25H15.25C15.6562 12.25 16 12.5938 16 13C16 13.4375 15.6562 13.75 15.25 13.75H7.375C7.0625 14.7812 6.09375 15.5 5 15.5C3.875 15.5 2.90625 14.7812 2.59375 13.75H0.75C0.3125 13.75 0 13.4375 0 13ZM6 13C6 12.4688 5.53125 12 5 12C4.4375 12 4 12.4688 4 13C4 13.5625 4.4375 14 5 14C5.53125 14 6 13.5625 6 13ZM11 5.5C12.0938 5.5 13.0625 6.25 13.375 7.25H15.25C15.6562 7.25 16 7.59375 16 8C16 8.4375 15.6562 8.75 15.25 8.75H13.375C13.0625 9.78125 12.0938 10.5 11 10.5C9.875 10.5 8.90625 9.78125 8.59375 8.75H0.75C0.3125 8.75 0 8.4375 0 8C0 7.59375 0.3125 7.25 0.75 7.25H8.59375C8.90625 6.25 9.875 5.5 11 5.5ZM12 8C12 7.46875 11.5312 7 11 7C10.4375 7 10 7.46875 10 8C10 8.5625 10.4375 9 11 9C11.5312 9 12 8.5625 12 8ZM15.25 2.25C15.6562 2.25 16 2.59375 16 3C16 3.4375 15.6562 3.75 15.25 3.75H8.375C8.0625 4.78125 7.09375 5.5 6 5.5C4.875 5.5 3.90625 4.78125 3.59375 3.75H0.75C0.3125 3.75 0 3.4375 0 3C0 2.59375 0.3125 2.25 0.75 2.25H3.59375C3.90625 1.25 4.875 0.5 6 0.5C7.09375 0.5 8.0625 1.25 8.375 2.25H15.25ZM5 3C5 3.5625 5.4375 4 6 4C6.53125 4 7 3.5625 7 3C7 2.46875 6.53125 2 6 2C5.4375 2 5 2.46875 5 3Z"
              fill="grey"
            ></path>
          </svg>
        </button>

        {advanceSearch === true ? (
          <AdvanceSearch setAdvanceSearch={setAdvanceSearch}></AdvanceSearch>
        ) : (
          <></>
        )}

        <div
          className={`${
            showSuggestions == true && router.pathname !== "/allSearchResults"
              ? "absolute  flex flex-col"
              : "hidden"
          } top-10 bg-white text-black w-full rounded-[2px] shadow-sm`}
        >
          {typeof searchSuggestions === "undefined"
            ? ""
            : searchSuggestions.map((suggestion, i) => {
                console.log("hits", suggestion.userId);
                if (i < 5) {
                  return (
                    <div key={i} className="pb-3 px-4 hover:bg-gray-100 ">
                      <p className="text-sm mt-2 cursor-pointer">
                        {suggestion.basics.about.title}
                      </p>
                    </div>
                  );
                }
              })}
          {searchSuggestions.length !== 0 && (
            <Link
              href="/allSearchResults"
              className="pb-3 hover:bg-gray-100 text-center font-semibold text-primary-brand cursor-pointer"
              onClick={() => setShowSuggestions(false)}
            >
              <p className="text-sm mt-2">See all results</p>
            </Link>
          )}
          {searchSuggestions.length === 0 && (
            <div className="pb-3 hover:bg-gray-100 text-center font-semibold text-primary-brand cursor-pointer">
              <p className="text-sm mt-2">No results found!!!</p>
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:block">
        {!isUserLoggedIn ? (
          <>
            <div className="my-auto flex gap-[52px]">
              <div className="flex gap-[32px]">
                <button>Join Our Community</button>
                <div className="flex gap-[6px] bg-white px-[18px] py-[11px] text-dark-neutral-700 border-[1px] border-light-neutral-600 rounded-[6px]">
                  <button className="text-button-text-md font-[600]">
                    Become a creator
                  </button>
                </div>
              </div>

              <div className="flex items-center h-[40px] cursor-pointer gap-[24px]">
                <Link
                  href={`/login?redirectToPath=${currentPath}`}
                  className="text-primary-purple-500 text-button-text-md font-[600]"
                >
                  Log In
                </Link>

                <Link
                  href={`/signup`}
                  className="px-[18px] py-[11px] bg-primary-purple-500 rounded-[6px] text-white shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="my-auto flex gap-[24px]">
              <div className="flex gap-[32px]">
                <button>Join Our Community</button>
                <button
                  onClick={() => {
                    router.push("/my-nest/mycampaigns");
                  }}
                  className="flex gap-[6px] bg-primary-purple-500 px-[18px] py-[11px] text-white rounded-[6px]"
                >
                  <div className="m-auto text-button-text-md font-[600] flex gap-[6px]">
                    <span className="my-auto">
                      <PlusNew />
                    </span>{" "}
                    <span>Create</span>
                  </div>
                </button>
              </div>

              <div className="flex items-center h-[40px] cursor-pointer gap-4">
                <LiveBellNotifications
                  newNotifications={props.newNotifications}
                />
                <Link
                  href="/my-wishlist"
                  className="bg-white shadow-sm p-[11px] rounded-[5px]"
                >
                  <HeartHeader />
                </Link>
                <Link
                  href="/cart"
                  className="bg-white shadow-sm p-[11px] rounded-[5px]"
                >
                  <CartHeader />
                </Link>
                <div
                  onClick={() => {
                    setShow(!show);
                    console.log(dot);
                    console.log("setShow pressed", show);
                  }}
                  className="w-fit h-fit"
                >
                  <Avatar size="sm" imageSrc={profilePicture} />
                </div>
                {dot ? <div title="Basic details incomplete"></div> : null}
                {/*TODO Make the Exlcaimation visible only when server's not running */}
                <div
                  className={`absolute flex flex-col transition-all top-[72px] right-3 bg-white w-[375px] rounded-[5px] border-[1px] border-light-neutral-700 shadow-hover ${
                    show ? "opacity-100 block" : "opacity-0 hidden"
                  }`}
                  ref={showProfileMenuRef}
                >
                  <div className="flex flex-col gap-4 px-4 pb-4">
                    <div className="flex gap-[10px] py-[10px]">
                      <Avatar size="md-1" imageSrc={profilePicture} />
                      <div>
                        <p className="text-lg font-semibold text-dark-neutral-700">
                          {user?.accountInformation?.fullName}
                        </p>
                        <p className="text-lg font-medium text-dark-neutral-50">
                          <span>@</span>
                          <span>{user.username}</span>
                        </p>
                      </div>
                    </div>
                    <div className="bg-light-neutral-700 h-[1px]"></div>
                    <Link
                      href="/my-nest/portfolio"
                      onClick={() => setShow(false)}
                      className="flex gap-3 p-[10px] text-lg font-medium text-dark-neutral-700"
                    >
                      <Image
                        src="/SVG/Bars_User.svg"
                        alt="My Nest Icon"
                        width={20}
                        height={20}
                      />
                      <p className="grow">My Nest</p>
                    </Link>
                    <Link
                      href={`/user/${user.username}/about`}
                      onClick={() => setShow(false)}
                      className="flex gap-3 p-[10px] text-lg font-medium text-dark-neutral-700"
                    >
                      <Image
                        src="/SVG/Mobile_User.svg"
                        alt="My Public Profile< Icon"
                        width={20}
                        height={20}
                      />
                      <p className="grow">My Public Profile</p>
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setShow(false)}
                      className="flex gap-3 p-[10px] text-lg font-medium text-dark-neutral-700"
                    >
                      <Image
                        src="/SVG/Document_Check.svg"
                        alt="My Orders Icon"
                        width={20}
                        height={20}
                      />
                      <p className="grow">My Orders</p>
                    </Link>
                    <Link
                      href="/settings/my-profile"
                      onClick={() => setShow(false)}
                      className="flex gap-3 p-[10px] text-lg font-medium text-dark-neutral-700"
                    >
                      <Image
                        src="/SVG/Settings_3.svg"
                        alt="Account Settings Icon"
                        width={20}
                        height={20}
                      />
                      <p className="grow">Account Settings</p>
                    </Link>
                    <Link
                      href=""
                      onClick={() => setShow(false)}
                      className="flex gap-3 p-[10px] text-lg font-medium text-dark-neutral-700"
                    >
                      <Image
                        src="/SVG/Headphones_Alt.svg"
                        alt="Help and Support Icon"
                        width={20}
                        height={20}
                      />
                      <p className="grow">Help and Support</p>
                    </Link>
                  </div>
                  <div
                    className="bg-light-neutral-50 p-4 text-md font-medium"
                    onClick={handleLogOut}
                  >
                    <div className="flex gap-3 px-[10px]">
                      <Image
                        src="/SVG/Upload.svg"
                        alt="Logout Icon"
                        width={20}
                        height={20}
                      />
                      <p className="grow">Log Out</p>
                    </div>
                  </div>
                </div>
                {/* <div
                  className={`absolute flex flex-col transition-all shadow-md top-[52px] right-3 bg-white w-60 p-2 rounded-[2px] font-medium text-[14px] ${
                    show ? "opacity-100 block" : "opacity-0 hidden"
                  }`}
                  ref={showProfileMenuRef}
                >
                  <SuperSlicer />
                  <Link
                    href="/settings/my-profile"
                    onClick={() => setShow(false)}
                    className="p-2 hover:bg-gray-100 rounded-[2px]"
                  >
                    My Account
                  </Link>
                  <Link
                    href={`/my-campaigns/${user.username}/draft`}
                    onClick={() => setShow(false)}
                    className="p-2 hover:bg-gray-100 rounded-[2px]"
                  >
                    My campaigns
                  </Link>
                  <Link
                    href=""
                    onClick={() => setShow(false)}
                    className="p-2 hover:bg-gray-100 rounded-[2px]"
                  >
                    My contributions
                  </Link>
                  <Link
                    href=""
                    onClick={() => setShow(false)}
                    className="p-2 hover:bg-gray-100 rounded-[2px]"
                  >
                    Help & Support
                  </Link>
                  <div
                    className="p-2 hover:bg-gray-100 rounded-[2px]"
                    onClick={handleLogOut}
                  >
                    Log Out
                  </div>
                </div> */}
              </div>
            </div>
          </>
        )}
      </div>

      {/* mobile view */}
      {/* <div onClick={() => setNavShow(!navShow)} className="lg:hidden">
        |||
      </div> */}
      {/* <div
        className={`absolute flex lg:hidden flex-col transition-all left-5 right-5 sm:left-10 sm:right-10 top-[60px] bg-white rounded-[2px] p-2 ${
          navShow ? "opacity-100 block" : "opacity-0 hidden"
        }`}
      >
        <div className="flex items-center border-2 rounded-[2px]">
          <div className="relative w-[18px] h-[18px] mx-3">
          </div>
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Search by Text, 'Exact Phrases' "
            className="w-[300px] focus:outline-none bg-white overflow-hidden"
          />
        </div>
        {!isUserLoggedIn ? (
          <div className="flex flex-col">
            <p className="">
              <Link href={`/login?redirectToPath=${currentPath}`} className="">
                Log In
              </Link>
            </p>
            <p>Create Campaign</p>
          </div>
        ) : (
          <>
            <SuperSlicer />
            <Link
              href="/settings/my-profile"
              onClick={() => setShow(false)}
              className="m-2"
            >
              My Account
            </Link>
            <Link href="" onClick={() => setShow(false)} className="m-2">
              My campaigns
            </Link>
            <Link href="" onClick={() => setShow(false)} className="m-2">
              My contributions
            </Link>
            <Link href="" onClick={() => setShow(false)} className="m-2">
              Help & Support
            </Link>
            <p className="m-2" onClick={handleLogOut}>
              Log Out
            </p>
          </>
        )}
      </div> */}
    </div>
  );
};

export default Header;
