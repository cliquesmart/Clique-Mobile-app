import React from 'react';

const useSlider = (initialIndex, slideLength) => {
  const [activeIndex, setActiveIndex] = React.useState(initialIndex);
  const showNextSlide = (tappedIndex) => {
    setActiveIndex(
      typeof tappedIndex === 'number'
        ? tappedIndex
        : (activeIndex + 1) % slideLength,
    );
  };
  return [activeIndex, showNextSlide];
};

export default useSlider;
