import { Grid, Paper, Stack, TextField } from "@mui/material";
import React, { useEffect, useReducer, useRef, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function FActureEditor() {
  const [state, dispatch] = useReducer(reducer, {
    lines: [],
  });
  const [article, setArticle] = useState(null);
  const [qte, setQte] = useState(1);
  const [articles, setArticles] = useState([]);
  const qteRef = useRef();

  useEffect(() => {
    getData();
  }, []);

  const getData = async (_) => {
    const res = await fetch("http://localhost:4000/articles/", {
      method: "get",
      mode: "cors",
      config: { headers: { "Access-Control-Allow-Origin": "*" } },
      responseType: "text",
    }).then((res) => res.json());
    setArticles(res.data);
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

  return (
    <div
      style={{
        width: "100%",
        minHeight: "70%",
        padding: 10,
        border: "1px solid red",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={8} style={{ border: "1px solid blue" }}>
          <Stack spacing={2}>
            <Item style={{ minWidth: 350 }}>
              <Stack direction="row" spacing={2}>
                <Item>
                  <Box sx={{ minWidth: 320 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Article
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
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
                </Item>
                <Item style={{ minWidth: 150 }}>
                  <TextField
                    label="Qté"
                    inputRef={qteRef}
                    type="number"
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
                </Item>
              </Stack>
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
                        <TableCell align="right">***.***</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Item>
            <Item>Ligne Total</Item>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12} md={4} style={{ border: "1px solid green" }}>
          <Stack spacing={2}>
            <Item>Ecran Total</Item>
            <Item>Client</Item>
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "INIT":
      return payload;
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
      lines: state.lines.map((e) => {
        if (e.id_article === article.id) {
          return {
            ...e,
            qte: e.qte + article.qte,
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
        id_article: article.id,
        designation: article.designation,
        prix: article.prix,
        qte: article.qte,
      },
    ],
  };
};
