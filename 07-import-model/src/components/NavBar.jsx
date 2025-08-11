export default function NavBar() {
  return (
    <nav
     style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      width: "100vw", 
      background: "#222",
      color: "#fff",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px", // Add padding for spacing
      boxSizing: "border-box",
      zIndex: 10,

    }}><div>
    <video
      src="/assets/logo1_enhanced.mp4"
      autoPlay
      muted
      onEnded={e => e.target.pause()}
      style={{ height: "40px", borderRadius: "8px" }}
    />
  </div>
      <div>
        <a href="/" style={{ color: "#fff", margin: "0 16px", textDecoration: "none" }}>Home</a>
        <a href="/about" style={{ color: "#fff", margin: "0 16px", textDecoration: "none" }}>About</a>
        <a href="/contact" style={{ color: "#fff", margin: "0 16px", textDecoration: "none" }}>Contact</a>
      </div>
    </nav>
  );
}