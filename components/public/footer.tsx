import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-navy/10 bg-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-heading text-lg font-bold text-gold">
              Qhemegha Senior Primary School
            </p>
            <p className="mt-2 text-sm text-white/80">
              Sebenza Uphumelela — Work to succeed
            </p>
          </div>
          <div>
            <p className="font-heading font-semibold text-gold">Quick links</p>
            <ul className="mt-2 space-y-1 text-sm text-white/80">
              <li>
                <Link href="/about" className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/apply" className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm">
                  Apply online
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-heading font-semibold text-gold">Contact</p>
            <address className="mt-2 not-italic text-sm text-white/80">
              Qhimirha Village, Orange Circuit, Sterkspruit CMC
              <br />
              Joe Gqabi District, Eastern Cape, South Africa
              <br />
              +27 84 955 0163
              <br />
              info@qhemegha-sps.co.za
            </address>
          </div>
        </div>
        <p className="mt-8 border-t border-white/10 pt-4 text-center text-xs text-white/60">
          &copy; {new Date().getFullYear()} Qhemegha Senior Primary School.
        </p>
      </div>
    </footer>
  );
}
