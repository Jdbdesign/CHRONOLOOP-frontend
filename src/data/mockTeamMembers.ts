import type { TeamMember } from '../types/teamMember'

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm1', name: 'Aspen Herwitz', initials: 'AH', role: 'Senior Developer', dept: 'Development',
    email: 'aspen.h@chronoloop.io', color: '#4A90FF', online: true,
    activeTasks: 8, completedTasks: 24, velocity: 42, completion: 94,
    todoTasks: 4, inProgressTasks: 4,
    projects: [{ name: 'Web 3 App for Fxtrade', color: '#4A90FF' }, { name: 'ChronoLoop Launch', color: '#A855F7' }],
    timezone: 'UTC\u22125 \u00b7 EST', joinDate: 'Mar 2022', location: 'New York, USA',
    activity: [
      { text: 'Completed "Smart contract integration" task', time: '2h ago', dot: '#22C55E' },
      { text: 'Commented on sprint story "Web3 wallet auth"', time: '4h ago', dot: '#4A90FF' },
      { text: 'Added 3 subtasks to "Token dashboard"', time: 'Yesterday', dot: '#EAB308' },
      { text: 'Started Sprint 03 board review session', time: '2 days ago', dot: '#A855F7' },
    ],
  },
  {
    id: 'tm2', name: 'Roger Dokidis', initials: 'RD', role: 'UI/UX Designer', dept: 'Design',
    email: 'roger.d@chronoloop.io', color: '#FF8C42', online: true,
    activeTasks: 5, completedTasks: 18, velocity: 30, completion: 87,
    todoTasks: 2, inProgressTasks: 3,
    projects: [{ name: 'Healthydog Landing Page', color: '#00D4AA' }, { name: 'Redesign of Website', color: '#FF8C42' }],
    timezone: 'UTC+1 \u00b7 CET', joinDate: 'Jun 2022', location: 'Berlin, Germany',
    activity: [
      { text: 'Uploaded new Figma screens for Healthydog', time: '1h ago', dot: '#4A90FF' },
      { text: 'Completed wireframe review with Ryan', time: '3h ago', dot: '#22C55E' },
      { text: 'Resolved design comment on CTA button', time: 'Yesterday', dot: '#EAB308' },
      { text: 'Delivered component library v3 to dev', time: '2 days ago', dot: '#A855F7' },
    ],
  },
  {
    id: 'tm3', name: 'Marley Vaccaro', initials: 'MV', role: 'Full Stack Engineer', dept: 'Development',
    email: 'marley.v@chronoloop.io', color: '#A855F7', online: false,
    activeTasks: 11, completedTasks: 31, velocity: 55, completion: 91,
    todoTasks: 5, inProgressTasks: 6,
    projects: [{ name: 'Web 3 App for Fxtrade', color: '#4A90FF' }, { name: 'Redesign of Website', color: '#FF8C42' }],
    timezone: 'UTC\u22128 \u00b7 PST', joinDate: 'Jan 2023', location: 'San Francisco, USA',
    activity: [
      { text: 'Merged PR #142 \u2014 Auth middleware refactor', time: '30m ago', dot: '#22C55E' },
      { text: "Reviewed Roger's component library update", time: '2h ago', dot: '#4A90FF' },
      { text: 'Fixed critical bug in token refresh flow', time: '5h ago', dot: '#FF4D4D' },
      { text: 'Opened 2 new issues in backlog', time: 'Yesterday', dot: '#EAB308' },
    ],
  },
  {
    id: 'tm4', name: 'Ryan Culhane', initials: 'RC', role: 'Product Manager', dept: 'Management',
    email: 'ryan.c@chronoloop.io', color: '#00D4AA', online: true,
    activeTasks: 3, completedTasks: 41, velocity: 28, completion: 96,
    todoTasks: 1, inProgressTasks: 2,
    projects: [{ name: 'ChronoLoop Launch', color: '#A855F7' }, { name: 'Healthydog Landing Page', color: '#00D4AA' }],
    timezone: 'UTC+0 \u00b7 GMT', joinDate: 'Sep 2021', location: 'London, UK',
    activity: [
      { text: 'Updated Q4 product roadmap document', time: '45m ago', dot: '#4A90FF' },
      { text: 'Closed sprint retrospective with the team', time: '3h ago', dot: '#22C55E' },
      { text: 'Assigned Sprint 04 stories to members', time: 'Yesterday', dot: '#EAB308' },
      { text: 'Approved Healthydog design for dev handoff', time: '2 days ago', dot: '#A855F7' },
    ],
  },
  {
    id: 'tm5', name: 'Sofia Chen', initials: 'SC', role: 'Frontend Developer', dept: 'Development',
    email: 'sofia.c@chronoloop.io', color: '#EC4899', online: true,
    activeTasks: 6, completedTasks: 15, velocity: 38, completion: 88,
    todoTasks: 3, inProgressTasks: 3,
    projects: [{ name: 'Redesign of Website', color: '#FF8C42' }, { name: 'ChronoLoop Launch', color: '#A855F7' }],
    timezone: 'UTC+8 \u00b7 SGT', joinDate: 'Apr 2023', location: 'Singapore',
    activity: [
      { text: 'Completed responsive layout for Homepage', time: '1h ago', dot: '#22C55E' },
      { text: 'Created component: AnimatedHero', time: '3h ago', dot: '#4A90FF' },
      { text: 'Fixed Safari-specific flex alignment bug', time: 'Yesterday', dot: '#FF4D4D' },
      { text: "Code review for Marley's PR #139", time: '2 days ago', dot: '#EAB308' },
    ],
  },
  {
    id: 'tm6', name: 'David Osei', initials: 'DO', role: 'DevOps Engineer', dept: 'Development',
    email: 'david.o@chronoloop.io', color: '#EAB308', online: false,
    activeTasks: 4, completedTasks: 20, velocity: 33, completion: 85,
    todoTasks: 2, inProgressTasks: 2,
    projects: [{ name: 'Web 3 App for Fxtrade', color: '#4A90FF' }],
    timezone: 'UTC+0 \u00b7 GMT', joinDate: 'Jul 2022', location: 'Accra, Ghana',
    activity: [
      { text: 'Set up CI/CD pipeline for staging', time: '2h ago', dot: '#22C55E' },
      { text: 'Updated Docker config for auth service', time: '5h ago', dot: '#4A90FF' },
      { text: 'Resolved deploy failure on branch dev/auth', time: 'Yesterday', dot: '#FF4D4D' },
      { text: 'Optimised build time by 40%', time: '3 days ago', dot: '#EAB308' },
    ],
  },
  {
    id: 'tm7', name: 'Nina Park', initials: 'NP', role: 'Brand Designer', dept: 'Design',
    email: 'nina.p@chronoloop.io', color: '#06B6D4', online: true,
    activeTasks: 7, completedTasks: 22, velocity: 35, completion: 90,
    todoTasks: 3, inProgressTasks: 4,
    projects: [{ name: 'Healthydog Landing Page', color: '#00D4AA' }, { name: 'Redesign of Website', color: '#FF8C42' }],
    timezone: 'UTC+9 \u00b7 KST', joinDate: 'Nov 2022', location: 'Seoul, South Korea',
    activity: [
      { text: 'Published new brand guidelines v2.1', time: '2h ago', dot: '#22C55E' },
      { text: 'Delivered icon set for Healthydog mobile', time: '4h ago', dot: '#4A90FF' },
      { text: 'Review session with Roger on colour tokens', time: 'Yesterday', dot: '#EAB308' },
      { text: 'Completed motion design spec doc', time: '3 days ago', dot: '#A855F7' },
    ],
  },
  {
    id: 'tm8', name: 'Marcus Webb', initials: 'MW', role: 'Data Analyst', dept: 'Marketing',
    email: 'marcus.w@chronoloop.io', color: '#FF4D4D', online: false,
    activeTasks: 2, completedTasks: 12, velocity: 20, completion: 79,
    todoTasks: 1, inProgressTasks: 1,
    projects: [{ name: 'ChronoLoop Launch', color: '#A855F7' }],
    timezone: 'UTC\u22126 \u00b7 CST', joinDate: 'Feb 2023', location: 'Chicago, USA',
    activity: [
      { text: 'Published Q3 user analytics report', time: '1d ago', dot: '#22C55E' },
      { text: 'Set up GA4 event tracking on launch page', time: '2d ago', dot: '#4A90FF' },
      { text: 'Presented funnel analysis to Ryan', time: '3d ago', dot: '#EAB308' },
      { text: 'Added UTM tracking to all campaign links', time: '4d ago', dot: '#A855F7' },
    ],
  },
]

/**
 * Parse a relative time string ("30m ago", "2h ago", "Yesterday", "2 days ago", "1d ago")
 * into an approximate minutes-ago number for sorting (lower = more recent).
 */
export function parseRelativeTime(time: string): number {
  const t = time.toLowerCase().trim()
  const numMatch = t.match(/^(\d+)/)
  const num = numMatch ? parseInt(numMatch[1], 10) : 1

  if (t.includes('m ago')) return num // minutes
  if (t.includes('h ago')) return num * 60 // hours
  if (t === 'yesterday') return 24 * 60
  if (t.includes('d ago')) return num * 24 * 60 // "1d ago", "2d ago"
  if (t.includes('day')) return num * 24 * 60 // "2 days ago"
  return 9999 // fallback — sort to end
}
