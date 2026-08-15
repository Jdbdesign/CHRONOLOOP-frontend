import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ActiveSprintBanner } from './ActiveSprintBanner'
import { useSprintsStore } from '../../store/sprintsStore'
import { MOCK_SPRINTS } from '../../data/mockSprints'

describe('ActiveSprintBanner', () => {
  beforeEach(() => {
    useSprintsStore.setState({ sprints: MOCK_SPRINTS })
  })

  it('renders nothing when there is no active sprint', () => {
    useSprintsStore.setState({ sprints: MOCK_SPRINTS.filter((s) => s.status !== 'active') })
    const { container } = render(<ActiveSprintBanner />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the active sprint name, goal, and progress percentage', () => {
    render(<ActiveSprintBanner />)
    expect(screen.getByText('SPRINT 03 — UX Polish & Integrations')).toBeInTheDocument()
    expect(screen.getByText(/Refine the user experience/)).toBeInTheDocument()
    expect(screen.getByText('58%')).toBeInTheDocument()
    expect(screen.getByText('26/45 pts')).toBeInTheDocument()
  })

  it('renders the task breakdown counts', () => {
    render(<ActiveSprintBanner />)
    expect(screen.getByText('6')).toBeInTheDocument() // done
    expect(screen.getByText('3')).toBeInTheDocument() // in progress
    expect(screen.getByText('2')).toBeInTheDocument() // todo
  })

  it('draws a burndown polyline only from non-null points', () => {
    const { container } = render(<ActiveSprintBanner />)
    // s3.burndown = [45,41,36,30,24,null,null,null] -> 5 usable points
    const polyline = container.querySelector('polyline')
    expect(polyline?.getAttribute('points')?.trim().split(' ')).toHaveLength(5)
  })
})
