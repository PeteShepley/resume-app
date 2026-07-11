import { useState } from 'react'
import { saveProfile } from '../api/mutations'
import { useApiToken } from '../api/useApiToken'
import { useResume } from '../api/useResume'
import { ErrorScreen } from '../components/ErrorScreen'
import { LoadingScreen } from '../components/LoadingScreen'
import { Modal } from '../components/Modal'
import { ProfileHeader } from '../components/ProfileHeader'
import { Section } from '../components/Section'
import { CertificationForm } from '../forms/CertificationForm'
import { EducationForm } from '../forms/EducationForm'
import { ExperienceForm } from '../forms/ExperienceForm'
import { GoalForm } from '../forms/GoalForm'
import { HobbyForm } from '../forms/HobbyForm'
import { ProfileForm } from '../forms/ProfileForm'
import {
  type CertificationFormValues,
  type EducationFormValues,
  type ExperienceFormValues,
  type GoalFormValues,
  type HobbyFormValues,
  type ProfileFormValues,
  type SkillFormValues,
  profileFormValuesToInput,
  profileToFormValues,
} from '../forms/schemas'
import { SkillForm } from '../forms/SkillForm'
import { formatDate, formatDateRange } from '../lib/format'
import type {
  Certification,
  CertificationInput,
  Education,
  EducationInput,
  Experience,
  ExperienceInput,
  Goal,
  GoalInput,
  Hobby,
  HobbyInput,
  Skill,
  SkillInput,
} from '../types/schema'

