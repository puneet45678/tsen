import React, { Fragment, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeTiersData, addTier, removeTier, updateTier } from '../store/campaignSlice';
import dynamic from 'next/dynamic';
import ImageSelector from './ImageSelector'
import { v1 as uuidv1 } from 'uuid';
import { useRouter } from 'next/router';
import axios from 'axios';


import {
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";


function Icon({ id, open }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${id === open ? "rotate-180" : ""
                } h-5 w-5 transition-transform`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    );
}


const EditorBlock = dynamic(() => import('./Editor'), {
    ssr: false,
});



export const TiersDataCompo = (props) => {
    const router = useRouter();
    const [showAlert, setShowAlert] = useState(false);
    const [uploadedImagesOnServer, setUploadedImagesOnServer] = useState();
    const dispatch = useDispatch();
    const [imageSelector, setImageSelector] = useState(false);
    const [itemData, setItemData] = useState({});
    // const [localTiers, setLocalTiers] = useState([]);
    const [itemDataObject, setItemDataObject] = useState({});
    const [backers, setBackers] = useState(false);
    const tiersDataSlice = useSelector((state) => state.campaign.tiers);
    const [checked, setChecked] = useState(false);
    const timestamp = Date.now();
    const tierId = uuidv1({ msecs: timestamp });
    const [tierAsset, setTierAsset] = useState();

    let temp = {
        tierData: {
            earlyBird: false,
            endingIn: 1,
            isBacker: false,
            tierTitle: "",
            numberOfBackers: 456,
            amount: 0,
            tierAsset: {},
            currency: "USD",
            raised: 46,
            tiersDescription: {}
        },
        tierId: tierId

    }

    const [items, setItems] = useState(typeof tiersDataSlice !== "undefined" ? tiersDataSlice : [temp]);


    const [tierDataInput, setTierDataInput] = useState({
        earlyBird: false,
        endingIn: 1,
        isBacker: false,
        tierTitle: "",
        numberOfBackers: 456,
        amount: 0,
        tierAsset: {},
        currency: "USD",
        raised: 46,
        tiersDescription: {}
    });

    const [open, setOpen] = useState(1);

    const handleOpen = (value) => {
        console.log("value ==> ", value);
        setOpen(open === value ? 0 : value);
    };

    const customAnimation = {
        mount: { scale: 1 },
        unmount: { scale: 0.9 },
    };

    const getImagesUrl = async () => {
        console.log("rouer query", props.campaignId);
        await axios.get(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/details`)
            .then(response => {
                setUploadedImagesOnServer(response.data.campaignAssets.campaignImages);
                console.log("result in metadata page", response.data.campaignAssets.campaignImages);
            })
            .catch(err => {
                // Handle errors
                console.error(err);
            });
    }

    // const itemsHandler = (e) => {
    //     let parentId = e.target.parentElement.id;
    //     //console.log(console.log("Pritish");
    //     //console.log(parentId);
    //     let temp = {};

    //     if (e.target.name == "itemTitle") {
    //         setItemData({ ...itemData, title: e.target.value });
    //         if (itemDataObject[parentId] === undefined || itemDataObject[parentId] === null) {
    //             temp = {
    //                 title: e.target.value,
    //                 quantity: null
    //             }
    //         } else {
    //             temp = itemDataObject[parentId];
    //             temp = { ...temp, title: e.target.value };
    //         }
    //         setItemDataObject({ ...itemDataObject, [parentId]: temp })
    //     }
    //     else if (e.target.name == "itemQuantity") {
    //         setItemData({ ...itemData, quantity: e.target.value });

    //         if (itemDataObject[parentId] === undefined || itemDataObject[parentId] === null) {
    //             temp = {
    //                 title: null,
    //                 quantity: e.target.value
    //             }
    //         } else {
    //             temp = itemDataObject[parentId];
    //             temp = { ...temp, quantity: e.target.value };
    //         }
    //         setItemDataObject({ ...itemDataObject, [parentId]: temp })
    //     }
    // }

    let tierCounter = 1;

    const isTierDataComplete = (tierData) => {

        console.log("tierData", tierData)
        // Add any required fields from the tierData object to this array
        const requiredFields = [
            // 'earlyBird',
            // 'endingIn',
            // 'isBacker',
            'tierTitle',
            // 'numberOfBackers',
            "amount",
            "currency",
            "tiersDescription",
            // "tierAsset"
        ];

        return requiredFields.every((field) => tierData[field]);
    };

    // const createANewTier = (tierId) => {
    //     axios.post(
    //         `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/tiers`,
    //         { tierId: tierId },
    //         {
    //             withCredentials: true,
    //         }
    //     )
    //         .then((res) => {
    //             console.log(res);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }
    const tiersAddHandler = (length) => {
        console.log("items", items)
        if (items.length === 0 || isTierDataComplete(items[items.length - 1].tierData)) {
            const timestamp = Date.now();
            const tierId = uuidv1({ msecs: timestamp });
            console.log("uuid", tierId);
            setOpen(items.length + 1)
            tierCounter += 1;
            console.log("tierCounter", tierCounter)
            let temp = {
                earlyBird: false,
                endingIn: 1,
                isBacker: false,
                tierTitle: "",
                numberOfBackers: 456,
                amount: 0,
                tierAsset: {},
                currency: "USD",
                raised: 46,
                tiersDescription: {}
            }

            const newTier = { tierId, tierData: temp, license: {} };
            // createANewTier(tierId);
            setItems([...items, newTier]);
            console.log(dispatch(addTier(newTier)));
            console.log("items", items);
        }
        else {
            setShowAlert(true);
            // alert("Please complete the details of the current tier before adding a new one.");
        }

        // let newArr = [   ...tiersDataSlice];
        // newArr[length - 1] = temp;
        // console.log(dispatch(changeTiersData(newArr)));
        // setItems(items.concat(1));

    }

    const inputHandler = (e, tierId) => {
        props.setSave(false);
        // console.log("State of save", props.save);
        let nam, val;
        nam = e.target.name;
        val = e.target.value;
        // console.log(dispatch(changeTiersData({ ...tiersDataSlice, [nam]: val })));
        // const { name, value } = e.target;

        // Update tierDataInput state
        setTierDataInput((prevState) => ({
            ...prevState,
            [nam]: val,
        }));

        // Dispatch updated tier data to Redux store
        console.log(dispatch(updateTier({ tierId, tierData: { ...tierDataInput, [nam]: val } })));

    }

    const removeCurrentTier = (tierId) => {
        tierCounter--;
        const updatedTiers = items.filter((tier) => tier.tierId !== tierId);
        console.log("After filtering localTiers:", updatedTiers);
        setItems(updatedTiers);
        dispatch(removeTier(tierId));
    }

    useEffect(() => {
        // tiersAddHandler();
        console.log("tierslice", tiersDataSlice, " items ", items, "tierData", tierDataInput);
    }, [tierDataInput]);

    return (
        <div className='flex justify-center mt-4 '>
            <div className='bg-white  md:ml-32 lg:ml-8  rounded-[2px] lg:pl-4 px-4 mb-2 w-full md:w-[65%]'>
                <div className='mt-7 text-base font-[550]'>Tiers</div>
                <div className='w-full mt-4 '>
                    {(typeof tiersDataSlice !== "undefined" ? tiersDataSlice : items).map((item, index) => {
                        console.log("item", tiersDataSlice[index].tierData.tierTitle, "index", index);
                        return (
                            <div className='' id={index} key={`Tier-${index}`}>
                                <Fragment>
                                    <div className={`${open === (index + 1) ? "border-[1.5px] border-accent1" : "border-0"} md:ml-6 mt-2 w-full px-2 md:px-0 md:w-[90%]`}>
                                        <Accordion open={open === (index + 1)} icon={<Icon id={index + 1} open={open} />} animate={customAnimation}>
                                            <div className={`${open === (index + 1) ? "border-0" : "border-2"} mt-2 px-4`}>
                                                <AccordionHeader onClick={() => handleOpen(index + 1)}>
                                                    <div className='text-base font-[450]'>
                                                        Tier {index + 1} - {item.tierId}
                                                    </div>
                                                </AccordionHeader>
                                            </div>
                                            <AccordionBody>
                                                <div className='px-4'>
                                                    <div className='flex items-center'>
                                                        <p className='text-sm font-[500]'>Is this tier early bird?</p>
                                                        <input type="checkbox" className='ml-3 bg-primary-brand hover:sbg-sky-500' name="earlyBird" onChange={(e) => {
                                                            console.log("true/false", e.target.checked, "item.tierId", item.tierId);
                                                            props.setSave(false);
                                                            setChecked(e.target.checked); console.log(dispatch(updateTier({ tierId: item.tierId, tierData: { ...tierDataInput, [e.target.name]: e.target.checked } })));
                                                        }} required defaultValue={tiersDataSlice !== undefined && tiersDataSlice[index].tierData.earlyBird !== undefined ? tiersDataSlice[index].tierData.earlyBird : ""} />
                                                    </div>
                                                    <div className={`${checked ? "w-[95%] mt-3 p-2" : "hidden"}`}>
                                                        <div className='flex'>
                                                            <p className='text-sm font-[500] mt-1 '>Ending in</p>
                                                            <input type="number" className='w-[4.75rem] h-[2rem] px-2 rounded-sm outline-none text-sm mx-3 border-[1.5px]' required name='endingIn' onChange={inputHandler} defaultValue={tiersDataSlice !== undefined && tiersDataSlice[index].tierData.endingIn !== undefined ? tiersDataSlice[index].tierData.endingIn : ""}></input>
                                                            <p className='text-sm mt-2 font-[500]'>days</p>
                                                        </div>
                                                        <div className='flex items-start mt-4'>
                                                            <p className='text-sm font-[500]'>Backers</p>
                                                            <div className='ml-6 w-full  rounded-sm px-1 pb-1'>
                                                                <div>
                                                                    <div className='flex flex-wrap mt-1'>
                                                                        <div className='text-black rounded-l-sm flex items-center'>
                                                                            <input className='' type="radio" required id="remixSharingYes" name="isBacker" onChange={() => { setBackers(true); console.log(dispatch(updateTier({ tierId, tierData: { ...tierDataInput, ["isBacker"]: true } }))); }} />
                                                                            <label htmlFor="remixSharingYes" className='text-xs'>Yes</label>
                                                                        </div>
                                                                        <div className='text-black rounded-r-sm px-4 flex items-center'>
                                                                            <input className='' type="radio" required id="remixSharingNo" name="isBacker" onChange={() => { console.log("ewfbwf"); setBackers(false); console.log(dispatch(updateTier({ tierId, tierData: { ...tierDataInput, ["isBacker"]: false } }))); }} />
                                                                            <label htmlFor="remixSharingNo" className='text-xs'>No</label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className={`${backers ? "mt-2 flex flex-col-reverse" : "hidden"}`}>
                                                                    {/* <input className={`w-[43.5%] h-[2rem] mt-1 px-2 rounded-sm border-[1.5px] text-sm peer outline-none`} required id="Number" type="number" name="numberOfBackers" defaultValue={tiersDataSlice !== undefined && tiersDataSlice.numberOfBackers !== undefined ? tiersDataSlice.numberOfBackers : ""} onChange={inputHandler}></input> */}

                                                                    <input className={`w-[43.5%] h-[2rem] mt-1 px-2 rounded-sm border-[1.5px] text-sm peer outline-none`} required id="Number" type="number" name="numberOfBackers" onChange={(e) => inputHandler(e, item.tierId)}></input>
                                                                    <p className='text-sm font-[500] peer-disabled:text-gray-400'>Number</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='mt-4 w-[80%] md:w-[70%] mx-6'>
                                                    <p className='mb-1 sm:mb-2 text-sm font-[500]'>Title</p>
                                                    {/* <input className={`w-[95%] h-[2rem] sm:w-full mr-2 rounded-sm border-[1.5px] px-2 py-1 focus:ring-1 focus:ring-primary-brand outline-none`} id="tierTitle" required type="text" name="tierTitle" defaultValue={tierSlice2 !== undefined && item.tierData.tierTitle !== undefined ? item.tierData.tierTitle : ""} onChange={(e) => inputHandler(e, item.tierId)}></input> */}
                                                    <input className={`w-[95%] h-[2rem] sm:w-full mr-2 rounded-sm border-[1.5px] px-2 py-1 focus:ring-1 focus:ring-primary-brand outline-none`} id="tierTitle" required type="text" name="tierTitle" defaultValue={tiersDataSlice !== undefined && tiersDataSlice[index].tierData.tierTitle !== undefined ? tiersDataSlice[index].tierData.tierTitle : ""} onChange={(e) => inputHandler(e, item.tierId)}></input>
                                                </div>
                                                <div className='mt-4 w-[80%] md:w-[70%] mx-6'>
                                                    <p className='mb-1 sm:mb-2 text-sm font-[500]'>Amount</p>
                                                    <div className='flex'>
                                                        <input className={`w-[65%] h-[2rem] sm:w-full mr-2 rounded-sm border-[1.5px] px-2 py-1 focus:ring-1 focus:ring-primary-brand outline-none`} required id="amount" type="number" name="amount" defaultValue={tiersDataSlice !== undefined && tiersDataSlice[index].tierData.amount !== undefined ? tiersDataSlice[index].tierData.amount : ""} onChange={(e) => inputHandler(e, item.tierId)}></input>
                                                        <select id="primaryCategory" className='focus:outline-none w-[28%] rounded-sm border-[1.5px] text-black text-center' value={tierDataInput.currency} name='currency' onChange={(e) => inputHandler(e, item.tierId)}>
                                                            <option value="USD">USD</option>
                                                            <option value="INR">INR</option>
                                                            <option value="YEN">YEN</option>
                                                            <option value="YEN">EUR</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className='mt-4 w-[75%] md:w-[70%] mx-6'>
                                                    <p className='mb-1 sm:mb-2 text-sm font-[500]'>Tier Image</p>
                                                    {/* <input className={`w-[95%] h-[2rem] sm:w-full rounded-sm border-[1.5px] px-2 py-1 outline-none`} id="image" type="text" name="image" onChange={inputHandler}></input> */}
                                                    {/* <div className='h-[150px] flex relative'> */}
                                                    <div className='w-[80%] mb-2'>
                                                        <button className='bg-primary-brand hover:bg-sky-500 px-6 py-1 md:py-2 text-xs lg:text-sm text-white rounded-sm  max-h-[2.5rem]' onClick={() => { setImageSelector(true); console.log("imageSelector", imageSelector); getImagesUrl(); }}>Select Image</button>
                                                        <p className='mt-1'>{tiersDataSlice[index].tierData.tierAsset.fileName}</p>
                                                    </div>
                                                    {(imageSelector && uploadedImagesOnServer !== undefined) ? <ImageSelector tierDataInput={tierDataInput} setTierDataInput={setTierDataInput} campaignId={props.campaignId} setSave={props.setSave} tierId={item.tierId} uploadedImagesOnServer={uploadedImagesOnServer} imageSelector={imageSelector} setImageSelector={setImageSelector} buttonName={"Set as Tier Image"} metaCompo={false} tierCompo={true} tierAsset={tierAsset} setTierAsset={setTierAsset} /> : ""}

                                                    {/* <UploadAndDisplayImage id="tierPic" usage="displayPic" aspect={1 / 1} borderRadius="2px" /> */}
                                                    {/* </div> */}
                                                </div>
                                                <div className='mt-2 mb-4 sm:mt-4 w-[75%] md:[70%] mx-6'>
                                                    <p className='mb-1 sm:mb-2 text-sm font-[500]'>Description</p>
                                                    <div className='px-2 w-full min-h-[108px] border-2 border-gray-200 bg-white rounded-[2px] mt-4'>
                                                        <div className="p-4 ">
                                                            <EditorBlock holder={"editorjs-container"}
                                                                // data={tiersDataSlice !== undefined && tiersDataSlice.tiersDescription !== undefined ? tiersDataSlice.tiersDescription : ""}
                                                                show={true}
                                                                name="tiersDescription"
                                                                onChange={(value) => {
                                                                    // inputHandler(e, item.tierId)
                                                                    props.setSave(false);
                                                                    let tierId = item.tierId;
                                                                    console.log(dispatch(updateTier({ tierId, tierData: { ...tierDataInput, tiersDescription: value } })));

                                                                    // dispatch(changeTiersData({ ...tiersDataSlice, tiersDescription: value }));
                                                                }


                                                                } />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='mt-4 mb-4 justify-center w-[55%] flex-col px-4 ml-2'>
                                                    <button onClick={() => { removeCurrentTier(item.tierId); console.log("item>tierID", item.tierId) }}
                                                        className='bg-black text-white w-36 py-2 text-xs rounded-sm'>
                                                        - Remove Tier {index + 1}
                                                    </button>
                                                </div>
                                                {/* </div> */}
                                            </AccordionBody>
                                        </Accordion>
                                    </div>
                                </Fragment>
                            </div>
                        )
                    })}

                </div>

                {(showAlert === true) ? (
                    <>
                        <div>
                            <div className="fixed inset-0 flex justify-center opacity-75 bg-black z-40"></div>
                            <div className="fixed bottom-[50%] bg-white opacity-100 w-fit h-auto z-50 mx-auto left-0 right-0 rounded-sm">
                                <div className="flex flex-col justify-center">
                                    <div className="mt-4 mx-16" id="alert-message">
                                        Please complete the details of the current tier before adding a new one.
                                    </div>
                                    <div className="mt-7 mb-6 mx-auto flex flex-row justify-between gap-4">
                                        <div className="">
                                            <button
                                                className="w-[70px] text-sm  text-white py-1 bg-red-500 hover:bg-red-400 "
                                                onClick={() => {
                                                    setShowAlert(false);
                                                    console.log("okii pressed");
                                                }}
                                            >
                                                Ok
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <></>
                )}

                <div className='flex '>
                    <div className='mt-4 mb-4 justify-center w-[55%] flex-col'>
                        <button onClick={() => tiersAddHandler(items.length + 1)}
                            className='bg-primary-brand text-white w-36 py-2 text-xs rounded-sm'>
                            + Add New Tier
                        </button>
                    </div>
                    {/* <div className='mt-4 mb-4 justify-center w-[55%] flex-col'>
                        <button onClick={removeTier}
                            className='bg-primary-brand text-white w-36 py-2 text-xs rounded-sm'>
                            - Remove Tier
                        </button>
                    </div> */}
                </div>
            </div>

            <div className='w-[0%] lg:w-[45%]'></div>

        </div >



    )
}

