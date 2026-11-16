/**
 * Растение «Далони»: сколько людей в семье — такой и рисунок.
 * До FLOWER_MIN_PEOPLE − 1 человек включительно — росток с листиками,
 * начиная с FLOWER_MIN_PEOPLE — цветок, люди становятся лепестками.
 * Имущество в обоих вариантах — листья на стебле.
 */
export const FLOWER_MIN_PEOPLE = 5

export type PlantMode = 'sprout' | 'flower'

export function plantMode(people: number): PlantMode {
  return people >= FLOWER_MIN_PEOPLE ? 'flower' : 'sprout'
}
