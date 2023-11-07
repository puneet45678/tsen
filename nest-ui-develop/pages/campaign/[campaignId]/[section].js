import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import AboutTheCampaign from "../../../components/AboutTheCampaign";
import CampaignUpdates from "../../../components/CampaignUpdates";
import CampaignComments from "../../../components/CampaignComments";
import CampaignTiers from "../../../components/CampaignTiers";
import CampaignFAQ from "../../../components/CampaignFAQ";
import BreadCrumbs from "../../../components/BreadCrumbs";
import AboutTheCampaignNavigation from "../../../components/AboutTheCampaignNavigation";
import axios from "axios";
import ImagesPreviewViewer from "../../../components/ImagesPreviewViewer";
import Head from "next/head";

const AboutCampaign = ({ data, userDataServer }) => {
  let tierDataObj = [];

  const [campaignData, setCampaignData] = useState(data);
  const router = useRouter();
  const { campaignId } = router.query;
  const { section } = router.query;
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [basicsAboutData, setBasicsAboutData] = useState({});
  const [basicsTagsData, setBasicsTagsData] = useState([]);
  const [campaignDp, setCampaignDp] = useState("");
  const [tiersData, setTiersData] = useState([]);
  const [storyDescription, setStoryDescription] = useState();
  const [tierCartData, setTierCartData] = useState(0);
  const [campaignAssets, setCampaignAssets] = useState([]);
  const [metaData, setMetaData] = useState();
  const [faqsData, setFaqsData] = useState([{ ques: "", ans: "" }]);
  // const [userData, setUserData] = useState();

  useEffect(() => {
    console.log("HELLOOO");
    setBasicsAboutData(campaignData.basics.about);
    setBasicsTagsData(campaignData.basics.tags);
    if (campaignData.campaignAssets) {
      setCampaignAssets(campaignData.campaignAssets.campaignImages);
      console.log("in if statement", campaignAssets);
    }
    setMetaData(campaignData.basics.metaData);
    setFaqsData(campaignData.story.faqs);
    setTiersData(campaignData.tiers);
    console.log("useeffect called");
    if (
      campaignData.campaignAssets.campaignDp === "" &&
      typeof campaignAssets[0] !== "undefined"
    ) {
      console.log("dp khalii");
      setCampaignDp(campaignAssets[0].location);
    } else {
      setCampaignDp(campaignData.campaignAssets.campaignDp);
    }

    if (
      Object.keys(campaignData.story.description).length === 0 &&
      campaignData.story.description.constructor === Object
    ) {
      console.log("khalii object");
    } else {
      setStoryDescription(campaignData.story.description);
    }
  }, [
    basicsTagsData,
    campaignAssets,
    basicsAboutData,
    faqsData,
    campaignDp,
    metaData,
    tiersData,
    tierCartData,
  ]);

  const [selectedCarouselImage, setSelectedCarouselImage] = useState(0);

  if (tiersData !== undefined && tierDataObj.length === 0) {
    for (let i = 0; i < tiersData.length; i++) {
      if (tiersData[i].tierData !== undefined) {
        tierDataObj.push({
          tierData: tiersData[i].tierData,
          tierId: tiersData[i].tierId,
        });
      } else {
        continue;
      }
    }
  }
  console.log("tierData", tiersData);
  console.log("tiersDataObj", tierDataObj);

  const campaign = {
    campaignTitle: "Cyberpunk Future Wonder Woman",
    faqs: {
      ques: "",
      ans: "",
    },
    campaignDescription: {
      time: 1674804090781,
      blocks: [
        {
          id: "m414YwdXAl",
          type: "header",
          data: {
            text: "Editor.js",
            level: 2,
          },
        },
        {
          id: "6pWuWl3xKU",
          type: "paragraph",
          data: {
            text: "Hey. Meet the new Editor. On this page you can see it in action — try to edit this text.",
          },
        },
        {
          id: "uLYh3m3GQ4",
          type: "header",
          data: {
            text: "Key features",
            level: 3,
          },
        },
        {
          id: "QgClEgU2-R",
          type: "list",
          data: {
            style: "unordered",
            items: [
              "It is a block-styled editor",
              "It returns clean data output in JSON",
              "Designed to be extendable and pluggable with a simple API",
            ],
          },
        },
        {
          id: "kAb0fhwgVu",
          type: "header",
          data: {
            text: "What does it mean «block-styled editor»",
            level: 3,
          },
        },
        {
          id: "_Ehz_wpMga",
          type: "paragraph",
          data: {
            text: 'Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js <mark class="cdx-marker">workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor\'s Core.',
          },
        },
        {
          id: "pm1K2s9prd",
          type: "paragraph",
          data: {
            text: 'There are dozens of <a href="https://github.com/editor-js">ready-to-use Blocks</a> and the <a href="https://editorjs.io/creating-a-block-tool">simple API</a> for creation any Block you need. For example, you can implement Blocks for Tweets, Instagram posts, surveys and polls, CTA-buttons and even games.',
          },
        },
        {
          id: "qIq53bYvu8",
          type: "header",
          data: {
            text: "What does it mean clean data output",
            level: 3,
          },
        },
        {
          id: "x5FdkQHQSU",
          type: "paragraph",
          data: {
            text: "Classic WYSIWYG-editors produce raw HTML-markup with both content data and content appearance. On the contrary, Editor.js outputs JSON object with data of each Block. You can see an example below",
          },
        },
        {
          id: "RIMLAR9sQX",
          type: "paragraph",
          data: {
            text: 'Given data can be used as you want: render with HTML for <code class="inline-code">Web clients</code>, render natively for <code class="inline-code">mobile apps</code>, create markup for <code class="inline-code">Facebook Instant Articles</code> or <code class="inline-code">Google AMP</code>, generate an <code class="inline-code">audio version</code> and so on.',
          },
        },
        {
          id: "hJQLhjnlMh",
          type: "paragraph",
          data: {
            text: "Clean data is useful to sanitize, validate and process on the backend.",
          },
        },
        {
          id: "3xhRbhUWAv",
          type: "delimiter",
          data: {},
        },
        {
          id: "vuo46DzPoi",
          type: "paragraph",
          data: {
            text: "We have been working on this project more than three years. Several large media projects help us to test and debug the Editor, to make it's core more stable. At the same time we significantly improved the API. Now, it can be used to create any plugin for any task. Hope you enjoy. 😏",
          },
        },
      ],
      version: "2.26.4",
    },
    campaignCreator: "test",
    numberOfComments: 0,
    numberOfUpdates: 0,
    numberOfLikes: 0,
    totalGoal: 1245.630000000001,
    totalRaised: 212.28,
    defaultCurrency: "USD",
    totalBackers: 35,
    campaignEndingIn: 40,
    tags: [
      { label: "Tag1", value: "tag1" },
      { label: "Tag2", value: "tag2" },
      { label: "Tag3", value: "tag3" },
      { label: "Tag4", value: "tag4" },
      { label: "Tag5", value: "tag5" },
      { label: "Tag5", value: "tag5" },
      { label: "Tag5", value: "tag5" },
      { label: "Tag5", value: "tag5" },
      { label: "Tag5", value: "tag5" },
      { label: "Tag5", value: "tag5" },
      { label: "Tag5", value: "tag5" },
      { label: "Tag5", value: "tag5" },
    ],
  };

  console.log("description DATA", storyDescription);
  console.log("description dummy DATA", campaign.campaignDescription);
  let items = [];
  if (campaignAssets !== undefined) {
    for (let i = 0; i < campaignAssets.length; i++) {
      if (campaignDp === campaignAssets[i].location) {
        continue;
      }
      if (campaignAssets[i].croppedUrl === undefined) {
        items.push(campaignAssets[i].location);
      } else {
        items.push(campaignAssets[i].croppedUrl);
      }
    }
  } else {
    items.push("");
  }
  console.log("items", items[0]);
  console.log("items", items);
  const carouselItems = items;

  console.log("campaign basics DATA", basicsAboutData);
  console.log("tags DATA", basicsTagsData);
  console.log("Faqs DATA", faqsData);
  console.log("Campaign assets", campaignAssets);
  console.log("Meta data", metaData);
  const title =
    typeof metaData !== "undefined"
      ? metaData.title === ""
        ? "Ikarus Nest Campaign"
        : metaData.title
      : "";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          property="og:description"
          content={
            typeof metaData === "undefined"
              ? "My page description"
              : metaData.description
          }
        />
        <meta
          property="og:title"
          content={
            typeof metaData === "undefined" ? "My page title" : metaData.title
          }
          key="title"
        />
      </Head>

      <div className="w-full px-12 pb-12 bg-accent2">
        <div className="my-5 flex gap-2 font-medium text-[12px] text-secondary-text-icons-button-text">
          <BreadCrumbs
            items={[
              { title: "Fund Campaigns", to: "" },
              { title: `About the Campaign - ${campaignId}`, to: "" },
            ]}
          />
        </div>

        <div className="flex gap-10">
          {/* Left side of view i.e image wala start here  */}
          <div className="w-[75%] flex justify-between h-[480px]">
            {basicsAboutData.campaignVideo === "" ? (
              <div className="w-[65%] mr-1 h-full flex">
                <img src={campaignDp} className="w-full" alt="" />
              </div>
            ) : (
              <div className="w-[65%] mr-1 h-full flex">
                <iframe
                  className="w-full"
                  src={basicsAboutData.campaignVideo}
                  title="W3Schools Free Online Web Tutorials"
                ></iframe>
              </div>
            )}
            <div
              className={`w-[35%] grid ${
                carouselItems.length <= 3 ? "" : "grid-cols-2"
              } grid-flow-row auto-rows-[minmax(0,_2fr)] gap-1 h-full `}
            >
              {carouselItems.slice(0, 3).map((item, index) => {
                if (index === selectedCarouselImage) {
                  return (
                    <div
                      key={index}
                      className="relative w-full h-full  pointer-events-none"
                      onClick={() => setSelectedCarouselImage(index)}
                    >
                      <Image
                        src={item}
                        alt={campaignAssets[index].metaData}
                        style={{ objectFit: "cover" }}
                        fill
                      />
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className="relative w-full h-full opacity-75 "
                      onClick={() => setSelectedCarouselImage(index)}
                    >
                      <Image
                        src={item}
                        alt={campaignAssets[index].metaData}
                        style={{ objectFit: "cover" }}
                        fill
                      />
                      <div className="absolute w-full h-full top-0 left-0 z-10 bg-black opacity-30"></div>
                    </div>
                  );
                }
              })}
              {carouselItems.length >= 3 ? (
                <div className="relative flex items-center justify-center h-full w-fullrounded-sm">
                  <span
                    className="relative z-10 font-medium text-[20px] cursor-pointer"
                    onClick={() => {
                      setShowImageViewer(true);
                      console.log("showImageViewer", showImageViewer);
                    }}
                  >
                    View More
                  </span>
                  <div className="absolute h-full w-full bg-orange-300/[.5] rounded-sm"></div>
                </div>
              ) : (
                <div className="relative flex items-center justify-center h-full w-fullrounded-sm">
                  <span
                    className="relative z-10 font-medium text-[20px] cursor-pointer"
                    onClick={() =>
                      console.log("show corousel length", carouselItems.length)
                    }
                  >
                    Upload More Pictures to View More
                  </span>
                  <div className="absolute h-full w-full bg-orange-300/[.5] rounded-sm"></div>
                </div>
              )}
              {showImageViewer ? (
                <ImagesPreviewViewer
                  setShowImageViewer={setShowImageViewer}
                  carouselItems={carouselItems}
                  campaignAssets={campaignAssets}
                />
              ) : (
                ""
              )}
            </div>
          </div>

          {/* Right side wala view starts from here */}
          <div className="flex flex-col w-[25%]">
            <h1 className="text-[24px] text-left">{basicsAboutData.title}</h1>
            <div className="flex gap-2 text-secondary-text-paragraph-text mb-3">
              <div className="relative w-20 h-20 min-w-[50px] bg-accent1 rounded-sm">
                <Image
                  src={
                    userDataServer.displayInformation.profilePicture
                      .croppedPictureUrl
                  }
                  alt="Campaign Creator's Profile Picture"
                  className="rounded-sm"
                  fill
                />
              </div>
              <div className="flex flex-col font-medium">
                <p className="text-[20px]">
                  By {userDataServer.accountInformation.firstName}
                </p>
                <div className="flex gap-3 text-[14px]">
                  <p>0 followers</p>
                  <p>0 following</p>
                  <p>0 campaigns</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between font-medium text-[20px] text-secondary-text-icons-button-text my-3">
              <p>Funding Goal</p>
              <p>
                <span className="text-primary-brand">
                  {campaign.defaultCurrency}
                </span>
                &nbsp;
                {Math.round((campaign.totalGoal + Number.EPSILON) * 100) / 100}
              </p>
            </div>
            <div className="flex flex-col gap-2 font-medium my-3">
              <p className="text-[12px] text-secondary-text-icons-button-text">
                <span className="text-primary-brand">
                  {campaign.defaultCurrency}&nbsp;
                  {Math.round((campaign.totalRaised + Number.EPSILON) * 100) /
                    100}
                </span>
                &nbsp;raised
              </p>
              <div className="relative w-full h-2 bg-accent1 rounded-sm overflow-hidden">
                <div
                  className="absolute top-0 left-0 inline-block bg-green-600 h-full rounded-sm"
                  style={{
                    width: `${
                      (campaign.totalRaised / campaign.totalGoal) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex font-medium justify-between text-[14px] text-secondary-text-icons-button-text">
                <p>
                  <span className="text-primary-brand">
                    {campaign.totalBackers}
                  </span>
                  &nbsp;backers
                </p>
                <p>
                  <span className="text-primary-brand">
                    {campaign.campaignEndingIn}
                  </span>
                  &nbsp;days left
                </p>
                <p>
                  <span className="text-primary-brand">
                    {Math.round(
                      (campaign.totalGoal -
                        campaign.totalRaised +
                        Number.EPSILON) *
                        100
                    ) / 100}
                  </span>
                  &nbsp;still to raise
                </p>
              </div>
            </div>
            <div className="flex flex-col font-medium my-3 gap-2">
              <div className="flex flex-row gap-8">
                <button className="w-[70%] bg-primary-brand text-white py-1.5 rounded-sm text-[14px]">
                  Choose tier and Fund
                </button>
                <button
                  className="w-[30%] bg-primary-brand text-white py-1.5 rounded-sm text-[14px]"
                  onClick={() => {
                    router.push("/cart");
                  }}
                >
                  Cart {tierCartData}
                </button>
              </div>

              <div className="flex gap-2 text-[15px]">
                <button className="w-1/3 bg-white h-10">Save</button>
                <button className="w-1/3 bg-white h-10">Share</button>
                <button className="w-1/3 bg-white h-10">Report</button>
              </div>
            </div>
            <div className="flex items-start text-[14px] font-medium mt-2">
              <span className="mr-2">Tags:</span>
              <div className="flex flex-wrap gap-1">
                {basicsTagsData.map((tag, index) => {
                  if (index === basicsTagsData.length - 1) {
                    return (
                      <span
                        key={index}
                        className="text-[12px] text-secondary-text-paragraph-text"
                      >
                        {tag}
                      </span>
                    );
                  } else {
                    return (
                      <span
                        key={index}
                        className="text-[12px] text-secondary-text-paragraph-text"
                      >
                        {tag},
                      </span>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </div>
        <AboutTheCampaignNavigation
          campaignId={campaignId}
          items={[
            {
              title: "About the Campaign",
              id: "about",
              to: `/campaign/${campaignId}/about`,
            },
            {
              title: "Tiers",
              id: "tiers",
              to: `/campaign/${campaignId}/tiers`,
            },
            {
              title: "Updates",
              id: "updates",
              to: `/campaign/${campaignId}/updates`,
            },
            {
              title: "Comments",
              id: "comments",
              to: `/campaign/${campaignId}/comments`,
            },
            {
              title: "FAQ",
              id: "faq",
              to: `/campaign/${campaignId}/faq`,
            },
          ]}
          section={section}
        />
        <div className="flex w-full">
          {section === "about" ? (
            <AboutTheCampaign
              description={
                typeof storyDescription !== "undefined "
                  ? storyDescription
                  : campaign.campaignDescription
              }
            />
          ) : section === "tiers" ? (
            <CampaignTiers
              tiersData={tierDataObj}
              tierCartData={tierCartData}
              setTierCartData={setTierCartData}
            ></CampaignTiers>
          ) : section === "updates" ? (
            <CampaignUpdates
              campaignCreator={campaign.campaignCreator}
              campaignId={campaignId}
            ></CampaignUpdates>
          ) : section === "comments" ? (
            <CampaignComments campaignId={campaignId}></CampaignComments>
          ) : section === "faq" ? (
            // <></>
            <CampaignFAQ
              faqsData={
                typeof faqsData === "undefined" ? campaign.faqs : faqsData
              }
            ></CampaignFAQ>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { req } = context;
  const cookies = req.headers.cookie;
  const config = {
    withCredentials: true,
    headers: {
      cookie: cookies,
    },
  };
  const { campaignId } = context.query;
  const response = await axios.get(
    `http://localhost:8002/api/v1/campaigns/${campaignId}/details`
  );

  const responseUser = await axios.get(`http://localhost:8001/user`, config);
  const userDataServer = responseUser.data;
  const data = response.data;
  const { section } = context.query;
  if (
    section !== "about" &&
    section !== "tiers" &&
    section !== "updates" &&
    section !== "comments" &&
    section !== "faq"
  ) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data, userDataServer },
  };
}

export default AboutCampaign;
