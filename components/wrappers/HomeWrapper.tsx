'use client';

export function HomeWrapper({ children, className }: any) {
  return (
    <div className="flex w-full justify-center gap-2 bg-[#F5F5F5]">
      <div
        className={`mt-[90px] flex h-full flex-col pb-20 xs:ml-3 xs:mr-3 xs:w-[380px] sm:w-[480px] md:w-[768px] lg:w-[80%] xl:w-[80%] 2xl:w-[1440px] ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
