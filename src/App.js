import { useState } from 'react';
import Articles from './pages/articles';
import Clients from './pages/Clients';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  const [page, setPage] = useState('AllArticles');

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={_ => setPage('AllArticles')}>Articles</button>
        <button onClick={_ => setPage('ArticleEdClientsitor')}>Clients</button>
      </div>
      {page === 'AllArticles' && <Articles />}
      {page === 'Clients' && <Clients />}
    </div>
  );
}

export default App;
