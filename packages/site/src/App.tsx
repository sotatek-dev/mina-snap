import './App.css';
import GlobalStyle from 'theme/GlobalStyles';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from 'theme/default';
import 'toastr2/dist/toastr.min.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from 'components/pages/Home';
import CustomPage from 'components/pages/Custom';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/custom" element={<CustomPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      {/* <HomePage /> */}
    </ThemeProvider>
  );
}

export default App;
