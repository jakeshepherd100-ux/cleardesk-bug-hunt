import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed RTM Profiles
  const profiles = [
    {
      id: 'profile-1',
      name: 'Maria Santos',
      roleType: 'VA',
      yearsExp: 4,
      skills: ['Calendar management', 'Email triage', 'CRM data entry', 'Client follow-up', 'Report generation'],
      coreApps: ['Google Workspace', 'HubSpot', 'Slack', 'Hubstaff', 'Canva'],
      bio: 'Maria has supported real estate teams and home care agencies across scheduling and CRM work. Known for clean inbox management and proactive client follow-up.',
      availability: 'Immediate',
    },
    {
      id: 'profile-2',
      name: 'James Reyes',
      roleType: 'Scheduler',
      yearsExp: 6,
      skills: ['Appointment setting', 'Route optimization', 'Dispatch coordination', 'Client communication', 'Shift coverage'],
      coreApps: ['Google Calendar', 'Deputy Workforce', 'Tanda', 'Slack', 'Office 365'],
      bio: 'James has coordinated multi-crew dispatch for home services companies across three time zones. Specializes in high-volume scheduling environments.',
      availability: '2 weeks',
    },
    {
      id: 'profile-3',
      name: 'Ana Cruz',
      roleType: 'Recruiter',
      yearsExp: 3,
      skills: ['Candidate sourcing', 'Job posting', 'Resume screening', 'Interview coordination', 'ATS management'],
      coreApps: ['LinkedIn Recruiter', 'Bullhorn', 'JobAdder', 'HubSpot', 'Slack'],
      bio: 'Ana has sourced and screened candidates for staffing agencies and direct-hire clients. Strong pipeline management and ATS experience.',
      availability: 'Immediate',
    },
    {
      id: 'profile-4',
      name: 'Carlo Mendoza',
      roleType: 'Ops Support',
      yearsExp: 5,
      skills: ['SOP documentation', 'Process mapping', 'Vendor coordination', 'Data entry', 'Project tracking'],
      coreApps: ['Asana', 'Google Workspace', 'Slack', 'HubSpot', 'Hubstaff'],
      bio: 'Carlo builds and documents operational systems for scaling businesses. Has supported ops teams in home health care and professional services.',
      availability: '1 month',
    },
    {
      id: 'profile-5',
      name: 'Rina Villanueva',
      roleType: 'Bookkeeper',
      yearsExp: 7,
      skills: ['AR/AP', 'Bank reconciliation', 'Payroll support', 'Financial reporting', 'QuickBooks'],
      coreApps: ['QuickBooks', 'Xero', 'Google Sheets', 'Slack', 'HubSpot'],
      bio: 'Rina has managed full-cycle bookkeeping for small businesses and multi-location operators. Clean track record on monthly closes and audit prep.',
      availability: '2 weeks',
    },
    {
      id: 'profile-6',
      name: 'Paolo Lim',
      roleType: 'VA',
      yearsExp: 2,
      skills: ['Email management', 'Social media scheduling', 'Research', 'Data entry', 'Customer follow-up'],
      coreApps: ['Canva', 'Google Workspace', 'Buffer', 'Slack', 'Hubstaff'],
      bio: 'Paolo supports founders and small teams with day-to-day administrative and digital tasks. Quick learner with strong written communication.',
      availability: 'Immediate',
    },
    {
      id: 'profile-7',
      name: 'Sofia Dela Cruz',
      roleType: 'Scheduler',
      yearsExp: 4,
      skills: ['Multi-location scheduling', 'Client intake', 'Care coordinator support', 'Shift management'],
      coreApps: ['Tanda', 'Deputy Workforce', 'Google Calendar', 'Slack', 'Office 365'],
      bio: 'Sofia has coordinated scheduling for home health care agencies managing 20+ caregivers. Comfortable with last-minute shift changes and high communication volume.',
      availability: 'Immediate',
    },
    {
      id: 'profile-8',
      name: 'Mark Aquino',
      roleType: 'Recruiter',
      yearsExp: 8,
      skills: ['Executive search', 'Reverse marketing', 'Market mapping', 'Cold outreach', 'Pipeline management'],
      coreApps: ['LinkedIn Recruiter', 'Vincere', 'Bullhorn', 'HubSpot', 'Dialpad'],
      bio: 'Mark has led full-cycle recruitment for staffing firms and in-house talent teams. Strong in outbound sourcing and passive candidate engagement.',
      availability: '2 weeks',
    },
    {
      id: 'profile-9',
      name: 'Lea Bautista',
      roleType: 'Ops Support',
      yearsExp: 3,
      skills: ['CRM maintenance', 'Onboarding coordination', 'Internal reporting', 'Task management'],
      coreApps: ['HubSpot', 'Asana', 'Google Workspace', 'Slack', 'Hubstaff'],
      bio: 'Lea has supported CS and ops teams with CRM hygiene, onboarding workflows, and internal reporting. Detail-oriented with strong follow-through.',
      availability: '1 month',
    },
    {
      id: 'profile-10',
      name: 'Ramon Torres',
      roleType: 'Bookkeeper',
      yearsExp: 5,
      skills: ['Full-cycle bookkeeping', 'Tax prep support', 'Payroll', 'Client billing', 'Financial dashboards'],
      coreApps: ['QuickBooks', 'Xero', 'Google Sheets', 'FreshBooks', 'Slack'],
      bio: 'Ramon manages bookkeeping for professional services clients and multi-entity operators. Strong in financial dashboards and month-end close processes.',
      availability: '2 weeks',
    },
  ]

  for (const profile of profiles) {
    await prisma.rtmProfile.upsert({
      where: { id: profile.id },
      update: profile,
      create: profile,
    })
  }

  // Seed Bug Definitions
  const bugs = [
    {
      id: 'BUG-01',
      tier: 'easy',
      title: 'No form validation on Business Profiler',
      description: 'The Business Profiler form submits with empty required fields — no validation is enforced.',
      idealFixSummary: 'Add client-side required field validation before submission. Check that business name, industry, role type, and hours needed are all filled in. Show inline error messages and prevent form submission until all required fields are complete.',
      prerequisiteIds: [],
      points: 1,
    },
    {
      id: 'BUG-02',
      tier: 'easy',
      title: 'No confirmation state after form submission',
      description: 'After submitting the Business Profiler, the form silently resets with no success message or confirmation.',
      idealFixSummary: 'Add a success confirmation state after form submission. Show a confirmation message like "Your profile has been submitted" and either transition to the next section or display a clear success UI. The form should not silently reset.',
      prerequisiteIds: [],
      points: 1,
    },
    {
      id: 'BUG-03',
      tier: 'easy',
      title: 'Learn More buttons have undefined onClick',
      description: 'The "Learn More" buttons on testimonial cards have undefined onClick handlers and do nothing when clicked.',
      idealFixSummary: 'Replace the undefined onClick handlers on the testimonial Learn More buttons with proper handler functions. Either navigate to a relevant page, open a modal with more information, or implement a meaningful action. The handlers should not be undefined.',
      prerequisiteIds: [],
      points: 1,
    },
    {
      id: 'BUG-04',
      tier: 'easy',
      title: 'Back button on archetype results does nothing',
      description: 'The "Back" button on the Management Archetype results page has no navigation — clicking it does nothing.',
      idealFixSummary: 'Wire the Back button on the archetype results page to navigate back to the quiz section. Use router.back() or explicitly set state to return to the ManagementAssessment step so users can retake the quiz.',
      prerequisiteIds: [],
      points: 1,
    },
    {
      id: 'BUG-05',
      tier: 'easy',
      title: 'Footer admin link has no label',
      description: 'The footer admin link shows just the word "admin" with no context or description for what it leads to.',
      idealFixSummary: 'Update the footer admin link to have a clear, descriptive label such as "Admin Dashboard" or "Staff Login". The link should clearly communicate its purpose and ideally include appropriate styling to distinguish it as an administrative link.',
      prerequisiteIds: [],
      points: 1,
    },
    {
      id: 'BUG-06',
      tier: 'easy',
      title: 'Match score progress bar hardcoded to 0%',
      description: 'The match score progress bar on talent profile cards is hardcoded to width 0% regardless of the actual match score.',
      idealFixSummary: 'Fix the progress bar width to reflect the actual match score percentage. Replace the hardcoded style={{ width: "0%" }} with a dynamic style that uses the profile\'s calculated match score, e.g., style={{ width: `${matchScore}%` }}.',
      prerequisiteIds: [],
      points: 1,
    },
    {
      id: 'BUG-07',
      tier: 'medium',
      title: 'Quiz Q6 answer A missing Ghost archetype increment',
      description: 'Question 6 Answer A ("I\'m stretched too thin") should increment both Delegator AND Ghost archetypes, but only increments Delegator.',
      idealFixSummary: 'In the quiz scoring logic for Q6, answer A should add to both the Delegator and Ghost archetype counts. Find the scoring switch/map for question 6 and add scores.Ghost++ (or equivalent) alongside the existing scores.Delegator++ for answer A.',
      prerequisiteIds: [],
      points: 2,
    },
    {
      id: 'BUG-08',
      tier: 'medium',
      title: 'Status page has zero authentication',
      description: 'The /status page is completely public with no authentication, exposing candidate match data to anyone.',
      idealFixSummary: 'Add authentication to the /status page. Check for a valid session or token before rendering the page content. Redirect unauthenticated users to a login page. The status page contains sensitive candidate-match information and should require auth.',
      prerequisiteIds: ['BUG-02'],
      points: 2,
    },
    {
      id: 'BUG-09',
      tier: 'medium',
      title: 'Integration monitor shows wrong field mapping',
      description: 'The HubSpot integration monitor maps business name to the Last Name field instead of Company Name, and errors are not surfaced.',
      idealFixSummary: 'Fix the field mapping in the integration monitor so business name maps to the Company field, not Last Name. Also surface integration errors to the user — currently errors are swallowed and not shown. Add error state display to the integration status UI.',
      prerequisiteIds: ['BUG-05'],
      points: 2,
    },
    {
      id: 'BUG-10',
      tier: 'medium',
      title: 'Status page has no empty state',
      description: 'When no match profile has been found yet, the status page shows nothing — no empty state or guidance for the user.',
      idealFixSummary: 'Add an empty state component to the status page for when no match has been found. Show a helpful message like "No match found yet — complete your intake form to get matched" with a CTA to start the intake process.',
      prerequisiteIds: [],
      points: 2,
    },
    {
      id: 'BUG-11',
      tier: 'medium',
      title: 'Profile cards missing "Why this match" section',
      description: 'Talent profile cards show the match score but have no "Why this match" explanation section to justify the score.',
      idealFixSummary: 'Add a "Why this match" section to each talent profile card that explains the key reasons the profile was matched to this candidate. This could be generated from the matching criteria — role type match, skills overlap, availability, etc. Show 2-3 key matching factors.',
      prerequisiteIds: [],
      points: 2,
    },
    {
      id: 'BUG-12',
      tier: 'hard',
      title: 'Matching algorithm weights are incorrect',
      description: 'The matching algorithm uses wrong weights: role type is 10pts (should be 50), experience is 0 (should be 20), apps overlap is 20 (should be 10), skills is 20 (should be 10).',
      idealFixSummary: 'Fix the matching algorithm weights in lib/matching.ts. Role type match should be worth 50 points, experience score should be uncommented and worth 20 points, app overlap should be capped at 10 points (not 20), and skills match should be capped at 10 points (not 20). This will produce dramatically different and more accurate match results.',
      prerequisiteIds: ['BUG-02'],
      points: 3,
    },
    {
      id: 'BUG-13',
      tier: 'hard',
      title: 'Archetype system prompt missing Ghost tiebreaker rule',
      description: 'The Claude system prompt for archetype classification doesn\'t define the Ghost-priority tiebreaker rule for when archetypes tie.',
      idealFixSummary: 'Update the archetype API system prompt to include a clear tiebreaker rule: when two archetypes tie in score, Ghost should take priority. Add language like: "When two archetypes are tied, always select Ghost as the winner — Ghost represents the most common management challenge for remote hires and should be the default tiebreaker." This ensures consistent, intentional behavior on ties.',
      prerequisiteIds: ['BUG-07'],
      points: 3,
    },
    {
      id: 'BUG-14',
      tier: 'hard',
      title: 'Anthropic API key exposed in client component',
      description: 'The ManagementAssessment client component references NEXT_PUBLIC_ANTHROPIC_API_KEY, exposing the API key to the browser.',
      idealFixSummary: 'Remove the NEXT_PUBLIC_ANTHROPIC_API_KEY reference from the ManagementAssessment client component. API keys must never be prefixed with NEXT_PUBLIC_ as this exposes them to the browser. Move any Anthropic API calls to server-side API routes and call those routes from the client component instead.',
      prerequisiteIds: [],
      points: 3,
    },
    {
      id: 'BUG-15',
      tier: 'hard',
      title: 'Archetype result page has no CTA or next steps',
      description: 'After the management archetype is revealed, there are no next steps, CTA buttons, or guidance on what to do next.',
      idealFixSummary: 'Add a clear CTA section after the archetype reveal. Include: a "View Your Matches" button to proceed to the talent results, a brief description of what the archetype means for working with a VA, and optionally a "Retake Quiz" link. Users need clear next steps after seeing their archetype.',
      prerequisiteIds: [],
      points: 3,
    },
  ]

  for (const bug of bugs) {
    await prisma.bugDefinition.upsert({
      where: { id: bug.id },
      update: bug,
      create: bug,
    })
  }

  console.log('Seed complete: 10 RTM profiles and 15 bug definitions created.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
