'use client'

import { useEffect, useRef, useState } from 'react'

type BrandedVideoProps = {
  label: string
  locale: 'en' | 'fr'
  poster: string
  src: string
}

const labels = {
  en: { play: 'Play video', pause: 'Pause video', mute: 'Mute', unmute: 'Unmute', fullscreen: 'Enter fullscreen', exitFullscreen: 'Exit fullscreen', progress: 'Video progress' },
  fr: { play: 'Lire la vidéo', pause: 'Mettre en pause', mute: 'Couper le son', unmute: 'Rétablir le son', fullscreen: 'Passer en plein écran', exitFullscreen: 'Quitter le plein écran', progress: 'Progression de la vidéo' },
}

function formatTime(value: number) {
  if (!Number.isFinite(value)) return '0:00'
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

export function BrandedVideo({ label, locale, poster, src }: BrandedVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const copy = labels[locale]

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(document.fullscreenElement === wrapperRef.current)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) await video.play()
    else video.pause()
  }

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen()
    else await wrapperRef.current?.requestFullscreen()
  }

  return (
    <div ref={wrapperRef} className="group relative aspect-video w-full overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#11131f] shadow-2xl shadow-black/20">
      <video
        ref={videoRef}
        playsInline
        preload="metadata"
        poster={poster}
        className="h-full w-full cursor-pointer object-cover"
        aria-label={label}
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
      >
        <source src={src} type="video/mp4" />
      </video>

      {!isPlaying ? (
        <button type="button" onClick={togglePlay} aria-label={copy.play} className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-primary text-white shadow-xl shadow-black/25 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-current"><path d="M8 5v14l11-7z" /></svg>
        </button>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#11131f] via-[#11131f]/85 to-transparent px-4 pt-10 pb-3 sm:px-5">
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => {
            const nextTime = Number(event.target.value)
            if (videoRef.current) videoRef.current.currentTime = nextTime
            setCurrentTime(nextTime)
          }}
          aria-label={copy.progress}
          className="h-1 w-full cursor-pointer accent-[#8f90ff]"
        />
        <div className="mt-2 flex items-center gap-3 text-xs font-medium text-white/75">
          <button type="button" onClick={togglePlay} aria-label={isPlaying ? copy.pause : copy.play} className="rounded-md p-1 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
            {isPlaying ? <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg> : <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M8 5v14l11-7z" /></svg>}
          </button>
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          <button type="button" onClick={() => { if (videoRef.current) videoRef.current.muted = !isMuted; setIsMuted((value) => !value) }} aria-label={isMuted ? copy.unmute : copy.mute} className="ml-auto rounded-md p-1 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
            {isMuted ? <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2"><path d="M11 5 6 9H3v6h3l5 4zM16 9l5 6m0-6-5 6" /></svg> : <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2"><path d="M11 5 6 9H3v6h3l5 4zM15 9a4 4 0 0 1 0 6m3-9a8 8 0 0 1 0 12" /></svg>}
          </button>
          <button type="button" onClick={toggleFullscreen} aria-label={isFullscreen ? copy.exitFullscreen : copy.fullscreen} className="rounded-md p-1 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2"><path d={isFullscreen ? 'M9 9H5V5m10 4h4V5M9 15H5v4m10-4h4v4' : 'M8 3H3v5m13-5h5v5M8 21H3v-5m13 5h5v-5'} /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
