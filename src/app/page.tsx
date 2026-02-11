import { StationList } from "@/components";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="hidden text-6xl">
        Welcome to <span className="text-green-400">Gas Tracker</span>
      </h1>
      <StationList />
    </div>
  );
}
