export default function FlyingPlane() {
  return (
    <div className="flying-plane-container">
      <div className="flying-plane">
        {/* Trail */}
        <div className="plane-trail" />
        {/* Paper airplane SVG - clean geometric perspective */}
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="plane-svg">
          {/* Top wing - bright white */}
          <polygon points="5,45 95,15 50,50" fill="white" />
          {/* Bottom wing - blue accent */}
          <polygon points="95,15 50,50 55,85" fill="#4466cc" />
          {/* Top fold crease - slightly darker */}
          <polygon points="5,45 95,15 60,38 30,46" fill="rgba(220,225,235,0.9)" />
          {/* Inner fold - dark blue */}
          <polygon points="50,50 55,85 48,58" fill="#2a2a5e" />
          {/* Center line highlight */}
          <line x1="5" y1="45" x2="95" y2="15" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
          <line x1="95" y1="15" x2="50" y2="50" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
        </svg>
      </div>
    </div>
  )
}
