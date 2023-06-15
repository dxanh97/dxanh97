import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import css from './Cursor.module.scss';

const Cursor: React.FC = () => {
  const $bigCursor = useRef<HTMLDivElement>(null);
  const $smallCursor = useRef<HTMLDivElement>(null);
  const isMouseOnScreen = useRef(false);

  useEffect(() => {
    document.body.addEventListener('mousemove', (e) => {
      if (
        !isMouseOnScreen.current &&
        $bigCursor.current?.style &&
        $smallCursor.current?.style
      ) {
        $bigCursor.current.style.opacity = '1';
        $smallCursor.current.style.opacity = '1';
        isMouseOnScreen.current = true;
      }
      gsap.to($bigCursor.current, 0.45, {
        x: e.pageX - 15,
        y: e.pageY - 15,
      });
      gsap.to($smallCursor.current, 0.1, {
        x: e.pageX - 5,
        y: e.pageY - 12,
      });
    });

    document.body.addEventListener('mouseleave', () => {
      isMouseOnScreen.current = false;
      if ($bigCursor.current?.style && $smallCursor.current?.style) {
        $bigCursor.current.style.opacity = '0';
        $smallCursor.current.style.opacity = '0';
      }
    });

    const $hoverables = document.querySelectorAll('a');
    $hoverables.forEach(($hoverable) => {
      $hoverable.addEventListener('mouseenter', () => {
        gsap.to($bigCursor.current, 0.2, {
          scale: 3,
        });
      });
      $hoverable.addEventListener('mouseleave', () => {
        gsap.to($bigCursor.current, 0.2, {
          scale: 1,
        });
      });
    });
  }, []);

  return (
    <div className={css['cursor-wrapper']}>
      <div ref={$bigCursor} className={css['cursor']}>
        <svg height="30" width="30">
          <circle cx="15" cy="15" r="12" strokeWidth="0" />
        </svg>
      </div>

      <div ref={$smallCursor} className={css['cursor']}>
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="4" strokeWidth="0" />
        </svg>
      </div>
    </div>
  );
};

export default Cursor;
