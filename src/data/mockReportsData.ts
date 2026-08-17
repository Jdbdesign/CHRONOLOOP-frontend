export interface RptKpi {
  label: string
  value: string
  delta: string
  dir: 'up' | 'down' | 'neutral'
  sub: string
  icon: string
  color: string
  bg: string
}

export interface RptProjectStatus {
  label: string
  value: number
  color: string
}

export interface RptSprintVelocity {
  name: string
  pts: number
}

export interface RptPriorityBreakdown {
  label: string
  count: number
  color: string
}

export interface RptTeamOutput {
  name: string
  initials: string
  color: string
  completed: number
  total: number
}

export interface RptBurndownPoint {
  day: number
  ideal: number
  actual: number
}

export interface RptProjectRow {
  name: string
  status: string
  total: number
  done: number
  due: string
  health: 'good' | 'warn' | 'risk'
}

export interface RptSprintRow {
  name: string
  start: string
  end: string
  velocity: number | null
  target: number
  status: string
}

export const RPT_DATA = {
  kpis: [
    { label: 'Tasks Completed', value: '127', delta: '+12', dir: 'up' as const, sub: 'vs last period', icon: 'check-circle-2', color: 'var(--accent-green)', bg: 'rgba(34,197,94,0.1)' },
    { label: 'Completion Rate', value: '84%', delta: '+5%', dir: 'up' as const, sub: 'vs last period', icon: 'percent', color: 'var(--accent-blue)', bg: 'rgba(74,144,255,0.1)' },
    { label: 'Sprint Velocity', value: '42', delta: '+8 pts', dir: 'up' as const, sub: 'avg last 6', icon: 'zap', color: 'var(--accent-yellow)', bg: 'rgba(234,179,8,0.1)' },
    { label: 'On-Time Delivery', value: '89%', delta: '+3%', dir: 'up' as const, sub: 'vs last period', icon: 'clock', color: 'var(--accent-teal)', bg: 'rgba(0,212,170,0.1)' },
    { label: 'Active Projects', value: '10', delta: '\u2014', dir: 'neutral' as const, sub: 'no change', icon: 'briefcase', color: 'var(--accent-purple)', bg: 'rgba(168,85,247,0.1)' },
  ] satisfies RptKpi[],

  weeklyTasks: [
    [22, 16], [28, 22], [25, 20], [30, 25], [20, 18], [32, 28],
    [27, 23], [35, 30], [24, 20], [31, 26], [29, 25], [33, 28],
  ] as [number, number][],
  weekLabels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],

  projectStatus: [
    { label: 'Completed', value: 4, color: '#22C55E' },
    { label: 'In Progress', value: 4, color: '#4A90FF' },
    { label: 'On Hold', value: 1, color: '#EAB308' },
    { label: 'Overdue', value: 1, color: '#FF4D4D' },
  ] satisfies RptProjectStatus[],

  sprintVelocity: [
    { name: 'S1', pts: 32 },
    { name: 'S2', pts: 38 },
    { name: 'S3', pts: 35 },
    { name: 'S4', pts: 45 },
    { name: 'S5', pts: 40 },
    { name: 'S6', pts: 42 },
  ] satisfies RptSprintVelocity[],

  priorityBreakdown: [
    { label: 'Critical', count: 18, color: '#FF4D4D' },
    { label: 'High', count: 45, color: '#FF8C42' },
    { label: 'Medium', count: 52, color: '#EAB308' },
    { label: 'Low', count: 30, color: '#00D4AA' },
  ] satisfies RptPriorityBreakdown[],

  teamOutput: [
    { name: 'Aspen H.', initials: 'AH', color: '#4A90FF', completed: 32, total: 38 },
    { name: 'Marley V.', initials: 'MV', color: '#A855F7', completed: 27, total: 32 },
    { name: 'Jordan K.', initials: 'JK', color: '#00D4AA', completed: 24, total: 28 },
    { name: 'Sam R.', initials: 'SR', color: '#FF8C42', completed: 21, total: 26 },
    { name: 'Taylor B.', initials: 'TB', color: '#EC4899', completed: 23, total: 25 },
  ] satisfies RptTeamOutput[],

  burndown: [
    { day: 0, ideal: 80, actual: 80 },
    { day: 1, ideal: 74, actual: 76 },
    { day: 2, ideal: 68, actual: 71 },
    { day: 3, ideal: 62, actual: 65 },
    { day: 4, ideal: 56, actual: 60 },
    { day: 5, ideal: 50, actual: 52 },
    { day: 6, ideal: 44, actual: 50 },
    { day: 7, ideal: 38, actual: 44 },
    { day: 8, ideal: 32, actual: 38 },
    { day: 9, ideal: 26, actual: 28 },
    { day: 10, ideal: 20, actual: 20 },
    { day: 11, ideal: 14, actual: 12 },
    { day: 12, ideal: 8, actual: 6 },
    { day: 13, ideal: 0, actual: 0 },
  ] satisfies RptBurndownPoint[],

  projects: [
    { name: 'ChronoLoop App', status: 'In Progress', total: 32, done: 26, due: 'Dec 15', health: 'good' as const },
    { name: 'Web 3 App', status: 'In Progress', total: 28, done: 18, due: 'Nov 30', health: 'warn' as const },
    { name: 'CareyCare Homepage', status: 'Completed', total: 24, done: 24, due: 'Nov 12', health: 'good' as const },
    { name: 'Eatz Landing Page', status: 'Overdue', total: 20, done: 12, due: 'Nov 5', health: 'risk' as const },
    { name: 'ChronoLoop V2', status: 'In Progress', total: 18, done: 8, due: 'Jan 10', health: 'good' as const },
    { name: 'Brand Refresh', status: 'On Hold', total: 15, done: 4, due: 'TBD', health: 'warn' as const },
  ] satisfies RptProjectRow[],

  sprints: [
    { name: 'Auth & Onboarding', start: 'Oct 1', end: 'Oct 14', velocity: 32, target: 40, status: 'Completed' },
    { name: 'Core Dashboard', start: 'Oct 15', end: 'Oct 28', velocity: 38, target: 40, status: 'Completed' },
    { name: 'Task Management', start: 'Oct 29', end: 'Nov 11', velocity: 35, target: 40, status: 'Completed' },
    { name: 'Projects & Sprints', start: 'Nov 12', end: 'Nov 25', velocity: 45, target: 40, status: 'Completed' },
    { name: 'Team & Reports', start: 'Nov 26', end: 'Dec 9', velocity: 40, target: 40, status: 'Active' },
    { name: 'Integrations', start: 'Dec 10', end: 'Dec 23', velocity: null, target: 40, status: 'Planned' },
  ] satisfies RptSprintRow[],
}
