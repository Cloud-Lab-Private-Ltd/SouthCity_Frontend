'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { IoMdNotifications } from 'react-icons/io';

const Header = () => {
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      setCurrentDateTime(now.toLocaleDateString(undefined, options));
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, []);

  return (
    <header className="w-full bg-white py-4 px-6 drop-shadow-md shadow-black flex justify-between items-center">
      {/* Display Current Date and Time */}
      <h2 className="text-xs text-gray-500">{currentDateTime}</h2>

      <div className="flex items-center space-x-4">
        {/* Notification */}
        <button className="relative text-4xl text-blue-500">
        <IoMdNotifications /><span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">1</span>
        </button>

        {/* Profile */}
        <div className="flex items-center space-x-2">
          <Image
            width={32}
            height={32}
            src="/images/profile-pic.jpg"
            alt="Admin Profile"
            className="w-8 h-8 rounded-full"
          />
          <div className="text-sm">
            <p className="font-semibold text-gray-700">Muhammad Ahmed</p>
            <p className="text-gray-500">(Admin)</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
