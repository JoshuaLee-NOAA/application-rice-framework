export default function Header() {
  return (
    <header className="bg-navy-500 text-white shadow-lg">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold">RICE Framework</h1>
            <p className="text-xs text-ocean-200">
              NOAA Fisheries OCIO
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
