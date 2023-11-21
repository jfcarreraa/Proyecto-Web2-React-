import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { collection, query, where, getDocs } from "@firebase/firestore";
import { db } from "../../firebase";
import "./style.scss";
const FullPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { post } = state;

  const goBack = () => {
    navigate("/");
  };

  const [openModal, setOpenModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [taggedPosts, setTaggedPosts] = useState([]);

  useEffect(() => {
    const fetchTaggedPosts = async () => {
      if (selectedTag) {
        const postsCollection = collection(db, "posts");
        const tagQuery = query(
          postsCollection,
          where("Tags", "array-contains", selectedTag)
        );
        const tagSnapshot = await getDocs(tagQuery);
        const tagPostsData = tagSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTaggedPosts(tagPostsData);
      }
    };

    fetchTaggedPosts();
  }, [selectedTag]);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedTag(null);
    setOpenModal(false);
  };

  return (
    <Box
      className="full-post-container"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
    >
      <Button
        variant="contained"
        color="primary"
        onClick={goBack}
        style={{ marginBottom: "1rem", marginTop: "1rem" }}
      >
        Go Back
      </Button>
      <div>
        <Typography variant="h4" gutterBottom>
          {post.Title}
        </Typography>
        <Typography variant="body1" paragraph>
          {post.Body}
        </Typography>
        <Typography variant="subtitle2" paragraph>
          Published by: {post.User.name} {post.User.lastName}
        </Typography>
        <Typography variant="body2" paragraph>
          Tags:{" "}
          {post.Tags.map((tag, index) => (
            <span
              key={index}
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
              {index < post.Tags.length - 1 && ", "}
            </span>
          ))}
        </Typography>
        <Typography variant="body2" paragraph>
          Reactions: {post.Reactions}
        </Typography>
        <Typography variant="body2" paragraph>
          Comments:
        </Typography>
        <ul>
          {post.Comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          Posts with Tag: {selectedTag}
          <Button
            onClick={handleCloseModal}
            style={{ position: "absolute", right: 8, top: 8 }}
          >
            X
          </Button>
        </DialogTitle>
        <DialogContent>
          <List>
            {taggedPosts.map((taggedPost) => (
              <ListItem key={taggedPost.id}>
                <ListItemText
                  primary={taggedPost.Title}
                  secondary={`Published by: ${taggedPost.User.name} ${taggedPost.User.lastName}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FullPost;
