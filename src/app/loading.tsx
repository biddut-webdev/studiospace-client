
import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#fafaf7] px-4 transition-colors duration-300 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <Loader2
          size={42}
          className="animate-spin text-lime-600 dark:text-lime-400"
        />

        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Loading, please wait...
        </p>
      </div>
    </main>
  );
};

export default Loading;
