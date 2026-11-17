import * as React from 'react'
import { cn } from 'cn'
import { Slider as SliderPrimitive } from 'radix-ui'

function Slider({ className, defaultValue, value, min = 0, max = 100, 'aria-label': ariaLabel, ...props }: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const values = React.useMemo(() => Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min], [value, defaultValue, min])
  return (
    <SliderPrimitive.Root data-slot="slider" defaultValue={defaultValue} value={value} min={min} max={max} className={cn('relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50', className)} {...props}>
      <SliderPrimitive.Track data-slot="slider-track" className="relative h-1 w-full grow overflow-hidden rounded-full bg-white/25">
        <SliderPrimitive.Range data-slot="slider-range" className="absolute h-full bg-[#8f90ff]" />
      </SliderPrimitive.Track>
      {values.map((_, index) => <SliderPrimitive.Thumb key={index} aria-label={ariaLabel} data-slot="slider-thumb" className="block size-3 shrink-0 rounded-full border border-white/70 bg-[#8f90ff] shadow-sm outline-none transition-[color,box-shadow] focus-visible:ring-2 focus-visible:ring-white/70" />)}
    </SliderPrimitive.Root>
  )
}

export { Slider }
