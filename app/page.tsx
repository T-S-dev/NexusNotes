import Link from "next/link";
import { ArrowRight, FileText, Users, Zap, Globe, Shield, Smartphone } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import Header from "@/shared/components/LandingHeader";

const features = [
  {
    icon: <FileText className="h-6 w-6 text-blue-600" />,
    bgColor: "bg-blue-100",
    title: "Rich Text Editor",
    description:
      "Create beautiful documents with our intuitive editor. Format text, add images, and embed content seamlessly.",
  },
  {
    icon: <Users className="h-6 w-6 text-green-600" />,
    bgColor: "bg-green-100",
    title: "Real-time Collaboration",
    description:
      "Work together in real-time. See who's online, track changes, and collaborate seamlessly with your team.",
  },
  {
    icon: <Zap className="h-6 w-6 text-purple-600" />,
    bgColor: "bg-purple-100",
    title: "Lightning Fast",
    description: "Built for speed and performance. Access your content instantly, even with large documents and teams.",
  },
  {
    icon: <Shield className="h-6 w-6 text-orange-600" />,
    bgColor: "bg-orange-100",
    title: "Secure & Private",
    description: "Your data is encrypted and secure. Control who has access to your content with granular permissions.",
  },
  {
    icon: <Globe className="h-6 w-6 text-pink-600" />,
    bgColor: "bg-pink-100",
    title: "Access Anywhere",
    description: "Work from anywhere with our web app. Your content syncs across all devices automatically.",
  },
  {
    icon: <Smartphone className="h-6 w-6 text-indigo-600" />,
    bgColor: "bg-indigo-100",
    title: "Mobile Friendly",
    description: "Responsive design that works perfectly on desktop, tablet, and mobile devices.",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              🚀 Now with real-time collaboration
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Your ideas,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                organized
              </span>{" "}
              and{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                collaborative
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              Create, share, and collaborate on documents, notes, and wikis. Everything you need to organize your work
              and life in one beautiful, intuitive workspace.
            </p>
            <Button size="lg" asChild className="mt-10 h-12 px-8">
              <Link href="/workspace">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to stay organized
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features designed to help you and your team work more efficiently.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="relative overflow-hidden border-0 shadow-lg transition-shadow hover:shadow-xl"
                >
                  <CardHeader>
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor}`}>
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Ready to get organized?</h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of teams who trust NexusNotes for their collaboration needs.
            </p>
            <Button size="lg" variant="secondary" asChild className="mt-8 h-12 px-8">
              <Link href="/workspace">
                Start Free Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold">NexusNotes</span>
              </div>
              <p className="max-w-md text-gray-400">
                The all-in-one workspace for your notes, docs, and collaboration. Built for teams who want to work
                better together.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#features" className="transition-colors hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/workspace" className="transition-colors hover:text-white">
                    Workspace
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 sm:flex-row">
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} NexusNotes. All rights reserved.</p>
            <div className="mt-4 flex items-center gap-4 sm:mt-0">
              <Link href="/privacy" className="text-sm text-gray-400 transition-colors hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 transition-colors hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
