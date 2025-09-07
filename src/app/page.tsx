
"use client";

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BrainCircuit, Zap, BarChart3, ShieldCheck, Award, MessageCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { EduSparkLogo } from '@/components/icons/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Image from 'next/image';

export default function HomePage() {
  const features = [
    {
      icon: <BrainCircuit className="h-6 w-6 text-primary" />,
      title: 'AI Study Plans',
      description: 'Generate personalized study plans tailored to your learning goals and performance.',
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-primary" />,
      title: 'AI Tutor',
      description: 'Get instant answers to your questions about your learning materials, 24/7.',
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: 'Practice Quizzes',
      description: 'Create and take interactive practice quizzes on any topic to test your knowledge.',
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: 'Gamified Learning',
      description: 'Earn points, badges, and climb the leaderboards to stay motivated.',
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: 'Progress Tracking',
      description: 'Detailed analytics to monitor your progress for you, your parents, and your teachers.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: 'Secure & Collaborative',
      description: 'A safe environment with role-based access for students, parents, and teachers.',
    },
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="flex flex-col min-h-screen bg-background/80 backdrop-blur-sm">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/50">
        <div className="container-pro flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <EduSparkLogo className="h-6 w-auto text-glow" />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-24 sm:py-32 md:py-40 overflow-hidden">
          <Image 
            src="https://i.ibb.co/v4srytRC/20250520-2250-Edu-Spark-Website-Banner-simple-compose-01jvqb98g5fxyaah81qf71zq6n.png"
            alt="EduSpark hero background"
            layout="fill"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/50"></div>
          <motion.div
            className="container-pro text-center relative z-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-6">
                <Button asChild variant="secondary" size="sm" className="rounded-full px-4 py-1.5 text-sm">
                   <Link href="#features">
                    <span className="mr-2">✨</span>
                    Powered by the latest in Generative AI
                   </Link>
                </Button>
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl [text-wrap:balance]"
              variants={itemVariants}
            >
              The Future of Learning, <span className="text-gradient-primary">Personalized</span>.
            </motion.h1>
            <motion.p 
              className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground [text-wrap:balance]"
              variants={itemVariants}
            >
              EduSpark is an intelligent learning platform that adapts to you. Get personalized study plans, instant help, and engaging content to achieve your academic goals faster.
            </motion.p>
            <motion.div 
              className="mt-10 flex items-center justify-center gap-x-4"
              variants={itemVariants}
            >
              <Button size="lg" asChild>
                <Link href="/register">
                  Start Learning Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        <section id="features" className="py-24 sm:py-32">
          <div className="container-pro">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                A Smarter Way to Learn
              </h2>
              <p className="mx-auto mt-4 text-lg text-muted-foreground">
                Everything you need to succeed in one intelligent platform.
              </p>
            </div>
            <motion.div
                className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
            >
              {features.map((feature) => (
                <motion.div 
                    key={feature.title}
                    className="glass-card glass-hover rounded-2xl p-6"
                    variants={itemVariants}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EduSpark. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
