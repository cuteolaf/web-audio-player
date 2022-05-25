import * as React from "react";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AudioSepctrum from "react-audio-spectrum";
import download from "js-file-download";

export default function AudioPlayer({ item, open, handleClose }) {
  const [isDownloading, setDownloading] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const handleDownload = () => {
    if (item.filename) {
      setDownloading(true);
      fetch(item.filename)
        .then((resp) => resp.blob())
        .then(function (blob) {
          download(blob, `${item.title}.mp3`);
          setDownloading(false);
        });
    }

    handleClose();
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{item.title ?? "Title"}</DialogTitle>
      <DialogContent sx={{ minWidth: 320 }}>
        <div>
          <div style={{ position: "relative" }}>
            <AudioSepctrum
              id="audio-canvas"
              audioId={"audio_element"}
              capColor={"red"}
              capHeight={2}
              meterWidth={2}
              meterCount={512}
              meterColor={[
                { stop: 0, color: "#f00" },
                { stop: 0.5, color: "#0CD7FD" },
                { stop: 1, color: "red" },
              ]}
              gap={4}
              style={{ width: "100%" }}
            />
            {loading && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "32px 0",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 100,
                }}
              >
                <CircularProgress size={40} />
              </div>
            )}
          </div>
          <audio
            style={{ width: "100%" }}
            id="audio_element"
            src={item.filename}
            controls
            crossOrigin="anonymous"
            controlsList="nodownload"
            onLoadStart={() => {
              setLoading(true);
            }}
            onCanPlayThrough={(e) => {
              setLoading(false);
            }}
            autoPlay
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={isDownloading}
          variant="outlined"
          onClick={handleDownload}
        >
          {isDownloading && (
            <CircularProgress
              color="inherit"
              size="1.2rem"
              variant="indeterminate"
              sx={{
                marginRight: "10px",
              }}
            />
          )}
          Download
        </Button>
        <Button
          disabled={isDownloading}
          variant="contained"
          onClick={handleClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
