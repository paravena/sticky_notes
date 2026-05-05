import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TrashZone } from '../TrashZone'

describe('TrashZone', () => {
  it('renders nothing when not visible', () => {
    const { container } = render(<TrashZone visible={false} isOver={false} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders the drop hint when visible', () => {
    render(<TrashZone visible={true} isOver={false} />)
    expect(screen.getByText('Drag here to delete')).toBeInTheDocument()
  })

  it('shows release message when hovering over trash', () => {
    render(<TrashZone visible={true} isOver={true} />)
    expect(screen.getByText('Release to delete')).toBeInTheDocument()
  })

  it('has the correct test id', () => {
    render(<TrashZone visible={true} isOver={false} />)
    expect(screen.getByTestId('trash-zone')).toBeInTheDocument()
  })
})
