import { PolicyList } from './components/PolicyList';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#003366' }}>
        <div className="container">
          <a className="navbar-brand text-white fw-bold" href="/">
            <span style={{ color: '#FF6B00' }}>✦</span> Seguros Bolívar
          </a>
        </div>
      </nav>
      <PolicyList />
    </div>
  );
}

export default App;