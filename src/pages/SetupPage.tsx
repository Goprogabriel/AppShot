import { ArrowLeft, ArrowRight, Minus, Plus } from 'lucide-react'
import type { DeviceType } from '../types/device'
import { Button } from '../components/controls/Button'

interface SetupPageProps {
  deviceType: DeviceType
  count: number
  onCountChange: (count: number) => void
  onBack: () => void
  onCreate: () => void
}

export function SetupPage({ deviceType, count, onCountChange, onBack, onCreate }: SetupPageProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fafc,#eef2ff)] px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-4xl">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <section className="mt-16 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
          <div className="border-b border-slate-200 bg-slate-950 px-8 py-5 text-white md:px-12">
            <div className="text-sm font-bold uppercase tracking-[0.18em] text-slate-300">{deviceType} setup</div>
            <div className="mt-1 text-sm text-slate-400">You can change this later in the editor.</div>
          </div>
          <div className="p-8 md:p-12">
          <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-normal md:text-6xl">How many screenshots do you want to start with?</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Start with 3 to 5 for a focused App Store story. You can add, duplicate, reorder, or remove screenshots later in the editor.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div className="flex items-center overflow-hidden rounded-md border border-slate-200 bg-slate-50">
              <button className="grid h-12 w-12 place-items-center hover:bg-white" type="button" onClick={() => onCountChange(Math.max(1, count - 1))}>
                <Minus className="h-4 w-4" />
              </button>
              <div className="grid h-12 w-20 place-items-center border-x border-slate-200 bg-white text-2xl font-black">{count}</div>
              <button className="grid h-12 w-12 place-items-center hover:bg-white" type="button" onClick={() => onCountChange(Math.min(10, count + 1))}>
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {[3, 5, 7, 10].map((value) => (
                <button
                  key={value}
                  className={`h-10 rounded-md px-4 text-sm font-bold transition ${value === count ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  type="button"
                  onClick={() => onCountChange(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <Button className="mt-10 h-12 px-5" variant="primary" onClick={onCreate}>
            Open editor
            <ArrowRight className="h-4 w-4" />
          </Button>
          </div>
        </section>
      </div>
    </main>
  )
}
