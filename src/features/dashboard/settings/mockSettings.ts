export type GlobalSettings = {
  currency: string
  language: string
  sessionTimeout: number
}

export const mockSettings: GlobalSettings = {
  currency: "MXN",
  language: "es",
  sessionTimeout: 30,
} 