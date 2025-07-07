import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { EnhancedNeighborhoodProvider } from './contexts/EnhancedNeighborhoodContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import EnhancedBrowse from './pages/EnhancedBrowse';
import Compare from './pages/Compare';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import NeighborhoodDetail from './pages/NeighborhoodDetail';
import SchoolsDetail from './pages/SchoolsDetail';
import NightlifeDetail from './pages/NightlifeDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EnhancedNeighborhoodProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/browse" element={<EnhancedBrowse />} />
                  <Route path="/neighborhood/:id" element={<NeighborhoodDetail />} />
                  <Route path="/schools/:id" element={<SchoolsDetail />} />
                  <Route path="/nightlife/:id" element={<NightlifeDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/compare" element={
                    <PrivateRoute>
                      <Compare />
                    </PrivateRoute>
                  } />
                  <Route path="/profile" element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } />
                  <Route path="/admin" element={
                    <PrivateRoute adminOnly>
                      <Admin />
                    </PrivateRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </EnhancedNeighborhoodProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;