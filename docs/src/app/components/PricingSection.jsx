"use client";

import Link from "next/link";
import { Slider } from "@/components/ui/slider";
import { Check } from "lucide-react";
import { useState } from "react";

// Available event tiers for the slider
const EVENT_TIERS = [
  100_000, 250_000, 500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000, "Custom",
];

// Define plan features
const PRO_FEATURES = [
  "Unlimited websites",
  "Unlimited team members",
  "Real-time analytics",
  "Custom events",
  "Funnels & user flows",
  "All features"
];

export const formatter = Intl.NumberFormat("en", {
  notation: "compact",
}).format;

// Format price with dollar sign
function getFormattedPrice(eventLimit, isAnnual) {
  // Monthly prices from stripe.ts
  let monthlyPrice;
  if (eventLimit <= 100_000) monthlyPrice = 19;
  else if (eventLimit <= 250_000) monthlyPrice = 29;
  else if (eventLimit <= 500_000) monthlyPrice = 49;
  else if (eventLimit <= 1_000_000) monthlyPrice = 69;
  else if (eventLimit <= 2_000_000) monthlyPrice = 99;
  else if (eventLimit <= 5_000_000) monthlyPrice = 149;
  else if (eventLimit <= 10_000_000) monthlyPrice = 249; // 10M events
  else return { custom: true }; // 10M+ events - custom pricing
  
  // Annual prices are 10x monthly (2 months free)
  const annualPrice = monthlyPrice * 10;
  return {
    monthly: monthlyPrice,
    annual: annualPrice
  };
}

export function PricingSection() {
  const [eventLimitIndex, setEventLimitIndex] = useState(0); // Default to 100k (index 0)
  const [isAnnual, setIsAnnual] = useState(true);
  
  const eventLimit = EVENT_TIERS[eventLimitIndex];
  const prices = getFormattedPrice(eventLimit, isAnnual);
  
  // Handle slider changes
  function handleSliderChange(value) {
    setEventLimitIndex(value[0]);
  }
  
  return (
    <section className="py-16 md:py-24 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
            Simple Pricing
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Transparent Pricing</h2>
          <p className="mt-4 text-neutral-300 max-w-2xl mx-auto">
            Privacy-friendly analytics with all the features you need to grow
          </p>
        </div>
        
        {/* Pricing card with background gradients */}
        <div className="relative max-w-lg mx-auto mb-10">
          {/* Background gradients - overlapping circles for organic feel */}
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-emerald-500/30 rounded-full blur-[80px] opacity-60"></div>
          <div className="absolute top-20 left-20 w-[300px] h-[300px] bg-emerald-600/20 rounded-full blur-[70px] opacity-40"></div>
          
          <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-blue-500/30 rounded-full blur-[80px] opacity-50"></div>
          <div className="absolute bottom-40 right-20 w-[250px] h-[250px] bg-indigo-500/20 rounded-full blur-[75px] opacity-40"></div>
          
          <div className="absolute top-1/4 right-0 w-[200px] h-[200px] bg-purple-500/30 rounded-full blur-[70px] opacity-40"></div>
          
          <div className="absolute bottom-1/3 left-0 w-[220px] h-[220px] bg-emerald-400/20 rounded-full blur-[70px] opacity-50"></div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-400/20 rounded-full blur-[80px] opacity-40"></div>
        
          {/* Card with relative positioning and higher z-index */}
          <div className="relative z-10 bg-neutral-800/50 rounded-xl border border-neutral-700 overflow-hidden backdrop-blur-sm shadow-xl">
            <div className="p-6">
              {/* Slider section */}
              <div className="mb-6">
                <div className="flex justify-between mb-3 items-center">
                  <div>
                    <h3 className="font-semibold mb-2">Events per month</h3>
                    <div className="text-3xl font-bold text-emerald-400 hidden md:block">
                      {eventLimit.toLocaleString()}
                    </div>
                    <div className="text-3xl font-bold text-emerald-400 md:hidden">
                      {isNaN(eventLimit) ? "10M+" : formatter(eventLimit)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {/* Billing toggle */}
                    <div className="flex gap-3 mb-2 text-sm">
                      <button 
                        onClick={() => setIsAnnual(false)}
                        className={`px-3 py-1 rounded-full transition-colors ${!isAnnual 
                          ? "bg-emerald-500/20 text-emerald-400 font-medium" 
                          : "text-neutral-400 hover:text-neutral-200"}`}
                      >
                        Monthly
                      </button>
                      <button 
                        onClick={() => setIsAnnual(true)}
                        className={`px-3 py-1 rounded-full transition-colors ${isAnnual 
                          ? "bg-emerald-500/20 text-emerald-400 font-medium" 
                          : "text-neutral-400 hover:text-neutral-200"}`}
                      >
                        Annual 
                        <span className="ml-1 text-xs text-emerald-500">-17%</span>
                      </button>
                    </div>
                    <div className="text-right h-10">
                      {prices.custom ? <></> : <><span className="text-3xl font-bold">${isAnnual ? Math.round(prices.annual / 12) : prices.monthly}</span>
                      <span className="ml-1 text-neutral-400">
                        /month
                      </span></> }
                    </div>
                  </div>
                </div>
                
                <Slider
                  defaultValue={[0]}
                  max={EVENT_TIERS.length - 1}
                  min={0}
                  step={1}
                  onValueChange={handleSliderChange}
                  className="mb-3"
                />
                
                <div className="flex justify-between text-xs text-neutral-400">
                  {EVENT_TIERS.map((tier, index) => (
                    <span
                      key={index}
                      className={eventLimitIndex === index ? "font-bold text-emerald-400" : ""}
                    >
                      {index === EVENT_TIERS.length - 1 ? "10M+" : tier >= 1_000_000 ? `${tier / 1_000_000}M` : `${tier / 1_000}K`}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                {PRO_FEATURES.map((feature, i) => (
                  <div key={i} className="flex items-center">
                    <Check className="h-4 w-4 text-emerald-400 mr-3 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              {prices.custom ? (
                <Link href="https://www.rybbit.io/contact" className="w-full block">
                  <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-3 rounded-lg shadow-lg shadow-emerald-900/20 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
                    Contact us
                  </button>
                </Link>
              ) : (
                <Link href="https://app.rybbit.io/signup" className="w-full block">
                  <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-3 rounded-lg shadow-lg shadow-emerald-900/20 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
                    Start your 14 day free trial
                  </button>
                </Link>
              )}
              
              <p className="text-center text-sm text-neutral-400 mt-4">
              {prices.custom ? "Email us at hello@rybbit.io for custom pricing" : "We don't ask for your credit card"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 