import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import React, { useEffect, useRef, useState } from "react";
import { TextField } from "@mui/material";

export default function ArticleChooser({ onSelect }) {
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState(null);
  const [qte, setQte] = useState(1);
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
      if (qteRef.current) {
        qteRef.current.select();
        qteRef.current.focus();
      }
    }, 200);
  };

  return (
    <div style={{ width: "100%", height: 50 }}>
      {!article && (
        <FormControl sx={{ m: 1, minWidth: 250 }} size="small">
          <InputLabel>Articles</InputLabel>
          <Select label="Age" onChange={handleChange}>
            {articles.map((e) => (
              <MenuItem value={e} key={e.id}>
                {e.designation}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {article && (
        <div>
          <h3>{article.designation}</h3>
          <TextField
            label="Size"
            inputRef={qteRef}
            type="number"
            value={qte}
            onChange={(e) => setQte(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && e.target.value) {
                onSelect({ ...article, qte: e.target.value });
                setArticle(null);
                setQte(1);
              }
            }}
            size="small"
          />
        </div>
      )}
    </div>
  );
}
