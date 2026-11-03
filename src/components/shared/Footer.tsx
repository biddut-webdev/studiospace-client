
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Mail,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="text-3xl font-bold tracking-tight">
              Studio<span className="text-lime-400">Space.</span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
              Find your space. Create your vision. Discover inspiring
              creative spaces and bring your ideas to life with StudioSpace.
            </p>

            <div className="mt-6 flex items-center gap-3 text-sm text-gray-400">
              <MapPin size={17} className="text-lime-400" />
              <span>Connecting Creators Everywhere</span>
            </div>

            <div className="mt-3 flex items-center gap-3 text-sm text-gray-400">
              <Mail size={17} className="text-lime-400" />
              <span>hello@studiospace.com</span>
            </div>

            {/* Social Links */}
            <div className="mt-7 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:border-lime-400 hover:bg-lime-400 hover:text-gray-950"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:border-lime-400 hover:bg-lime-400 hover:text-gray-950"
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:border-lime-400 hover:bg-lime-400 hover:text-gray-950"
              >
                <FaLinkedinIn size={18} />
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:border-lime-400 hover:bg-lime-400 hover:text-gray-950"
              >
                <FaXTwitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold">Quick Links</h3>

            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link href="/" className="transition hover:text-lime-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/studios" className="transition hover:text-lime-400">
                  Explore Studios
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="transition hover:text-lime-400">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-lime-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/add-studio" className="transition hover:text-lime-400">
                  List Your Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-6 text-lg font-bold">Categories</h3>

            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link href="/studios?category=Photo%20Studios" className="transition hover:text-lime-400">
                  Photo Studios
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Sound%20Stages" className="transition hover:text-lime-400">
                  Sound Stages
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Podcast%20Rooms" className="transition hover:text-lime-400">
                  Podcast Rooms
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Music%20Suites" className="transition hover:text-lime-400">
                  Music Suites
                </Link>
              </li>
              <li>
                <Link href="/studios?category=Art%20Workshops" className="transition hover:text-lime-400">
                  Art Workshops
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-6 text-lg font-bold">Stay Inspired</h3>

            <p className="mb-5 text-sm leading-7 text-gray-400">
              Get creative inspiration and updates about new spaces
              delivered to your inbox.
            </p>

            <div className="flex overflow-hidden rounded-full border border-white/15 bg-white/5 p-1">
              <input
                type="email"
                required
                placeholder="Your email address"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-gray-500"
              />

              <button
                type="submit"
                aria-label="Subscribe"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400 text-gray-950 transition hover:bg-lime-300"
              >
                <ArrowRight size={19} />
              </button>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              We respect your privacy. No spam, ever.
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-5 border-t border-white/10 py-7 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} StudioSpace. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/terms" className="transition hover:text-lime-400">
              Terms of Service
            </Link>

            <Link href="/privacy" className="transition hover:text-lime-400">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
