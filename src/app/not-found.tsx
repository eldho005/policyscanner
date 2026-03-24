import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-md">
          <p className="text-6xl font-bold text-primary mb-4">404</p>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground mb-3">
            Page not found
          </h1>
          <p className="text-foreground-muted mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white
                         font-semibold text-sm rounded-sm hover:bg-primary-hover transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/quote"
              className="inline-flex items-center justify-center px-6 py-3 border border-border
                         text-foreground font-semibold text-sm rounded-sm hover:bg-background-warm transition-colors"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
