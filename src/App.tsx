import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import { Home } from './pages/home/Home';
import { ActivateUser } from './pages/auth/ActivateUser';
import { NotificationProvider } from './context/NotificationContext';
import { INotificationContainer } from './components/ui/notification/INotificationContainer';

function App() {
    return (
        <>
            <NotificationProvider>
                <Router>
                    <Routes>
                        <Route path="*" element={<Home />} />
                        <Route path="/app" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/auth/activate-user/:uid/:token/:activationKey" element={<ActivateUser />} />
                    </Routes>
                </Router>

                <INotificationContainer />
            </NotificationProvider>
        </>
    );
}

export default App;
