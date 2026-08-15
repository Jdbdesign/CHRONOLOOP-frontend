// src/components/dashboard/StatCard.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ClipboardList } from 'lucide-react'
import { StatCard } from './StatCard'

describe('StatCard', () => {
  // Target-value assertion intentionally omitted here: useCountUp's animation is
  // gated behind a 300ms setTimeout + requestAnimationFrame, which is flaky under
  // jsdom's synchronous-ish RAF timing (see task-3 brief Step 7). The animated
  // value is instead covered in KpiGrid.test.tsx via vi.useFakeTimers().
  it('renders the label and delta text', () => {
    render(
      <StatCard
        label="To-do"
        icon={<ClipboardList aria-hidden="true" />}
        target={45}
        delta="up"
        deltaText="Up 4.5% since yesterday"
        index={0}
      />,
    )
    expect(screen.getByText('To-do')).toBeInTheDocument()
    expect(screen.getByText('▲ Up 4.5% since yesterday')).toBeInTheDocument()
  })

  it('is keyboard-focusable, matching the original tabindex="0" stat cards', () => {
    render(<StatCard label="To-do" icon={<ClipboardList aria-hidden="true" />} target={45} delta="up" deltaText="x" index={0} />)
    expect(screen.getByText('To-do').closest('[tabindex]')).toHaveAttribute('tabindex', '0')
  })

  it('accepts an optional iconBackground override without affecting the default background when omitted', () => {
    const { container, rerender } = render(
      <StatCard label="To-do" icon={<ClipboardList aria-hidden="true" />} target={45} delta="up" deltaText="x" index={0} />,
    )
    const defaultWrap = container.querySelector('[class*="iconWrap"]') as HTMLElement
    expect(defaultWrap.style.background).toBe('')

    rerender(
      <StatCard
        label="Active Sprint"
        icon={<ClipboardList aria-hidden="true" />}
        target={1}
        delta="up"
        deltaText="Currently running"
        index={1}
        iconBackground="rgba(74,144,255,0.12)"
      />,
    )
    const overriddenWrap = container.querySelector('[class*="iconWrap"]') as HTMLElement
    expect(overriddenWrap.style.background).toBe('rgba(74, 144, 255, 0.12)')
  })
})
