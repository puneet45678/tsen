import { createSlice } from "@reduxjs/toolkit";

// const modelDefaultValue = {
//   files: {
//     glbFile: null,
//     modelFile: null,
//   },
//   pictures: [],
//   coverImage: "",
//   name: "",
//   category: null,
//   description: "",
//   tags: null,
//   amount: "",
//   license: { type: "", value: "" },
//   visibility: "private",
//   advanceInformation: {
//     printingInformation: "",
//     materialType: "",
//     materialQuantity: "",
//     dimensions: { length: "", width: "", depth: "" },
//     scale: { minimum: "", maximum: "" },
//     timetoPrint: { hours: "", minutes: "" },
//     support: false,
//     NSFW: false,
//     remixes: { value: false, links: [] },
//   },
// };

const modelDefaultValue = {
  modelName: "",
  coverImage: "",
  description: "",
  modelFileUrl: {
    glb: { name: "", status: "" },
    stl: { name: "", status: "" },
  },
  NSFW: false,
  price: null,
  printDetails: "",
  supportNeeded: false,
  category: "",
  dimensions: { modelLength: null, modelWidth: null, modelHeight: null },
  scale: { minScale: null, maxScale: null },
  timetoPrint: { hours: null, minutes: null },
  visibility: "private",
  printMaterial: "",
  materialQuantity: null,
  // license: { type: "", value: "" },
  modelImages: [],
  remixes: [],
  tags: [],
};

