/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';

function Slide({ image, isActive }: { image: string, isActive: boolean }) {
  return (
    <div className={`slide ${isActive ? 'active' : ''}`}>
      <img src={image} alt="" />
    </div>
  );
}

function Carousel({ slides, interval }: { slides: Array<string>, interval: number }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentSlide(currentSlide => (currentSlide + 1) % slides.length);
    }, interval);

    return () => clearInterval(timerId);
  }, [slides.length, interval]);

  return (
    <div className="carousel">
      {slides.map((slide, index) => (
        <Slide key={index} image={slide} isActive={currentSlide === index} />
      ))}
    </div>
  );
}


export default Carousel;
