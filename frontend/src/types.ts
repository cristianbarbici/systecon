export type System = {
  product: string
  color: string
  acquisition: number
  annual: number
  cumulative: number
  dataset: number[] | null
}

export type Component = {
  part: string
  system: string
  quantity: number
  failureRate: number
  price: number
  annual: number
  cumulative: number
}
