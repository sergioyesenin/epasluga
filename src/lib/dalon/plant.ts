import type { DalonCharge, DalonState, MemberKind } from '../../types/dalon'
import { countText } from '../dates'
import { formatBYN } from '../money'
import { memberStatus, sumDue, type MemberStatus } from './selectors'

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

/** Человек или имущество на растении. */
export interface PlantItem {
  id: string
  kind: MemberKind
  name: string
  initials: string
  status: MemberStatus
  count: number
  /** Сумма к оплате в копейках. */
  sum: number
  /** Что прочитает скринридер и что видно в подписи под растением. */
  text: string
}

const STATUS_TEXT: Record<MemberStatus, string> = {
  due: 'есть счёт',
  paid: 'всё оплачено',
  locked: 'нет доступа',
}

function itemText(name: string, status: MemberStatus, count: number, sum: number): string {
  if (status === 'due') {
    const n = countText(count, 'начисление', 'начисления', 'начислений')
    return `${name}: ${STATUS_TEXT.due}, ${n} на ${formatBYN(sum)}`
  }
  return `${name}: ${STATUS_TEXT[status]}`
}

/**
 * Кто на растении. Люди, с которыми связь закрыта записью о смерти, уходят с растения;
 * после расторжения брака и в 18 лет человек остаётся, но без доступа.
 */
export function plantItems(state: DalonState, charges: DalonCharge[], now = new Date()) {
  const make = (id: string, kind: MemberKind, name: string, initials: string): PlantItem => {
    const own = charges.filter((c) => c.memberId === id)
    const status = memberStatus(state, id, charges, now)
    const sum = status === 'locked' ? 0 : sumDue(own, now)
    const count = status === 'locked' ? 0 : own.length
    return { id, kind, name, initials, status, count, sum, text: itemText(name, status, count, sum) }
  }
  const people = state.people
    .filter((p) => p.closedBy?.kind !== 'death')
    .map((p) => make(p.id, p.kind, p.name, p.initials))
  const assets = state.assets.map((a) => make(a.id, a.kind, a.full, ''))
  return { mode: plantMode(people.length), people, assets }
}

/* --- Геометрия рисунка (координаты 400×400, видимая часть — plantView) --- */

/** Видимая часть рисунка: у ростка верх пустой — обрезаем, чтобы растение было крупнее. */
export function plantView(mode: PlantMode): string {
  return mode === 'flower' ? '60 0 280 400' : '60 64 280 336'
}
export const PLANT_BASE = { x: 200, y: 380 }

export type Point = { x: number; y: number }

/** Точка на луче из origin: угол в градусах, 0 — вверх, по часовой стрелке. */
export function polar(origin: Point, angle: number, dist: number): Point {
  const r = (angle * Math.PI) / 180
  return { x: origin.x + dist * Math.sin(r), y: origin.y - dist * Math.cos(r) }
}

/** Лист: основание в (0,0), кончик в (0,−len), острый кончик. */
export function leafPath(len: number, width: number): string {
  const a = width * 0.62
  return `M0 0 C ${a} ${-len * 0.2} ${a} ${-len * 0.7} 0 ${-len} C ${-a} ${-len * 0.7} ${-a} ${-len * 0.2} 0 0 Z`
}

/** Лепесток: как лист, но со скруглённым кончиком. */
export function petalPath(len: number, width: number): string {
  const a = width * 0.72
  const b = width * 0.5
  return `M0 0 C ${a} ${-len * 0.18} ${b} ${-len * 1.02} 0 ${-len} C ${-b} ${-len * 1.02} ${-a} ${-len * 0.18} 0 0 Z`
}

/** Одна часть растения: где основание, куда повёрнута, где подпись и значок статуса. */
export interface PlantPartShape {
  origin: Point
  angle: number
  d: string
  /** Прожилка — только у листьев. */
  vein?: string
  label: Point
  badge: Point
}

export const SPROUT_CROWN: Point = { x: 200, y: 182 }
export const FLOWER_CENTER: Point = { x: 200, y: 122 }
export const FLOWER_DISC = 30

/** Второй, нижний узел ростка: на нём пара листьев, когда людей трое или четверо. */
const SPROUT_LOWER_NODE = 42

/** Где растут листья-люди у ростка: [узел, угол]. Как у сеянца — парами. */
const SPROUT_LAYOUT: [number, number][][] = [
  [[0, 0]],
  [
    [0, -42],
    [0, 42],
  ],
  [
    [1, -64],
    [0, 0],
    [1, 64],
  ],
  [
    [1, -68],
    [0, -26],
    [0, 26],
    [1, 68],
  ],
]

export function stemPath(mode: PlantMode): string {
  const top = mode === 'flower' ? FLOWER_CENTER.y + FLOWER_DISC - 4 : SPROUT_CROWN.y
  return `M${PLANT_BASE.x} ${PLANT_BASE.y} C 194 330, 206 250, 200 ${top}`
}

function veinPath(len: number): string {
  return `M0 -4 Q 2 ${-len * 0.5} 0 ${-len + 10}`
}

/** Люди у ростка: молодые листья парами на макушке. */
export function sproutLeaves(n: number): PlantPartShape[] {
  const len = 100
  const width = 56
  const layout = SPROUT_LAYOUT[Math.min(n, SPROUT_LAYOUT.length) - 1] ?? []
  return layout.map(([node, angle]) => {
    const origin = { x: SPROUT_CROWN.x, y: SPROUT_CROWN.y + node * SPROUT_LOWER_NODE }
    return {
      origin,
      angle,
      d: leafPath(len, width),
      vein: veinPath(len),
      label: polar(origin, angle, len * 0.5),
      badge: polar(origin, angle, len - 4),
    }
  })
}

/** Люди у цветка: лепестки по кругу, первый смотрит вверх. */
export function flowerPetals(n: number): PlantPartShape[] {
  const len = 92
  const width = Math.min(54, ((2 * Math.PI * (FLOWER_DISC + 46)) / n) * 0.92)
  return Array.from({ length: n }, (_, i) => {
    const angle = (360 / n) * i
    return {
      origin: polar(FLOWER_CENTER, angle, FLOWER_DISC - 6),
      angle,
      d: petalPath(len, width),
      label: polar(FLOWER_CENTER, angle, FLOWER_DISC + 40),
      badge: polar(FLOWER_CENTER, angle, FLOWER_DISC + len - 16),
    }
  })
}

/** Имущество: листья на стебле, по очереди справа и слева, снизу вверх. */
export function stemLeaves(n: number): PlantPartShape[] {
  const len = 84
  const width = 50
  return Array.from({ length: n }, (_, i) => {
    const origin = { x: PLANT_BASE.x, y: 350 - i * 34 }
    const angle = i % 2 === 0 ? 62 : -62
    return {
      origin,
      angle,
      d: leafPath(len, width),
      vein: veinPath(len),
      label: polar(origin, angle, len * 0.5),
      badge: polar(origin, angle, len - 2),
    }
  })
}
