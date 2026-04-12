export default function FlyingPlane() {
  const src = import.meta.env.BASE_URL + 'avion.png'
  return (
    <div className="flying-plane-container">
      <div className="flying-plane">
        <img
          src={src}
          alt=""
          className="plane-img"
        />
      </div>
    </div>
  )
}
