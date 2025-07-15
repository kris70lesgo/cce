'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text';
import { cn } from '@/lib/utils';
import { TextFade } from '@/components/textfade';
import HeroVideoDialog from '@/components/magicui/hero-video-dialog';



export default function Home() {
  const [dropdown, setDropdown] = useState<'features' | 'solutions' | null>(
    null
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
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
      <TextFade
        direction="up"
        className="flex flex-col items-center"
      >
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
      <Link
        href="/signup"
        className="mt-8 inline-block rounded-lg bg-[#6366F1] px-6 py-3 font-semibold text-white shadow-md hover:bg-[#4F46E5]"
      >
        Get started for free
      </Link>

      <p className="mt-3 text-sm text-[#9CA3AF]">
        7 day free trial. No credit card required.
      </p>
      <div className="mt-10">
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

      {/* Nav */}
      <nav className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-[#111827]">
          acme.ai
        </Link>

        <ul className="flex items-center gap-6 text-sm text-[#4B5563]">
          <li className="relative">
            <button
              onClick={() =>
                setDropdown(dropdown === 'features' ? null : 'features')
              }
              className="flex items-center gap-1 hover:text-[#111827]"
            >
              Features <span className="text-xs">v</span>
            </button>
            {dropdown === 'features' && (
              <div className="absolute left-0 top-8 w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5">
                {/* Dropdown content here */}
              </div>
            )}
          </li>

          <li className="relative">
            <button
              onClick={() =>
                setDropdown(dropdown === 'solutions' ? null : 'solutions')
              }
              className="flex items-center gap-1 hover:text-[#111827]"
            >
              Solutions <span className="text-xs">v</span>
            </button>
            {dropdown === 'solutions' && (
              <div className="absolute left-0 top-8 w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5">
                {/* Dropdown content here */}
              </div>
            )}
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
              href="/signup"
              className="rounded-md bg-[#F3F4F6] px-4 py-2 font-semibold text-[#111827] hover:bg-[#E5E7EB]"
            >
              Get Started for Free
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}