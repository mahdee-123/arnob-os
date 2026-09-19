export type WindowId = string;

export type WindowState = {
  id: WindowId;
  title: string;
  icon?: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized?: boolean;
  zIndex: number;
};

export type AppConfig = {
  id: WindowId;
  title: string;
  icon: string;
};