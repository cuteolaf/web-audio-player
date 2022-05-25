import * as React from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import AudioPlayer from "./AudioPlayer";
import AudioUploader from "./AudioUploader";

const columns = [
  { id: "no", label: "No", minWidth: 170 },
  { id: "title", label: "Title", minWidth: 100 },
  {
    id: "uploadedAt",
    label: "Uploaded at",
    minWidth: 70,
    align: "right",
  },
];

export default function AudioList({ audios }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [curItem, selectItem] = React.useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [playerVisible, showPlayer] = React.useState(false);
  const [uploaderVisible, showUploader] = React.useState(false);
  return (
    <>
      {/* Audio Player */}
      <AudioPlayer
        open={playerVisible}
        item={curItem}
        handleClose={() => {
          showPlayer(false);
        }}
      />
      <AudioUploader
        open={uploaderVisible}
        handleClose={() => {
          showUploader(false);
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minWidth: "600px",
        }}
      >
        <Button
          variant="contained"
          component="span"
          sx={{ alignSelf: "flex-end", textTransform: "none" }}
          onClick={() => {
            showUploader(true);
          }}
        >
          Upload
        </Button>
        <Paper
          sx={{
            width: "100%",
            overflow: "hidden",
          }}
        >
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id}>{column.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {audios
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={index}
                        onClick={() => {
                          selectItem(item);
                          showPlayer(true);
                        }}
                      >
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>
                          {moment(item.created_at).format(
                            "YYYY.MM.DD HH:mm:ss"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={audios.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </>
  );
}
