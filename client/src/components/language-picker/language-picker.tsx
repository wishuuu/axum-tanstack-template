import { Languages } from "lucide-react";
import { SingleLanguage } from "./single-language";

export default function LanguagePicker() {
  return (
    <div className="dropdown dropdown-end">
      <button
        type="button"
        tabIndex={0}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 hover:text-primary h-7 w-7 -ml-1 rounded-md"
      >
        <Languages />
      </button>
      <ul className="dropdown-content menu bg-base-300 gap-y-2 rounded-md">
        <SingleLanguage code={"pl"} name={"Polski"} />
        <SingleLanguage code={"en"} name={"English"} />
      </ul>
    </div>
  );
}
