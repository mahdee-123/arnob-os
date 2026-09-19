"use client";

type AppIconProps = {
  name: string;
  icon: string;
  onOpen: () => void;
};

export default function AppIcon({
  name,
  icon,
  onOpen,
}: AppIconProps) {
  return (
    <button onDoubleClick={onOpen}>
      <div>{icon}</div>
      <span>{name}</span>
    </button>
  );
}