import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewProjectModal } from './NewProjectModal'
import { useProjectModalStore } from '../../../store/projectModalStore'
import { useProjectsStore } from '../../../store/projectsStore'
import { MOCK_PROJECTS } from '../../../data/mockProjects'

describe('NewProjectModal', () => {
  beforeEach(() => {
    useProjectModalStore.setState({ isOpen: false })
    useProjectsStore.setState({ projects: MOCK_PROJECTS })
  })

  it('renders nothing visible when closed', () => {
    render(<NewProjectModal />)
    expect(screen.queryByText('New Project')).not.toBeInTheDocument()
  })

  it('creates a project with the entered name and defaults, then closes and resets the form', async () => {
    useProjectModalStore.setState({ isOpen: true })
    render(<NewProjectModal />)

    await userEvent.type(screen.getByLabelText(/Project Name/), 'Launch Retro Site')
    await userEvent.click(screen.getByRole('button', { name: /Create Project/ }))

    expect(useProjectModalStore.getState().isOpen).toBe(false)
    const created = useProjectsStore.getState().projects[0]
    expect(created.name).toBe('Launch Retro Site')
    expect(created.priority).toBe('medium')
    expect(created.color).toBe('#4A90FF')
    expect(created.dueDays).toBe(30)
  })

  it('shows an error toast and does not create a project when the name is blank', async () => {
    useProjectModalStore.setState({ isOpen: true })
    render(<NewProjectModal />)
    const before = useProjectsStore.getState().projects.length
    await userEvent.click(screen.getByRole('button', { name: /Create Project/ }))
    expect(useProjectsStore.getState().projects.length).toBe(before)
  })

  it('lets the user pick a priority pill and an accent color before submitting', async () => {
    useProjectModalStore.setState({ isOpen: true })
    render(<NewProjectModal />)

    await userEvent.type(screen.getByLabelText(/Project Name/), 'Color Test')
    await userEvent.click(screen.getByRole('button', { name: 'High' }))
    await userEvent.click(screen.getByRole('button', { name: 'Purple' }))
    await userEvent.click(screen.getByRole('button', { name: /Create Project/ }))

    const created = useProjectsStore.getState().projects[0]
    expect(created.priority).toBe('high')
    expect(created.color).toBe('#A855F7')
  })
})
