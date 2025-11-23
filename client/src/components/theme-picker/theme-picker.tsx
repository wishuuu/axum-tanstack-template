import { ColorPicker } from "@/components/svgs.tsx";
import { SingleThemePicker } from "@/components/theme-picker/single-theme.tsx";
import { themes, ThemeContext } from "@/hooks/useTheme";
import { useContext } from "react";

export function ThemePicker() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        // biome-ignore lint/a11y/useSemanticElements: <explanation>
        role="button"
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 hover:text-primary h-7 w-7 -ml-1 rounded-md"
      >
        <ColorPicker />
      </div>
      <ul
        // biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
        tabIndex={0}
        className="z-50 dropdown-content menu bg-base-300 gap-y-2 rounded-md"
      >
        <div className="max-h-96 flex flex-col gap-y-2 overflow-y-auto">
          {Object.keys(themes).map((themeKey) => (
            <SingleThemePicker key={themeKey} theme={themeKey} chosen={themeKey === theme} />
          ))}
        </div>
      </ul>
    </div>
  );
}
