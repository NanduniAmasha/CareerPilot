import { Button } from "./ui/button";

interface NavbarProps {
  user: {
    name: string;
  } | null;

  onLogout: () => void;
}

function Navbar({
  user,
  onLogout
}: NavbarProps) {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">
            CareerPilot
          </h1>

          <p className="text-xs text-slate-500">
            Job Application Tracker
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm">
            {user?.name}
          </span>

          <Button
            variant="outline"
            onClick={onLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;