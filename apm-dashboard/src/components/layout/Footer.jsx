import React from 'react'
import { Github, Twitter, Globe, Cpu, ShieldCheck, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-[#09090b] border-t border-white/5 pt-12 pb-8 px-6 ">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-violet-500/10 rounded-lg border border-violet-500/20">
                <Cpu size={20} className="text-violet-400" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">S<span className="text-violet-400">Node</span></span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6">
              Advanced infrastructure monitoring and real-time telemetry for modern cloud-native applications.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Github size={18} /></a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Twitter size={18} /></a>
              <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Globe size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Monitoring</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-violet-400 transition-colors">Infrastructure</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Network Traffic</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Log Explorer</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Alert Manager</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-violet-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Status Page</a></li>
              <li><a href="#" className="hover:text-violet-400 transition-colors">Community</a></li>
            </ul>
          </div>

          {/* Contact/Newsletter */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Stay Updated</h4>
            <p className="text-zinc-500 text-xs mb-4">Get the latest updates on infrastructure trends.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50 w-full"
              />
              <button className="bg-violet-600 hover:bg-violet-500 text-white p-2 rounded-lg transition-all">
                <Mail size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <span className="text-zinc-600 text-[11px]">© {currentYear} SystemNode Inc. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-[11px] text-zinc-600 font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
          
        </div>
      </div>
    </footer>
  )
}

export default Footer