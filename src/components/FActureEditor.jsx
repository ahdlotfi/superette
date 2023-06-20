import {
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useReducer, useRef, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PeopleIcon from "@mui/icons-material/People";
import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";
import PrintIcon from "@mui/icons-material/Print";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Dlg from "../components/Dlg";
import Clients from "../pages/Clients";
import FacturePrinter from "./FacturePrinter";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function FActureEditor({ idFacture, onChange }) {
  const [state, dispatch] = useReducer(reducer, {
    lines: [],
    id: 0,
  });
  const [article, setArticle] = useState(null);
  const [qte, setQte] = useState(1);
  const [articles, setArticles] = useState([]);
  const [openClientChooser, setOpenClientChooser] = useState(false);
  const [openPrinter, setOpenPrinter] = useState(false);
  const qteRef = useRef();

  useEffect(() => {
    getData();
    if (idFacture) {
      loadFacture(idFacture);
    }
  }, [idFacture]);

  const getData = async (_) => {
    const res = await fetch("http://localhost:4000/articles/", {
      method: "get",
      mode: "cors",
      config: { headers: { "Access-Control-Allow-Origin": "*" } },
      responseType: "text",
    }).then((res) => res.json());
    setArticles(res.data);
  };

  const loadFacture = async (id) => {
    const res = await fetch("http://localhost:4000/factures/" + id, {
      method: "get",
      mode: "cors",
      config: { headers: { "Access-Control-Allow-Origin": "*" } },
      responseType: "text",
    }).then((res) => res.json());
    if (res.success) {
      dispatch({
        type: "INIT",
        payload: {
          ...res.data,
          lines: res.data.lines.map((e) => ({ ...e, type: "OLD" })),
        },
      });
    }
  };

  const handleChange = (event) => {
    setArticle(event.target.value);
    setTimeout(() => {
      qteRef.current.focus();
      qteRef.current.select();
    }, 200);
  };

  const addArticle = (_) => {
    console.log(article, qte);
    dispatch({ type: "ADD_ARTICLE", payload: { ...article, qte: qte } });
    setArticle(null);
    setQte(1);
  };

  const selectClient = (client) => {
    console.log(client);
    setOpenClientChooser(false);
    dispatch({ type: "SELECT_CLIENT", payload: client });
  };

  const handleSave = async (_) => {
    const commande = {
      id: state.id,
      id_client: state.client.id,
      lignes: state.lines.filter((e) => e.type !== "OLD"),
    };
    console.log(commande);
    const res = await fetch("http://localhost:4000/factures/", {
      method: state.id === 0 ? "post" : "put",
      mode: "cors",
      config: {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commande),
    }).then((res) => res.json());
    if (!res.success) {
      alert(res.message);
      return;
    }
    let id = idFacture || res.insertId;
    loadFacture(id);
  };

  const handleCloture = async (_) => {
    const resp = window.confirm("Clôturer cette commande ?");
    if (resp !== true) {
      return;
    }
    const commande = {
      operation: "CLOTURE",
      id: state.id,
      id_client: state.client.id,
      lignes: state.lines.filter((e) => e.type !== "OLD"),
    };
    const res = await fetch("http://localhost:4000/factures/", {
      method: "post",
      mode: "cors",
      config: {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commande),
    }).then((res) => res.json());
    if (!res.success) {
      alert(res.message);
      return;
    }
    onChange();
  };

  const handlePrint = () => {
    setOpenPrinter(true);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "70%",
        padding: 10,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={8}>
          <Stack spacing={2}>
            <Item style={{ minWidth: 350 }}>
              {state && state.etat !== "Clôturée" && (
                <Stack direction="row" spacing={2}>
                  <Box sx={{ minWidth: 320, mt: 1 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Article
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        margin="dense"
                        size="small"
                        value={article}
                        label={article ? article.designation : ""}
                        onChange={handleChange}
                      >
                        {articles.map((a) => (
                          <MenuItem key={a.id} value={a}>
                            {a.designation}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box style={{ minWidth: 150 }}>
                    <TextField
                      label="Qté"
                      inputRef={qteRef}
                      type="number"
                      margin="dense"
                      size="small"
                      value={qte}
                      disabled={!article}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addArticle();
                        }
                      }}
                      onChange={(e) => setQte(e.target.value)}
                      sx={{ m: 1, width: "25ch" }}
                    />
                  </Box>
                </Stack>
              )}
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
                    {state.lines.map((row) => (
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
            <Item>
              <div
                style={{ width: "100%", textAlign: "right", paddingRight: 50 }}
              >
                TOTAL :{" "}
                <b style={{ color: "red" }}>
                  {state.lines.reduce(
                    (acc, e) => acc + Number(e.qte) * Number(e.prix),
                    0
                  )}
                </b>
              </div>
            </Item>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Stack spacing={2}>
            <Item>
              <div style={{ width: "100%", textAlign: "center" }}>
                <b style={{ color: "green" }}>
                  {state.lines.reduce(
                    (acc, e) => acc + Number(e.qte) * Number(e.prix),
                    0
                  )}
                </b>
              </div>
              <Divider />
              <div style={{ width: "100%", textAlign: "center" }}>
                <IconButton
                  aria-label="save"
                  disabled={
                    !state ||
                    !state.changed ||
                    !state.client ||
                    state.lines.length === 0
                  }
                  onClick={handleSave}
                  color="primary"
                >
                  <SaveIcon />
                </IconButton>
                <IconButton
                  aria-label="close"
                  disabled={
                    !state || state.changed || state.etat === "Clôturée"
                  }
                  onClick={handleCloture}
                  color="secondary"
                >
                  <LockIcon />
                </IconButton>
                <IconButton
                  aria-label="print"
                  disabled={state.etat !== "Clôturée"}
                  onClick={handlePrint}
                  color="secondary"
                >
                  <PrintIcon />
                </IconButton>
              </div>
            </Item>
            <Item>
              <IconButton
                aria-label="delete"
                onClick={(_) => setOpenClientChooser(true)}
                color="primary"
                disabled={state.etat === "Clôturée"}
              >
                <PeopleIcon />
              </IconButton>
              {state.client && (
                <div>
                  <h3>{state.client.nom}</h3>
                  <div>{state.client.solde}</div>
                </div>
              )}
            </Item>
          </Stack>
        </Grid>
      </Grid>

      {openClientChooser && (
        <Dlg
          title="test"
          open={openClientChooser}
          onClose={(_) => setOpenClientChooser(false)}
        >
          <Clients onSelect={selectClient} />
        </Dlg>
      )}
      {openPrinter && (
        <Dlg
          title="Impression"
          open={openPrinter}
          onClose={(_) => setOpenPrinter(false)}
        >
          <FacturePrinter facture={state} />
        </Dlg>
      )}
    </div>
  );
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "INIT":
      return payload;
    case "SELECT_CLIENT":
      return { ...state, client: payload, changed: true };
    case "ADD_ARTICLE":
      return addArticle(state, payload);
    default:
      return { ...state };
  }
};

const addArticle = (state, article) => {
  const exists =
    state.lines.filter((e) => e.id_article === article.id).length > 0;
  if (exists) {
    return {
      ...state,
      changed: true,
      lines: state.lines.map((e) => {
        if (e.id_article === article.id) {
          return {
            ...e,
            qte: Number(e.qte) + Number(article.qte),
            type: e.type === "OLD" ? "EDIT" : "NEW",
          };
        }
        return { ...e };
      }),
    };
  }
  return {
    ...state,
    lines: [
      ...state.lines,
      {
        id_facture: state.id,
        id_article: article.id,
        designation: article.designation,
        prix: article.prix,
        qte: article.qte,
        type: "NEW",
      },
    ],
    changed: true,
  };
};
