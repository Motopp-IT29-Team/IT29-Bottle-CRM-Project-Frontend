import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import { Home } from './pages/home/Home';
import { ActivateUser } from './pages/auth/ActivateUser';
import { NotificationProvider } from './components/ui/notification/NotificationContext';
import { INotificationContainer } from './components/ui';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';

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
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/auth/reset-password/:uidb64/:token" element={<ResetPassword />} />
                    </Routes>
                </Router>

                <INotificationContainer />
            </NotificationProvider>
        </>
    );
}

export default App;
