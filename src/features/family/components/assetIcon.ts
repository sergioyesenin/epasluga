import type { IconName } from '../../../design-system'
import type { AssetKind } from '../../../types/dalon'

/** Значок имущества: на аватаре и на листе растения. */
export const ASSET_ICON: Record<AssetKind, IconName> = {
  car: 'car',
  flat: 'home',
  dacha: 'dacha',
}
