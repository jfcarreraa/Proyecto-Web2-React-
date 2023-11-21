import React, { useState, useEffect } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import { Button, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, "posts");
        const postsSnapshot = await getDocs(postsCollection);
        const postsData = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        setError("Error fetching posts. Please try again later.");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCardClick = (post) => {
    navigate(`/post/${post.id}`, { state: { post } });
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <>
          <h2>{showMyPosts ? "My Posts" : "All Posts"}</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowMyPosts(!showMyPosts)}
            sx={{ marginBottom: "1rem" }}
          >
            Toggle
          </Button>
          <div style={{ marginBottom: "1rem" }}>
            <TextField
              type="text"
              placeholder="Search by title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          {posts
            .filter((post) =>
              showMyPosts ? post.User.id === userData.id : true
            )
            .filter((post) =>
              post.Title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onCardClick={handleCardClick}
              />
            ))}
        </>
      )}
    </div>
  );
};

export default Posts;
