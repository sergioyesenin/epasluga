import { ConfirmDialog, Icon } from '../../../design-system'
import { useZagsDemo } from '../../../hooks/useZagsDemo'
import { DemoBadge } from '../components/DemoBadge'
import { quietButton, textButton } from '../components/styles'

const selectClass =
  'w-full min-h-11 rounded-control border border-line bg-white px-3 text-[15px] focus:border-family-wine focus:outline-none focus:ring-4 focus:ring-family-wine/15'

/**
 * Демо-блок: события, которые в жизни приходят из реестра ЗАГС сами.
 * Явно помечен как демо — у пользователя таких кнопок нет.
 */
export function ZagsDemoPanel() {
  const demo = useZagsDemo()

  return (
    <section
      aria-labelledby="zags-demo-title"
      className="rounded-card border-2 border-dashed border-line-2 bg-card p-5"
    >
      <div className="flex items-center gap-2 mb-1">
        <DemoBadge />
        <h2 id="zags-demo-title" className="text-lg font-bold text-ink">
          Демо: события из реестра ЗАГС
        </h2>
      </div>
      <p className="text-sm text-muted mb-4">
        В жизни этих кнопок нет: записи о браке, рождении, расторжении брака и смерти приходят из
        реестра сами. Здесь их можно смоделировать.
      </p>

      <div className="space-y-3">
        <button
          type="button"
          className={`${quietButton} w-full justify-start text-left`}
          disabled={!demo.spouse}
          onClick={() => {
            demo.ask('divorce')
          }}
        >
          <Icon name="file" className="w-5 h-5 shrink-0" />
          Запись о расторжении брака
        </button>
        {!demo.spouse && (
          <p className="text-xs text-muted -mt-1">Действующей записи о браке нет.</p>
        )}

        <div className="space-y-2">
          <label htmlFor="zags-death-who" className="block text-sm font-semibold text-ink">
            Кого касается запись о смерти
          </label>
          <select
            id="zags-death-who"
            className={selectClass}
            value={demo.target?.id ?? ''}
            disabled={demo.candidates.length === 0}
            onChange={(e) => {
              demo.setDeathId(e.target.value)
            }}
          >
            {demo.candidates.map((p) => (
              <option key={p.id} value={p.id}>
                {p.full}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={`${quietButton} w-full justify-start text-left`}
            disabled={!demo.target}
            onClick={() => {
              demo.ask('death')
            }}
          >
            <Icon name="file" className="w-5 h-5 shrink-0" />
            Запись о смерти
          </button>
        </div>

        <button
          type="button"
          className={`${quietButton} w-full justify-start text-left`}
          disabled={demo.born}
          onClick={() => {
            demo.ask('birth')
          }}
        >
          <Icon name="plus" className="w-5 h-5 shrink-0" />
          {demo.born ? 'Запись о рождении уже поступила' : 'Запись о рождении ребёнка'}
        </button>

        <button
          type="button"
          className={textButton}
          onClick={() => {
            demo.ask('reset')
          }}
        >
          <Icon name="refresh" className="w-4.5 h-4.5" />
          Сбросить демо
        </button>
      </div>

      <ConfirmDialog
        open={demo.dialog !== null}
        title={demo.dialog?.title ?? ''}
        description={demo.dialog?.description ?? ''}
        confirmLabel={demo.dialog?.confirmLabel ?? ''}
        cancelLabel="Отмена"
        onCancel={demo.cancel}
        onConfirm={demo.confirm}
      />
    </section>
  )
}
