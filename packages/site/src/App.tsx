import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from 'theme/default';
import 'toastr2/dist/toastr.min.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from 'components/pages/Home';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      {/* <HomePage /> */}
    </ThemeProvider>
  );
}

export default App;
