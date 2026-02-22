import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

/**
 * ThemePreviewCard - Displays a visual preview of a theme
 *
 * @param {Object} props
 * @param {Object} props.theme - Theme object from ThemeContext
 * @param {boolean} props.isSelected - Whether this theme is currently selected
 * @param {Function} props.onClick - Click handler for theme selection
 * @param {string} props.size - Size variant: 'small' | 'medium' | 'large'
 */
function ThemePreviewCard({
  theme,
  isSelected = false,
  onClick,
  size = 'medium'
}) {
  // Handle system theme (no colors)
  if (theme.followsSystem) {
    return (
      <div
        onClick={onClick}
        className={`
          cursor-pointer rounded-lg border p-3 transition-all duration-200
          ${isSelected
            ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }
          ${size === 'small' ? 'p-2' : size === 'large' ? 'p-4' : 'p-3'}
        `}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
        aria-pressed={isSelected}
      >
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
              {theme.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Follows system preference
            </div>
          </div>
          {isSelected && (
            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
          )}
        </div>
      </div>
    );
  }

  // Helper to convert HSL to CSS color
  const hslToCss = (hsl) => `hsl(${hsl})`;

  const { name, isDark, colors } = theme;
  const { primary, secondary, accent, ring, background, foreground } = colors || {};

  const sizeClasses = {
    small: {
      container: 'p-2',
      text: 'text-xs',
      gradient: 'h-3',
      swatch: 'w-3 h-3'
    },
    medium: {
      container: 'p-3',
      text: 'text-sm',
      gradient: 'h-5',
      swatch: 'w-4 h-4'
    },
    large: {
      container: 'p-4',
      text: 'text-base',
      gradient: 'h-6',
      swatch: 'w-5 h-5'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer rounded-lg border transition-all duration-200
        ${isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
        }
        ${currentSize.container}
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      aria-pressed={isSelected}
    >
      {/* Header with name and icon */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {isDark ? (
            <Moon className={`w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0`} />
          ) : (
            <Sun className={`w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0`} />
          )}
          <span className={`font-medium ${currentSize.text} text-gray-900 dark:text-gray-100 truncate`}>
            {name}
          </span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {isDark ? 'Dark' : 'Light'}
          </span>
          {isSelected && (
            <div className={`w-2 h-2 rounded-full bg-blue-500 ml-1`} />
          )}
        </div>
      </div>

      {/* Full color palette showing all theme colors */}
      {colors && (
        <>
          {/* Main gradient bar with primary, secondary, accent */}
          <div className={`w-full ${currentSize.gradient} rounded-md overflow-hidden flex mb-2`}>
            <div
              className="flex-1"
              style={{ backgroundColor: hslToCss(primary) }}
              title={`Primary: ${primary}`}
            />
            <div
              className="flex-1"
              style={{ backgroundColor: hslToCss(secondary) }}
              title={`Secondary: ${secondary}`}
            />
            <div
              className="flex-1"
              style={{ backgroundColor: hslToCss(accent) }}
              title={`Accent: ${accent}`}
            />
          </div>

          {/* Color swatches with labels */}
          {size !== 'small' && (
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-full ${currentSize.swatch} rounded-md border border-gray-200 dark:border-gray-700`}
                  style={{ backgroundColor: hslToCss(primary) }}
                  title={`Primary: ${primary}`}
                />
                <span className="text-[10px] text-gray-500 dark:text-gray-400">Primary</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-full ${currentSize.swatch} rounded-md border border-gray-200 dark:border-gray-700`}
                  style={{ backgroundColor: hslToCss(secondary) }}
                  title={`Secondary: ${secondary}`}
                />
                <span className="text-[10px] text-gray-500 dark:text-gray-400">Secondary</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-full ${currentSize.swatch} rounded-md border border-gray-200 dark:border-gray-700`}
                  style={{ backgroundColor: hslToCss(accent) }}
                  title={`Accent: ${accent}`}
                />
                <span className="text-[10px] text-gray-500 dark:text-gray-400">Accent</span>
              </div>
            </div>
          )}

          {/* Background/Foreground preview */}
          {size === 'large' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-full ${currentSize.swatch} rounded-md border border-gray-200 dark:border-gray-700`}
                  style={{ backgroundColor: hslToCss(background) }}
                  title={`Background: ${background}`}
                />
                <span className="text-[10px] text-gray-500 dark:text-gray-400">BG</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-full ${currentSize.swatch} rounded-md border border-gray-200 dark:border-gray-700`}
                  style={{ backgroundColor: hslToCss(foreground) }}
                  title={`Foreground: ${foreground}`}
                />
                <span className="text-[10px] text-gray-500 dark:text-gray-400">FG</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * ThemePreviewMini - Compact inline preview for dropdowns
 * 
 * @param {Object} props
 * @param {Object} props.theme - Theme object from ThemeContext
 */
export function ThemePreviewMini({ theme }) {
  if (theme.followsSystem) {
    return (
      <div className="flex items-center gap-2">
        <Monitor className="w-3.5 h-3.5 text-gray-500" />
        <span>{theme.name}</span>
      </div>
    );
  }

  const { name, isDark, colors } = theme;
  const hslToCss = (hsl) => `hsl(${hsl})`;

  return (
    <div className="flex items-center gap-2">
      {/* Mini gradient indicator */}
      {colors && (
        <div className="flex gap-0.5">
          <div 
            className="w-3 h-3 rounded-sm" 
            style={{ backgroundColor: hslToCss(colors.primary) }}
            title={`Primary: ${colors.primary}`}
          />
          <div 
            className="w-3 h-3 rounded-sm" 
            style={{ backgroundColor: hslToCss(colors.ring) }}
            title={`Ring: ${colors.ring}`}
          />
        </div>
      )}
      <span>{name}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {isDark ? '(Dark)' : '(Light)'}
      </span>
    </div>
  );
}

export default ThemePreviewCard;
