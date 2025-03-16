import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // השתמש ב-Routes במקום Switch
import Login from './components/Login'; // ייבוא הקומפוננטה


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* הוספת נתיבים אחרים כמו dashboard וכו' */}
      </Routes>
    </Router>
  );
};

export default App;
