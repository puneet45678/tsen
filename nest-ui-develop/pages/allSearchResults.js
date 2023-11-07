import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeSearchResults } from "../store/searchSlice";
import axios from "axios";
import Image from "next/image";
import styled from '@emotion/styled';
import { conditionalExpression } from "@babel/types";


const Input = styled('input')`
  padding: 0.5rem;
  font-size: 1rem;
`;

const Select = styled('select')`
  padding: 0.5rem;
  font-size: 1rem;
  margin-left: 0.5rem;
`;

const AllSearchResults = () => {
  const dispatch = useDispatch();
  const searchSuggestions = useSelector((state) => state.search.searchResults);
  const searchWord = useSelector((state) => state.search.searchWord);
  const [pageNo, setPageNo] = useState(0);
  const [names, setNames] = useState();


  const getUserName = async (userId) => {
    const res = await axios.get(
      // http://localhost:8004/search?query=how
      `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/user?userid=${userId}`,
      { withCredentials: true }
    );

    return { "firstName": res.data.accountInformation.firstName, "lastName": res.data.accountInformation.lastName }
  }


  useEffect(() => {
    (async function () {
      if (searchWord !== "") {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SEACH_SERVICE}/search?query=${searchWord}&index=campaign`
        );
        console.log("Dispatching search results", res.data.search_result.hits);
        dispatch(changeSearchResults(res.data.search_result.hits));
      }
    })();

    async function fetchData() {
      if (searchSuggestions && searchSuggestions.length) {
        const namePromises = searchSuggestions.map((suggestion) => {
          if (!suggestion.userId) {
            console.error("UserId is missing in suggestion", suggestion);
            return null;
          }

          return getUserName(suggestion.userId).catch((error) => {
            console.error(
              "Failed to fetch user name for userId",
              suggestion.userId,
              error
            );
            return null;
          });
        });

        const resolvedNames = await Promise.all(namePromises);
        console.log("Fetched user names", resolvedNames);
        setNames(resolvedNames);
      }
    }

    fetchData();
  }, []);


  const handleSort = () => {

  }

  return (
    <>
      <div className="flex flex-row m-8">
        Found {searchSuggestions.length} results for{" "}
        <span className=" font-bold px-1  ">{searchWord} </span> across Ikarus
        Nest
      </div>


      <div className="flex flex-row">
        <div className="flex w-[20%] mx-6">
          <div className="flex flex-col w-full border-2 p-4 ">
            <div className="flex flex-col">
              Filters By:-
            </div>
            <div className="flex flex-col">
              <div className="text-sm">
                Sort By price ...
                <select onChange={handleSort}>
                  <option value="asc">ASC</option>
                  <option value="desc">DESC</option>
                </select>
              </div>
              <div className="mt-2 text-sm">
                Sort By ending in ...
                <select onChange={handleSort}>
                  <option value="asc">ASC</option>
                  <option value="desc">DESC</option>
                </select>
              </div>

            </div>

          </div>

        </div>

        <div className="flex w-[80%]">
          <div className="flex flex-col mx-8 w-full border-2">

            {(typeof searchSuggestions !== "undefined" && typeof names !== "undefined") ? searchSuggestions.map((suggestion, index) => {
              console.log("suggestion", suggestion.story)
              // const name = await getUserName(suggestion.userId);
              // console.log("getUserName", getUserName(suggestion.userId))
              // console.log("firstName", name);
              console.log("description ", index, suggestion.story.description)
              // console.log("userNames", names[index].firstName)
              return (
                <div key={index} className=" hover:bg-gray-100 flex justify-between py-6 px-4 border-b-2"
                >
                  <div className=" w-full flex flex-row ">
                    <div className="flex flex-row">
                      <Image className="rounded-[5px]" src={suggestion.campaignAssets.campaignDp} alt="" width={100} height={100} />
                    </div>

                    <div className="flex flex-col">
                      <p className="text-xl  mt-2 mx-4" >{suggestion.basics.about.title}, <span className="text-sm">By {names[index].firstName}</span> </p>
                      <p className="text-sm mt-1 mx-4"></p>
                      <div className="prose mx-4 text-xs">
                        {suggestion.story.description !== "" ? ((suggestion.story.description).split('.')[0].trim()) : ""}
                        {/* {parse(suggestion.story.description)} */}
                      </div>
                    </div>
                  </div>


                  <div>
                    <button className="bg-primary-brand w-[150px] hover:bg-sky-500 rounded-sm h-[2rem] text-white">
                      View More
                    </button>
                  </div>

                </div>
              );
            }) : ""}

          </div>
        </div>


      </div>

      {/* <div className="mt-36 text-primary-brand flex flex-col justify-center"> */}


      {/* <div className="flex flex-col mx-auto h-40 w-96"> */}
      {/* {searchSuggestions.map((suggestion, index) => {
            console.log("suggestion", suggestion)
            return (
              <div key={index} className="pb-3 px-4 hover:bg-gray-100 flex justify-between"
              >
                <img src={suggestion.campaignAssets.campaignDp} alt="" />
                <p className="text-sm mt-2">{suggestion.basics.about.title}</p>
                <p className="text-sm mt-2">{suggestion.email}</p>
                <p className="text-sm mt-2">{suggestion.gender}</p>{" "}
              </div>
            );
          })} */}
      {/* </div> */}


      {/* </div> */}
      {/* <div className="flex w-16 mx-auto justify-between">
        <span className="cursor-pointer" onClick={() => setPageNo(pageNo - 1)}>{"< "}</span>
        <span>{pageNo}</span>
        <span className="cursor-pointer" onClick={() => setPageNo(pageNo + 1)}>{" >"}</span>
      </div> */}
    </>
  );
};

export default AllSearchResults;