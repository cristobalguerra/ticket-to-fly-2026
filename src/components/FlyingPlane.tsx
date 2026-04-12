export default function FlyingPlane() {
  return (
    <div className="flying-plane-container">
      <div className="flying-plane">
        {/* Trail */}
        <div className="plane-trail" />
        {/* Paper airplane SVG */}
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="plane-svg">
          {/* Shadow/dark plane */}
          <path d="M8 38L24 24L20 28L8 38Z" fill="#1a1a2e" opacity="0.3" />
          {/* Main body - white */}
          <path d="M4 20L44 8L24 24L4 20Z" fill="white" />
          {/* Top fold - light */}
          <path d="M4 20L44 8L28 18L4 20Z" fill="rgba(255,255,255,0.9)" />
          {/* Bottom fold - blue accent */}
          <path d="M44 8L24 24L20 40L44 8Z" fill="#4466cc" opacity="0.8" />
          {/* Inner fold - darker blue */}
          <path d="M24 24L20 40L18 28L24 24Z" fill="#2a2a5e" opacity="0.6" />
          {/* Edge highlight */}
          <path d="M4 20L44 8" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  )
}
