'use client';

import React from 'react';
import Image from 'next/image';

interface ExamSession {
  subject: string;
  startTime: string;
  endTime: string;
}

interface ExamDay {
  dayName: string;
  date: string;
  morningSession: ExamSession;
  afternoonSession: ExamSession;
  extraMorningSession?: ExamSession;
  extraAfternoonSession?: ExamSession;
}

interface ExamScheduleTableProps {
  studentName?: string;
  examNumber?: string;
  examPosition: number;
}

const examData: ExamDay[] = [
  {
    dayName: 'الاثنين',
    date: '2026/01/19',
    morningSession: {
      subject: 'اللغة العربية',
      startTime: '8:30',
      endTime: '10:30',
    },
    afternoonSession: {
      subject: 'اللغة الفرنسية',
      startTime: '12:20',
      endTime: '14:20',
    },
    extraMorningSession: {
      subject: 'العلوم الفيزيائية',
      startTime: '10:45',
      endTime: '11:45',
    },
    extraAfternoonSession: {
      subject: 'التربية الإسلامية',
      startTime: '14:30',
      endTime: '15:30',
    },
  },
  {
    dayName: 'الثلاثاء',
    date: '2026/01/20',
    morningSession: {
      subject: 'الرياضيات',
      startTime: '8:30',
      endTime: '10:30',
    },
    afternoonSession: {
      subject: 'علوم الحياة والأرض',
      startTime: '13:00',
      endTime: '14:00',
    },
    extraMorningSession: {
      subject: 'الاجتماعيات',
      startTime: '10:45',
      endTime: '12:00',
    },
    extraAfternoonSession: {
      subject: 'اللغة الإنجليزية',
      startTime: '14:15',
      endTime: '15:15',
    },
  },
];

export function ExamScheduleTable({ studentName = '', examNumber = '', examPosition }: ExamScheduleTableProps) {
  return (
    <div className="a4-page-container max-w-[1000px] mx-auto p-8 md:p-12">
      {/* Logo Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="w-32 h-32 relative shrink-0">
          <Image
            src="/leftLogo.png"
            alt="Left Logo"
            fill
            className="object-contain"
          />
        </div>
        <div className="text-center px-4">
          <h1 className="text-2xl font-normal mb-1"> الامتحان الموحد على صعيد المؤسسة</h1>
          <h1 className="text-2xl font-normal mb-1">Examen normalisé local</h1>
          <p className="text-xl">Session : Janvier 2026</p>
        </div>
        <div className="w-32 h-32 relative shrink-0">
          <Image
            src="/rightLogo.png"
            alt="Right Logo"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Student Info Header */}
      <div className="flex justify-between  ">
        <div className="text-lg font-bold shrink-0">
          اسم التلميذ الكامل: <span className="font-normal text-xl">{studentName}</span>
        </div>
        <div className="text-lg font-bold mr-8 pr-[200px] shrink-0">
          رقم التلميذ: <span className="font-normal text-xl">{examNumber}</span>
        </div>
      </div>

            {/* Exam Position Footer */}
      <div className="text-right mt-2">
        <p className="text-xl font-bold">
          رقم الامتحان: <span className="font-normal">{examPosition}</span>
        </p>
      </div>

      {/* Table */}
      <table className="w-full border-collapse mt-10">
        <thead>
          {/* Row 1: Main headers */}
          <tr>
            <th rowSpan={3} className="border border-black p-2.5 text-center bg-[#e8e8e8] font-bold">
              التاريخ
            </th>
            <th colSpan={3} className="border border-black p-2.5 text-center bg-[#e8e8e8] font-bold">
              الفترة الصباحية
            </th>
            <th colSpan={3} className="border border-black p-2.5 text-center bg-[#e8e8e8] font-bold">
              فترة ما بعد الزوال
            </th>
          </tr>
          {/* Row 2: Subject and Time headers */}
          <tr>
            <th rowSpan={2} className="border border-black p-2.5 text-center bg-[#e8e8e8] font-bold">
              المادة
            </th>
            <th colSpan={2} className="border border-black p-2.5 text-center bg-[#e8e8e8] font-bold">
              التوقيت
            </th>
            <th rowSpan={2} className="border border-black p-2.5 text-center bg-[#e8e8e8] font-bold">
              المادة
            </th>
            <th colSpan={2} className="border border-black p-2.5 text-center bg-[#e8e8e8] font-bold">
              التوقيت
            </th>
          </tr>
          {/* Row 3: From/To headers */}
          <tr>
            <th className="border border-black p-2.5 text-center bg-[#e8e8e8] font-bold">من</th>
            <th className="border border-black p-2.5 text-center bg-[#e8e8e8] font-bold">إلى</th>
            <th className="border border-black p-2.5 text-center bg-[#e8e8e8] font-bold">من</th>
            <th className="border border-black p-2.5 text-center bg-[#e8e8e8] font-bold">إلى</th>
          </tr>
        </thead>
        <tbody>
          {examData.map((day, index) => (
            <React.Fragment key={index}>
              {/* First session row */}
              <tr>
                <td rowSpan={2} className="border border-black p-2.5 text-center font-bold bg-[#f0f0f0] align-middle">
                  <span className="block text-base mb-1">{day.dayName}</span>
                  <span className="block text-sm">{day.date}</span>
                </td>
                <td className="border border-black p-2.5 text-center">{day.morningSession.subject}</td>
                <td className="border border-black p-2.5 text-center font-bold">{day.morningSession.startTime}</td>
                <td className="border border-black p-2.5 text-center font-bold">{day.morningSession.endTime}</td>
                <td className="border border-black p-2.5 text-center">{day.afternoonSession.subject}</td>
                <td className="border border-black p-2.5 text-center font-bold">{day.afternoonSession.startTime}</td>
                <td className="border border-black p-2.5 text-center font-bold">{day.afternoonSession.endTime}</td>
              </tr>
              {/* Second session row */}
              {day.extraMorningSession && day.extraAfternoonSession && (
                <tr>
                  <td className="border border-black p-2.5 text-center">{day.extraMorningSession.subject}</td>
                  <td className="border border-black p-2.5 text-center font-bold">{day.extraMorningSession.startTime}</td>
                  <td className="border border-black p-2.5 text-center font-bold">{day.extraMorningSession.endTime}</td>
                  <td className="border border-black p-2.5 text-center">{day.extraAfternoonSession.subject}</td>
                  <td className="border border-black p-2.5 text-center font-bold">{day.extraAfternoonSession.startTime}</td>
                  <td className="border border-black p-2.5 text-center font-bold">{day.extraAfternoonSession.endTime}</td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white;
            padding: 0;
          }
          .max-w-\\[1000px\\] {
            box-shadow: none;
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
}
