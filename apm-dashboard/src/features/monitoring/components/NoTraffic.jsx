import React from 'react'

const NoTraffic = () => {
  return (
    <div className="flex flex-1 items-center justify-center">
    <div className="flex flex-col items-center gap-3 text-zinc-500">
      
      {/* animated pulse dot */}
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-500/40"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-zinc-500/70"></span>
      </span>

      {/* text */}
      <div className="text-center">
        <p className="text-sm font-medium text-zinc-400">
          No traffic yet
        </p>
        <p className="text-xs text-zinc-600 mt-1">
          Waiting for incoming requests
        </p>
      </div>

    </div>
  </div>
  )
}

export default NoTraffic
