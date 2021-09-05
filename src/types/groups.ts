export interface GroupItemProps {
  id: string
  title: string
  groupName: string
  price: number
  quantity: number
  inStock: number
  inCart: boolean
}

export interface GroupProps {
  id: string
  name: string
  products: GroupItemProps[]
}