export default TiersDataCompo














//add items wala section

{/* {items.length>0 && <div className="border-[1.5px] rounded-sm p-4 mt-20  w-[55%]">
                        <p className='mb-1 sm:mb-2 text-sm font-[500]'>Items</p>
                        <p className='mb-1 sm:mb-2 text-xs font-[500] text-secondary-text-paragraph-text'>Build out a list of what you're offering.</p>
                        <div className='flex justify-between px-2 pt-4'>
                            <p className='sm:w-[42%] text-sm'>Title</p>
                            <p className='sm:w-[42%] text-sm'>Quantity</p>
                        </div>
                        <div id="itemsParent">
                            { items.map((item, index)=>(                                 
                                <div className='rounded-sm mb-6 p-2 flex justify-between' key={index} id={index}>                                
                                    <input type="text" className='h-[2rem] sm:w-[55%] rounded-sm border-[1.5px] px-2 py-1 outline-none' name="itemTitle" onChange={itemsHandler}></input>
                                    <input type="number" className='h-[2rem] sm:w-[25%] rounded-sm border-[1.5px] px-2 py-1 outline-none' name="itemQuantity" onChange={itemsHandler}></input>
                                    <button className='w-[15%] text-xs' onClick={removeItem} >remove</button>
                                </div>
                            ))
                            }   
                        </div>
                                            
                        console.log("splice", items.splice(0,1))                       
                    </div>}      */}

{/* <div className='mt-4 w-[55%]'>
                        <button onClick={()=>{
                                                if(showItems || func())
                                                    setItems(items.concat(1))
                                                setShowItems(false);
                                            }}
                                            
                                className='w-full text-secondary-text-icons-button-text bg-white rounded-sm border-[1.5px] text-sm py-2 mb-4'>
                                    + New item
                        </button>
                    </div>*/}