declare module "*.jpg";
declare module "*.png";
declare module "*.woff2";
declare module "*.woff";
declare module "*.ttf";
declare module "*.scss" {
  const content: Record<string, string>;
  export default content;
}

declare module "*.svg";

declare interface Window {
  __TAURI__?: {
    writeText(text: string): Promise<void>;
    invoke(command: string, payload?: Record<string, unknown>): Promise<any>;
    dialog: {
      save(options?: Record<string, unknown>): Promise<string | null>;
    };
    fs: {
      writeBinaryFile(path: string, data: Uint8Array): Promise<void>;
      writeTextFile(path: string, data: string): Promise<void>;
    };
    notification: {
      requestPermission(): Promise<Permission>;
      isPermissionGranted(): Promise<boolean>;
      sendNotification(options: string | Options): void;
    };
  };
}
