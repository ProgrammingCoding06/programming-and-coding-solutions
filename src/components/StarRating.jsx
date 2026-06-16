import { useId } from 'react'

function Star({ index, rating, starColor, filledColor, starSize, gradientPrefix }) {
  const commonProps = {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    width: `${starSize}px`,
    height: `${starSize}px`,
    'aria-hidden': 'true',
    focusable: 'false',
  }

  const starPath =
    'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'

  if (rating >= index + 1) {
    return (
      <svg {...commonProps} fill={filledColor}>
        <path d={starPath} />
      </svg>
    )
  }

  if (rating > index && rating < index + 1) {
    const gradientId = `${gradientPrefix}-half-fill-${index}`

    return (
      <svg {...commonProps}>
        <defs>
          <linearGradient id={gradientId}>
            <stop offset="50%" stopColor={filledColor} />
            <stop offset="50%" stopColor={starColor} />
          </linearGradient>
        </defs>
        <path fill={`url(#${gradientId})`} d={starPath} />
      </svg>
    )
  }

  return (
    <svg {...commonProps} fill={starColor}>
      <path d={starPath} />
    </svg>
  )
}

export default function StarRating({
  rating = 5,
  starColor = '#303035',
  filledColor = '#ffd700',
  starSize = 20,
  textSize = 16,
  textWeight = 800,
  textColor = 'currentColor',
  className = '',
  showValue = true,
}) {
  const gradientPrefix = useId().replaceAll(':', '')
  const clampedRating = Math.max(0, Math.min(5, Number(rating) || 0))
  const formattedRating = Number.isInteger(clampedRating)
    ? `${clampedRating}.0`
    : clampedRating.toFixed(1)

  return (
    <div
      className={`framer-rating ${className}`.trim()}
      aria-label={`${formattedRating} out of 5 rating`}
      style={{
        '--rating-text-size': `${textSize}px`,
        '--rating-text-weight': textWeight,
        '--rating-text-color': textColor,
      }}
    >
      {showValue ? <span className="framer-rating__value">{formattedRating}</span> : null}
      <span className="framer-rating__stars">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            index={index}
            rating={clampedRating}
            starColor={starColor}
            filledColor={filledColor}
            starSize={starSize}
            gradientPrefix={gradientPrefix}
          />
        ))}
      </span>
    </div>
  )
}
