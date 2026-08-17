import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RptTeamOutput } from './RptTeamOutput'

describe('RptTeamOutput', () => {
  it('renders team members with completed/total counts', () => {
    render(<RptTeamOutput />)
    expect(screen.getByText('Team Output')).toBeInTheDocument()
    expect(screen.getByText('Aspen H.')).toBeInTheDocument()
    expect(screen.getByText('32/38')).toBeInTheDocument()
  })
})
