import {
  Clock3,
  Mail,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { BUSINESS } from '../constants/business'
import { Button } from '../shared/ui'

const methods = [
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    text: 'Quick availability checks and request follow-ups.',
    action: 'Message now',
    href: `https://wa.me/${BUSINESS.whatsappNumber}`,
  },
  {
    icon: Phone,
    title: 'Phone',
    text: 'Speak directly with us.',
    action: BUSINESS.phoneDisplay,
    href: BUSINESS.phoneLink,
  },
  {
    icon: Mail,
    title: 'Email',
    text: 'For general inquiries.',
    action: BUSINESS.email,
    href: `mailto:${BUSINESS.email}`,
  },
]

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your full name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  message: z
    .string()
    .trim()
    .min(5, 'Please share a little more detail.')
    .max(1500, 'Please keep your message under 1,500 characters.'),
})

type ContactForm = z.infer<typeof contactSchema>

export function ContactPage() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const submit = (values: ContactForm) => {
    const subject = encodeURIComponent(
      `Zorch Farms enquiry from ${values.name}`
    )

    const body = encodeURIComponent(
      `Name: ${values.name}
Email: ${values.email}

${values.message}`
    )

    window.location.href = `mailto:${BUSINESS.email}?subject=${subject}&body=${body}`

    setSent(true)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden py-24 text-white">
        <img
          src={`${import.meta.env.BASE_URL}images/market-image2.jpg`}
          alt="Lagos market produce"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest via-forest/80 to-forest/30" />

        <div className="page-shell">
          <p className="eyebrow text-mint">We are here to help</p>

          <h1 className="mt-2 font-primary text-4xl font-bold">
            Get in Touch
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/85">
            Whether you are planning for the kitchen or sourcing for a
            business, we are ready to deliver.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="page-shell relative z-10 -mt-10 grid gap-5 md:grid-cols-3">
        {methods.map(({ icon: Icon, title, text, action, href }) => (
          <a
            key={title}
            href={href}
            className="rounded-2xl bg-white p-7 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-float"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-mint/60 text-forest">
              <Icon size={25} />
            </span>

            <h2 className="mt-5 font-display text-xl font-bold text-forest">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {text}
            </p>

            <span className="mt-4 inline-block text-sm font-bold text-moss">
              {action}
            </span>
          </a>
        ))}
      </section>

      {/* Contact Content */}
      <section className="page-shell grid gap-8 py-16 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="rounded-2xl bg-white p-7 shadow-soft sm:p-9">
          <h2 className="font-display text-2xl font-bold text-forest">
            Send a message
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            For general questions, send us an email and we will respond as soon
            as we can.
          </p>

          {sent ? (
            <div
              role="status"
              className="mt-7 rounded-xl bg-mint/35 p-5 text-moss"
            >
              <strong>Thank you.</strong> Your email application should now be
              open with your message.
            </div>
          ) : (
            <form
              noValidate
              className="mt-6 space-y-4"
              onSubmit={handleSubmit(submit)}
            >
              {/* Name */}
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-700">
                  Full name
                </span>

                <input
                  {...register('name')}
                  className="w-full rounded-lg border border-line px-3 py-3 outline-none focus:border-moss"
                  aria-invalid={Boolean(errors.name)}
                />

                {errors.name && (
                  <span className="mt-1 block text-sm text-red-700">
                    {errors.name.message}
                  </span>
                )}
              </label>

              {/* Email */}
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-700">
                  Email address
                </span>

                <input
                  {...register('email')}
                  type="email"
                  className="w-full rounded-lg border border-line px-3 py-3 outline-none focus:border-moss"
                  aria-invalid={Boolean(errors.email)}
                />

                {errors.email && (
                  <span className="mt-1 block text-sm text-red-700">
                    {errors.email.message}
                  </span>
                )}
              </label>

              {/* Message */}
              <label className="block">
                <span className="mb-1.5 block text-sm font-bold text-slate-700">
                  Your message
                </span>

                <textarea
                  {...register('message')}
                  rows={5}
                  className="w-full rounded-lg border border-line px-3 py-3 outline-none focus:border-moss"
                  aria-invalid={Boolean(errors.message)}
                />

                {errors.message && (
                  <span className="mt-1 block text-sm text-red-700">
                    {errors.message.message}
                  </span>
                )}
              </label>

              <Button type="submit" fullWidth variant="clay">
                <Send size={17} />
                Open email message
              </Button>
            </form>
          )}
        </div>

        {/* Business Info */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-forest p-7 text-white shadow-soft">
            <h2 className="flex items-center gap-2 font-display text-2xl font-bold">
              <Clock3 size={22} />
              Business Hours
            </h2>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/15 pb-3">
                <dt>Monday – Friday</dt>
                <dd className="font-bold">6:00 AM – 10:00 PM</dd>
              </div>

              <div className="flex justify-between border-b border-white/15 pb-3">
                <dt>Saturday</dt>
                <dd className="font-bold">7:00 AM – 10:00 PM</dd>
              </div>

              <div className="flex justify-between">
                <dt>Sunday</dt>
                <dd className="text-mint">Dispatch only</dd>
              </div>
            </dl>

            <p className="mt-6 rounded-lg bg-white/10 p-4 text-sm leading-6 text-mint">
              Deliveries are scheduled between 8:00 AM and 6:00 PM across Lagos
              State.
            </p>
          </div>

          {/* Location */}
          {/* <div className="relative min-h-52 overflow-hidden rounded-2xl bg-slate-200 shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1000&q=85"
              alt="Lagos city view"
              className="h-52 w-full object-cover"
              loading="lazy"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 p-5 text-white">
              <p className="flex items-center gap-2 font-bold">
                <MapPin size={17} />
                Lagos HQ
              </p>

              <p className="mt-1 text-sm text-white/80">
                {BUSINESS.location}
              </p>
            </div>
          </div> */}
        </div>
      </section>
    </>
  )
}