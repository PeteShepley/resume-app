/**
 * Zod schemas — one per entity, field-for-field mirrors of resume-api's
 * Pydantic models (resume_api/models.py in the sibling repo). Keep these two
 * in sync by hand; there's no codegen path from Pydantic to Zod.
 */
import { z } from 'zod'
import type { Profile, ProfileInput } from '../types/schema'

/** Empty strings from optional text inputs become undefined, so resume-api
 * sees an absent field rather than "". */
const optionalText = z
  .string()
  .optional()
  .transform((value) => (value?.trim() ? value.trim() : undefined))

const requiredText = z.string().trim().min(1, 'Required')

/** HTML date inputs already produce YYYY-MM-DD, which is exactly the ISO
 * date format resume-api's Pydantic `date` fields expect. */
const requiredDate = z.string().min(1, 'Required')
const optionalDate = optionalText

export const employmentTypes = ['full-time', 'part-time', 'contract', 'internship', 'self-employed'] as const
export const skillCategories = ['language', 'framework', 'tool', 'soft-skill'] as const
export const proficiencies = ['beginner', 'intermediate', 'advanced', 'expert'] as const
export const certificationTypes = ['professional', 'personal'] as const
export const goalCategories = ['career', 'personal', 'learning'] as const
export const goalStatuses = ['active', 'achieved', 'abandoned'] as const

export const profileSchema = z.object({
  name: requiredText,
  headline: optionalText,
  summary: optionalText,
  location: optionalText,
  email: optionalText,
  linkedin: optionalText,
  github: optionalText,
  site: optionalText,
  goals_summary: optionalText,
})
export type ProfileFormValues = z.infer<typeof profileSchema>

export const experienceSchema = z.object({
  organization: requiredText,
  title: requiredText,
  location: optionalText,
  employment_type: z.enum(employmentTypes).optional(),
  start_date: requiredDate,
  end_date: optionalDate,
  responsibilities: z.array(z.string()).default([]),
  accomplishments: z.array(z.string()).default([]),
})
export type ExperienceFormValues = z.infer<typeof experienceSchema>

export const educationSchema = z.object({
  institution: requiredText,
  degree: requiredText,
  field_of_study: optionalText,
  location: optionalText,
  start_date: requiredDate,
  end_date: optionalDate,
  gpa: optionalText,
  honors: optionalText,
  activities: optionalText,
})
export type EducationFormValues = z.infer<typeof educationSchema>

export const skillSchema = z.object({
  name: requiredText,
  category: z.enum(skillCategories),
  proficiency: z.enum(proficiencies).optional(),
  // Kept as a string here (the raw <input type="number"> value) — converted
  // to a number only when building the API request body, so the form's
  // field-value type doesn't diverge from what defaultValues/register expect.
  years_experience: z.string().optional(),
})
export type SkillFormValues = z.infer<typeof skillSchema>

export const certificationSchema = z.object({
  name: requiredText,
  issuing_organization: requiredText,
  issue_date: requiredDate,
  expiration_date: optionalDate,
  credential_id: optionalText,
  credential_url: optionalText,
  type: z.enum(certificationTypes).default('professional'),
})
export type CertificationFormValues = z.infer<typeof certificationSchema>

export const hobbySchema = z.object({
  name: requiredText,
  description: optionalText,
})
export type HobbyFormValues = z.infer<typeof hobbySchema>

export const goalSchema = z.object({
  description: requiredText,
  category: z.enum(goalCategories),
  target_date: optionalDate,
  status: z.enum(goalStatuses).default('active'),
})
export type GoalFormValues = z.infer<typeof goalSchema>

/** Profile.links is an open dict[str,str] on the API side; the form only
 * exposes the three conventional keys the design doc calls out
 * (LinkedIn/GitHub/site), flattened for a simpler form and reassembled here. */
export function profileFormValuesToInput(values: ProfileFormValues): ProfileInput {
  const links: Record<string, string> = {}
  if (values.linkedin) links.linkedin = values.linkedin
  if (values.github) links.github = values.github
  if (values.site) links.site = values.site

  return {
    name: values.name,
    headline: values.headline,
    summary: values.summary,
    location: values.location,
    email: values.email,
    links,
    goals_summary: values.goals_summary,
  }
}

export function profileToFormValues(profile: Profile): Partial<ProfileFormValues> {
  return {
    name: profile.name,
    headline: profile.headline ?? undefined,
    summary: profile.summary ?? undefined,
    location: profile.location ?? undefined,
    email: profile.email ?? undefined,
    linkedin: profile.links?.linkedin,
    github: profile.links?.github,
    site: profile.links?.site,
    goals_summary: profile.goals_summary ?? undefined,
  }
}
