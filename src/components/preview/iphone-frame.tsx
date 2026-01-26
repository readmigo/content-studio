'use client';

import { cn } from '@/lib/utils';

interface IPhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  debug?: boolean;
}

export function IPhoneFrame({ children, className, debug }: IPhoneFrameProps) {
  return (
    <div className={cn('relative', className)}>
      {/* iPhone 16 Pro Max frame (380 x 826 screen, scaled from 440 x 956 pt) */}
      <div className="relative w-[400px] h-[846px] bg-[#1a1a1a] rounded-[48px] p-[10px] shadow-xl">
        {/* Dynamic Island */}
        <div className="absolute top-[16px] left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-full z-20" />

        {/* Side buttons */}
        <div className="absolute -left-[2px] top-[176px] w-[3px] h-[44px] bg-[#2a2a2a] rounded-l" />
        <div className="absolute -left-[2px] top-[250px] w-[3px] h-[81px] bg-[#2a2a2a] rounded-l" />
        <div className="absolute -left-[2px] top-[345px] w-[3px] h-[81px] bg-[#2a2a2a] rounded-l" />
        <div className="absolute -right-[2px] top-[264px] w-[3px] h-[103px] bg-[#2a2a2a] rounded-r" />

        {/* Screen */}
        <div className={cn('relative w-full h-full bg-white rounded-[48px] overflow-hidden', debug && 'bg-yellow-200')}>
          {/* Status bar */}
          <div className={cn('absolute top-0 left-0 right-0 h-[59px] flex items-end justify-between px-7 pb-1 z-10 bg-gradient-to-b from-black/10 to-transparent', debug && 'bg-green-300')}>
            <span className="text-[15px] font-semibold">9:41</span>
            <div className="flex items-center gap-2">
              {/* Wi-Fi icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 18c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0-6c3.03 0 5.78 1.23 7.76 3.22l-2.12 2.12C16.2 15.9 14.2 15 12 15s-4.2.9-5.64 2.34l-2.12-2.12C6.22 13.23 8.97 12 12 12zm0-6c4.42 0 8.44 1.79 11.34 4.69l-2.12 2.12C18.78 10.37 15.53 9 12 9s-6.78 1.37-9.22 3.81L.66 10.69C3.56 7.79 7.58 6 12 6z"/>
              </svg>
              {/* Battery icon */}
              <div className="flex items-center">
                <div className="w-7 h-3.5 border border-current rounded-sm relative">
                  <div className="absolute inset-[2px] bg-current rounded-[1px]" style={{ width: '80%' }} />
                </div>
                <div className="w-[2px] h-2 bg-current rounded-r ml-[1px]" />
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className={cn('absolute top-[59px] left-0 right-0 bottom-[34px] overflow-auto', debug && 'bg-blue-200')}>
            {children}
          </div>

          {/* Home indicator */}
          <div className={cn('absolute bottom-2 left-1/2 -translate-x-1/2 w-[140px] h-[5px] bg-black/20 rounded-full', debug && 'bg-purple-500 h-[8px]')} />
        </div>
      </div>
    </div>
  );
}
