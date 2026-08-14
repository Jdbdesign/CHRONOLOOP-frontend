import { describe, it, expect, beforeEach } from 'vitest'
import { useProjectsStore } from './projectsStore'
import { MOCK_PROJECTS } from '../data/mockProjects'

describe('projectsStore', () => {
  beforeEach(() => {
    useProjectsStore.setState({ projects: MOCK_PROJECTS })
  })

  it('starts seeded with all 10 MOCK_PROJECTS', () => {
    expect(useProjectsStore.getState().projects).toHaveLength(10)
  })

  it('addProject prepends a new active project with 0 progress and dueDays hardcoded to 30', () => {
    useProjectsStore.getState().addProject({
      name: 'New Initiative',
      client: 'Acme',
      category: 'Development',
      priority: 'high',
      dueDate: 'Dec 25, 2024',
      color: '#4A90FF',
      desc: 'A new thing',
    })
    const projects = useProjectsStore.getState().projects
    expect(projects).toHaveLength(11)
    expect(projects[0]).toMatchObject({
      name: 'New Initiative',
      client: 'Acme',
      category: 'Development',
      status: 'active',
      priority: 'high',
      progress: 0,
      dueDays: 30,
      dueDate: 'Dec 25, 2024',
      tasksTotal: 0,
      tasksDone: 0,
      milestones: [],
    })
    expect(projects[0].team).toEqual([{ i: 'JA', c: '#4A90FF', n: 'Jacobs A.' }])
  })

  it('addProject falls back to "No client" and a placeholder description when left blank', () => {
    useProjectsStore.getState().addProject({
      name: 'Untitled', client: '', category: 'Design', priority: 'medium', dueDate: 'TBD', color: '#22C55E', desc: '',
    })
    const project = useProjectsStore.getState().projects[0]
    expect(project.client).toBe('No client')
    expect(project.desc).toBe('No description provided.')
  })

  it('removeProject removes the project with the given id and leaves the rest untouched', () => {
    useProjectsStore.getState().removeProject('p3')
    const projects = useProjectsStore.getState().projects
    expect(projects).toHaveLength(9)
    expect(projects.find((p) => p.id === 'p3')).toBeUndefined()
    expect(projects.find((p) => p.id === 'p1')).toBeDefined()
  })
})
