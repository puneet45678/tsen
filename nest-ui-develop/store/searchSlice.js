import { createSlice } from '@reduxjs/toolkit'

export const searchSlice = createSlice({
  name: 'section',
  initialState: {
    searchResults:[],
    searchWord: "",
  },
  reducers: {  
    changeSearchResults: (state, action) => {
      state.searchResults = action.payload
    },
    changeSearchWord: (state, action) => {
        state.searchWord = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { changeSearchResults, changeSearchWord } = searchSlice.actions

export default searchSlice.reducer