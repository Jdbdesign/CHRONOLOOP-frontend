export interface DashboardTeamMember {
  id: string
  name: string
  role: string
  gridEmail: string
  detailEmail: string
  activeTasks: number
  avatarSrc: string
}

export const DASHBOARD_TEAM_MEMBERS: DashboardTeamMember[] = [
  { id: 'AS', name: 'Aspen Herwitz', role: 'Frontend Developer', gridEmail: 'Joedoe@gmail.com', detailEmail: 'aspen@example.com', activeTasks: 5, avatarSrc: '/avatars/Ellipse 2.png' },
  { id: 'RD', name: 'Roger Dokidis', role: 'Backend Developer', gridEmail: 'Joedoe@gmail.com', detailEmail: 'roger@example.com', activeTasks: 3, avatarSrc: '/avatars/Ellipse 3.png' },
  { id: 'MV', name: 'Marley Vaccaro', role: 'UI/UX Designer', gridEmail: 'Joedoe@gmail.com', detailEmail: 'marley@example.com', activeTasks: 4, avatarSrc: '/avatars/Ellipse 4.png' },
  { id: 'RC', name: 'Ryan Culhane', role: 'Project Manager', gridEmail: 'Joedoe@gmail.com', detailEmail: 'ryan@example.com', activeTasks: 3, avatarSrc: '/avatars/Ellipse 5.png' },
]
