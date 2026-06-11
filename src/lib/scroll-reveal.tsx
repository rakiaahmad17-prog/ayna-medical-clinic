'use client'

import { useEffect, useRef, useState } from 'react'

export function useScrollReveal(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px', ...options }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [options])

  return { ref, isVisible }
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'fade'
}) {
  const { ref, isVisible } = useScrollReveal()

  const directionStyles = {
    up: 'translateY(30px)',
    left: 'translateX(-30px)',
    right: 'translateX(30px)',
    fade: '',
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`transition-all duration-600 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : directionStyles[direction],
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export function StaggerReveal({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`space-y-4 ${className}`}
    >
      {Array.isArray(children)
        ? (children as React.ReactNode[]).map((child, i) => (
            <div
              key={i}
              className="transition-all duration-500 ease-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${i * 100}ms`,
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  )
}