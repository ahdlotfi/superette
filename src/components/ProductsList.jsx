import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Main({ state }) {
  if (!state) {
    return null;
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Désignation</TableCell>
            <TableCell align="right">Prix</TableCell>
            <TableCell align="right">Qté</TableCell>
            <TableCell align="right">Montant</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state.lines.map((row, index) => (
            <TableRow key={"row" + index}>
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell>{row.designation}</TableCell>
              <TableCell align="right">{row.prix}</TableCell>
              <TableCell align="right">{row.qte}</TableCell>
              <TableCell align="right">{Number(row.prix) * row.qte}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
