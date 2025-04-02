"use client";

import React from 'react';
import Navigation from './navigation/Navigation';

// This file is a wrapper to maintain backward compatibility
// It imports the modular Navigation component from the navigation directory

const NavigationWrapper = () => {
  return <Navigation />;
};

export default NavigationWrapper;
