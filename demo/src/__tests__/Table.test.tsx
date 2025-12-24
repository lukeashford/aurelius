import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@lukeashford/aurelius'

describe('Table', () => {
  it('renders a table', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('renders with responsive wrapper by default', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(container.querySelector('.overflow-x-auto')).toBeInTheDocument()
  })

  it('renders without responsive wrapper when disabled', () => {
    const { container } = render(
      <Table responsive={false}>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(container.querySelector('.overflow-x-auto')).not.toBeInTheDocument()
  })

  it('applies custom className to table', () => {
    render(
      <Table className="custom-table">
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByRole('table')).toHaveClass('custom-table')
  })
})

describe('TableHeader', () => {
  it('renders thead element', () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    )
    expect(container.querySelector('thead')).toBeInTheDocument()
  })

  it('applies background class', () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    )
    expect(container.querySelector('thead')).toHaveClass('bg-graphite')
  })
})

describe('TableBody', () => {
  it('renders tbody element', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(container.querySelector('tbody')).toBeInTheDocument()
  })
})

describe('TableRow', () => {
  it('renders tr element', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(container.querySelector('tr')).toBeInTheDocument()
  })

  it('applies hover class when hoverable', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow hoverable>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(container.querySelector('tr')).toHaveClass('hover:bg-graphite/50')
  })

  it('applies selected styling', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow selected>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(container.querySelector('tr')).toHaveClass('bg-gold/10')
  })
})

describe('TableHead', () => {
  it('renders th element', () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    )
    expect(container.querySelector('th')).toBeInTheDocument()
  })

  it('renders header text', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
  })
})

describe('TableCell', () => {
  it('renders td element', () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Cell content</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(container.querySelector('td')).toBeInTheDocument()
  })

  it('renders cell content', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>Hello World</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
