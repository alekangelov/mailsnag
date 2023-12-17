export default function Footer() {
  return (
    <footer className="flex items-center justify-center w-full h-24 mt-4">
      <div className="flex items-center justify-center gap-0 flex-col">
        <h4 className="opacity-25">Build with love</h4>
        <h4 className="opacity-50">
          {new Date().getFullYear()} &copy; Alek Angelov
        </h4>
      </div>
    </footer>
  );
}
