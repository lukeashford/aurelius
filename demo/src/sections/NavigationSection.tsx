import React, { useState } from 'react'
import {
  Card,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuLabel,
  Breadcrumb,
  BreadcrumbItem,
  Pagination,
  Button,
} from '@lukeashford/aurelius'
import { Settings, User, LogOut, ChevronDown } from 'lucide-react'
import Section from './Section'

export default function NavigationSection() {
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <Section
      className="space-y-8"
      title="Navigation"
      subtitle="Components for navigating through content and sections."
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Tabs */}
        <Card className="p-6 space-y-4 md:col-span-2">
          <h3 className="text-gold font-medium">Tabs</h3>
          <Tabs defaultValue="account">
            <TabList>
              <Tab value="account">Account</Tab>
              <Tab value="notifications">Notifications</Tab>
              <Tab value="security">Security</Tab>
              <Tab value="disabled" disabled>Disabled</Tab>
            </TabList>
            <TabPanel value="account">
              <div className="p-4 bg-graphite">
                <p className="text-sm text-silver">Manage your account settings and preferences.</p>
              </div>
            </TabPanel>
            <TabPanel value="notifications">
              <div className="p-4 bg-graphite">
                <p className="text-sm text-silver">Configure how you receive notifications.</p>
              </div>
            </TabPanel>
            <TabPanel value="security">
              <div className="p-4 bg-graphite">
                <p className="text-sm text-silver">Update your security settings and password.</p>
              </div>
            </TabPanel>
          </Tabs>
        </Card>

        {/* Accordion */}
        <Card className="p-6 space-y-4">
          <h3 className="text-gold font-medium">Accordion</h3>
          <Accordion type="single" defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Aurelius?</AccordionTrigger>
              <AccordionContent>
                Aurelius is a cohesive design system combining technical sophistication
                with artistic sensibility.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I get started?</AccordionTrigger>
              <AccordionContent>
                Install the package via npm and import the components you need.
                Check the documentation for detailed examples.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it customizable?</AccordionTrigger>
              <AccordionContent>
                Yes! Aurelius is built on Tailwind CSS v4 and supports full theme
                customization through CSS custom properties.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        {/* Menu */}
        <Card className="p-6 space-y-4">
          <h3 className="text-gold font-medium">Menu</h3>
          <div className="flex gap-4">
            <Menu>
              <MenuTrigger className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal border border-ash text-white hover:border-gold transition-colors">
                Options <ChevronDown className="h-4 w-4" />
              </MenuTrigger>
              <MenuContent>
                <MenuLabel>My Account</MenuLabel>
                <MenuItem icon={<User className="h-4 w-4" />}>Profile</MenuItem>
                <MenuItem icon={<Settings className="h-4 w-4" />}>Settings</MenuItem>
                <MenuSeparator />
                <MenuItem icon={<LogOut className="h-4 w-4" />} destructive>
                  Logout
                </MenuItem>
              </MenuContent>
            </Menu>
          </div>
        </Card>

        {/* Breadcrumb */}
        <Card className="p-6 space-y-4">
          <h3 className="text-gold font-medium">Breadcrumb</h3>
          <div className="space-y-4">
            <Breadcrumb>
              <BreadcrumbItem href="#">Home</BreadcrumbItem>
              <BreadcrumbItem href="#">Products</BreadcrumbItem>
              <BreadcrumbItem href="#">Category</BreadcrumbItem>
              <BreadcrumbItem current>Current Page</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </Card>

        {/* Pagination */}
        <Card className="p-6 space-y-4">
          <h3 className="text-gold font-medium">Pagination</h3>
          <div className="space-y-4">
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
            />
            <p className="text-sm text-silver">Current page: {currentPage}</p>
          </div>
        </Card>
      </div>
    </Section>
  )
}
