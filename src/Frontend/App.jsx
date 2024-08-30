import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './Sign Up Component/SignUp';
import Login from './Sign Up Component/Login';
import Header from './Header Component/Header';
import DataProvider from './DataProvider/DataProvider';
import ReactTalk from './ReactTalk Component/ReactTalk';
import Report from './Report Component/Report';
import Talk from './Talk Component/Talk';
import ProtectedRoute from './ProtectedRoute';
import CreateTalk from './Talk Component/CreateTalk';
import TalkDeleted from './TalkDeleted Component/TalkDeleted';
import Contact from './Contact Component/Contact';
import Profile from './Profile Component/Profile';
import SearchTalk from './Talk Component/SearchTalk';

function App() {
  return (
    <DataProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} /> {/* Redirect to SignUp by default */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/reacttalk"  element={
              <ProtectedRoute>
                <ReactTalk />
              </ProtectedRoute>
          } />

          <Route path="/report" element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
          } />

          <Route path="/talk" element={
              <ProtectedRoute>
                <Talk />
              </ProtectedRoute>
          } />

          <Route path="/createtalk" element={
              <ProtectedRoute>
                <CreateTalk />
              </ProtectedRoute>
          } />

          <Route path="/deletetalk" element={
              <ProtectedRoute>
                <TalkDeleted />
              </ProtectedRoute>
          } />

          <Route path="/contact" element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
          } />

          <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
          } />

          <Route path="/search" element={
              <ProtectedRoute>
                <SearchTalk />
              </ProtectedRoute>
          } />

          {/* if you want to add routes, put them below this comment but not below the '*' route otherwise they might not get caught */}

          <Route path="*" element={
              <ProtectedRoute>
                <ReactTalk />
              </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;