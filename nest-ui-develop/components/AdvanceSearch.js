import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { changeSearchResults, changeSearchWord } from "../store/searchSlice";
import { useRouter } from "next/router";

const AdvanceSearch = (props) => {
    const router = useRouter();
    const advanceSearchRef = useRef();
    const dispatch = useDispatch();
    const advanceSearchObj = { "has_words": "", "exact_match": "", "must_contain": "" }
    const [checkedOption, setCheckedOption] = useState('campaigns');
    const searchSuggestions = useSelector((state) => state.search.searchResults);


    //setAdvanceSearch disable if click outside the area
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (advanceSearchRef.current && !advanceSearchRef.current.contains(event.target)) {
                props.setAdvanceSearch(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInput = (event) => {
        var nam = event.target.name;
        var val = event.target.value;
        advanceSearchObj[nam] = val;
        console.log("advanceSearchObj", advanceSearchObj);
    }

    const handleSearch = async () => {
        // TODO to add a post call for sending this advanceSearchObj to backend for handling advanceSearch shown on allSearchPage

        await axios.post(
            `${process.env.NEXT_PUBLIC_SEACH_SERVICE}/advanced_search?index=${checkedOption}`,
            advanceSearchObj,
            {
                withCredentials: true,
            }
        )
            .then((res) => {
                console.log("response", res);
                console.log("res.data", res.data);
                console.log(dispatch(changeSearchResults(res.data.search_result.hits)));
                console.log(dispatch(changeSearchWord(advanceSearchObj.must_contain)));
                props.setAdvanceSearch(false);
                router.push("/allSearchResults");
            })
            .catch((err) => {
                console.log("error", err);
            });

    }

    useEffect(() => {
        console.log("checkedOption", checkedOption);
    }, [checkedOption])

    return (
        <>
            <div className=" absolute flex flex-col top-10 bg-white text-black w-full rounded-[5px] shadow-sm" ref={advanceSearchRef}>
                <div className="advanceSearchTitle pt-4 ">
                    <h1 className="text-center text-base font-medium">
                        Advance Search
                    </h1>
                </div>

                <div className="m-4" >
                    <div className="my-2">
                        <div>
                            <input type="checkbox" id="campaigns" name="campaigns" value="campaigns" checked={checkedOption === "campaigns"} onChange={(e) => setCheckedOption(e.target.value)} />
                            <label className="text-[#999999] text-sm" hmtlFor="campaigns"> Search in Campaigns</label>
                        </div>

                        <div>
                            <input type="checkbox" id="tags" name="tags" value="tags" checked={checkedOption === "tags"} onChange={(e) => setCheckedOption(e.target.value)} />
                            <label className="text-[#999999] text-sm" hmtlFor="tags"> Search in Tags</label>
                        </div>

                        <div>
                            <input type="checkbox" id="users" name="users" value="users" checked={checkedOption === "users"} onChange={(e) => setCheckedOption(e.target.value)} />
                            <label className="text-[#999999] text-sm" hmtlFor="users"> Search in Users</label>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm ">Search by word or phrase</p>
                        <div className="mt-4 ">
                            <p className="text-[#999999] text-xs">Has these words</p>
                            <input placeholder="Words To Search For" className={'w-full text-sm mt-2 h-[2rem] mr-2 rounded-[5px] border-[1.5px] px-2 py-1 focus:ring-1 focus:ring-primary-brand outline-none'} type="text" name='has_words' id="has_words" onChange={(e) => handleInput(e)}></input>
                        </div>

                        <div className="mt-4 ">
                            <p className="text-[#999999] text-xs">Exact Match</p>
                            <input placeholder="Word or phrase to match exactly" className={'w-full text-sm mt-2 h-[2rem] mr-2 rounded-[5px] border-[1.5px] px-2 py-1 focus:ring-1 focus:ring-primary-brand outline-none'} type="text" name='exact_match' id="exact_match" onChange={(e) => handleInput(e)}></input>
                        </div>

                        <div className="mt-4 ">
                            <p className="text-[#999999] text-xs">Must contain</p>
                            <input placeholder="Words To Require" className={'w-full text-sm mt-2 h-[2rem] mr-2 rounded-[5px] border-[1.5px] px-2 py-1 focus:ring-1 focus:ring-primary-brand outline-none'} type="text" name='must_contain' id="must_contain" onChange={(e) => handleInput(e)} ></input>
                        </div>


                    </div>


                </div>


                <div className="mx-auto mt-2 mb-4">
                    <button className="bg-primary-brand hover:bg-sky-500 w-[200px] rounded-sm h-full text-white" onClick={handleSearch}>
                        Search
                    </button>
                </div>
            </div>
        </>
    );
};
export default AdvanceSearch;