export function ResumePage() {
  const { resume, loading, error, refetch } = useResume()
  const getToken = useApiToken()
  const [editingProfile, setEditingProfile] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  if (error) return <ErrorScreen error={error} onRetry={refetch} />
  if (loading || !resume?.profile) return <LoadingScreen />

  const handleSaveProfile = async (values: ProfileFormValues) => {
    setSavingProfile(true)
    try {
      const token = await getToken()
      await saveProfile(token, profileFormValuesToInput(values))
      setEditingProfile(false)
      refetch()
    } finally {
      setSavingProfile(false)
    }
  }

  return (
    <div className="resume-page">
      <ProfileHeader profile={resume.profile} onEdit={() => setEditingProfile(true)} />

      <Section<Experience, ExperienceInput, ExperienceFormValues>
        title="Experience"
        items={resume.experience ?? []}
        entityPath="experience"
        Form={ExperienceForm}
        onChanged={refetch}
        renderItem={(item) => (
          <>
            <h3>
              {item.title} <span className="item-sub">· {item.organization}</span>
            </h3>
            <p className="item-meta">
              {[
                formatDateRange(item.start_date, item.end_date),
                item.location,
                item.employment_type,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
            {!!item.responsibilities?.length && (
              <ul className="item-detail-list">
                {item.responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            )}
            {!!item.accomplishments?.length && (
              <ul className="item-detail-list item-accomplishments">
                {item.accomplishments.map((accomplishment, index) => (
                  <li key={index}>{accomplishment}</li>
                ))}
              </ul>
            )}
          </>
        )}
        toDefaultValues={(item) => ({
          organization: item.organization,
          title: item.title,
          location: item.location ?? undefined,
          employment_type: item.employment_type,
          start_date: item.start_date,
          end_date: item.end_date ?? undefined,
          responsibilities: item.responsibilities ?? [],
          accomplishments: item.accomplishments ?? [],
        })}
        toInput={(values) => values}
      />

      <Section<Education, EducationInput, EducationFormValues>
        title="Education"
        items={resume.education ?? []}
        entityPath="education"
        Form={EducationForm}
        onChanged={refetch}
        renderItem={(item) => (
          <>
            <h3>
              {item.degree}
              {item.field_of_study ? `, ${item.field_of_study}` : ''}{' '}
              <span className="item-sub">· {item.institution}</span>
            </h3>
            <p className="item-meta">
              {[formatDateRange(item.start_date, item.end_date), item.location].filter(Boolean).join(' · ')}
            </p>
            {(item.gpa || item.honors) && (
              <p className="item-meta">{[item.gpa && `GPA: ${item.gpa}`, item.honors].filter(Boolean).join(' · ')}</p>
            )}
            {item.activities && <p>{item.activities}</p>}
          </>
        )}
        toDefaultValues={(item) => ({
          institution: item.institution,
          degree: item.degree,
          field_of_study: item.field_of_study ?? undefined,
          location: item.location ?? undefined,
          start_date: item.start_date,
          end_date: item.end_date ?? undefined,
          gpa: item.gpa ?? undefined,
          honors: item.honors ?? undefined,
          activities: item.activities ?? undefined,
        })}
        toInput={(values) => values}
      />

      <Section<Skill, SkillInput, SkillFormValues>
        title="Skills"
        items={resume.skills ?? []}
        entityPath="skills"
        Form={SkillForm}
        onChanged={refetch}
        renderItem={(item) => (
          <>
            <h3>{item.name}</h3>
            <p className="item-meta">
              {[item.category, item.proficiency, item.years_experience != null ? `${item.years_experience} yrs` : null]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </>
        )}
        toDefaultValues={(item) => ({
          name: item.name,
          category: item.category,
          proficiency: item.proficiency,
          years_experience: item.years_experience != null ? String(item.years_experience) : undefined,
        })}
        toInput={(values) => ({
          name: values.name,
          category: values.category,
          proficiency: values.proficiency,
          years_experience: values.years_experience?.trim() ? Number(values.years_experience) : undefined,
        })}
      />

      <Section<Certification, CertificationInput, CertificationFormValues>
        title="Certifications"
        items={resume.certifications ?? []}
        entityPath="certifications"
        Form={CertificationForm}
        onChanged={refetch}
        renderItem={(item) => (
          <>
            <h3>
              {item.name} <span className="item-sub">· {item.issuing_organization}</span>
            </h3>
            <p className="item-meta">
              {[
                `Issued ${formatDate(item.issue_date)}`,
                item.expiration_date ? `Expires ${formatDate(item.expiration_date)}` : null,
                item.type,
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
            {item.credential_url && (
              <a href={item.credential_url} target="_blank" rel="noreferrer">
                Credential
              </a>
            )}
          </>
        )}
        toDefaultValues={(item) => ({
          name: item.name,
          issuing_organization: item.issuing_organization,
          issue_date: item.issue_date,
          expiration_date: item.expiration_date ?? undefined,
          credential_id: item.credential_id ?? undefined,
          credential_url: item.credential_url ?? undefined,
          type: item.type,
        })}
        toInput={(values) => values}
      />

      <Section<Hobby, HobbyInput, HobbyFormValues>
        title="Hobbies"
        items={resume.hobbies ?? []}
        entityPath="hobbies"
        Form={HobbyForm}
        onChanged={refetch}
        renderItem={(item) => (
          <>
            <h3>{item.name}</h3>
            {item.description && <p>{item.description}</p>}
          </>
        )}
        toDefaultValues={(item) => ({
          name: item.name,
          description: item.description ?? undefined,
        })}
        toInput={(values) => values}
      />

      <Section<Goal, GoalInput, GoalFormValues>
        title="Goals"
        items={resume.goals ?? []}
        entityPath="goals"
        Form={GoalForm}
        onChanged={refetch}
        renderItem={(item) => (
          <>
            <h3>{item.description}</h3>
            <p className="item-meta">
              {[item.category, item.status, item.target_date ? `by ${formatDate(item.target_date)}` : null]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </>
        )}
        toDefaultValues={(item) => ({
          description: item.description,
          category: item.category,
          target_date: item.target_date ?? undefined,
          status: item.status,
        })}
        toInput={(values) => values}
      />

      {editingProfile && (
        <Modal title="Edit profile" onClose={() => setEditingProfile(false)}>
          <ProfileForm
            defaultValues={profileToFormValues(resume.profile)}
            onSubmit={handleSaveProfile}
            onCancel={() => setEditingProfile(false)}
            submitting={savingProfile}
          />
        </Modal>
      )}
    </div>
  )
}
