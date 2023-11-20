import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  Grid,
  Autocomplete,
} from "@mui/material";
import { setDoc, doc } from "@firebase/firestore";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Admin.scss";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../firebase";

const ViewEditPost = (props) => {
  const { onClose, open, object, onUpdate, flagView } = props;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [reactions, setReactions] = useState(0);
  const [tags, setTags] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [formError, setFormError] = useState(false);

  const user = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    if (object && object.object) {
      setTitle(object.object.Title);
      setBody(object.object.Body);
      setReactions(object.object.Reactions);
      setTags(object.object.Tags);
      setComments(object.object.Comments);
    }
  }, [object]);

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

  const handleAddComment = () => {
    setComments((prevComments) => [...prevComments, newComment]);
    setNewComment("");
  };

  const handleDeleteComment = (index) => {
    const updatedComments = [...comments];
    updatedComments.splice(index, 1);
    setComments(updatedComments);
  };

  const handleUpdate = async () => {
    const collectionRef = doc(db, "posts", object.object.id);

    try {
      const post = {
        id: object.object.id,
        Title: title,
        Body: body,
        User: user,
        Reactions: reactions,
        Tags: tags,
        Comments: comments,
      };
      await setDoc(collectionRef, post);
      toast.success("Updated!", { autoClose: 3000 });
      onUpdate(post);
    } catch (error) {
      toast.error("Something went wrong!", {
        autoClose: 3000,
      });
      console.log(error);
    }

    handleClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title || !body || !reactions || !tags.length || !comments.length) {
      setFormError(true);
      return;
    }
    handleUpdate();
    setFormError(false);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle style={{ textAlign: "center" }}>
        {flagView ? "View Post" : "Update Post"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
            <TextField
              label="Title"
              className="title-container"
              value={title}
              onChange={handleTitleChange}
              disabled={flagView}
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
              disabled={flagView}
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
              disabled={flagView}
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
              disabled={flagView}
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

          {!flagView && (
            <>
              <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
                <TextField
                  className="comment-container"
                  label="Comment"
                  autoComplete="off"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sx={{ marginLeft: 2, marginRight: 2 }}>
                <Button variant="outlined" onClick={handleAddComment}>
                  Add Comment
                </Button>
              </Grid>
            </>
          )}

          {comments.map((comment, index) => (
            <Grid
              item
              xs={12}
              key={index}
              sx={{ marginLeft: 2, marginRight: 2 }}
            >
              <TextField
                label={`Comment ${index + 1}`}
                value={comment}
                fullWidth
                disabled
              />
              {!flagView && (
                <Button onClick={() => handleDeleteComment(index)}>X</Button>
              )}
            </Grid>
          ))}

          {!flagView && formError && (
            <Grid item xs={12} justifyContent="flex-end">
              <p style={{ color: "red", textAlign: "center" }}>
                Fill all the required fields
              </p>
            </Grid>
          )}
          <Grid item xs={12} justifyContent="flex-end">
            <DialogActions>
              {flagView ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClose}
                >
                  Close
                </Button>
              ) : (
                <>
                  <Button onClick={handleClose}>Close</Button>
                  <Button type="submit" variant="contained" color="primary">
                    Save
                  </Button>
                </>
              )}
            </DialogActions>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </Dialog>
  );
};

export default ViewEditPost;
