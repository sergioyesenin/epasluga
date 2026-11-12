import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'

type Message = { role: 'user' | 'ai'; text: string }

type AiAssistantProps = {
  /** Спрятать круглую кнопку на телефоне (когда снизу своя панель действий). */
  hideFabOnMobile?: boolean
}

export function AiAssistant({ hideFabOnMobile = false }: AiAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Здравствуйте! Я — цифровой помощник. Чем я могу вам помочь?' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Быстрые действия: навигация и демо-вопросы
  const quickQuestions = [
    'Частые вопросы',
    'Написать в поддержку',
    'Как войти через ID-карту?',
    'Где посмотреть статус заявления?',
  ]

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = (text: string) => {
    if (!text.trim()) {
      return
    }

    // Навигационные опции — не уходят в чат
    if (text === 'Частые вопросы') {
      navigate('/about')
      setIsOpen(false)
      return
    }
    if (text === 'Написать в поддержку') {
      navigate('/support')
      setIsOpen(false)
      return
    }

    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('')
    setIsTyping(true)

    // Имитация ответа
    window.setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'Я нашел информацию по вашему вопросу. Вы можете оформить эту услугу в разделе «Каталог услуг». Если нужна помощь с ID-картой, перейдите по ссылке в разделе «О портале».',
        },
      ])
    }, 1000)
  }

  return (
    <>
      {/* Кнопка вызова чата */}
      <button
        onClick={() => setIsOpen(true)}
        className={clsx(
          'fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] md:bottom-6 right-[max(1rem,env(safe-area-inset-right))] md:right-6 w-14 h-14 bg-card text-navy border border-line rounded-full shadow-lift flex items-center justify-center hover:border-navy transition-colors z-40',
          isOpen && 'hidden',
          !isOpen && hideFabOnMobile && 'hidden md:flex',
        )}
        aria-label="Открыть ИИ-помощника"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>

      {/* Окно чата */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="ИИ-Помощник"
          className="fixed z-50 flex flex-col overflow-hidden bg-white border-line inset-0 pt-safe pb-safe md:inset-auto md:pt-0 md:pb-0 md:bottom-6 md:right-6 md:w-96 md:h-[550px] md:max-h-[calc(100dvh-6rem)] md:rounded-card md:border md:shadow-2xl"
        >
          {/* Шапка */}
          <div className="bg-card border-b border-line pl-4 pr-1 h-14 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-ok rounded-full" />
              <span className="font-semibold text-sm text-ink">ИИ-помощник</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-11 h-11 inline-flex items-center justify-center rounded-xl text-muted hover:text-ink hover:bg-soft"
              aria-label="Закрыть чат"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* История сообщений */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-bg/50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={clsx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={clsx(
                    'max-w-[85%] rounded-2xl px-4 py-2 text-sm',
                    msg.role === 'user'
                      ? 'bg-navy text-white rounded-br-none'
                      : 'bg-white border border-line text-ink rounded-bl-none shadow-sm',
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-line rounded-2xl rounded-bl-none px-4 py-2 shadow-sm flex gap-1 items-center h-9">
                  <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Чипсы с быстрыми опциями (только в начале) */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0 bg-bg/50">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-sm bg-card text-navy px-3 min-h-11 rounded-full hover:border-navy transition-colors border border-line text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Поле ввода */}
          <div className="p-3 border-t border-line bg-white flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Напишите вопрос..."
              className="flex-1 bg-bg rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-navy/20"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="text-navy p-2 hover:bg-soft rounded-full disabled:opacity-50"
              aria-label="Отправить"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}