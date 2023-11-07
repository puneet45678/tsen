import React, { useState, useEffect, useId } from "react";
import MyNestContentWithCreateButton from "../MyNestContentWithCreateButton";
import MyModelCard from "./MyModelCard";
import { useRouter } from "next/router";
import axios from "axios";
import Select from "react-select";
import Dropdown from "../../Dropdown";
import { singleSelect } from "../../../styles/ReactSelectStyles";
import Image from "next/image";

const DisplayModel = () => {
  const router = useRouter();
  const [models, setModels] = useState([]);
  const [selectedFileFilter, setSelectedFileFilter] = useState({
    value: "all",
    label: "All",
  });
  const [selectedVisibilityFilter, setSelectedVisibilityFilter] = useState({
    value: "all",
    label: "All",
  });
  const [selectedLicenseFilter, setSelectedLicenseFilter] = useState({
    value: "all",
    label: "All",
  });
  const [filterApplied, setFilterApplied] = useState(false);
  // const [selectedSortingFilter, setSelectedSortingFilter] =
  //   useState("Recently Added");

  const fileOptions = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "published",
      label: "Published",
    },
    {
      value: "draft",
      label: "Draft",
    },
    {
      value: "In_review",
      label: "In Review",
    },
  ];

  // const fileOptions = [
  //   {
  //     value: "all",
  //     label: "All",
  //   },
  //   {
  //     value: "published",
  //     label: "Published",
  //   },
  //   {
  //     value: "draft",
  //     label: "Draft",
  //   },
  //   {
  //     value: "inReview",
  //     label: "In Review",
  //   },
  // ];

  const visibilityOptions = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "public",
      label: "Public",
    },
    {
      value: "private",
      label: "Private",
    },
  ];

  const licenseOptions = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "Ikarus",
      label: "Ikarus",
    },
    {
      value: "Creative Commons",
      label: "Creative Commons",
    },
  ];

  const sortOptions = [
    {
      value: "Recently Added",
      label: "Recently Added",
    },
    {
      value: "Creative Commons",
      label: "Creative Commons",
    },
    {
      value: "2",
      label: "2",
    },
  ];

  const handleModelUploadClick = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/model`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("res", res);
        router.push(`/my-nest/models/upload/${res.data}/upload-files`);
      })
      .catch((err) => {
        console.log("Err", err);
      });
  };

  useEffect(() => {
    // TODO add get models handler
    const resData = [
      {
        id: "1",
        bannerImageUrl: "/temp/banner.webp",
        modelName: "Articulated Baby Dragon",
        license: "IKN - P - 20",
        modelStatus: "status",
        date: "Fri Jan 01 2023",
        visibility: "private",
      },
      {
        id: "2",
        bannerImageUrl: "/temp/banner.webp",
        modelName: "Articulated Baby Dragon",
        license: "IKN - P - 20",
        modelStatus: "status",
        date: "Fri May 01 2023",
        visibility: "public",
      },
      {
        id: "3",
        bannerImageUrl: "/temp/banner.webp",
        modelName: "Articulated Baby Dragon",
        license: "CC",
        modelStatus: "status",
        date: "Fri Jun 01 2023",
        visibility: "private",
      },
      {
        id: "4",
        bannerImageUrl: "/temp/banner.webp",
        modelName: "Articulated Baby Dragon",
        license: "CC",
        modelStatus: "status",
        date: "Fri May 01 2023",
        visibility: "public",
      },
      {
        id: "5",
        bannerImageUrl: "/temp/banner.webp",
        modelName: "Articulated Baby Dragon",
        license: "CC",
        modelStatus: "status",
        date: "Fri Jun 01 2023",
        visibility: "private",
      },
      {
        id: "6",
        bannerImageUrl: "/temp/banner.webp",
        modelName: "Articulated Baby Dragon",
        license: "CC",
        modelStatus: "status",
        date: "Fri May 01 2023",
        visibility: "public",
      },
    ];
    // TODO: add license filter
    axios
      .get(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/models?status=${selectedFileFilter.value}&visibility=${selectedVisibilityFilter.value}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("Res", res);
        setModels(res.data);
        if (
          selectedFileFilter.value === "all" &&
          selectedVisibilityFilter.value === "all" &&
          selectedLicenseFilter.value === "all"
        ) {
          setFilterApplied(false);
        } else {
          setFilterApplied(true);
        }
        // console.log("hereeeeeeeeeeeeeee2", index, model.modelImages);
      })
      .catch((err) => {
        console.log("err", err);
        // console.log("error index", index);
      });
    // setModels(resData);
  }, [selectedFileFilter, selectedVisibilityFilter, selectedLicenseFilter]);

  return (
    <MyNestContentWithCreateButton
      empty={!filterApplied && models.length === 0}
      emptyImage={"/images/add photos.png"}
      emptyHeading={"Its too empty  here"}
      emptyText={"Fill the space up with your creations!"}
      handleCreate={handleModelUploadClick}
      createLinkText={"Upload New Model"}
      heading={"My Models"}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-[0.875rem] grow">
            <div className="flex items-center justify-center gap-2 border-[1px] rounded-[5px] bg-white h-10 px-4 py-[10px] grow max-w-[30rem] text-light-neutral-900 text-sm">
              <Image src="/SVG/Zoom_Search.svg" height={18} width={18} />
              <input
                type="text"
                placeholder="Search"
                className="grow rounded-r-sm focus:outline-none bg-transparent placeholder-gray-500 "
                // value={searchText}
                // onChange={(event) => setSearchText(event.target.value)}
              />
            </div>
            {/* <div className="flex gap-2">
              <span className="font-semibold">File:</span>
              <div>
                <Dropdown
                  value={selectedFileFilter}
                  options={fileOptions}
                  onChange={(value) => setSelectedFileFilter(value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Visibility:</span>
              <div>
                <Dropdown
                  value={selectedVisibilityFilter}
                  options={visibilityOptions}
                  onChange={(value) => setSelectedVisibilityFilter(value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">License:</span>
              <div>
                <Dropdown
                  value={selectedLicenseFilter}
                  options={licenseOptions}
                  onChange={(value) => setSelectedLicenseFilter(value)}
                />
              </div>
            </div> */}
          </div>
          {/* <div className="w-60">
            <Select
              options={sortOptions}
              // value={{
              //   label: selectedSortingFilter,
              //   value: selectedSortingFilter,
              // }}
              styles={singleSelect}
              instanceId={useId()}
              isSearchable={false}
              // onChange={(newSorting) =>
              //   setSelectedSortingFilter(newSorting.label)
              // }
            />
          </div> */}
        </div>
        <div className="grid grid-cols-5 gap-6">
          {models.map((model) => (
            <div key={model._id} className="w-full h-full">
              <MyModelCard
                id={model._id}
                coverImage={model.coverImage}
                modelName={model.modelName}
                license={model.license}
                approvalStatus={model.approvalStatus}
                date={model.updatedAt}
                visibility={model.visibility}
              />
            </div>
          ))}
        </div>
      </div>
    </MyNestContentWithCreateButton>
  );
};
export default DisplayModel;
