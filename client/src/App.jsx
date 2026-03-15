import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Page Imports
import Login from './pages/Login';
import Register from './pages/Register';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Chat from './pages/Chat';

const Home = () => <Navigate to="/jobs" replace />;

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <Navbar />
                    <div className="app-container">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/jobs" element={<JobList />} />
                            <Route path="/jobs/:id" element={<JobDetails />} />

                            <Route
                                path="/recruiter-dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                                        <RecruiterDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/candidate-dashboard"
                                element={
                                    <ProtectedRoute allowedRoles={['candidate']}>
                                        <CandidateDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/resume-analyzer"
                                element={
                                    <ProtectedRoute>
                                        <ResumeAnalyzer />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/analytics"
                                element={
                                    <ProtectedRoute>
                                        <Analytics />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/chat"
                                element={
                                    <ProtectedRoute>
                                        <Chat />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
