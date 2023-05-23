import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Dlg from "../components/Dlg";
import FActureEditor from "../components/FActureEditor";

export default function Main() {
  const [data, setData] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const [openDlg, setOpenDlg] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async (_) => {
    const res = await fetch("http://localhost:4000/factures/", {
      method: "get",
      mode: "cors",
      config: { headers: { "Access-Control-Allow-Origin": "*" } },
      responseType: "text",
    }).then((res) => res.json());
    console.log(res);
    setData(res.data);
  };

  const showEdit = (row) => {
    console.log(row);
    setCurrentId(row.id);
    setOpenDlg(true);
  };

  return (
    <div>
      <h3>Liste des articles</h3>
      <IconButton
        color="secondary"
        aria-label="add"
        onClick={(_) => {
          setCurrentId(0);
          setOpenDlg(true);
        }}
      >
        <AddIcon />
      </IconButton>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Client</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.client}</TableCell>
                <TableCell align="right">{row.total}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    aria-label="edit"
                    onClick={(_) => showEdit(row)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {openDlg && (
        <Dlg
          title="Factures"
          fullScreen={true}
          open={openDlg}
          onClose={(_) => setOpenDlg(false)}
        >
          <FActureEditor
            id={currentId}
            onChange={(_) => {
              setOpenDlg(false);
              getData();
            }}
          />
        </Dlg>
      )}
    </div>
  );
}
