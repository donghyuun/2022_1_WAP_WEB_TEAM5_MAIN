//postPost 와 commentPost
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = [];

export const postPost = createAsyncThunk("post/post", async (dataToSubmit) => {
  const request = await axios
    .post("/api/post/post", dataToSubmit)
    .then((res) => res.data);

  return request;
});

export const commentPost = createAsyncThunk(
  "post/comment",
  async (dataToSubmit) => {
    const request = await axios
      .post("/api/post/comment", dataToSubmit)
      .then((res) => res.data);

    return request;
  }
);
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postPost.pending, (state) => {})
      .addCase(postPost.fulfilled, (state, action) => {
        return action.payload.postSuccess;
      })
      .addCase(postPost.rejected, (state) => {})
      .addCase(commentPost.pending, (state) => {})
      .addCase(commentPost.fulfilled, (state, action) => {
       return action.payload.postSuccess;
      })
      .addCase(commentPost.rejected, (state) => {});
  },
});

export default postSlice.reducer;
