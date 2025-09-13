'use client';
import React, { forwardRef, memo } from 'react';
import SvgBase from './SvgBase';
import { REGISTRY } from './registry';

const SvgIcon = memo(forwardRef(function SvgIcon({
  name,
  // SvgBase passthrough
  size, width, height, viewBox,
  color, secondaryColor, stroke, strokeWidth,
  title, decorative = false,
  className, style,
  ...rest
}, ref) {
  const Comp = REGISTRY[name];
  if (!Comp) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`[SvgIcon] Unknown icon "${name}". Did you register it?`);
    }
    return null;
  }

  const vb = viewBox || Comp.viewBox || '0 0 24 24';

  return (
    <SvgBase
      ref={ref}
      size={size} width={width} height={height} viewBox={vb}
      color={color} secondaryColor={secondaryColor}
      stroke={stroke} strokeWidth={strokeWidth}
      title={title} decorative={decorative}
      className={className} style={style}
      {...rest}
    >
      <Comp />
    </SvgBase>
  );
}));

export default SvgIcon;