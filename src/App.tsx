import { BrowserRouter as Router,Routes, Route, Navigate} from 'react-router-dom';
import CreatePerson from './components/CreatePerson';
import Person from './components/Person';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate replace to="/person" />} />
          <Route path="/person/:id" element={<Person />} />
          <Route path="/person/create/" element={<CreatePerson />} />
        </Routes>
      </Router>

  );
}

export default App;
