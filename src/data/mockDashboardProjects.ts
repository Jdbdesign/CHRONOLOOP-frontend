export interface CriticalProject {
  id: string
  title: string
  client: string
  dueLabel: string
}

export const DASHBOARD_CRITICAL_PROJECTS: CriticalProject[] = [
  { id: 'web3-fxtrade', title: 'Web 3 app for Fxtrade', client: 'Fxtrade Expert', dueLabel: 'Due in 20hrs' },
  { id: 'healthydog', title: 'Healthydog Landing Page', client: 'DogXpert', dueLabel: 'Due in 3 days' },
  { id: 'redesign-website', title: 'Redesign of Website', client: 'Fxtrade Expert', dueLabel: 'Due in 5 days' },
]
