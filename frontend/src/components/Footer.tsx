export default function Footer({ name }: { name: string }) {
  return (
    <footer className="footer">
      <div className="container footer-row">
        <span>© {new Date().getFullYear()} {name}</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  );
}
