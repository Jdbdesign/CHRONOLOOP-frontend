import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from './AppShell'

describe('AppShell', () => {
  it('renders Sidebar, TopBar, and the routed child content together', () => {
    const router = createMemoryRouter(
      [
        {
          element: <AppShell />,
          children: [{ path: '/', element: <div>page content</div> }],
        },
      ],
      { initialEntries: ['/'] },
    )

    render(<RouterProvider router={router} />)

    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
    expect(screen.getByText('page content')).toBeInTheDocument()
  })
})
