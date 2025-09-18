import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="container-pro py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <p className="font-semibold mb-3">EduSpark</p>
          <p className="text-muted-foreground">AI-powered learning for students, teachers, and parents.</p>
        </div>
        <div>
          <p className="font-semibold mb-3">Product</p>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/chatbot">AI Tutor</Link></li>
            <li><Link href="/quizzes">Quiz Generator</Link></li>
            <li><Link href="/study-plan">Study Plans</Link></li>
            <li><Link href="/recommendations">Recommendations</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-3">Company</p>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-3">Resources</p>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link href="/docs">Docs</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-pro py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EduSpark. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

