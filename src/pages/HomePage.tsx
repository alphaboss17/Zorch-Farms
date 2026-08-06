import { ArrowRight, Check, CheckCircle2, MapPin, Search, Send, ShieldCheck, ShoppingBag, Sparkles, Weight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CATEGORY_META } from '../constants/business'
import { products } from '../data/products'
import { ProductCard } from '../features/catalog/ProductCard'
import { Button } from '../shared/ui'
import { Section } from '../shared/ui/Section'

const steps = [{ icon: Search, title: 'Browse', body: 'Explore fresh produce and daily provisions.' }, { icon: Weight, title: 'Choose', body: 'Select the measurement that suits you.' }, { icon: CheckCircle2, title: 'Build', body: 'Add everything to one clear request list.' }, { icon: Send, title: 'Send', body: 'We confirm pricing and delivery on WhatsApp.' }]

export function HomePage() { const popular = products.filter((product) => product.popular).slice(0, 4); return <>
  <section className="relative isolate flex min-h-[620px] items-center overflow-hidden bg-forest">
  <img src={`${import.meta.env.BASE_URL}images/market.jpg`} alt="Fresh Nigerian market produce" className="absolute inset-0 -z-20 h-full w-full object-cover" fetchPriority="high" />
  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest via-forest/75 to-forest/10" />
  <div className="page-shell py-24 text-white">
  <div className="max-w-2xl"><p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-mint backdrop-blur"><ShoppingBag size={14} /> provisions sourcing</p>
  <h1 className="font-primary text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">Fresh Market Supplies, <br />For You.</h1>
  <p className="font-sans mt-6 max-w-xl text-lg leading-8 text-white/85">Skip the market chaos. Build one provision request, then let our Lagos team confirm prices and delivery directly with you.</p>
  <div className="mt-9 flex flex-wrap gap-3"><Button href="/categories" variant="secondary" size="md" className="text-forest" >Start Your Request <ArrowRight size={20} /></Button>
  <Button href="#how-it-works" size="lg" variant="outline" className="border-white/40 text-white hover:border-white hover:bg-white/10">How it works</Button></div>
  </div>
  </div>
  </section>
  
  <Section><div className="page-shell">
    <div className="mb-8"><p className="eyebrow">Freshly sourced</p>
    <h2 className="mt-2 font-display text-3xl font-primary text-forest">Browse Categories</h2>
    <p className="mt-2 text-slate-600">Hand-picked selections for your daily needs.</p>
    </div>
    <div className="grid gap-4 md:grid-cols-12 md:h-[420px]">{Object.entries(CATEGORY_META).slice(0, 3).map(([id, category], index) => <Link to={`/categories?category=${id}`} key={id} className={`group relative min-h-56 overflow-hidden rounded-2xl shadow-soft ${index === 0 ? 'md:col-span-6' : 'md:col-span-3'}`}><img src={category.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
    <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/30 to-transparent" />
    <div className="absolute bottom-0 p-6 text-white">
      <h3 className="font-display text-xl font-bold">{category.name}</h3><p className="mt-1 text-sm text-white/80">{category.description}</p></div>
      </Link>)}</div>
      </div>
      </Section>
  <Section id="how-it-works" className="bg-forest text-white">
    <div className="page-shell">
      <div className="mx-auto mb-12 max-w-xl text-center">
        
        <h2 className="mt-4 font-primary text-3xl font-bold">How It Works</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{steps.map(({ icon: Icon, title, body }, index) => <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"><div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-mint text-forest"><Icon size={21} /></div><h3 className="font-display font-bold">{index + 1}. {title}</h3><p className="mt-2 text-sm leading-5 text-white/70">{body}</p></div>)}</div></div></Section>
  <Section><div className="page-shell"><div className="mb-10 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Most requested</p><h2 className="mt-2 font-primary text-3xl font-bold text-forest">Popular Provisions</h2>
  </div><Link to="/categories" className="inline-flex items-center gap-1 text-sm font-bold text-moss hover:underline">See all provisions <ArrowRight size={16} /></Link></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{popular.map((product) => <ProductCard product={product} key={product.id} />)}</div></div></Section>
  <Section className="pt-0"><div className="page-shell"><div className="grid overflow-hidden rounded-3xl bg-white shadow-soft lg:grid-cols-2"><img src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1000&q=85" alt="Fresh vegetables prepared for delivery" className="h-72 w-full object-cover lg:h-full" loading="lazy" /><div className="p-8 sm:p-12"><p className="eyebrow">Why Zorch</p><h2 className="mt-2 font-primary text-3xl font-bold text-forest">Roots in Reliability.</h2><p className="mt-5 leading-7 text-slate-600">We bridge the gap between the market and your kitchen, with thoughtful sourcing and a conversation-first request process.</p><ul className="mt-6 space-y-4">{['Neighborhood focus', 'Quality checks before dispatch', 'Transparent pricing conversations'].map((item) => <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700"><CheckCircle2 size={19} className="text-moss" />{item}</li>)}</ul></div></div></div></Section>
  <Section className="pt-0"><div className="page-shell"><div className="rounded-3xl bg-forest px-6 py-14 text-center text-white shadow-float"><h2 className="font-primary text-3xl font-bold">Ready to ease your market run?</h2><p className="mx-auto mt-3 max-w-xl text-white/70">Start your provision request now. We will take the conversation from there.</p><Button href="/categories" variant="ghost"
  className="mt-7 bg-white text-black hover:bg-mint">Start Your Request</Button></div></div></Section>
  </> }
