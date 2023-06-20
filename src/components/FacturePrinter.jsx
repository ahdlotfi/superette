import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
} from "@mui/material";
import React from "react";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function FacturePrinter({ facture }) {
  const print = () => {
    printPartOfPage("cmd-to-print");
  };

  return (
    <div style={{ minWidth: 450 }}>
      <Button onClick={print}>Imprimer</Button>
      <Stack id="cmd-to-print">
        <Item>
          <b>Client : </b>
          {facture.client.nom}
        </Item>
        <Item>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Désignation</TableCell>
                  <TableCell align="right">Qté</TableCell>
                  <TableCell align="right">Prix</TableCell>
                  <TableCell align="right">Montant</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {facture.lines.map((row) => (
                  <TableRow
                    key={row.id_article}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.designation}
                    </TableCell>
                    <TableCell align="right">{row.qte}</TableCell>
                    <TableCell align="right">{row.prix}</TableCell>
                    <TableCell align="right">
                      {Number(row.qte) * Number(row.prix)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Item>
      </Stack>
    </div>
  );
}

function printPartOfPage(elementId, uniqueIframeId = "ifmcontentstoprint") {
  const content = document.getElementById(elementId);
  let pri;
  if (document.getElementById(uniqueIframeId)) {
    pri = document.getElementById(uniqueIframeId).contentWindow;
  } else {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("title", uniqueIframeId);
    iframe.setAttribute("id", uniqueIframeId);
    iframe.setAttribute(
      "style",
      "height: 0px; width: 0px; position: absolute;"
    );
    document.body.appendChild(iframe);
    pri = iframe.contentWindow;
  }
  pri.document.open();
  pri.document.write(content.innerHTML);
  pri.document.close();
  pri.focus();
  pri.print();
}
