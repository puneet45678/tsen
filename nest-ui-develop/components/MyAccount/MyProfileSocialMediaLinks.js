import { useState, useMemo, useEffect, useId } from "react";
import SectionLayout from "../Layouts/SectionLayout";
import Plus from "../../icons/Plus";
import Minus from "../../icons/Minus";
import MyProfileSocialLinksContainer from "./MyProfileSocialLinksContainer";
import { Reorder } from "framer-motion";
import axios from "axios";
import BurgerMenu_Big from "../../icons/BurgerMenu_Big";
import Globe from "../../icons/Globe";

const MyProfileSocialMediaLinks = ({ data, setData, changes, setChanges }) => {
  const [showCustomInputContainer, setShowCustomInputContainer] =
    useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [mediaLinks, setMediaLinks] = useState([]);
  const [defaultAccountsStatus, setDefaultAccountsStatus] = useState({
    linkedin: false,
    instagram: false,
    twitter: false,
    medium: false,
    facebook: false,
  });
  const [customLinkChanges, setCustomLinkChanges] = useState(false);
  const [defaultLinkChanges, setDefaultLinkChanges] = useState(false);

  const generateAccountValue = (title) => {
    const input = title.toLowerCase();
    const words = input.split(/\s+|_|-/);
    for (let i = 1; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].slice(1);
    }
    const camelCaseString = words.join("");
    return camelCaseString;
  };

  // TODO: Add throttling
  const handleMediaLinksReorder = (links) => {
    setMediaLinks(links);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/social-links/reorder`,
        links,
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
        setData((current) => ({
          ...current,
          socialMediaLinks: res.data,
        }));
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  // TODO: Add throttling
  const socialLinkSubmitHandler = (accountTitle, accountUrl) => {
    const accountValue = generateAccountValue(accountTitle);
    const data = { title: accountTitle, value: accountValue, url: accountUrl };
    console.log("data", data);
    return new Promise((resolve, reject) => {
      axios
        .put(
          `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/social-link`,
          data,
          { withCredentials: true }
        )
        .then((res) => {
          console.log("res1", res);
          setData((current) => ({
            ...current,
            socialMediaLinks: [...current.socialMediaLinks, { ...data }],
          }));
          resolve(true);
        })
        .catch((err) => {
          console.log("err2", err);
          reject(false);
        });
    });
  };

  const socialLinkDeletionHandler = (accountValue) => {
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/social-link/${accountValue}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("res1", res);
        setData((current) => ({
          ...current,
          socialMediaLinks: current.socialMediaLinks.filter(
            (link) => link.value !== accountValue
          ),
        }));
      })
      .catch((err) => {
        console.log("err2", err);
      });
  };

  useEffect(() => {
    if (customLinkChanges || defaultLinkChanges) {
      setChanges(true);
    }
  }, [customLinkChanges, defaultLinkChanges]);

  useEffect(() => {
    console.log("data.socialMediaLinks", data.socialMediaLinks);
    const defaultAccountsData = {
      linkedin: false,
      instagram: false,
      twitter: false,
      medium: false,
      facebook: false,
    };
    for (let account of data.socialMediaLinks) {
      if (account.value) {
        if (account.value === "linkedin") {
          defaultAccountsData["linkedin"] = true;
        } else if (account.value === "instagram") {
          defaultAccountsData["instagram"] = true;
        } else if (account.value === "twitter") {
          defaultAccountsData["twitter"] = true;
        } else if (account.value === "medium") {
          defaultAccountsData["medium"] = true;
        } else if (account.value === "facebook") {
          defaultAccountsData["facebook"] = true;
        }
      }
    }
    setDefaultAccountsStatus((current) => ({
      ...current,
      ...defaultAccountsData,
    }));
    setMediaLinks(data.socialMediaLinks);
  }, [data]);

  return (
    <div className="scroll-mt-[120px]" id="socialConnections">
      <SectionLayout
        heading="Social media links"
        subHeading="Let people discover you on your socials"
      >
        <div className="flex justify-start">
          {showCustomInputContainer ? (
            <div
              className="flex-center gap-[6px] text-primary-purple-500 cursor-pointer"
              onClick={() => setShowCustomInputContainer(false)}
            >
              <div className="h-5 w-5">
                <Minus />
              </div>
              <span className="text-button-text-md font-bold">
                Add custom links
              </span>
            </div>
          ) : (
            <div
              className="flex-center gap-[6px] text-primary-purple-500 cursor-pointer"
              onClick={() => setShowCustomInputContainer(true)}
            >
              <div className="h-5 w-5">
                <Plus />
              </div>

              <span className="text-button-text-md font-bold">
                Add custom links
              </span>
            </div>
          )}
        </div>

        {showCustomInputContainer && (
          <>
            <div className="flex items-end justify-center gap-6 rounded-[6px] bg-light-neutral-50 p-6">
              <form className="grid grid-cols-2 gap-6 grow">
                <div className="flex flex-col gap-[6px]">
                  <label
                    htmlFor="linkTitle"
                    className=""
                  >
                    Link Title
                  </label>
                  <input
                    id="linkTitle"
                    type="text"
                    value={linkTitle}
                    onChange={(event) => {
                      if (!customLinkChanges) {
                        setCustomLinkChanges(true);
                      }
                      setLinkTitle(event.target.value);
                    }}
                    className="px-[16px] py-[13px] rounded-[5px] border-[1px] focus-within:outline-none border-light-neutral-700 focus-within:border-primary-purple-500 focus-within:shadow-focused-primary"
                    placeholder="Write the text shown for link"
                  />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <label
                    htmlFor="linkUrl"
                    className=""
                  >
                    Link URL
                  </label>
                  <input
                    id="linkUrl"
                    type="text"
                    value={linkUrl}
                    onChange={(event) => {
                      if (!customLinkChanges) {
                        setCustomLinkChanges(true);
                      }
                      setLinkUrl(event.target.value);
                    }}
                    className="px-[16px] py-[13px] rounded-[5px] border-[1px] focus-within:outline-none border-light-neutral-700 focus-within:border-primary-purple-500 focus-within:shadow-focused-primary"
                    placeholder="Add link where should the link go"
                  />
                </div>
              </form>
              <div className="flex-center gap-6">
                <button
                  onClick={async () => {
                    try {
                      const result = await socialLinkSubmitHandler(
                        linkTitle,
                        linkUrl
                      );
                      if (result) {
                        setShowCustomInputContainer(false);
                        setLinkTitle("");
                        setLinkUrl("");
                        setCustomLinkChanges(false);
                      }
                    } catch (err) {}
                  }}
                  className="button-xs button-primary w-fit"
                >
                  Add link
                </button>
                <button className="text-button-text-sm text-dark-neutral-700 font-semibold">
                  Cancel
                </button>
              </div>
            </div>
            <div className="h-[1px] w-full bg-light-neutral-600"></div>
          </>
        )}
        <div className="flex flex-col gap-4">
          <Reorder.Group
            axis="y"
            values={mediaLinks}
            onReorder={handleMediaLinksReorder}
          >
            <div className="flex flex-col gap-4">
              {mediaLinks.map((link) => (
                <Reorder.Item key={`${link.title}-${link.url}`} value={link}>
                  <MyProfileSocialLinksContainer
                    socialAccountTitle={link.title}
                    socialAccountValue={link.value}
                    accountUrl={link.url}
                    deleteUrlHandler={socialLinkDeletionHandler}
                    socialIcon={<Globe />}
                    burgerIcon={<BurgerMenu_Big />}
                  />
                </Reorder.Item>
              ))}
            </div>
          </Reorder.Group>
          {!defaultAccountsStatus?.linkedin && (
            <MyProfileSocialLinksContainer
              socialAccountTitle={"Linkedin"}
              socialAccountValue={"linkedin"}
              submitUrlHandler={socialLinkSubmitHandler}
              changes={defaultLinkChanges}
              setChanges={setDefaultLinkChanges}
            />
          )}
          {!defaultAccountsStatus?.instagram && (
            <MyProfileSocialLinksContainer
              socialAccountTitle={"Instagram"}
              socialAccountValue={"instagram"}
              submitUrlHandler={socialLinkSubmitHandler}
              changes={defaultLinkChanges}
              setChanges={setDefaultLinkChanges}
            />
          )}
          {!defaultAccountsStatus?.twitter && (
            <MyProfileSocialLinksContainer
              socialAccountTitle={"Twitter"}
              socialAccountValue={"twitter"}
              submitUrlHandler={socialLinkSubmitHandler}
              changes={defaultLinkChanges}
              setChanges={setDefaultLinkChanges}
            />
          )}
          {!defaultAccountsStatus?.medium && (
            <MyProfileSocialLinksContainer
              socialAccountTitle={"Medium"}
              socialAccountValue={"medium"}
              submitUrlHandler={socialLinkSubmitHandler}
              changes={defaultLinkChanges}
              setChanges={setDefaultLinkChanges}
            />
          )}
          {!defaultAccountsStatus?.facebook && (
            <MyProfileSocialLinksContainer
              socialAccountTitle={"Facebook"}
              socialAccountValue={"facebook"}
              submitUrlHandler={socialLinkSubmitHandler}
              changes={defaultLinkChanges}
              setChanges={setDefaultLinkChanges}
            />
          )}
        </div>
      </SectionLayout>
    </div>
  );
};

export default MyProfileSocialMediaLinks;
