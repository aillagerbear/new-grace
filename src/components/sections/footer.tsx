import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#F7FAFC] py-8">
      <div className="container max-w-[1200px] mx-auto px-4 text-center text-[12px] text-[#A0AEC0]">
        © {new Date().getFullYear()} Grace Church
      </div>
    </footer>
  );
};

export default Footer;