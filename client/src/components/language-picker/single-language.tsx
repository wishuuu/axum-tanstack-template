export interface SingleLanguageProps {
  code: string;
  name: string;
}

export function SingleLanguage(props: SingleLanguageProps) {
  return (
    <li className="w-40 rounded-md">
      <button type="button" className="flex justify-between rounded-md">
        <div className="badge badge-outline">{props.code}</div>
        <div>{props.name}</div>
      </button>
    </li>
  );
}
