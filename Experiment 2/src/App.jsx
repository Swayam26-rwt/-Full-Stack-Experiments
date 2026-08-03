import React, { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchPosts,
  addPost,
  deletePost,
  selectAllPosts,
  selectPopularPosts,
  selectShortPosts,
  selectTotalPosts,
  selectTotalLikes,
  selectPlatforms,
} from "./redux";

// Memoized component (Experiment 2.2)
const PostCard = memo(({ post, onDelete }) => {
  return (
    <div className="card">
      <h3>{post.title}</h3>

      <p>
        <strong>Platform:</strong> {post.platform}
      </p>

      <p>
        <strong>Likes:</strong> {post.likes}
      </p>

      <button onClick={() => onDelete(post.id)}>Delete</button>
    </div>
  );
});

function App() {
  const dispatch = useDispatch();

  const posts = useSelector(selectAllPosts);

  const popularPosts = useSelector(selectPopularPosts);

  const shortPosts = useSelector(selectShortPosts);

  const totalPosts = useSelector(selectTotalPosts);

  const totalLikes = useSelector(selectTotalLikes);

  const platforms = useSelector(selectPlatforms);

  const loading = useSelector((state) => state.posts.loading);

  const error = useSelector((state) => state.posts.error);

  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [likes, setLikes] = useState("");

  // Async Thunk
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  // Add Post
  const handleAdd = () => {
    if (!title || !likes) return;

    dispatch(
      addPost({
        id: Date.now(),
        title,
        platform,
        likes: Number(likes),
      })
    );

    setTitle("");
    setLikes("");
    setPlatform("Instagram");
  };

  // Delete Post
  const handleDelete = (id) => {
    dispatch(deletePost(id));
  };

  return (
    <div className="container">
      <h1>Redux Content Management System-swayam</h1>

      {loading && <h3>Loading Posts...</h3>}

      {error && <h3>{error}</h3>}

      {/* Add Post */}
      <div className="form">
        <h2>Add New Post</h2>

        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option>Instagram</option>
          <option>Facebook</option>
          <option>Twitter</option>
          <option>LinkedIn</option>
        </select>

        <input
          type="number"
          placeholder="Likes"
          value={likes}
          onChange={(e) => setLikes(e.target.value)}
        />

        <button onClick={handleAdd}>Add Post</button>
      </div>

      {/* Posts */}
      <h2>All Posts</h2>

      <div className="posts">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Analytics */}
      <div className="analytics">
        <h2>Analytics</h2>

        <p>
          <strong>Total Posts:</strong> {totalPosts}
        </p>

        <p>
          <strong>Total Likes:</strong> {totalLikes}
        </p>

        <p>
          <strong>Popular Posts:</strong> {popularPosts.length}
        </p>

        <p>
          <strong>Short Posts:</strong> {shortPosts.length}
        </p>

        <p>
          <strong>Platforms Used:</strong>
        </p>

        <ul>
          {platforms.map((platform) => (
            <li key={platform}>{platform}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
