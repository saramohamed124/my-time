'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

// icons
import dashboard from '../assets/icons/dashboard.svg';
import mission from '../assets/icons/mission.svg';
import tasks from '../assets/icons/tasks.svg';
import account from '../assets/icons/account.svg';
import jobs from '../assets/icons/jobs.svg';
import log from '../assets/icons/logout.svg';

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="h-screen w-fit md:w-64 bg-white shadow-xl flex flex-col p-2 md:p-6 whitespace-nowrap">
      <nav className="flex flex-col gap-6">
        <SidebarItem icon={dashboard} label="لوحة التحكم" link="/dashboard" />
        <SidebarItem icon={mission} label="المهام" link="/dashboard/missions" />
        <SidebarItem icon={tasks} label="التاسكات" link="/dashboard/tasks" />
        <SidebarItem icon={jobs} label="المجالات والوظائف" link="/dashboard/jobs" />
        <SidebarItem icon={account} label="حسابي" link="/dashboard/my-profile" />
        <button
          className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded transition-all duration-300"
          onClick={logout}
        >
          <Image src={log} alt="logout" width={24} height={24} />
          <span className="hidden md:block text-gray-700 font-medium">تسجيل الخروج</span>
        </button>
      </nav>
    </aside>
  );
};

const SidebarItem = ({ icon, label, link }) => {
  return (
    <Link href={link} className="flex items-center gap-4 hover:bg-gray-100 p-2 rounded transition-all duration-300">
      <Image src={icon} alt={label} width={24} height={24} />
      <span className="hidden md:block text-gray-700 font-medium">{label}</span>
    </Link>
  );
};

export default Sidebar;
