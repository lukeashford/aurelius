import React from 'react';

export const Footer = () => {
  return (
      <footer className="mt-20 py-10 border-t border-ash/30 text-silver/60 text-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <p>
              &copy; {new Date().getFullYear()} <a href="https://lukeashford.com" target="_blank"
                                                   rel="noopener noreferrer"
                                                   className="hover:text-gold transition-colors">Luke
              Ashford</a>. All rights reserved.
            </p>
            <p className="mt-2">
              Licensed under MIT. Use freely, but credit is required.
            </p>
          </div>
          <div className="text-right">
            <a href="#legal"
               className="font-medium text-silver/80 mb-1 hover:text-gold transition-colors">Impressum
              / Legal Notice</a>
          </div>
        </div>
      </footer>
  );
};
