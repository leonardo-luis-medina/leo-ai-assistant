export default function Walkthrough() {
  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 20 }}>
      <h1>AI Operating System Walkthrough</h1>
      <video controls style={{ width: '100%', borderRadius: 8 }}>
        <source src="/walkthrough.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}