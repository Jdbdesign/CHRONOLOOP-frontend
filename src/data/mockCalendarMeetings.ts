import type { CalendarEvent } from '../types/calendar'

export const CAL_MEETINGS: CalendarEvent[] = [
  { id: 'm1', type: 'meeting', title: 'Sprint Planning', date: '2024-11-04', time: '10:00', duration: 60, project: 'Web 3 App for Fxtrade', assignee: 'AS', color: '#FF8C42', notes: 'Plan tasks for Sprint 04. Discuss backlog priorities.' },
  { id: 'm2', type: 'meeting', title: 'Design Review', date: '2024-11-06', time: '14:00', duration: 45, project: 'Healthydog Landing Page', assignee: 'MV', color: '#FF8C42', notes: 'Review latest Figma mockups with stakeholders.' },
  { id: 'm3', type: 'meeting', title: 'Stakeholder Demo', date: '2024-11-11', time: '11:00', duration: 90, project: 'Redesign of Website', assignee: 'RC', color: '#FF8C42', notes: 'Live demo for Artstyle Co. stakeholders.' },
  { id: 'm4', type: 'meeting', title: 'Sprint Retrospective', date: '2024-11-13', time: '15:00', duration: 60, project: 'Web 3 App for Fxtrade', assignee: 'AS', color: '#FF8C42', notes: 'Sprint 03 retrospective and lessons learned.' },
  { id: 'm5', type: 'meeting', title: 'Client Sync — DogXpert', date: '2024-11-14', time: '10:30', duration: 30, project: 'Healthydog Landing Page', assignee: 'RC', color: '#FF8C42', notes: 'Weekly progress sync with DogXpert team.' },
  { id: 'm6', type: 'meeting', title: 'All-Hands Meeting', date: '2024-11-18', time: '09:00', duration: 60, project: 'Internal', assignee: 'AS', color: '#FF8C42', notes: 'Company-wide quarterly review and roadmap.' },
  { id: 'm7', type: 'meeting', title: 'Architecture Review', date: '2024-11-20', time: '13:00', duration: 90, project: 'Web 3 App for Fxtrade', assignee: 'RD', color: '#FF8C42', notes: 'Review smart contract architecture decisions.' },
  { id: 'm8', type: 'meeting', title: 'Design Handoff', date: '2024-11-22', time: '11:00', duration: 45, project: 'Redesign of Website', assignee: 'MV', color: '#FF8C42', notes: 'Hand off latest designs to the development team.' },
  { id: 'm9', type: 'meeting', title: 'Security Briefing', date: '2024-11-25', time: '14:00', duration: 60, project: 'Redesign of Website', assignee: 'RD', color: '#FF8C42', notes: 'Review findings from the security audit report.' },
  { id: 'm10', type: 'meeting', title: 'Sprint 04 Kickoff', date: '2024-11-26', time: '10:00', duration: 60, project: 'Web 3 App for Fxtrade', assignee: 'AS', color: '#FF8C42', notes: 'Kick off next sprint with full team.' },
  { id: 'm11', type: 'meeting', title: 'UX Walkthrough', date: '2024-11-08', time: '15:30', duration: 60, project: 'Redesign of Website', assignee: 'MV', color: '#FF8C42', notes: 'Walk through updated UX flows with client.' },
  { id: 'm12', type: 'meeting', title: 'Budget Review', date: '2024-11-19', time: '09:30', duration: 45, project: 'Internal', assignee: 'AS', color: '#FF8C42', notes: 'Q4 budget review and resource planning.' },
  { id: 'm13', type: 'meeting', title: 'API Integration Sync', date: '2024-11-27', time: '11:00', duration: 60, project: 'Web 3 App for Fxtrade', assignee: 'RD', color: '#FF8C42', notes: 'Sync on Stripe and wallet API integration.' },
  { id: 'm14', type: 'meeting', title: 'Content Strategy', date: '2024-11-05', time: '14:30', duration: 45, project: 'Healthydog Landing Page', assignee: 'RC', color: '#FF8C42', notes: 'Finalize landing page copy and visuals.' },
]
