import React from "react";

export default function FactureTotal({ state }) {
  if (!state) return <div>Total : ***.**</div>;
  const total = state.lines.reduce(
    (acc, e) => acc + Number(e.prix) * Number(e.qte),
    0
  );
  return (
    <div style={{ width: "100%", textAlign: "right" }}>
      Total : <b>{total}</b>
    </div>
  );
}
