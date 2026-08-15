import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SprintItem } from './SprintItem'
import { MOCK_SPRINTS } from '../../data/mockSprints'

const sprint = MOCK_SPRINTS[2] // s3, active, 58%, 4-person team

describe('SprintItem', () => {
  it('renders number, name, goal, status, dates, progress, points, and team', () => {
    render(<SprintItem sprint={sprint} onOpenDetail={() => {}} onEdit={() => {}} onMarkComplete={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('SPRINT 03')).toBeInTheDocument()
    expect(screen.getByText('UX Polish & Integrations')).toBeInTheDocument()
    expect(screen.getByText(/Refine the user experience/)).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('6/11 tasks')).toBeInTheDocument()
    expect(screen.getByText('58%')).toBeInTheDocument()
    expect(screen.getByText('26')).toBeInTheDocument()
    expect(screen.getByText('+1')).toBeInTheDocument() // 4-member team, 3 shown + overflow
  })

  it('calls onOpenDetail when the row is clicked', async () => {
    const user = userEvent.setup()
    const onOpenDetail = vi.fn()
    render(<SprintItem sprint={sprint} onOpenDetail={onOpenDetail} onEdit={() => {}} onMarkComplete={() => {}} onDelete={() => {}} />)
    await user.click(screen.getByText('UX Polish & Integrations'))
    expect(onOpenDetail).toHaveBeenCalledWith('s3')
  })

  it('the three-dot menu stops propagation and does not also open the detail panel', async () => {
    const user = userEvent.setup()
    const onOpenDetail = vi.fn()
    render(<SprintItem sprint={sprint} onOpenDetail={onOpenDetail} onEdit={() => {}} onMarkComplete={() => {}} onDelete={() => {}} />)
    await user.click(screen.getByLabelText('More options'))
    expect(onOpenDetail).not.toHaveBeenCalled()
    expect(await screen.findByText('Mark Complete')).toBeInTheDocument()
  })

  it('Delete in the context menu calls onDelete with id and name', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<SprintItem sprint={sprint} onOpenDetail={() => {}} onEdit={() => {}} onMarkComplete={() => {}} onDelete={onDelete} />)
    await user.click(screen.getByLabelText('More options'))
    await user.click(await screen.findByText('Delete'))
    expect(onDelete).toHaveBeenCalledWith('s3', 'UX Polish & Integrations')
  })
})
