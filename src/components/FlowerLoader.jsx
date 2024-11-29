import React, { useEffect, useState } from 'react';
import './FlowerLoader.css';

const FlowerLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="loading-wrapper">
      <div className="loading flower-loader"></div>
    </div>
  );
};

export default FlowerLoader;
