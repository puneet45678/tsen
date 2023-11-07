import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
const timestamp = Date.now();
const faqId = uuidv4({ msecs: timestamp });
const tierId = uuidv4({ msecs: timestamp });
export const campaignSlice = createSlice({
  name: "campaign",
  initialState: {
        userId:"",
        createdOn:null,
        updatedOn:null,
        statusOfCampaign:"Draft",
        reviewIds:[],
        commentIds:[],
        updatedIds:[],
        likes:0,
        backers:[],
        likedBy:[],
        bookmarks:[],
        basics:{
            campaignTitle:"",
            category:"",
            tagline:"", 
            coverImage:"",           
            coverVideo:"",
            launchDate:new Date("Tue Jul 25 2069 10:40:13 GMT+0530 (India Standard Time)"),
            tags:[],
            endingOn:new Date("Tue Jul 25 2069 10:40:13 GMT+0530 (India Standard Time)"),
            metaTitle:'',
            metaDesc:'',
            metaImage:'',
            basicsImages:[]          
        },
        premarketing:{
            premarketingTitle:"",
            premarketingDp:null,
            premarketingVideo:null,
            premarketingDescription:"",
            isDescriptionSame:false,
        },
        rewardAndTier:[],
        milestone:[],
        story:{
            storyDescription:"",
            faqs:[],
        },
        updates:[]
  },
  reducers: {
    setAllData: (state, action) => {
      console.log('action.payload ', action.payload)
      return action.payload;
      // {...state, basics:action.payload.basics, premarketing:action.payload.premarketing, milestone:action.payload.milestone, 
      //   rewardAndTier:action.payload.rewardAndTier,
      //   story:action.payload.story,
      //   userId:action.payload.userId,
      //   createdOn:action.payload.createdOn,
      //   updatedOn:action.payload.updatedOn,
      //   statusOfCampaign:action.payload.statusOfCampaign,
      //   reviewIds:action.payload.reviewIds,
      //   commentIds:action.payload.commentIds,
      //   updatedIds:action.payload.updatedIds,
      //   likes:action.payload.likes,
      //   backers:action.payload.backers,
      //   likedBy:action.payload.likedBy,
      //   bookmarks:action.payload.bookmarks
      // }
      // );      
    },
    changeBasics: (state, action) => {  
      console.log("baahhhhhhhh ", action.payload)              
      return { ...state, basics: action.payload };
    },
    changeBasicsImages: (state, action) =>{      
      return { ...state, basics: { ...state.basics, basicsImages: [...action.payload] } };    
    },
    changeBasicsImage: (state, action) =>{      
      
      console.log("beeehhhh", action.payload)
      const { imageData, index } = action.payload;      
      const newPicturesArray = [
        ...state.basics.basicsImages.slice(0, index),
        imageData,
        ...state.basics.basicsImages.slice(index + 1),
      ];      
      return { ...state, basics: { ...state.basics, basicsImages: newPicturesArray } };    
    },
    changePreMarketing: (state, action) => {
      return { ...state, premarketing: action.payload }
    },
    changeBasicsAbout: (state, action) => {
      return { ...state, basics: { ...state.basics, about: action.payload } };
    },
    changeBasicsPrinting: (state, action) => {
      return {
        ...state,
        basics: { ...state.basics, printingDetails: action.payload },
      };
    },
    changeBasicsTags: (state, action) => {
      console.log("action.payload.tags", action.payload);
      
      return {
        ...state,
        basics: { ...state.basics, tags: action.payload },
      };
    },
    changeBasicsMetaData: (state, action) => {
      return {
        ...state,
        basics: { ...state.basics, metaData: action.payload },
      };
    },
    changeCampaignAssests: (state, action) => {
      console.log("action.payload", action.payload);
      return {
        ...state,
        campaignAssets: {
          ...state.campaignAssets,
          campaignImages: action.payload,
        },
      };
    },
    changeCampaignDp: (state, action) => {
      console.log("action.payload", action.payload);
      return {
        ...state,
        campaignAssets: { ...state.campaignAssets, campaignDp: action.payload },
      };
    },
    changeTierId: (state, action) => {
      return { ...state, tiers: { ...state.tiers, tierId: action.payload } };
    },
    changeTiersData: (state, action) => {
      return { ...state, rewardAndTier: action.payload };
    },
    changeMilestoneData: (state, action)=>{
      return { ...state, milestone: action.payload };
    },
    changeTierslicense: (state, action) => {
      return { ...state, tiers: { ...state.tiers, license: action.payload } };
    },
    addTier: (state, action) => {
      state.tiers = [...state.tiers, action.payload];
    },
    removeTier: (state, action) => {
      state.tiers = state.tiers.filter((tier) => tier.tierId !== action.payload);
    },
    updateTier: (state, action) => {
      const index = state.tiers.findIndex((tier) => tier.tierId === action.payload.tierId);
      if (index !== -1) {
        state.tiers[index] = action.payload;
      }
    },
    changeStoryData: (state, action) => {
      return {
        ...state,
        story: { ...state.story, storyDescription: action.payload },
      };
    },
    changeStoryFaqs: (state, action) => {            
      state.story = {...state.story, faqs: action.payload}
    },
    changeUpdates: (state, action) => {
      return { ...state, updates: action.payload };
    }
  },
});

export const {
  changeBasics,
  changeBasicsImage,
  changeBasicsImages,
  changeAboutDescription,
  changeStoryFaqs,
  changeTiersData,
  changeMilestoneData,
  changeStoryData,
  changePreMarketing,
  changeUpdates,
  setAllData,
  changeTierslicense,
  changeBasicsAbout,
  changeBasicsPrinting,
  changeBasicsTags,
  changeBasicsMetaData,
  changeCampaignAssests,
  changeCampaignDp,
  addTier,
  removeTier,
  updateTier
} = campaignSlice.actions;
export default campaignSlice.reducer;
