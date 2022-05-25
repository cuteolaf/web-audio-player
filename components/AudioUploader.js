import React from "react";
import { CircularProgress, Input, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useRouter } from "next/router";

export default function AudioUploader({ open, handleClose }) {
  const [title, setTitle] = React.useState("");
  const [path, setPath] = React.useState("");
  const [isUploading, setUploading] = React.useState(false);
  const [audio, setAudioFile] = React.useState(null);
  const router = useRouter();

  React.useEffect(() => {
    setPath("");
  }, [open]);

  const isValidInput = () => {
    return title !== "" && path !== "";
  };

  const onUpload = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", audio);
    try {
      setUploading(true);
      const result = await fetch("/api/upload-audio", {
        method: "post",
        body: formData,
      });
      const { error } = await result.json();
      if (result.status !== 200) {
        throw new Error(error);
      }
      setUploading(false);
    } catch (err) {
      window.alert("Failed to upload audio!");
      console.log(err);
    } finally {
      handleClose();
      router.reload(window.location.pathname);
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} sx={{ minWidth: "600px" }}>
      <DialogTitle>Upload & Share your audio</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: "8px" }}
      >
        <DialogContentText>Title:</DialogContentText>
        <TextField
          fullWidth
          value={title}
          sx={{ height: "40px" }}
          size="small"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <DialogContentText>Choose audio file to upload</DialogContentText>
        <Input
          type="file"
          value={path}
          inputProps={{ accept: ".mp3, .wav" }}
          onChange={(e) => {
            setPath(e.target.value);
            setAudioFile(e.target.files[0]);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={isUploading || !isValidInput()}
          variant="outlined"
          sx={{ textTransform: "none" }}
          onClick={onUpload}
        >
          {isUploading && (
            <CircularProgress
              color="inherit"
              size="1.2rem"
              variant="indeterminate"
              sx={{
                marginRight: "10px",
              }}
            />
          )}
          Upload
        </Button>
        <Button
          variant="contained"
          sx={{ textTransform: "none" }}
          onClick={handleClose}
          disabled={isUploading}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
