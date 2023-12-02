import React, { useEffect, useState } from "react";
import {
  Modal,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
} from "@mui/material";
import { collection, query, where, getDocs } from "@firebase/firestore";
import { db } from "../../firebase";

const TagPostsModal = ({ selectedTag, onClose }) => {
  const [tagPosts, setTagPosts] = useState([]);

  useEffect(() => {
    const fetchTagPosts = async () => {
      try {
        const postsCollection = collection(db, "posts");
        const tagPostsQuery = query(
          postsCollection,
          where("Tags", "array-contains", selectedTag)
        );
        const tagPostsSnapshot = await getDocs(tagPostsQuery);
        const tagPostsData = tagPostsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTagPosts(tagPostsData);
      } catch (error) {
        console.error("Error fetching tag posts:", error);
      }
    };

    if (selectedTag) {
      fetchTagPosts();
    }
  }, [selectedTag]);

  return (
    <Modal open={!!selectedTag} onClose={onClose}>
      <Paper
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "1.5rem",
        }}
      >
        <Button
          onClick={onClose}
          style={{ position: "absolute", top: 0, right: 0 }}
        >
          X
        </Button>
        <Typography variant="h6" style={{ marginBottom: "1rem" }}>
          Posts with Tag: {selectedTag}
        </Typography>
        <List>
          {tagPosts.map((post) => (
            <ListItem key={post.id}>
              <ListItemText primary={post.Title} secondary={post.Body} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Modal>
  );
};

export default TagPostsModal;
