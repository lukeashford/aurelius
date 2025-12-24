import React, { useState } from 'react'
import {
  Card,
  Checkbox,
  HelperText,
  Label,
  Radio,
  Select,
  Switch,
  Textarea,
  Input,
  Button,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  InputLeftElement,
  InputRightElement,
  Slider,
} from '@lukeashford/aurelius'
import { Search, Mail, DollarSign, Eye, EyeOff } from 'lucide-react'
import Section from './Section'

export default function FormsSection() {
  const [sliderValue, setSliderValue] = useState(50)
  const [stepSliderValue, setStepSliderValue] = useState(30)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Section
      className="space-y-8"
      title="Form Elements"
      subtitle="Standard form components with consistent styling."
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* InputGroup */}
        <Card className="p-6 space-y-4 md:col-span-2">
          <h3 className="text-gold font-medium">Input Group</h3>
          <p className="text-sm text-silver">
            Combine inputs with addons and elements for enhanced form fields.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>With Addons</Label>
              <InputGroup>
                <InputLeftAddon>https://</InputLeftAddon>
                <Input placeholder="example.com" />
              </InputGroup>
            </div>
            <div>
              <Label>With Right Addon</Label>
              <InputGroup>
                <Input placeholder="Amount" />
                <InputRightAddon>.00</InputRightAddon>
              </InputGroup>
            </div>
            <div>
              <Label>With Icon Elements</Label>
              <InputGroup>
                <InputLeftElement>
                  <Search className="h-4 w-4 text-silver" />
                </InputLeftElement>
                <Input placeholder="Search..." />
              </InputGroup>
            </div>
            <div>
              <Label>Password with Toggle</Label>
              <InputGroup>
                <InputLeftElement>
                  <Mail className="h-4 w-4 text-silver" />
                </InputLeftElement>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                />
                <InputRightElement>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-silver hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </InputRightElement>
              </InputGroup>
            </div>
            <div>
              <Label>Combined</Label>
              <InputGroup>
                <InputLeftAddon>
                  <DollarSign className="h-4 w-4" />
                </InputLeftAddon>
                <Input placeholder="0.00" />
                <InputRightAddon>USD</InputRightAddon>
              </InputGroup>
            </div>
            <div>
              <Label>With Button</Label>
              <InputGroup>
                <Input placeholder="Enter email..." />
                <Button size="sm" className="rounded-l-none">
                  Subscribe
                </Button>
              </InputGroup>
            </div>
          </div>
        </Card>

        {/* Slider */}
        <Card className="p-6 space-y-4 md:col-span-2">
          <h3 className="text-gold font-medium">Slider</h3>
          <p className="text-sm text-silver">
            Range inputs with gold styling for selecting numeric values.
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label>Basic Slider</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={sliderValue}
                    onChange={setSliderValue}
                    className="flex-1"
                  />
                  <span className="text-gold w-12 text-right">{sliderValue}</span>
                </div>
              </div>
              <div>
                <Label>With Steps (step=10)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={stepSliderValue}
                    onChange={setStepSliderValue}
                    step={10}
                    className="flex-1"
                  />
                  <span className="text-gold w-12 text-right">{stepSliderValue}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>With Tooltip</Label>
                <Slider defaultValue={75} showTooltip />
              </div>
              <div>
                <Label>Disabled</Label>
                <Slider defaultValue={60} disabled />
              </div>
            </div>
          </div>
        </Card>

        {/* Select */}
        <Card className="p-6 space-y-4">
          <h3 className="text-gold font-medium">Select</h3>
          <div>
            <Label>Standard Select</Label>
            <Select
              options={[
                { label: 'Option 1', value: '1' },
                { label: 'Option 2', value: '2' },
                { label: 'Option 3', value: '3' },
              ]}
            />
            <HelperText>Select an option from the list.</HelperText>
          </div>
          <div>
            <Label>Error State</Label>
            <Select
              error
              options={[{ label: 'Invalid Selection', value: '1' }]}
            />
            <HelperText error>This field is required.</HelperText>
          </div>
        </Card>

        {/* Textarea */}
        <Card className="p-6 space-y-4">
          <h3 className="text-gold font-medium">Textarea</h3>
          <div>
            <Label>Description</Label>
            <Textarea placeholder="Enter a description..." rows={3} />
          </div>
          <div>
            <Label>Error State</Label>
            <Textarea error placeholder="Invalid input..." rows={3} />
            <HelperText error>Please provide more details.</HelperText>
          </div>
        </Card>

        {/* Toggles */}
        <Card className="p-6 space-y-6">
          <h3 className="text-gold font-medium">Toggles</h3>

          <div className="space-y-2">
            <div className="font-medium text-sm text-silver mb-2">Checkbox</div>
            <Checkbox label="Accept terms and conditions" />
            <Checkbox label="Subscribe to newsletter" defaultChecked />
            <Checkbox label="Disabled" disabled />
          </div>

          <div className="space-y-2">
            <div className="font-medium text-sm text-silver mb-2">Radio</div>
            <div className="flex gap-4">
              <Radio name="plan" label="Free" />
              <Radio name="plan" label="Pro" defaultChecked />
              <Radio name="plan" label="Enterprise" disabled />
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium text-sm text-silver mb-2">Switch</div>
            <div className="flex flex-wrap gap-8">
              <Switch label="Notifications" />
              <Switch label="Dark Mode" defaultChecked />
              <Switch label="Disabled" disabled />
            </div>
          </div>
        </Card>
      </div>
    </Section>
  )
}
