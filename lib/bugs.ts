export type BugTier = 'easy' | 'medium' | 'hard'

export interface BugDefinition {
  id: string
  tier: BugTier
  title: string
  description: string
  idealFixSummary: string
  prerequisiteIds: string[]
  points: number
}

export const BUGS: BugDefinition[] = [
  {
    id: 'BUG-01',
    tier: 'easy',
    title: 'No form validation on Business Profiler',
    description: 'The Business Profiler form submits with empty required fields — no validation is enforced.',
    idealFixSummary: 'Add client-side required field validation before submission.',
    prerequisiteIds: [],
    points: 1,
  },
  {
    id: 'BUG-02',
    tier: 'easy',
    title: 'No confirmation state after form submission',
    description: 'After submitting the Business Profiler, the form silently resets with no success message or confirmation.',
    idealFixSummary: 'Add a success confirmation state after form submission.',
    prerequisiteIds: [],
    points: 1,
  },
  {
    id: 'BUG-03',
    tier: 'easy',
    title: 'Learn More buttons have undefined onClick',
    description: 'The "Learn More" buttons on testimonial cards have undefined onClick handlers and do nothing when clicked.',
    idealFixSummary: 'Replace the undefined onClick handlers with proper handler functions.',
    prerequisiteIds: [],
    points: 1,
  },
  {
    id: 'BUG-04',
    tier: 'easy',
    title: 'Back button on archetype results does nothing',
    description: 'The "Back" button on the Management Archetype results page has no navigation — clicking it does nothing.',
    idealFixSummary: 'Wire the Back button to navigate back to the quiz section.',
    prerequisiteIds: [],
    points: 1,
  },
  {
    id: 'BUG-05',
    tier: 'easy',
    title: 'Footer admin link has no label',
    description: 'The footer admin link shows just the word "admin" with no context or description for what it leads to.',
    idealFixSummary: 'Update the footer admin link to have a clear, descriptive label.',
    prerequisiteIds: [],
    points: 1,
  },
  {
    id: 'BUG-06',
    tier: 'easy',
    title: 'Match score progress bar hardcoded to 0%',
    description: 'The match score progress bar on talent profile cards is hardcoded to width 0% regardless of the actual match score.',
    idealFixSummary: 'Fix the progress bar width to reflect the actual match score percentage.',
    prerequisiteIds: [],
    points: 1,
  },
  {
    id: 'BUG-07',
    tier: 'medium',
    title: 'Quiz Q6 answer A missing Ghost archetype increment',
    description: "Question 6 Answer A (\"I'm stretched too thin\") should increment both Delegator AND Ghost archetypes, but only increments Delegator.",
    idealFixSummary: 'In the quiz scoring logic for Q6, answer A should add to both the Delegator and Ghost archetype counts.',
    prerequisiteIds: [],
    points: 2,
  },
  {
    id: 'BUG-08',
    tier: 'medium',
    title: 'Status page has zero authentication',
    description: 'The /status page is completely public with no authentication, exposing candidate match data to anyone.',
    idealFixSummary: 'Add authentication to the /status page.',
    prerequisiteIds: ['BUG-02'],
    points: 2,
  },
  {
    id: 'BUG-09',
    tier: 'medium',
    title: 'Integration monitor shows wrong field mapping',
    description: 'The HubSpot integration monitor maps business name to the Last Name field instead of Company Name, and errors are not surfaced.',
    idealFixSummary: 'Fix the field mapping so business name maps to Company, not Last Name.',
    prerequisiteIds: ['BUG-05'],
    points: 2,
  },
  {
    id: 'BUG-10',
    tier: 'medium',
    title: 'Status page has no empty state',
    description: 'When no match profile has been found yet, the status page shows nothing — no empty state or guidance.',
    idealFixSummary: 'Add an empty state component to the status page.',
    prerequisiteIds: [],
    points: 2,
  },
  {
    id: 'BUG-11',
    tier: 'medium',
    title: 'Profile cards missing "Why this match" section',
    description: 'Talent profile cards show the match score but have no "Why this match" explanation section.',
    idealFixSummary: 'Add a "Why this match" section to each talent profile card.',
    prerequisiteIds: [],
    points: 2,
  },
  {
    id: 'BUG-12',
    tier: 'hard',
    title: 'Matching algorithm weights are incorrect',
    description: 'The matching algorithm uses wrong weights: role type is 10pts (should be 50), experience is 0 (should be 20), apps overlap is 20 (should be 10), skills is 20 (should be 10).',
    idealFixSummary: 'Fix the matching algorithm weights in lib/matching.ts.',
    prerequisiteIds: ['BUG-02'],
    points: 3,
  },
  {
    id: 'BUG-13',
    tier: 'hard',
    title: 'Archetype system prompt missing Ghost tiebreaker rule',
    description: "The Claude system prompt for archetype classification doesn't define the Ghost-priority tiebreaker rule for when archetypes tie.",
    idealFixSummary: 'Update the archetype API system prompt to include a clear tiebreaker rule.',
    prerequisiteIds: ['BUG-07'],
    points: 3,
  },
  {
    id: 'BUG-14',
    tier: 'hard',
    title: 'Anthropic API key exposed in client component',
    description: 'The ManagementAssessment client component references NEXT_PUBLIC_ANTHROPIC_API_KEY, exposing the API key to the browser.',
    idealFixSummary: 'Remove the NEXT_PUBLIC_ANTHROPIC_API_KEY reference from the client component.',
    prerequisiteIds: [],
    points: 3,
  },
  {
    id: 'BUG-15',
    tier: 'hard',
    title: 'Archetype result page has no CTA or next steps',
    description: 'After the management archetype is revealed, there are no next steps, CTA buttons, or guidance on what to do next.',
    idealFixSummary: 'Add a clear CTA section after the archetype reveal.',
    prerequisiteIds: [],
    points: 3,
  },
]

export const TOTAL_POINTS = BUGS.reduce((sum, b) => sum + b.points, 0)

export function getBugById(id: string): BugDefinition | undefined {
  return BUGS.find((b) => b.id === id)
}

export function getBugsByTier(tier: BugTier): BugDefinition[] {
  return BUGS.filter((b) => b.tier === tier)
}
