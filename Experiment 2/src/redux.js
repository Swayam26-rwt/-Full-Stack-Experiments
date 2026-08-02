import {
  configureStore,
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { createSelector } from "reselect";

// ==========================
// Entity Adapter
// ==========================
const postsAdapter = createEntityAdapter();

// ==========================
// Initial State
// ==========================
const initialState = postsAdapter.getInitialState({
  loading: false,
  error: null,
});

// ==========================
// Async Thunk
// ==========================
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        id: 1,
        title: "React Basics",
        platform: "Instagram",
        likes: 120,
      },
      {
        id: 2,
        title: "Redux Toolkit Guide",
        platform: "LinkedIn",
        likes: 210,
      },
      {
        id: 3,
        title: "AI Content Ideas",
        platform: "Twitter",
        likes: 75,
      },
    ];
  }
);

// ==========================
// Slice
// ==========================
const postsSlice = createSlice({
  name: "posts",

  initialState,

  reducers: {
    addPost: postsAdapter.addOne,

    updatePost: postsAdapter.updateOne,

    deletePost: postsAdapter.removeOne,
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        postsAdapter.setAll(state, action.payload);
      })

      .addCase(fetchPosts.rejected, (state) => {
        state.loading = false;
        state.error = "Unable to fetch posts";
      });
  },
});

// ==========================
// Actions
// ==========================
export const {
  addPost,
  updatePost,
  deletePost,
} = postsSlice.actions;

// ==========================
// Store
// ==========================
export const store = configureStore({
  reducer: {
    posts: postsSlice.reducer,
  },
});

// ==========================
// Entity Selectors
// ==========================
const entitySelectors = postsAdapter.getSelectors(
  (state) => state.posts
);

export const selectAllPosts = entitySelectors.selectAll;

// ==========================
// Memoized Selectors
// ==========================
export const selectPopularPosts = createSelector(
  [selectAllPosts],
  (posts) => posts.filter((post) => post.likes >= 100)
);

export const selectShortPosts = createSelector(
  [selectAllPosts],
  (posts) => posts.filter((post) => post.title.length < 15)
);

export const selectTotalPosts = createSelector(
  [selectAllPosts],
  (posts) => posts.length
);

export const selectTotalLikes = createSelector(
  [selectAllPosts],
  (posts) =>
    posts.reduce((sum, post) => sum + post.likes, 0)
);

export const selectPlatforms = createSelector(
  [selectAllPosts],
  (posts) => [...new Set(posts.map((p) => p.platform))]
);