import Link from "next/link";
import { ArrowRight, Activity, Users, Trophy, ChevronRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
            alt="Gym Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="max-w-3xl">
            <p className="text-primary font-bold tracking-widest uppercase mb-4 animate-fade-in-up">Welcome to Vitality Gym</p>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight uppercase animate-fade-in-up delay-100">
              Fit to <span className="text-primary">Keep</span><br />
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Skin</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-xl leading-relaxed animate-fade-in-up delay-200">
              Achieve your fitness goals with our premium facilities and expert trainers. 
              Join a community that motivates you to be your best self.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
              <Link href="/member" className="bg-primary hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all transform hover:scale-105 flex items-center justify-center">
                Join Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/trainers" className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all flex items-center justify-center">
                Our Trainers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" alt="Gym 1" className="rounded-2xl shadow-2xl w-full h-64 object-cover transform translate-y-8" />
                <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop" alt="Gym 2" className="rounded-2xl shadow-2xl w-full h-64 object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary p-6 rounded-full shadow-xl hidden md:block">
                 <Activity className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <div>
              <div className="w-16 h-1 bg-primary mb-6"></div>
              <h2 className="text-4xl font-extrabold text-white mb-6 uppercase leading-tight">
                We Have a <span className="text-primary">Great Deal</span> of<br />
                Experience With <span className="text-gray-500">Fitness</span>
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Our gym is equipped with state-of-the-art machines and staffed by certified professionals who are passionate about helping you succeed. Whether you're a beginner or a pro, we have the right program for you.
              </p>
              
              <div className="space-y-6">
                <div className="bg-[#151515] p-6 rounded-xl border border-gray-800 hover:border-primary transition-colors group">
                  <div className="flex items-start">
                    <div className="bg-gray-800 p-3 rounded-lg mr-4 group-hover:bg-primary transition-colors">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">Certified Trainers</h3>
                      <p className="text-gray-500 text-sm">Our team consists of certified professionals with years of experience.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#151515] p-6 rounded-xl border border-gray-800 hover:border-primary transition-colors group">
                  <div className="flex items-start">
                    <div className="bg-gray-800 p-3 rounded-lg mr-4 group-hover:bg-primary transition-colors">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">Community Support</h3>
                      <p className="text-gray-500 text-sm">Join a supportive community that motivates you to push your limits.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 bg-[#111111] relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
             <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
             <h2 className="text-4xl font-extrabold text-white mb-4 uppercase">
               Simple Steps To <span className="text-primary">Reach</span><br />
               Your <span className="text-gray-500">Objectives</span>
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Step 1 */}
             <div className="group relative overflow-hidden rounded-2xl h-96">
               <img src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop" alt="Step 1" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 flex flex-col justify-end">
                 <h3 className="text-2xl font-bold text-white mb-2">1. Exercise Movement</h3>
                 <p className="text-gray-400 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Start with basic movements to build a strong foundation.</p>
                 <Link href="/trainers" className="text-primary font-bold uppercase text-sm flex items-center hover:text-white transition-colors">
                   Read More <ChevronRight className="w-4 h-4 ml-1" />
                 </Link>
               </div>
             </div>

             {/* Step 2 */}
             <div className="group relative overflow-hidden rounded-2xl h-96 mt-0 md:-mt-8">
               <img src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop" alt="Step 2" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 flex flex-col justify-end">
                 <h3 className="text-2xl font-bold text-white mb-2">2. Fitness Methods</h3>
                 <p className="text-gray-400 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Learn advanced techniques to maximize your gains.</p>
                 <Link href="/packages" className="text-primary font-bold uppercase text-sm flex items-center hover:text-white transition-colors">
                   Read More <ChevronRight className="w-4 h-4 ml-1" />
                 </Link>
               </div>
             </div>

             {/* Step 3 */}
             <div className="group relative overflow-hidden rounded-2xl h-96">
               <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop" alt="Step 3" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-8 flex flex-col justify-end">
                 <h3 className="text-2xl font-bold text-white mb-2">3. Success</h3>
                 <p className="text-gray-400 text-sm mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Achieve your goals and maintain a healthy lifestyle.</p>
                 <Link href="/member" className="text-primary font-bold uppercase text-sm flex items-center hover:text-white transition-colors">
                   Read More <ChevronRight className="w-4 h-4 ml-1" />
                 </Link>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 uppercase">Ready to Transform?</h2>
          <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">
            Don't wait for tomorrow. Start your fitness journey today with Vitality Gym.
          </p>
          <Link href="/member" className="bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-gray-900 transition-all transform hover:scale-105 inline-flex items-center">
            Join The Club <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
