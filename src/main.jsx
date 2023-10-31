import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProviderWrapper } from './contexts/auth.context'
import { LoginModalProvider } from './contexts/loginModal.context'
import { SignupModalProvider } from './contexts/signupModal.context'
import { MessageModalProvider } from './contexts/messageModal.context'
import { SocketProvider } from './contexts/socket.context'
import { FeedRefreshProvider } from './contexts/postsRefresh.context';
import { ExchangeStatusProvider } from './contexts/exchangeStatus.context'


ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <AuthProviderWrapper>
      <ExchangeStatusProvider>
        <FeedRefreshProvider>
          <SocketProvider>
            <SignupModalProvider>
              <LoginModalProvider>
                <MessageModalProvider>
                  <React.StrictMode>
                    <App />
                  </React.StrictMode>
                </MessageModalProvider>
              </LoginModalProvider>
            </SignupModalProvider>
          </SocketProvider>
        </FeedRefreshProvider>
      </ExchangeStatusProvider>
    </AuthProviderWrapper >
  </Router>
)
