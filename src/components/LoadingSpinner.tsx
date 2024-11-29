// LoadingSpinner.tsx
import React from "react";

interface LoadingSpinnerProps {
  size?: number; // Size of the spinner in pixels
  color?: string; // Color of the spinner
  borderThickness?: number; // Thickness of the spinner border
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = "#000",
  borderThickness = 4,
}) => {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `${borderThickness}px solid ${color}20`, // 20% opacity for background ring
        borderTop: `${borderThickness}px solid ${color}`, // Full opacity for rotating ring
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
  );
};

export default LoadingSpinner;
