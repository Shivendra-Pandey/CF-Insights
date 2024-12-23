import Footer from './components/footer'
import Header from './components/header'
import Landing from './components/landing'
import Analyzer from './components/analyzer'
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';
function App() {
  return (
    <div className="">
      <Router>
        <Routes>
          <Route path='/' element={<Landing/>}></Route>
          <Route path = '/analyzer' element={<Analyzer/>}></Route>
       </Routes>
      </Router>
    </div>
  );
}

export default App;
