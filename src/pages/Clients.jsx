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
import Dlg from "../components/Dlg";

export default function Clients({ onSelect }) {
  const [data, setData] = useState([]);
  const [openDlg, setOpenDlg] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async (_) => {
    const res = await fetch("http://localhost:4000/clients/", {
      method: "get",
      mode: "cors",
      config: { headers: { "Access-Control-Allow-Origin": "*" } },
      responseType: "text",
    }).then((res) => res.json());
    console.log(res);
    setData(res.data);
  };
  return (
    <div>
      <h3>Liste des clients</h3>
      {!onSelect && (
        <IconButton
          color="secondary"
          aria-label="add"
          onClick={(_) => setOpenDlg(true)}
        >
          <AddIcon />
        </IconButton>
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell align="right">Solde</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                onClick={(_) => {
                  if (onSelect) {
                    onSelect(row);
                  }
                }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.nom}</TableCell>
                <TableCell align="right">{row.solde}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {openDlg && (
        <Dlg title="test" open={openDlg} onClose={(_) => setOpenDlg(false)}>
          <Clients />
        </Dlg>
      )}
    </div>
  );
}