const modelSlice = createSlice({
  name: "model",
  initialState: modelDefaultValue,
  reducers: {
    clearModel: () => modelDefaultValue,
    setModel: (state, action) => {
      const {
        modelName,
        coverImage,
        description,
        modelFileUrl,
        NSFW,
        price,
        printDetails,
        supportNeeded,
        category,
        dimensions,
        scale,
        timetoPrint,
        visibility,
        printMaterial,
        materialQuantity,
        license,
        modelImages,
        remixes,
        tags,
      } = action.payload;
      return {
        modelName,
        coverImage,
        description,
        modelFileUrl: {
          stl: {
            name: modelFileUrl?.stl ? modelFileUrl?.stl : "",
            status: modelFileUrl?.stl ? "uploaded" : "",
          },
          glb: {
            name: modelFileUrl?.glb ? modelFileUrl?.glb : "",
            status: modelFileUrl?.glb ? "uploaded" : "",
          },
        },
        NSFW,
        price,
        printDetails,
        supportNeeded,
        category,
        dimensions,
        scale,
        timetoPrint,
        visibility: visibility ? visibility : "private",
        printMaterial,
        materialQuantity,
        license,
        modelImages,
        remixes,
        tags,
      };
    },
    changeGlbFile: (state, action) => {
      console.log("here glb", action.payload);
      return {
        ...state,
        modelFileUrl: {
          ...state.modelFileUrl,
          glb: action.payload,
        },
      };
    },
    changeGlbFileStatus: (state, action) => {
      console.log("here glb", action.payload);
      return {
        ...state,
        modelFileUrl: {
          ...state.modelFileUrl,
          glb: { ...state.modelFileUrl.glb, status: action.payload },
        },
      };
    },
    changeStlFile: (state, action) => {
      return {
        ...state,
        modelFileUrl: {
          ...state.modelFileUrl,
          stl: action.payload,
        },
      };
    },
    changeStlFileStatus: (state, action) => {
      return {
        ...state,
        modelFileUrl: {
          ...state.modelFileUrl,
          stl: { ...state.modelFileUrl.stl, status: action.payload },
        },
      };
    },
    changeModelPictures: (state, action) => {
      return { ...state, modelImages: action.payload };
    },
    changeModelPicture: (state, action) => {
      console.log("Action.payload", action.payload, "State", state);
      const currentState = { ...state };
      const { imageData, index } = action.payload;
      const images = state.modelImages;
      console.log(images);
      const newPicturesArray = [
        ...state.modelImages.slice(0, index),
        imageData,
        ...state.modelImages.slice(index + 1),
      ];
      console.log("currentState", currentState, newPicturesArray);
      return { ...state, modelImages: newPicturesArray };
      // return { ...state, modelImages: action.payload };
    },
    changeCoverImage: (state, action) => {
      return { ...state, coverImage: action.payload };
    },

    changeModelName: (state, action) => {
      return { ...state, modelName: action.payload };
    },
    changeModelCategory: (state, action) => {
      return { ...state, category: action.payload };
    },
    changeModelDescription: (state, action) => {
      return { ...state, description: action.payload };
    },
    changeModelTags: (state, action) => {
      return { ...state, tags: action.payload };
    },
    changeModelPrice: (state, action) => {
      return { ...state, price: action.payload };
    },
    changeModelLicenseType: (state, action) => {
      return { ...state, license: { type: action.payload, value: "" } };
    },
    changeModelLicenseValue: (state, action) => {
      return { ...state, license: { ...state.license, value: action.payload } };
    },
    changeModelVisibility: (state, action) => {
      return { ...state, visibility: action.payload };
    },
    changeModelPrintingInformation: (state, action) => {
      return {
        ...state,
        printDetails: action.payload,
      };
    },
    changeModelMaterialType: (state, action) => {
      return {
        ...state,
        printMaterial: action.payload,
      };
    },
    changeModelMaterialQuantity: (state, action) => {
      return {
        ...state,
        materialQuantity: action.payload,
      };
    },
    changeModelDimensionsLength: (state, action) => {
      return {
        ...state,
        dimensions: { ...state.dimensions, modelLength: action.payload },
      };
    },
    changeModelDimensionsWidth: (state, action) => {
      return {
        ...state,
        dimensions: { ...state.dimensions, modelWidth: action.payload },
      };
    },
    changeModelDimensionsDepth: (state, action) => {
      return {
        ...state,
        dimensions: { ...state.dimensions, modelHeight: action.payload },
      };
    },
    changeModelMinimumScale: (state, action) => {
      return {
        ...state,
        scale: { ...state.scale, minScale: action.payload },
      };
    },
    changeModelMaximumScale: (state, action) => {
      return {
        ...state,
        scale: { ...state.scale, maxScale: action.payload },
      };
    },
    changeModelHoursToPrint: (state, action) => {
      return {
        ...state,
        timetoPrint: { ...state.timetoPrint, hours: action.payload },
      };
    },
    changeModelMinutesToPrint: (state, action) => {
      return {
        ...state,
        timetoPrint: { ...state.timetoPrint, minutes: action.payload },
      };
    },
    changeModelSupportValue: (state, action) => {
      return {
        ...state,
        supportNeeded: action.payload,
      };
    },
    changeModelNSFWValue: (state, action) => {
      return {
        ...state,
        NSFW: action.payload,
      };
    },
    addRemixValues: (state, action) => {
      const newLinks = state?.remixes ? [...state.remixes] : [];
      newLinks.push(action.payload);
      return {
        ...state,
        remixes: newLinks,
      };
    },
    changeRemixImageUrl: (state, action) => {
      const { index, imageUrl } = action.payload;
      if (
        state?.remixes &&
        state.remixes.length > 0 &&
        state.remixes.length > index
      ) {
        return {
          ...state,
          remixes: [
            ...state.remixes.slice(0, index),
            { ...state.remixes[index], imageUrl: imageUrl },
            ...state.remixes.slice(index + 1),
          ],
        };
      }
    },
    deleteRemixValues: (state, action) => {
      const index = action.payload;
      if (
        state?.remixes &&
        state.remixes.length > 0 &&
        state.remixes.length > index
      ) {
        return {
          ...state,
          remixes: [
            ...state.remixes.slice(0, index),
            ...state.remixes.slice(index + 1),
          ],
        };
      }
    },
  },
});

export const {
  clearModel,
  setModel,
  changeGlbFile,
  changeStlFile,
  changeGlbFileStatus,
  changeStlFileStatus,
  changeModelPictures,
  changeModelPicture,
  changeCoverImage,
  changeModelName,
  changeModelCategory,
  changeModelDescription,
  changeModelTags,
  changeModelPrice,
  changeModelLicenseType,
  changeModelLicenseValue,
  changeModelVisibility,
  changeModelPrintingInformation,
  changeModelMaterialType,
  changeModelMaterialQuantity,
  changeModelDimensionsLength,
  changeModelDimensionsWidth,
  changeModelDimensionsDepth,
  changeModelMinimumScale,
  changeModelMaximumScale,
  changeModelHoursToPrint,
  changeModelMinutesToPrint,
  changeModelSupportValue,
  changeModelNSFWValue,
  addRemixValues,
  changeRemixImageUrl,
  deleteRemixValues,
} = modelSlice.actions;

export default modelSlice.reducer;
