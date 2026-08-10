import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App (Vitest/RTL harness smoke test)', () => {
  it('renders and responds to a user interaction', async () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /count is/i })
    expect(button).toHaveTextContent('Count is 0')

    await userEvent.click(button)

    expect(button).toHaveTextContent('Count is 1')
  })
})
