import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard.jsx'

import VenueList from './pages/VenueList';
import SignupPage from './pages/SignupPage';
import MyActivities from './pages/MyActivities';
import ProfilePage from './pages/ProfilePage';
import CreateActivities from "./pages/CreateActivities.jsx";
import CreateVenue from './pages/CreateVenue';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} >
                    <Route path="venues" element={<VenueList />} />
                    <Route path="signup" element={<SignupPage />} />
                    <Route path="my-activities" element={<MyActivities />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="create" element={<CreateActivities />} />
                    <Route path="createVenue" element={<CreateVenue />} />
                    <Route path="*" element={<div>请选择左侧菜单项</div>} />
                </Route>

            </Routes>
        </Router>
    )
}
