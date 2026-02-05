/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_TONCENTER_API: string
  readonly VITE_BOT_ADDRESS: string
  readonly VITE_SC_ADDRESS: string
  
  // Add other VITE_ prefixed env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}