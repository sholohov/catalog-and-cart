export const float = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
}

export const integer = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
}
