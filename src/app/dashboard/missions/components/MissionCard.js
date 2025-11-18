import React from 'react';
import Image from 'next/image';

// icons
import edit_icon from '../assets/edit.png'

const MissionCard = ({ mission, onUpdateStatus, onDelete, onEdit }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'in-progress':
                return 'bg-blue-500';
            case 'completed':
                return 'bg-green-500';
            default:
                return 'bg-gray-400';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'study':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4 text-blue-800">
                        <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM64 256c-17.7 0-32 14.3-32 32s14.3 32 32 32H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H32z"/>
                    </svg>
                );
            case 'exam':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-4 h-4 text-blue-800">
                        <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm172.5 96.5c-6.6-6.6-18.4-4.5-26.6 4.6l-34.4 39.7c-5.9 6.8-5.9 17.5 0 24.3l14.4 16.6c-4.9 5.8-9 12.3-11.8 19.3L153.4 224c-3.1 7.7-6.2 15.5-9.3 23.3L120.7 337c-3.2 7.7-6.2 15.5-9.3 23.3c-2.8 7.2-2.8 15.4 0 22.5L137 413.4c6.2 6.8 15.5 8.1 23.2 3.1l69.7-44.1c.3-.2 .5-.3 .8-.5l43.2-34.5c8.2-6.6 10.3-18.4 4.6-26.6l-34.5-43.2c-6.6-8.2-18.4-10.3-26.6-4.6l-50.6 40.5-23-26.6-14.4-16.6 23.3-69.7L236.5 128.5z"/>
                    </svg>
                );
            case 'interview':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4 text-blue-800">
                        <path d="M448 352a16 16 0 0 1-16 16H80a16 16 0 0 1-16-16V160a16 16 0 0 1 16-16h352a16 16 0 0 1 16 16v192zm-16-160a32 32 0 1 0 0 64 32 32 0 1 0 0-64zM256 160a32 32 0 1 0 0 64 32 32 0 1 0 0-64zM80 160a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0 160a32 32 0 1 0 0 64 32 32 0 1 0 0-64zM256 320a32 32 0 1 0 0 64 32 32 0 1 0 0-64zM432 320a32 32 0 1 0 0 64 32 32 0 1 0 0-64z"/>
                    </svg>
                );
            case 'project':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className="w-4 h-4 text-blue-800">
                        <path d="M128 0c17.7 0 32 14.3 32 32V64H224V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h48V32c0-17.7 14.3-32 32-32zM320 208H64v-64h256v64z"/>
                    </svg>
                );
            case 'work':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4 text-blue-800">
                        <path d="M160 320c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16h192c8.8 0 16-7.2 16-16v-96c0-8.8-7.2-16-16-16H160zm16-48h160c17.7 0 32-14.3 32-32v-96c0-17.7-14.3-32-32-32H176c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32zM512 160v192c0 53-43 96-96 96H96c-53 0-96-43-96-96V160c0-53 43-96 96-96h192V32c0-17.7 14.3-32 32-32s32 14.3 32 32v32h64c53 0 96 43 96 96z"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    const getDifficultyIcons = (difficulty) => {
        const starIcon = (color) => (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" className={`w-4 h-4 ${color}`}>
                <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.5 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3L288.1 426.7 410.8 512c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.2-20.9 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
            </svg>
        );
        switch (difficulty) {
            case 'easy':
                return <span className="flex">{starIcon('text-green-500')}</span>;
            case 'medium':
                return <span className="flex space-x-0.5">{starIcon('text-yellow-500')}{starIcon('text-yellow-500')}</span>;
            case 'hard':
                return <span className="flex space-x-0.5">{starIcon('text-red-500')}{starIcon('text-red-500')}{starIcon('text-red-500')}</span>;
            default:
                return null;
        }
    };

    return (
        <div className="relative bg-white rounded-lg shadow-md p-6 border-t-4 border-solid border-blue-500">
            <div className="flex justify-between items-start">
                <h3 className={`text-xl font-bold ${mission.status === 'completed' && 'line-through'}`}>{mission.title}</h3>
                <button
                    onClick={() => onEdit(mission)}
                    className="absolute top-[20px] left-[15px]"
                >
                    <Image src={edit_icon} alt="Edit" className="w-4 h-4 hover:opacity-70" />
                </button>
            </div>
            <p className={`text-sm text-gray-600 mt-2  ${mission.status === 'completed' && 'line-through'}`}>{mission.description}</p>
            <div className="mt-4 flex justify-between items-center">
                <span className="bg-blue-100 px-2 py-1 rounded-full flex justify-content-center items-center space-x-1">
                    {getTypeIcon(mission.type)}
                    <span className="text-blue-800 text-xs font-semibold">{mission.type === 'study' ? 'مذاكرة' : mission.type === 'exam' ? 'امتحان' : mission.type === 'interview' ? 'مقابلة عمل' : mission.type === 'project' ? 'مشروع' : 'عمل'}</span>
                </span>
                <span className="flex items-center space-x-1">
                    {mission.difficulty ? <span className="text-gray-600 text-sm">{mission.difficulty === "easy" ? 'سهل' : mission.difficulty === "medium" ? 'متوسط' : 'صعب' }</span> : null}
                    {getDifficultyIcons(mission.difficulty)}
                </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
                تاريخ الانتهاء: {new Date(mission.end_date).toLocaleDateString('ar-EG')}
            </p>
            <div className="mt-4 flex justify-center items-center gap-2 space-x-2 flex-wrap">
                <button
                    onClick={() => onUpdateStatus(mission._id, 'in-progress')}
                    className="w-15 px-4 py-2 text-white  bg-indigo-500 rounded-lg"
                >
                    ابدأ
                </button>
                <button
                    onClick={() => onUpdateStatus(mission._id, 'completed')}
                    className="w-15 px-4 py-2 text-white bg-green-500 rounded-lg"
                >
                    أكمل
                </button>
                <button
                    onClick={() => onDelete(mission._id)}
                    className="absolute top-[-20px] left-[-15px] px-4 py-2 text-white bg-red-500 rounded-[50%]"
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default MissionCard;
