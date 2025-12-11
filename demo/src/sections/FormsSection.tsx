import React from 'react'
import { 
  Select, Textarea, Checkbox, Radio, Switch, Label, HelperText, Card
} from '@lukeashford/aurelius'

export default function FormsSection() {
  return (
    <div className="space-y-8">
      <header className="mb-4">
        <h2 className="text-2xl">Form Elements</h2>
        <p className="text-silver">Standard form components with consistent styling.</p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Select */}
        <Card className="p-6 space-y-4">
          <h3 className="text-gold font-medium">Select</h3>
          <div>
            <Label>Standard Select</Label>
            <Select options={[
              { label: 'Option 1', value: '1' },
              { label: 'Option 2', value: '2' },
              { label: 'Option 3', value: '3' }
            ]} />
            <HelperText>Select an option from the list.</HelperText>
          </div>
           <div>
            <Label>Error State</Label>
            <Select error options={[{ label: 'Invalid Selection', value: '1' }]} />
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
            {/* Allow wrapping so items don't overflow the card on small screens */}
            <div className="flex flex-wrap gap-8">
              <Switch label="Notifications" />
              <Switch label="Dark Mode" defaultChecked />
              <Switch label="Disabled" disabled />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
