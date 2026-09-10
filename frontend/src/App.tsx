import { PolicyList } from './components/PolicyList';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav
        className="navbar navbar-expand-lg"
        style={{
          backgroundColor: '#003366',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          padding: '14px 0',
        }}
      >
        <div className="container">
          <a
            className="navbar-brand text-white fw-bold d-flex align-items-center gap-2"
            href="/"
            style={{ fontSize: '1.3rem', letterSpacing: '0.2px' }}
          >
            <img src="/seguros_bolivar.jpg" alt="Seguros Bolívar" width={30} height={30} />
            Seguros Bolívar
          </a>
        </div>
      </nav>
      <PolicyList />
    </div>
  );
}

export default App;
