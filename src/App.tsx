import {Route, Routes, BrowserRouter as Router} from "react-router-dom";
import {HomePage, NotFoundPage} from './features';
import Screens from './common/screens';
import LoginPage from "./features/auth";

function App() {
  return (
      <Router>
          <Routes>
              <Route path={Screens.LOGIN} element={<LoginPage />}/>
              <Route path={Screens.HOME} element={<HomePage/>}/>
              <Route path={Screens.NOT_FOUND} element={<NotFoundPage/>}/>
          </Routes>
      </Router>
  )
}

export default App
