// BUG-12: Matching algorithm weights are incorrect
// Correct weights should be: roleType=50, experience=20, appsOverlap=10, skillsMatch=10
// Current (broken) weights: roleType=10, experience=0 (commented out), appsOverlap=20, skillsMatch=20

export interface ClientProfile {
  roleType: string
  hoursNeeded: number
  requiredApps: string[]
  requiredSkills: string[]
  yearsExpNeeded: number
}

export interface RtmProfile {
  id: string
  name: string
  roleType: string
  yearsExp: number
  skills: string[]
  coreApps: string[]
  bio: string
  availability: string
}

export interface MatchResult {
  profile: RtmProfile
  score: number
  breakdown: {
    roleTypeScore: number
    experienceScore: number
    appsScore: number
    skillsScore: number
  }
}

export function calculateMatchScore(
  client: ClientProfile,
  profile: RtmProfile
): MatchResult {
  let score = 0

  // BUG-12: roleType should be worth 50 points, not 10
  const roleTypeScore =
    profile.roleType.toLowerCase() === client.roleType.toLowerCase() ? 10 : 0
  score += roleTypeScore

  // BUG-12: experience score is commented out — should contribute 20 points
  // const expDiff = Math.abs(profile.yearsExp - client.yearsExpNeeded)
  // const experienceScore = Math.max(0, 20 - expDiff * 4)
  // score += experienceScore
  const experienceScore = 0

  // BUG-12: apps overlap should be capped at 10, not 20
  const matchedApps = profile.coreApps.filter((app) =>
    client.requiredApps.some(
      (req) => req.toLowerCase() === app.toLowerCase()
    )
  )
  const appsScore = Math.min(20, matchedApps.length * 5)
  score += appsScore

  // BUG-12: skills match should be capped at 10, not 20
  const matchedSkills = profile.skills.filter((skill) =>
    client.requiredSkills.some((req) =>
      skill.toLowerCase().includes(req.toLowerCase()) ||
      req.toLowerCase().includes(skill.toLowerCase())
    )
  )
  const skillsScore = Math.min(20, matchedSkills.length * 4)
  score += skillsScore

  return {
    profile,
    score: Math.min(100, score),
    breakdown: {
      roleTypeScore,
      experienceScore,
      appsScore,
      skillsScore,
    },
  }
}

export function rankProfiles(
  client: ClientProfile,
  profiles: RtmProfile[]
): MatchResult[] {
  return profiles
    .map((profile) => calculateMatchScore(client, profile))
    .sort((a, b) => b.score - a.score)
}
