'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface ProgressBarProps {
  current: number; // 1-based
  steps: string[];
}

export function ProgressBar({ current, steps }: ProgressBarProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        {steps.map((label, i) => {
          const index = i + 1;
          const isDone = index < current;
          const isActive = index === current;
          return (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={[
                    'flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors',
                    isActive
                      ? 'border-[#C9A84C] bg-[#C9A84C] text-[#1A1612]'
                      : isDone
                        ? 'border-[#C9A84C] bg-transparent text-[#C9A84C]'
                        : 'border-[rgba(201,168,76,0.3)] bg-transparent text-[#7a6e64]',
                  ].join(' ')}
                >
                  {isDone ? '✓' : index}
                </div>
                <span
                  className={[
                    'mt-2 hidden text-[10px] uppercase tracking-widest sm:block',
                    isActive ? 'text-[#F5E6C8]' : 'text-[#7a6e64]',
                  ].join(' ')}
                >
                  {label}
                </span>
              </div>
              {index < steps.length && (
                <div className="mx-2 h-px flex-1 bg-[rgba(201,168,76,0.2)]">
                  <motion.div
                    className="h-full bg-[#C9A84C]"
                    initial={false}
                    animate={{ scaleX: isDone ? 1 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.4 }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressBar;
