import UserList from "@/components/Dashboard";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Home() {
  return (
    <>
      <div className="h-auto w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased z-10">
        <UserList/>
      <BackgroundBeams className="h-auto"/>
      </div>
    </>

  );
}
