import React from 'react';
import './ProgressChart.css';

const ProgressChart = ({ title, linkText, linkHref, data }) => {
  // Calculate total and percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Calculate stroke-dasharray for donut chart
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  let accumulatedOffset = 0;
  const segments = data.map((item) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const dashLength = (percentage / 100) * circumference;
    const offset = accumulatedOffset;
    accumulatedOffset += dashLength;

    return {
      ...item,
      percentage,
      dashArray: `${dashLength} ${circumference - dashLength}`,
      dashOffset: -offset
    };
  });

  return (
    <div className="progress-chart">
      <div className="progress-chart__header">
        <div className="progress-chart__title-wrapper">
          <div className="progress-chart__icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <h3 className="progress-chart__title">{title}</h3>
        </div>
        {linkText && (
          <a href={linkHref || '#'} className="progress-chart__link">
            {linkText} <span>&rarr;</span>
          </a>
        )}
      </div>

      <div className="progress-chart__content">
        <div className="progress-chart__donut">
          <svg viewBox="0 0 180 180" className="progress-chart__svg">
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="16"
            />
            {/* Data segments */}
            {segments.map((segment, index) => (
              <circle
                key={index}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="16"
                strokeDasharray={segment.dashArray}
                strokeDashoffset={segment.dashOffset}
                strokeLinecap="round"
                transform="rotate(-90 90 90)"
                className="progress-chart__segment"
              />
            ))}
          </svg>
          <div className="progress-chart__center">
            <span className="progress-chart__total">{total}</span>
            <span className="progress-chart__total-label">Total</span>
          </div>
        </div>

        <div className="progress-chart__legend">
          {segments.map((segment, index) => (
            <div key={index} className="progress-chart__legend-item">
              <span
                className="progress-chart__legend-color"
                style={{ backgroundColor: segment.color }}
              />
              <span className="progress-chart__legend-label">{segment.label}</span>
              <span className="progress-chart__legend-value">
                {segment.value} ({segment.percentage.toFixed(0)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
