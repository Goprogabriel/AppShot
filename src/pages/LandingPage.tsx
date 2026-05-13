import { ArrowRight, CheckCircle2, CloudOff, MonitorSmartphone, Sparkles, TabletSmartphone } from 'lucide-react'
import type { DeviceType } from '../types/device'
import { Button } from '../components/controls/Button'

interface LandingPageProps {
  onChooseDevice: (deviceType: DeviceType) => void
}

export function LandingPage({ onChooseDevice }: LandingPageProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto grid min-h-[92vh] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:px-10">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            <CloudOff className="h-4 w-4" />
            100% browser-based. No uploads to a server.
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-normal text-slate-950 md:text-7xl">
            App Store screenshots, built locally in your browser.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Upload raw app screens, choose iPhone or iPad frames, add launch-ready copy, customize layouts, and export App Store compatible PNGs without a backend.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="primary" className="h-12 px-5" onClick={() => onChooseDevice('iphone')}>
              <MonitorSmartphone className="h-4 w-4" />
              Create iPhone screenshots
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button className="h-12 px-5" onClick={() => onChooseDevice('ipad')}>
              <TabletSmartphone className="h-4 w-4" />
              Create iPad screenshots
            </Button>
          </div>

          <div className="mt-10 grid max-w-2xl gap-3 text-sm text-slate-600 sm:grid-cols-2">
            {['Upload screenshots', 'Choose a frame', 'Add title and subtitle', 'Download PNG or ZIP'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[580px]">
          <PreviewPoster />
        </div>
      </section>
    </main>
  )
}

function PreviewPoster() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative h-[560px] w-full max-w-[760px]">
        <div className="absolute left-[4%] top-[8%] h-[470px] w-[220px] rotate-[-8deg] overflow-hidden rounded-[38px] bg-[#0f172a] p-3 shadow-2xl">
          <div className="h-full rounded-[28px] bg-gradient-to-br from-sky-500 via-indigo-500 to-slate-950 p-6 text-white">
            <div className="text-3xl font-black leading-tight">Plan your day faster</div>
            <div className="mt-4 text-sm text-white/75">Smart timeline, calm focus, zero clutter.</div>
            <div className="mt-12 grid gap-3">
              <div className="h-20 rounded-md bg-white/20" />
              <div className="h-20 rounded-md bg-white/30" />
              <div className="h-20 rounded-md bg-white/15" />
            </div>
          </div>
        </div>

        <div className="absolute left-[30%] top-[0%] h-[540px] w-[250px] overflow-hidden rounded-[44px] bg-[#111827] p-3 shadow-2xl">
          <div className="h-full rounded-[34px] bg-white p-6">
            <div className="text-3xl font-black leading-tight text-slate-950">Track every metric</div>
            <div className="mt-5 h-32 rounded-md bg-slate-900" />
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="h-28 rounded-md bg-blue-100" />
              <div className="h-28 rounded-md bg-emerald-100" />
              <div className="h-28 rounded-md bg-amber-100" />
              <div className="h-28 rounded-md bg-rose-100" />
            </div>
          </div>
        </div>

        <div className="absolute right-[2%] top-[14%] h-[430px] w-[300px] rotate-[7deg] overflow-hidden rounded-[32px] bg-[#d9dde2] p-3 shadow-2xl">
          <div className="h-full rounded-[22px] bg-gradient-to-br from-slate-50 to-blue-100 p-7">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
              <Sparkles className="h-4 w-4" />
              iPad ready
            </div>
            <div className="mt-5 text-4xl font-black leading-tight text-slate-950">Beautiful on every screen</div>
            <div className="mt-8 h-36 rounded-md bg-white shadow-sm" />
            <div className="mt-4 h-24 rounded-md bg-slate-900" />
          </div>
        </div>
      </div>
    </div>
  )
}
