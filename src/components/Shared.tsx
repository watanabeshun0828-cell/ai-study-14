import { X, Check, ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'

export function Dialog({ title, close, children }: { title: string; close: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { const el = ref.current; el?.showModal(); return () => el?.close() }, [])
  return <dialog ref={ref} className="dialog" onCancel={close} onClick={e => { if (e.target === e.currentTarget) close() }} aria-labelledby="dialog-title">
    <div className="dialog-head"><h2 id="dialog-title">{title}</h2><button className="icon-button" aria-label="閉じる" onClick={close}><X size={21} /></button></div>{children}
  </dialog>
}
export function Progress({ value, label }: { value: number; label: string }) {
  return <div className="progress" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${value}%` }} /></div>
}
export function Empty({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return <div className="empty"><div className="empty-icon"><Sparkles /></div><h2>{title}</h2><p>{children}</p>{action}</div>
}
export function SectionHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return <div className="section-heading"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>{children}</div>
}
export function BookArtwork() {
  return <svg className="book-art" viewBox="0 0 320 240" fill="none" aria-hidden="true">
    <circle cx="174" cy="116" r="92" stroke="white" strokeOpacity=".13" /><circle cx="174" cy="116" r="117" stroke="white" strokeOpacity=".06" />
    <path d="m65 153 106 57 107-58-108-56z" fill="#102346" fillOpacity=".45" />
    <path d="m64 127 106 53 106-53v20l-106 56-106-56z" fill="#8eb6e6" />
    <path d="m170 180 106-53v20l-106 56z" fill="#668dbb" /><path d="m70 136 100 49 100-49M70 142l100 50 100-50" stroke="#d4e7ff" strokeOpacity=".6" />
    <path d="m65 116 105 48 106-48-105-51z" fill="#adcfff" />
    <path d="m170 164 2-90c-24-25-57-32-100-24l-7 66c40-2 78 16 105 48z" fill="#f0f6ff" />
    <path d="m170 164 2-90c30-25 62-32 94-21l10 63c-40-2-79 16-106 48z" fill="#d3e5ff" />
    <path d="m172 77-2 86" stroke="#8fb7e7" strokeWidth="2" /><path d="m91 77 49 15m-51 3 49 16m-51 3 49 17m59-36 45-16m-44 34 46-16m-44 34 47-16" stroke="#7da6dc" strokeWidth="4" strokeLinecap="round" />
    <rect x="206" y="29" width="47" height="47" rx="14" transform="rotate(12 206 29)" fill="#78adf4" /><path d="m225 43-5 12 12 5m-5-16 4 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <path d="m72 38 3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="#b2d3ff" /><circle cx="273" cy="165" r="4" fill="#8bbcff" /><circle cx="114" cy="195" r="3" fill="#adcfff" />
  </svg>
}
export const NextIcon = () => <ArrowRight size={18} />
export function ReadBadge({ read }: { read: boolean }) { return read ? <span className="tag success"><Check size={13} />読了</span> : <span className="tag"><BookOpen size={13} />未読</span> }
