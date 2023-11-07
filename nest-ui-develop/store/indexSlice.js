import { createSlice } from '@reduxjs/toolkit'

export const indexSlice = createSlice({
  name: 'section',
  initialState: {
    index:0
  },
  reducers: {  
    changeIndex: (state, action) => {
      state.index += action.payload
    },
    resetIndex: (state, action) => {
        state.index = 0
    }
  },
})

// Action creators are generated for each case reducer function
export const { changeIndex, resetIndex } = indexSlice.actions

export default indexSlice.reducer