import { useContext } from "react";
import { ThemeContext } from "@/hooks/useTheme";

export interface SingleThemePickerProps {
  theme: string;
  chosen: boolean;
}

export function SingleThemePicker(props: SingleThemePickerProps) {
  const { setTheme } = useContext(ThemeContext);

  return (
    <li
      className="z-50 w-48 rounded-md"
      data-theme={props.theme}
      onKeyDown={() => {
        setTheme(props.theme);
      }}
    >
      <button type="button" className="flex justify-between rounded-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-4"
        >
          <title>{props.theme}</title>
          <path
            className={props.chosen ? " " : "hidden"}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
        <div>{props.theme}</div>
        <div className="w-12 flex justify-evenly gap-1 rounded-md">
          <div className="bg-primary w-2 h-6 rounded-md" />
          <div className="bg-secondary w-2 h-6 rounded-md" />
          <div className="bg-accent w-2 h-6 rounded-md" />
          <div className="bg-neutral w-2 h-6 rounded-md" />
        </div>
      </button>
    </li>
  );
}
