/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react';
import { useParams } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import Header from './Components/common/Header/Header';
import Footer from './Components/common/Footer/Footer';
import HomePage from './Pages/HomePage/HomePage';
import RegisterPage from './Pages/RegisterPage/RegisterPage';
import LoginPage from './Pages/LoginPage/LoginPage';
import UserDashboard from './Components/User/Dashboard/Dashboard';
import PrivateRoute from './Components/PrivateRoute';
import ElectionsList from './Components/election/ElectionLists/ElectionLists';
import AdminDashboard from './Components/admin/Dashboard/Dashboard';
import ManageElections from './Components/admin/ManageElections/ManageElections';
import ManageCandidates from './Components/admin/ManageCandidates/ManageCanadidates';
import ElectionDetails from './Components/User/ElectionDetails/ElectionDetails';
import ResultPage from './Components/results/ResultsPage';
import Dashboard from './Components/DashboardRoute';
import Profile from './Components/ProfilePage';
const App = () => {
  return (
    <AuthProvider>
      <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/user/dashboard" 
            element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/user/elections" 
            element={
              <PrivateRoute>
                <ElectionsList />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/manage-elections" 
            element={
              <PrivateRoute>
                <ManageElections />
              </PrivateRoute>
            } 
          />
          <Route 
            path='/admin/manage-candidates' 
            element={
              <PrivateRoute>
                <ManageCandidates />
              </PrivateRoute>
            } 
          />
          <Route 
            path='/admin/view-results' 
            element={
              <PrivateRoute>
                <ResultPage />
              </PrivateRoute>
            } 
          />
          
          <Route path="/elections/:electionId" element={<ElectionDetailsWrapper />} />
        </Routes>
      </main>
      <Footer />
    </Router>
    </AuthProvider>
  );
};

// Wrapper component to extract the electionId from the URL and pass it to ElectionDetails
const ElectionDetailsWrapper = () => {
  const { electionId } = useParams(); // Extract electionId from URL
  return <ElectionDetails electionId={electionId} />;
};

export default App;
