import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="container">
      <div className='flex flex-col place-items-center mb-20 sm:mb-5 mt-20'>
        <p className="text-[#343751] text-[12px] font-aber-mono text-center">Copyright © 2022-2023 Ukiyo Studios, LLC. All Rights Reserved.</p>
        <div className='flex gap-4'>
          <a href="/pdf/TermsofService.pdf" target='_blank' className="text-[#2A6ED4] text-[12px] font-aber-mono">Terms of Service</a>
          <a href="/pdf/PrivacyPolicy.pdf" target='_blank' className="text-[#2A6ED4] text-[12px] font-aber-mono">Privacy Policy</a>
          <a href="https://discord.gg/ukiyonft" target='_blank' className="text-[#2A6ED4] text-[12px] font-aber-mono">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};