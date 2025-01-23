export function ToggleSwitch({ message, isChecked, onClick }: { message: string, isChecked: boolean, onClick: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <div className="m-2">
      <label className="flex items-center relative w-max cursor-pointer select-none">
      <span className="text-sm font-bold mr-4">{message}</span>
      <input type="checkbox" className="appearance-none transition-colors cursor-pointer w-14 h-4 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-gray-500" onClick={() => onClick(!isChecked)} defaultChecked={isChecked} />
      <span className="absolute font-medium text-xs uppercase right-1 text-white"> <small>off</small> </span>
      <span className="absolute font-medium text-xs uppercase right-9 text-white"> <small>on</small> </span>
      <span className="w-7 h-5 right-7 absolute rounded-full transform transition-transform bg-gray-200" />
      </label>
    </div>
  );
}
