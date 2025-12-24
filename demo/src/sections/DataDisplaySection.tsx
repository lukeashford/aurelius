import React from 'react'
import {
  Card,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Badge,
  Avatar,
} from '@lukeashford/aurelius'
import { Mail, Phone, MapPin, Star } from 'lucide-react'
import Section from './Section'

const tableData = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
]

export default function DataDisplaySection() {
  return (
    <Section
      className="space-y-8"
      title="Data Display"
      subtitle="Components for presenting structured data."
    >
      <div className="grid grid-cols-1 gap-8">
        {/* Table */}
        <Card className="p-6 space-y-4">
          <h3 className="text-gold font-medium">Table</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'Active' ? 'success' : 'default'}>
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* List */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card className="p-6 space-y-4">
            <h3 className="text-gold font-medium">List - Basic</h3>
            <List variant="divided">
              <ListItem interactive>
                <ListItemText
                  primary="Dashboard"
                  secondary="View your analytics"
                />
              </ListItem>
              <ListItem interactive>
                <ListItemText
                  primary="Settings"
                  secondary="Manage preferences"
                />
              </ListItem>
              <ListItem interactive disabled>
                <ListItemText
                  primary="Billing"
                  secondary="Upgrade to access"
                />
              </ListItem>
            </List>
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-gold font-medium">List - With Icons</h3>
            <List variant="divided">
              <ListSubheader>Contact Information</ListSubheader>
              <ListItem
                leading={<Mail className="h-5 w-5 text-silver" />}
              >
                <ListItemText
                  primary="Email"
                  secondary="hello@example.com"
                />
              </ListItem>
              <ListItem
                leading={<Phone className="h-5 w-5 text-silver" />}
              >
                <ListItemText
                  primary="Phone"
                  secondary="+1 (555) 123-4567"
                />
              </ListItem>
              <ListItem
                leading={<MapPin className="h-5 w-5 text-silver" />}
              >
                <ListItemText
                  primary="Address"
                  secondary="123 Main St, City, ST 12345"
                />
              </ListItem>
            </List>
          </Card>
        </div>
      </div>
    </Section>
  )
}
