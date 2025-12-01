import React from 'react';
import { Card, Button } from '@lukeashford/aurelius';

export const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-obsidian text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-semibold">Impressum / Legal Notice</h1>
          <a href="#">
            <Button variant="ghost">← Back to Home</Button>
          </a>
        </header>

        <Card className="p-8 space-y-6">
            <div className="space-y-2 text-silver">
                <p className="font-medium text-white text-lg">Lucas Waclawczyk</p>
                <p>Hegelallee 42</p>
                <p>14467 Potsdam, Germany</p>
            </div>

            <div className="space-y-2 text-silver pt-4 border-t border-ash/30">
                <p>Contact: <a href="mailto:luke@lukeashford.com" className="text-gold hover:underline">luke@lukeashford.com</a></p>
            </div>
        </Card>
      </div>
    </div>
  );
};
