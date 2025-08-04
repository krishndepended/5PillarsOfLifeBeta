// src/components/SvgSanskritIcon.tsx - SCALABLE SANSKRIT SYMBOL LIBRARY
import React from 'react';
import Svg, { Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';

interface SvgSanskritIconProps {
  symbol: 'om' | 'lotus' | 'chakra' | 'mandala' | 'trishul' | 'swastika' | 'yantra';
  size: number;
  color?: string;
  gradient?: boolean;
  theme?: 'light' | 'dark';
}

const SvgSanskritIcon: React.FC<SvgSanskritIconProps> = ({
  symbol,
  size,
  color = '#8B5CF6',
  gradient = true,
  theme = 'light'
}) => {
  const center = size / 2;

  const symbolPaths = {
    om: `M ${size * 0.2} ${size * 0.3} 
         C ${size * 0.1} ${size * 0.2}, ${size * 0.1} ${size * 0.4}, ${size * 0.2} ${size * 0.5}
         C ${size * 0.3} ${size * 0.6}, ${size * 0.5} ${size * 0.5}, ${size * 0.6} ${size * 0.4}
         C ${size * 0.8} ${size * 0.3}, ${size * 0.8} ${size * 0.6}, ${size * 0.7} ${size * 0.7}
         C ${size * 0.6} ${size * 0.8}, ${size * 0.4} ${size * 0.7}, ${size * 0.3} ${size * 0.6}
         L ${size * 0.2} ${size * 0.3} Z
         M ${size * 0.7} ${size * 0.2}
         C ${size * 0.75} ${size * 0.15}, ${size * 0.8} ${size * 0.2}, ${size * 0.75} ${size * 0.25}
         C ${size * 0.7} ${size * 0.3}, ${size * 0.65} ${size * 0.25}, ${size * 0.7} ${size * 0.2} Z`,
    
    lotus: `M ${center} ${size * 0.9}
            ${Array.from({ length: 8 }, (_, i) => {
              const angle = (i * 45 - 90) * Math.PI / 180;
              const petalLength = size * 0.35;
              const controlLength = size * 0.2;
              
              const x1 = center + controlLength * Math.cos(angle - 0.3);
              const y1 = center + controlLength * Math.sin(angle - 0.3);
              const x2 = center + petalLength * Math.cos(angle);
              const y2 = center + petalLength * Math.sin(angle);
              const x3 = center + controlLength * Math.cos(angle + 0.3);
              const y3 = center + controlLength * Math.sin(angle + 0.3);
              
              return `C ${x1} ${y1} ${x2} ${y2} ${x3} ${y3}`;
            }).join(' ')} Z`,
    
    chakra: `${Array.from({ length: 6 }, (_, i) => {
              const angle = i * 60 * Math.PI / 180;
              const radius = size * 0.4;
              const innerRadius = size * 0.15;
              
              const x1 = center + radius * Math.cos(angle);
              const y1 = center + radius * Math.sin(angle);
              const x2 = center + innerRadius * Math.cos(angle + Math.PI / 6);
              const y2 = center + innerRadius * Math.sin(angle + Math.PI / 6);
              const x3 = center + innerRadius * Math.cos(angle - Math.PI / 6);
              const y3 = center + innerRadius * Math.sin(angle - Math.PI / 6);
              
              return `M ${center} ${center} L ${x1} ${y1} L ${x2} ${y2} Z M ${center} ${center} L ${x1} ${y1} L ${x3} ${y3} Z`;
            }).join(' ')}`,
    
    mandala: `${Array.from({ length: 12 }, (_, i) => {
                const angle = i * 30 * Math.PI / 180;
                const radius1 = size * 0.4;
                const radius2 = size * 0.25;
                const radius3 = size * 0.1;
                
                const x1 = center + radius1 * Math.cos(angle);
                const y1 = center + radius1 * Math.sin(angle);
                const x2 = center + radius2 * Math.cos(angle);
                const y2 = center + radius2 * Math.sin(angle);
                const x3 = center + radius3 * Math.cos(angle);
                const y3 = center + radius3 * Math.sin(angle);
                
                return `M ${x3} ${y3} L ${x2} ${y2} L ${x1} ${y1}`;
              }).join(' ')}`,
    
    trishul: `M ${center} ${size * 0.1} 
              L ${center - size * 0.05} ${size * 0.3}
              L ${center - size * 0.15} ${size * 0.25}
              L ${center - size * 0.1} ${size * 0.4}
              L ${center} ${size * 0.35}
              L ${center + size * 0.1} ${size * 0.4}
              L ${center + size * 0.15} ${size * 0.25}
              L ${center + size * 0.05} ${size * 0.3}
              L ${center} ${size * 0.1} Z
              M ${center - size * 0.02} ${size * 0.35}
              L ${center + size * 0.02} ${size * 0.35}
              L ${center + size * 0.02} ${size * 0.9}
              L ${center - size * 0.02} ${size * 0.9} Z`,
    
    swastika: `M ${center - size * 0.2} ${center - size * 0.05}
               L ${center - size * 0.2} ${center - size * 0.3}
               L ${center - size * 0.15} ${center - size * 0.3}
               L ${center - size * 0.15} ${center - size * 0.05}
               L ${center + size * 0.05} ${center - size * 0.05}
               L ${center + size * 0.05} ${center - size * 0.15}
               L ${center + size * 0.3} ${center - size * 0.15}
               L ${center + size * 0.3} ${center - size * 0.1}
               L ${center + size * 0.05} ${center - size * 0.1}
               L ${center + size * 0.05} ${center + size * 0.05}
               L ${center + size * 0.2} ${center + size * 0.05}
               L ${center + size * 0.2} ${center + size * 0.3}
               L ${center + size * 0.15} ${center + size * 0.3}
               L ${center + size * 0.15} ${center + size * 0.05}
               L ${center - size * 0.05} ${center + size * 0.05}
               L ${center - size * 0.05} ${center + size * 0.15}
               L ${center - size * 0.3} ${center + size * 0.15}
               L ${center - size * 0.3} ${center + size * 0.1}
               L ${center - size * 0.05} ${center + size * 0.1}
               L ${center - size * 0.05} ${center - size * 0.05}
               L ${center - size * 0.2} ${center - size * 0.05} Z`,
    
    yantra: `M ${center} ${size * 0.1}
             L ${center - size * 0.35} ${size * 0.7}
             L ${center + size * 0.35} ${size * 0.7} Z
             M ${center} ${size * 0.9}
             L ${center - size * 0.35} ${size * 0.3}
             L ${center + size * 0.35} ${size * 0.3} Z`
  };

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        {gradient && (
          <LinearGradient
            id={`sanskrit-gradient-${symbol}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor={color} stopOpacity="1" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </LinearGradient>
        )}
      </Defs>

      <G>
        <Path
          d={symbolPaths[symbol]}
          fill={gradient ? `url(#sanskrit-gradient-${symbol})` : color}
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
};

export default SvgSanskritIcon;
