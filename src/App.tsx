import { BrowserRouter as Router,Routes, Route, Navigate, Link} from 'react-router-dom';
import CreatePerson from './components/CreatePerson';
import OptimisticUpdate from './components/OptimisticUpdate';
import Person from './components/Person';
import PersonTodos from './components/PersonTodos';

function App() {
  return (
      <Router>
        <Link to="/persons/1">切换至/persons/1</Link>
        <br />
        <Link to="/person/create">切换至/person/create</Link>
        <br />
        <Link to="/persontodos">切换至/persontodos</Link>
        <br />
        <Link to="/optimistic">切换至/optimistic</Link>
        <br />        
      
        <Routes>
          <Route path="/" element={<Navigate replace to="/optimistic" />} />
          <Route path="/person/:id" element={<Person />} />
          <Route path="/person/create/" element={<CreatePerson />} />
          <Route path="/persontodos" element={<PersonTodos />} />
          <Route path="/optimistic" element={<OptimisticUpdate />} />
        </Routes>
      </Router>

  );
}

export default App;
