import BaseApi from "@/api/BaseApi";

export interface GoodsProps {
  B: boolean
  C: number // price in USD
  CV: object | null
  G: number // id of group
  P: number // quantity in stock
  Pl: object | null
  T: number // id of product
}

export interface GoodsData {
  Goods: GoodsProps[]
}

export interface GoodsResponse {
  Error: string
  Id: number
  Success: boolean
  Value: GoodsData
}

export interface NamesForGoodsProps {
  N: string // name
  T: 3
}

export interface NamesForGroupProps {
  G: string // name
  C: number
  B: {[k: string]: NamesForGoodsProps } // products list
}

export interface NamesMapResponse extends NamesMapData {}

export interface NamesMapData {
  [k: string]: NamesForGroupProps
}

export default class GoodsApi extends BaseApi {
  async list(): Promise<GoodsData> {
    const response = await this.get<GoodsResponse>('data.json')
    return response.Value
  }

  async names(): Promise<NamesMapData> {
    return this.get<NamesMapResponse>('names.json')
  }
}