import React, { useState, useEffect } from "react";
import { collection, getDocs } from "@firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import PostCard from "./PostCard";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollection = collection(db, "posts");
      const postsSnapshot = await getDocs(postsCollection);
      const postsData = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  const handleCardClick = (post) => {
    navigate(`/post/${post.id}`, { state: { post } });
  };

  return (
    <div>
      <h2>Posts</h2>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onCardClick={handleCardClick} />
      ))}
    </div>
  );
};

export default Posts;
