'use client';
import { GitHubStarsButton } from '@/components/animate-ui/buttons/github-stars';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text';
import { cn } from '@/lib/utils';
import { TextFade } from '@/components/textfade';
import HeroVideoDialog from '@/components/magicui/hero-video-dialog';

export default function Home() {
  const [dropdown, setDropdown] = useState<'features' | 'solutions' | null>(null);

  return (
    <>
      {/* ===== Sticky Glass Nav ===== */}
      <header className="sticky top-0 z-30 w-full bg-white/30 dark:bg-black/30 backdrop-blur-lg border-b border-gray-200/20">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-[#111827]">
            acme.ai
          </Link>

          <ul className="flex items-center gap-6 text-sm text-[#4B5563]">
            {/* Features dropdown */}
            <li className="relative group">
              <button className="flex items-center gap-1 hover:text-[#111827]">
                Features 
              </button>
              <div className="absolute left-0 top-8 w-48 rounded-md bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black/5 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-200">
                <ul className="py-2">
                  <li>
                    <Link href="/features/ai" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700">
                      AI Tools
                    </Link>
                  </li>
                  <li>
                    <Link href="/features/integrations" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700">
                      Integrations
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            {/* Solutions dropdown */}
            <li className="relative group">
              <button className="flex items-center gap-1 hover:text-[#111827]">
                Solutions 
              </button>
              <div className="absolute left-0 top-8 w-48 rounded-md bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black/5 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-200">
                <ul className="py-2">
                  <li>
                    <Link href="/solutions/enterprise" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700">
                      Enterprise
                    </Link>
                  </li>
                  <li>
                    <Link href="/solutions/startups" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-neutral-700">
                      Startups
                    </Link>
                  </li>
                </ul>
              </div>
            </li>

            <li>
              <Link href="/blog" className="hover:text-[#111827]">
                Blog
              </Link>
            </li>

            <li>
              <Link href="/login" className="hover:text-[#111827]">
                Login
              </Link>
            </li>

            <li>
              <Link
                href="/ch"
                className="rounded-md bg-black text-white px-4 py-2 text-sm font-semibold
                          hover:bg-gray-900 hover:scale-105 transition-all duration-200"
              >
                Get Started for Free
              </Link>
            </li>
          </ul>
        </nav>
      </header>


      {/* ===== Centered Hero ===== */}
      <main className="flex flex-col items-center bg-white px-6 pt-24 pb-12 text-center">
        {/* Announcement */}
        <div className="mb-6">
          <div
            className={cn(
              'group rounded-full border border-black/5 bg-neutral-100 text-sm transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800',
            )}
          >
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1.5 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              <span>✨ Introducing Acme.ai</span>
              <ArrowRightIcon className="ml-1.5 h-3 w-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedShinyText>
          </div>
        </div>

        {/* Headline */}
        <TextFade direction="up" className="flex flex-col items-center">
          <h1 className="text-5xl font-bold leading-tight text-[#111827] sm:text-6xl">
            Automate your
            <br />
            workflow with AI
          </h1>
        </TextFade>

        {/* Subhead */}
        <p className="mt-6 max-w-lg text-lg text-[#6B7280]">
          No matter what problem you have, our AI can help you solve it.
        </p>

        {/* CTA */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/ch"
            className="rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white shadow-md hover:bg-gray-900"
          >
            Get started for free
          </Link>
          <GitHubStarsButton username="kris70lesgo" repo="https://github.com/kris70lesgo/cce" />
        </div>

        <p className="mt-3 text-sm text-[#9CA3AF]">
          7 day free trial. No credit card required.
        </p>

        {/* Hero Video */}
        <div className="relative mx-auto mt-10 w-full max-w-4xl aspect-video">
          <HeroVideoDialog
            className="block dark:hidden"
            animationStyle="top-in-bottom-out"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
            thumbnailAlt="Hero Video"
          />
          <HeroVideoDialog
            className="hidden dark:block"
            animationStyle="top-in-bottom-out"
            videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
            thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
            thumbnailAlt="Hero Video"
          />
        </div>
        {/* ===== How it Works ===== */}
<section className="w-full max-w-6xl mx-auto mt-20 px-6">
  <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#111827]">
    How it Works
  </h2>
  <p className="mt-2 text-center text-lg text-[#6B7280]">
    Just 3 steps to get started
  </p>

  <div className="mt-12 grid gap-8 md:grid-cols-3">
    {/* Step 1 */}
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl">
        1
      </div>
      <h3 className="text-xl font-semibold text-[#111827]">Upload Your Data</h3>
      <p className="mt-2 text-sm text-[#6B7280]">
        Simply upload your data to our secure platform. We support various file
        formats and data types for seamless integration.
      </p>
    </div>

    {/* Step 2 */}
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl">
        2
      </div>
      <h3 className="text-xl font-semibold text-[#111827]">Click Start</h3>
      <p className="mt-2 text-sm text-[#6B7280]">
        Our advanced AI algorithms automatically process and analyze your data,
        extracting valuable insights and patterns.
      </p>
    </div>

    {/* Step 3 */}
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl">
        3
      </div>
      <h3 className="text-xl font-semibold text-[#111827]">
        Get Actionable Insights
      </h3>
      <p className="mt-2 text-sm text-[#6B7280]">
        Receive clear, actionable insights and recommendations to make
        data-driven decisions and improve your business strategies.
            </p>
          </div>
        </div>
      </section>
      {/* ===== Footer ===== */}
      <footer className="w-full max-w-6xl mx-auto mt-20 mb-8 text-center text-sm text-gray-500">
        <hr className="mb-4 border-gray-300" />
        <p>
          Built with <span className="text-red-500" aria-label="love">♥</span> by{" "}
          <a
            href="https://github.com/kris70lesgo"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-indigo-600 hover:underline"
          >
            kris70lesgo
          </a>{" "}
          · © 2025 tastemate. All rights reserved.
        </p>
      </footer>
      </main>
    </>
  );
}