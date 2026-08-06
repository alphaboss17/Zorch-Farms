import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

export function Field({ label, error, className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const id = props.id ?? props.name
  return <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">{label}</span><input id={id} className={`w-full rounded-lg border bg-white px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-moss focus:ring-2 focus:ring-moss/20 ${error ? 'border-red-600' : 'border-line'} ${className}`} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props} />{error && <span id={`${id}-error`} className="mt-1 block text-sm text-red-700">{error}</span>}</label>
}

export function TextareaField({ label, error, className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  const id = props.id ?? props.name
  return <label className="block"><span className="mb-1.5 block text-sm font-bold text-slate-700">{label}</span><textarea id={id} className={`w-full rounded-lg border bg-white px-3 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-moss focus:ring-2 focus:ring-moss/20 ${error ? 'border-red-600' : 'border-line'} ${className}`} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props} />{error && <span id={`${id}-error`} className="mt-1 block text-sm text-red-700">{error}</span>}</label>
}
