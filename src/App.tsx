import { BrowserRouter as Router,Routes, Route, Navigate} from 'react-router-dom';
import CreatePerson from './components/CreatePerson';
import OptimisticUpdate from './components/OptimisticUpdate';
import Person from './components/Person';
import PersonTodos from './components/PersonTodos';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate replace to="/optimistic" />} />
          <Route path="/person/:id" element={<Person />} />
          <Route path="/person/create/" element={<CreatePerson />} />
          <Route path="/persontodos" element={<PersonTodos />} />
          <Route path="optimistic" element={<OptimisticUpdate />} />
        </Routes>
      </Router>

  );
}

export default App;
