import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "@firebase/firestore";
import { db } from "../../firebase";
import "./style.scss";

const FullPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { post } = state;

  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  const goBack = () => {
    navigate("/");
  };

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.Comments || []);

  const handleCommentSubmit = async () => {
    const updatedComments = [...comments, { body: newComment, user: userData }];

    const postDocRef = doc(db, "posts", post.id);
    await updateDoc(postDocRef, { Comments: updatedComments });

    setComments(updatedComments);
    setNewComment("");
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
              // You can keep or modify the handleTagClick function as needed
              onClick={() => console.log(`Clicked on tag: ${tag}`)}
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
        <List>
          {comments.map((comment, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${comment.user.name} ${comment.user.lastName}`}
                secondary={comment.body}
              />
            </ListItem>
          ))}
        </List>
        <TextField
          label="Add a Comment"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCommentSubmit}
        >
          Add Comment
        </Button>
      </div>
    </Box>
  );
};

export default FullPost;
