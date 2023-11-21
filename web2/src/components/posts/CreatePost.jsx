import React, { useState } from "react";

import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  Grid,
  Autocomplete,
} from "@mui/material";
import { collection, addDoc } from "@firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.scss";

const CreatePost = (props) => {
  const { onClose, open, onCreate } = props;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [reactions, setReactions] = useState(0);
  const [tags, setTags] = useState([]);
  const [formError, setFormError] = useState(false);

  const user = JSON.parse(localStorage.getItem("userData"));

  const handleClose = () => onClose();
  const handleTitleChange = (event) => setTitle(event.target.value);
  const handleBodyChange = (event) => setBody(event.target.value);
  const handleReactionsChange = (event) => setReactions(event.target.value);

  const [tagOptions, setTagOptions] = useState([
    "History",
    "American",
    "Crime",
    "French",
    "Fiction",
    "English",
    "Magical",
    "Love",
    "Classic",
    "Mystery",
  ]);

  const handleNewTag = (event, newValue) => {
    setTags(newValue);
    const lastTag = newValue[newValue.length - 1];
    if (!tagOptions.includes(lastTag)) {
      setTagOptions((prevOptions) => [...prevOptions, lastTag]);
    }
  };

  const handleCreate = async () => {
    const collectionRef = collection(db, "posts");
    try {
      const post = {
        Title: title,
        Body: body,
        User: user,
        Reactions: reactions,
        Tags: tags,
        Comments: [],
      };
      const docRef = await addDoc(collectionRef, post);
      post.id = docRef.id;
      onCreate(post);
      toast.success("Added successfully", {
        autoClose: 3000,
      });
      clearFields();
      handleClose();
    } catch (error) {
      toast.error("Something went wrong while adding", {
        autoClose: 3000,
      });
      console.log(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title || !body || !reactions || !tags.length) {
      setFormError(true);
      return;
    }
    handleCreate();
    setFormError(false);
  };
  const clearFields = () => {
    setTitle("");
    setBody("");
    setReactions(0);
    setTags([]);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: "center" }}>Add Post</DialogTitle>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              className="title-container"
              label="Title"
              autoComplete="off"
              value={title}
              fullWidth
              autoFocus
              onChange={handleTitleChange}
            />
          </Grid>

          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              className="body-container"
              label="Body"
              autoComplete="off"
              value={body}
              onChange={handleBodyChange}
              rows={6}
              fullWidth
              multiline
            />
          </Grid>

          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              className="reactions-container"
              label="Reactions"
              autoComplete="off"
              value={reactions}
              onChange={handleReactionsChange}
              type="number"
              InputProps={{
                inputProps: {
                  min: 0,
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <Autocomplete
              multiple
              className="tags-container"
              options={tagOptions}
              value={tags}
              onChange={handleNewTag}
              getOptionLabel={(option) => option || ""}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  className="tag-input"
                  label="Tags"
                  fullWidth
                />
              )}
            />
          </Grid>

          {formError && (
            <Grid item xs={12} justifyContent="flex-end">
              <p style={{ color: "red", textAlign: "center" }}>
                Fill all the required fields
              </p>
            </Grid>
          )}
          <Grid item xs={12} justifyContent="flex-end">
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </DialogActions>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </Dialog>
  );
};

export default CreatePost;
