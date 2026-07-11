import type { Profile } from '../types/schema'

interface ProfileHeaderProps {
  profile: Profile
  onEdit: () => void
}

export function ProfileHeader({ profile, onEdit }: ProfileHeaderProps) {
  const links = Object.entries(profile.links ?? {}).filter(([, url]) => url)

  return (
    <header className="profile-header">
      <div className="profile-header-main">
        <h1>{profile.name}</h1>
        {profile.headline && <p className="profile-headline">{profile.headline}</p>}
        <p className="profile-meta">
          {[profile.location, profile.email].filter(Boolean).join(' · ')}
        </p>
        {links.length > 0 && (
          <p className="profile-links">
            {links.map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noreferrer">
                {label}
              </a>
            ))}
          </p>
        )}
        {profile.summary && <p className="profile-summary">{profile.summary}</p>}
        {profile.goals_summary && (
          <p className="profile-goals">
            <strong>Goals:</strong> {profile.goals_summary}
          </p>
        )}
      </div>
      <button type="button" className="btn-secondary" onClick={onEdit}>
        Edit profile
      </button>
    </header>
  )
}
