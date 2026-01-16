import React from 'react'
import MetricPreview from "../components/MetricPreview";
import ServiceCard from "../components/ServiceCard";
import { apmFeatures } from "../data/apmFeatures";
const ServicePage = () => {
  return (
    <div className="min-h-screen bg-black px-6 py-12">
      {/* Hero */}
      <section className="max-w-6xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">
          Application Performance Monitoring
        </h1>

        <p className="text-zinc-400 max-w-2xl mb-8">
          Real-time insights into CPU, memory, latency, and uptime.
          Built for developers who care about performance.
        </p>

        <MetricPreview />
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold text-white mb-6">
          Core Monitoring Capabilities
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {apmFeatures.map(feature => (
            <ServiceCard
              key={feature.title}
              {...feature}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto mt-20 text-center">
        <h3 className="text-2xl font-semibold text-white mb-4">
          Ready to monitor your app?
        </h3>

        <p className="text-zinc-400 mb-6">
          Plug in the agent and start collecting metrics in seconds.
        </p>

        <button className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 transition text-white font-medium">
          Get Started
        </button>
      </section>
    </div>
  )
}

export default ServicePage
