import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

export function LandingPage() {
  return (
    <>
      <SignedIn>
        <Navigate to="/resume" replace />
      </SignedIn>
      <SignedOut>
        <div className="landing">
          <div className="landing-hero">
            <h1>Your resume, always up to date.</h1>
            <p>
              resume-app is a focused editor for your resume data — profile, work experience,
              education, skills, certifications, hobbies, and goals — stored under your own account
              and always available as clean JSON or Markdown from resume-api. Edit it once, use it
              everywhere.
            </p>
            <SignInButton mode="modal">
              <button type="button" className="btn-primary btn-large">
                Get started
              </button>
            </SignInButton>
          </div>
          <ul className="landing-features">
            <li>
              <h3>One place for every section</h3>
              <p>
                Experience, education, skills, certifications, hobbies, and goals — each with its
                own quick-edit form.
              </p>
            </li>
            <li>
              <h3>Your data, your account</h3>
              <p>Signed in with Clerk. Every request is scoped to you — nobody else can see or edit your resume.</p>
            </li>
            <li>
              <h3>API-backed</h3>
              <p>
                Everything you enter here comes straight back out as JSON or Markdown from
                resume-api, ready for anything you build next.
              </p>
            </li>
          </ul>
        </div>
      </SignedOut>
    </>
  )
}
