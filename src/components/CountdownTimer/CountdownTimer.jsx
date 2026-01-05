import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="timer-wrapper">
      {Object.keys(timeLeft).length ? (
        Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="timer-unit">
            <span className="timer-number font-tech">
              {value < 10 ? `0${value}` : value}
            </span>
            <span className="label-caps">{unit}</span>
          </div>
        ))
      ) : (
        <span className="timer-live-text font-tech">PRE-SALE IS LIVE!</span>
      )}

      <style>{`
        .timer-wrapper { display: flex; gap: 12px; }
        .timer-unit { 
          display: flex; flex-direction: column; align-items: center; 
          background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 12px;
          border: 1px solid var(--border); min-width: 65px;
        }
        .timer-number { font-size: 1.75rem; font-weight: 700; color: var(--primary); line-height: 1; margin-bottom: 4px; }
        .timer-live-text { font-size: 1.5rem; font-weight: 700; color: var(--primary); letter-spacing: 0.1em; }
        
        @media (max-width: 480px) {
          .timer-wrapper { gap: 8px; }
          .timer-unit { min-width: 55px; padding: 10px; }
          .timer-number { font-size: 1.4rem; }
        }
      `}</style>
    </div>
  );
};

export default CountdownTimer;
