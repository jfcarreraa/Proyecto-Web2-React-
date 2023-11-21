import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import "./style.scss";

const PostCard = ({ post, onCardClick }) => {
  const handleCardClick = () => {
    onCardClick(post);
  };
  return (
    <Card className="card" onClick={handleCardClick}>
      <CardContent>
        <Typography className="title" variant="h5" component="div">
          {post.Title}
        </Typography>
        <Typography
          className="body"
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: "2rem", marginTop: "2rem" }}
        >
          {post.Body}
        </Typography>
        <Typography
          className="publisher"
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: "2rem" }}
        >
          Published by: {post.User.name} {post.User.lastName}
        </Typography>
        <Typography className="tags" variant="body2" color="text.secondary">
          Tags: {post.Tags.join(", ")}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PostCard;
