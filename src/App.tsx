import { SignedIn, UserButton } from '@clerk/clerk-react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { LandingPage } from './pages/LandingPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { ResumePage } from './pages/ResumePage'
import { RedirectIfHasProfile, RequireAuth, RequireProfile } from './routes/guards'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>resume-app</h1>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/onboarding"
            element={
              <RequireAuth>
                <RedirectIfHasProfile>
                  <OnboardingPage />
                </RedirectIfHasProfile>
              </RequireAuth>
            }
          />
          <Route
            path="/resume"
            element={
              <RequireAuth>
                <RequireProfile>
                  <ResumePage />
                </RequireProfile>
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
