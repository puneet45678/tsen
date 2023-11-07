import React, { useState, useEffect } from "react";
import SubHeader from "../../../components/SubHeader";
import { useRouter } from "next/router";
import Head from "next/head";
import { useSelector } from "react-redux";
import SubMenu from "../../../components/SubMenu";
import Basics from "../../../components/BasicsMain";
import Tiers from "../../../components/TiersMain";
import About from "../../../components/StoryMain";

const CreateCampaign = () => {
  const router = useRouter();
  const { campaignId } = router.query;
  const { section } = router.query;
  const [alert, setAlert] = useState(false);
  const [subSection, setSubSection] = useState("basics");
  const [campaignData, setCampaignData] = useState({
    username: useSelector((state) => state.username),
    basics: useSelector((state) => state.basics),
    tiers: useSelector((state) => state.tiers),
    about: useSelector((state) => state.about),
  });
  const [save, setSave] = useState();

  useEffect(() => {
    console.log("campaignData", campaignData);
  }, campaignData);

  const menuItems = [
    { title: "Portfolio", route: "/portfolio" },
    { title: "My Models", route: "/models" },
    { title: "Shop", route: "/shop" },
    { title: "Campaigns", route: "/campaigns" },
    {
      title: "Purchases",
      subItems: [
        {
          title: "Models",
          route: "/purchases/models",
        },
        {
          title: "Campaigns",
          route: "/purchases/campaigns",
        },
      ],
    },
  ];

  const subMenuItems = [
    {
      title: "Basics",
      set: "basics",
      to: `/createCampaign/${campaignId}/basics`,
    },
    {
      title: "About",
      set: "about",
      to: `/createCampaign/${campaignId}/about`,
    },
    {
      title: "Pre-marketing",
      set: "pre-marketing",
      to: `/createCampaign/${campaignId}/pre-marketing`,
    },
    {
      title: "Reward tiers",
      set: "reqard-tiers",
      to: `/createCampaign/${campaignId}/reward-tiers`,
    },
    {
      title: "Milestones",
      set: "milestones",
      to: `/createCampaign/${campaignId}/milestones`,
    },
  ];

  return (
    <div className="bg-accent2">
      <Head>
        <title>Ikarus Nest</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* <SubHeader
                items={subheaderItems}
                setCompo={setCompo}
                save={save}
                setSave={setSave}
                alert={alert}
                setAlert={setAlert}
            ></SubHeader> */}
      <div className="flex relative h-full bg-accent2">
        <div className="h-full">
          <Menu menuItems={menuItems} />
        </div>

        <div className="flex flex-col w-[20%] border-2 border-gray-400">
          <SubMenu
            subMenuItems={subMenuItems}
            subSection={subSection}
            setSubSection={setSubSection}
          />
        </div>
        <div className="w-[80%] border-2 border-gray-400"></div>
      </div>
      {/* <div className="w-full flex bg-accent2" style={{ minHeight: "calc(100vh - 60px)" }}>
                {(section == "basics" && section === "basics") && (
                    <Basics
                        campaignId="649530b5c669cdd1862e0461"
                        save={save}
                        setSave={setSave}
                        campaignData={campaignData}
                        setCampaignData={setCampaignData}
                    />
                )}
                {(section == "tiers" || section === "tiers") && (
                    <Tiers
                        campaignId={campaignId}
                        save={save}
                        setSave={setSave}
                        campaignData={campaignData}
                        setCampaignData={setCampaignData}
                    />
                )}
                {(section == "about" || section === "about") && (
                    <About
                        campaignId={campaignId}
                        save={save}
                        setSave={setSave}
                        campaignData={campaignData}
                        setCampaignData={setCampaignData}
                    />
                )}
            </div> */}
    </div>
  );
};

//script to check whether the user is logged in or not !
export async function getServerSideProps(context) {
  if (
    context.req.cookies["sFrontToken"] &&
    context.req.cookies["sFrontToken"] !== "" &&
    context.req.cookies["sAccessToken"] &&
    context.req.cookies["sAccessToken"] !== ""
  ) {
    // console.log("here1")
    return {
      props: {},
    };
  }
  console.log("here2");
  return {
    redirect: {
      permanent: false,
      destination: "/login",
    },
    props: {},
  };
}

export default CreateCampaign;
