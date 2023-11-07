import { createSlice } from '@reduxjs/toolkit'

export const sectionSlice = createSlice({
  name: 'section',
  initialState: {
    section:"",
    menuClick:false
  },
  reducers: {  
    changeSection: (state, action) => {
      state.section = action.payload
    },
    changeMenuClick: (state, action) => {
      state.menuClick = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { changeSection, changeMenuClick } = sectionSlice.actions

export default sectionSlice.reducer