// /page.tsx
import { cn } from "@/lib/utils"
import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookIcon,
  CalendarIcon,
  CheckIcon,
  ClipboardListIcon,
  GraduationCapIcon,
  LineChartIcon,
  UsersIcon,
  ArrowRightIcon,
  LayoutDashboardIcon,
  LibraryIcon,
  MessageSquareIcon,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCapIcon className="h-6 w-6" />
            <span className="text-xl font-bold">EduTeach</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:underline underline-offset-4">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge className="mb-2">For Teachers, By Teachers</Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Simplify Your Teaching Workflow
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    EduTeach helps teachers manage classes, assignments, grades, and more—all in one place. Save time
                    and focus on what matters most: teaching.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="gap-2">
                      Get Started <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#demo">
                    <Button size="lg" variant="outline">
                      See Demo
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckIcon className="h-4 w-4 text-primary" />
                  <span>Free 14-day trial</span>
                  <span className="mx-2">•</span>
                  <CheckIcon className="h-4 w-4 text-primary" />
                  <span>No credit card required</span>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-xl" />
                <img
                  src="/placeholder.svg?height=550&width=750"
                  alt="EduTeach Dashboard"
                  className="relative rounded-lg border shadow-lg"
                  width={550}
                  height={750}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Logos Section */}
        <section className="w-full py-12 border-t border-b">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-xl font-medium">Trusted by educators worldwide</h2>
                <p className="text-muted-foreground">
                  Join thousands of teachers who use EduTeach to streamline their workflow
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16 grayscale opacity-70">
                {[
                  "School District A",
                  "Academy B",
                  "Education Center C",
                  "Learning Institute D",
                  "Teachers Association E",
                ].map((name) => (
                  <div key={name} className="flex items-center justify-center">
                    <span className="text-xl font-semibold">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="mb-2">Features</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Everything You Need to Teach Effectively
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  EduTeach provides a comprehensive set of tools designed specifically for teachers to manage their
                  daily tasks.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <FeatureCard
                icon={<LayoutDashboardIcon className="h-10 w-10" />}
                title="Intuitive Dashboard"
                description="Get a quick overview of your classes, upcoming assignments, and important events at a glance."
              />
              <FeatureCard
                icon={<GraduationCapIcon className="h-10 w-10" />}
                title="Class Management"
                description="Organize your classes, track attendance, and manage student information efficiently."
              />
              <FeatureCard
                icon={<ClipboardListIcon className="h-10 w-10" />}
                title="Assignment Tracking"
                description="Create, distribute, and grade assignments with ease. Set due dates and track submission status."
              />
              <FeatureCard
                icon={<LineChartIcon className="h-10 w-10" />}
                title="Grading System"
                description="Record and analyze student performance with our comprehensive grading tools and visual reports."
              />
              <FeatureCard
                icon={<LibraryIcon className="h-10 w-10" />}
                title="Teaching Materials"
                description="Store and organize your teaching resources in one place. Share materials with students or colleagues."
              />
              <FeatureCard
                icon={<BookIcon className="h-10 w-10" />}
                title="Lesson Planning"
                description="Create detailed lesson plans with objectives, activities, and assessments. Get AI-powered suggestions."
              />
              <FeatureCard
                icon={<CalendarIcon className="h-10 w-10" />}
                title="Calendar Integration"
                description="Keep track of classes, assignments, and events with our integrated calendar system."
              />
              <FeatureCard
                icon={<UsersIcon className="h-10 w-10" />}
                title="Student Profiles"
                description="Maintain comprehensive student profiles with academic history, notes, and parent contact information."
              />
              <FeatureCard
                icon={<MessageSquareIcon className="h-10 w-10" />}
                title="Communication Tools"
                description="Connect with students and parents through integrated messaging and announcement features."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="mb-2">How It Works</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Streamline Your Teaching Workflow
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See how EduTeach transforms the way you manage your teaching responsibilities.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 mt-12">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold">Set Up Your Classes</h3>
                <p className="text-muted-foreground">
                  Create your class profiles, add students, and customize your teaching schedule.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold">Manage Daily Tasks</h3>
                <p className="text-muted-foreground">
                  Create assignments, track submissions, record grades, and plan lessons all in one place.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold">Track Progress</h3>
                <p className="text-muted-foreground">
                  Monitor student performance, generate reports, and identify areas for improvement.
                </p>
              </div>
            </div>
            <div className="mt-16" id="demo">
              <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border bg-background shadow-lg">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 text-center text-sm font-medium">EduTeach Dashboard</div>
                  <div className="w-16" />
                </div>
                <img
                  src="/placeholder.svg?height=600&width=1200"
                  alt="EduTeach Dashboard Demo"
                  className="w-full"
                  width={1200}
                  height={600}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="mb-2">Testimonials</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Loved by Teachers Everywhere
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear what educators have to say about how EduTeach has transformed their teaching experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <TestimonialCard
                quote="EduTeach has completely transformed how I manage my classroom. I save at least 5 hours every week on administrative tasks."
                name="Sarah Johnson"
                role="High School Math Teacher"
                image="/placeholder.svg?height=100&width=100"
              />
              <TestimonialCard
                quote="The lesson planning features are incredible. I can create, store, and reuse my plans effortlessly. The AI suggestions are surprisingly helpful!"
                name="Michael Rodriguez"
                role="Middle School Science Teacher"
                image="/placeholder.svg?height=100&width=100"
              />
              <TestimonialCard
                quote="As a department head, I can finally keep track of all my teachers and classes in one place. The reporting features are invaluable for our meetings."
                name="Jennifer Lee"
                role="English Department Head"
                image="/placeholder.svg?height=100&width=100"
              />
              <TestimonialCard
                quote="The grading system is intuitive and saves me so much time. I can provide better feedback to my students because I'm not drowning in paperwork."
                name="David Wilson"
                role="Elementary School Teacher"
                image="/placeholder.svg?height=100&width=100"
              />
              <TestimonialCard
                quote="Parent communication has never been easier. I can share updates, assignments, and progress reports with just a few clicks."
                name="Emily Thompson"
                role="Special Education Teacher"
                image="/placeholder.svg?height=100&width=100"
              />
              <TestimonialCard
                quote="I was skeptical at first, but EduTeach has become indispensable to my teaching. I can't imagine going back to my old methods."
                name="Robert Chen"
                role="High School History Teacher"
                image="/placeholder.svg?height=100&width=100"
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="mb-2">Pricing</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Simple, Transparent Pricing
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that works best for you and your teaching needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-12 w-full">
              <Tabs defaultValue="monthly" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="annually">Annually (Save 20%)</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="monthly" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  <PricingCard
                    title="Starter"
                    price="$9.99"
                    description="Perfect for individual teachers"
                    features={[
                      "Up to 5 classes",
                      "Basic grading tools",
                      "Assignment tracking",
                      "Calendar integration",
                      "Email support",
                    ]}
                    buttonText="Get Started"
                    buttonVariant="outline"
                  />
                  <PricingCard
                    title="Professional"
                    price="$19.99"
                    description="Ideal for full-time educators"
                    features={[
                      "Unlimited classes",
                      "Advanced grading system",
                      "Lesson planning tools",
                      "Student performance analytics",
                      "Parent communication portal",
                      "Priority support",
                    ]}
                    buttonText="Get Started"
                    buttonVariant="default"
                    highlighted={true}
                  />
                  <PricingCard
                    title="School"
                    price="$99.99"
                    description="For entire departments or schools"
                    features={[
                      "All Professional features",
                      "Up to 50 teacher accounts",
                      "Administrative dashboard",
                      "Department-level analytics",
                      "Custom integrations",
                      "Dedicated account manager",
                    ]}
                    buttonText="Contact Sales"
                    buttonVariant="outline"
                  />
                </TabsContent>
                <TabsContent value="annually" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  <PricingCard
                    title="Starter"
                    price="$7.99"
                    period="per month, billed annually"
                    description="Perfect for individual teachers"
                    features={[
                      "Up to 5 classes",
                      "Basic grading tools",
                      "Assignment tracking",
                      "Calendar integration",
                      "Email support",
                    ]}
                    buttonText="Get Started"
                    buttonVariant="outline"
                  />
                  <PricingCard
                    title="Professional"
                    price="$15.99"
                    period="per month, billed annually"
                    description="Ideal for full-time educators"
                    features={[
                      "Unlimited classes",
                      "Advanced grading system",
                      "Lesson planning tools",
                      "Student performance analytics",
                      "Parent communication portal",
                      "Priority support",
                    ]}
                    buttonText="Get Started"
                    buttonVariant="default"
                    highlighted={true}
                  />
                  <PricingCard
                    title="School"
                    price="$79.99"
                    period="per month, billed annually"
                    description="For entire departments or schools"
                    features={[
                      "All Professional features",
                      "Up to 50 teacher accounts",
                      "Administrative dashboard",
                      "Department-level analytics",
                      "Custom integrations",
                      "Dedicated account manager",
                    ]}
                    buttonText="Contact Sales"
                    buttonVariant="outline"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge className="mb-2">FAQ</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Frequently Asked Questions
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to common questions about EduTeach.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl mt-12">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How secure is my data on EduTeach?</AccordionTrigger>
                  <AccordionContent>
                    EduTeach takes data security very seriously. We use industry-standard encryption and security
                    practices to protect your data. All student information is stored in compliance with FERPA and other
                    educational privacy regulations. We never share your data with third parties without your explicit
                    consent.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I import my existing class data?</AccordionTrigger>
                  <AccordionContent>
                    Yes! EduTeach supports importing data from CSV files, Google Classroom, and several other popular
                    educational platforms. Our setup wizard will guide you through the process of importing your
                    classes, students, and even past assignments and grades.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is there a mobile app available?</AccordionTrigger>
                  <AccordionContent>
                    Yes, EduTeach offers mobile apps for both iOS and Android devices. The mobile app allows you to take
                    attendance, update grades, and communicate with students and parents on the go. All changes sync
                    automatically with the web version.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I collaborate with other teachers?</AccordionTrigger>
                  <AccordionContent>
                    EduTeach includes powerful collaboration features that allow you to share lesson plans, teaching
                    materials, and even co-teach classes with colleagues. The Professional and School plans include
                    additional collaboration features for department-wide coordination.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>How does the 14-day free trial work?</AccordionTrigger>
                  <AccordionContent>
                    Our 14-day free trial gives you full access to all features of the Professional plan. No credit card
                    is required to start your trial. At the end of the trial period, you can choose to subscribe to any
                    of our plans or downgrade to the free basic version with limited features.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger>Do you offer discounts for schools or districts?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we offer special pricing for schools and districts. Our School plan is designed for entire
                    departments, but we can create custom plans for larger implementations. Please contact our sales
                    team for more information about district-wide licensing options.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Teaching?
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of educators who are saving time and improving their teaching experience with EduTeach.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Start Your Free Trial <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Schedule a Demo
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckIcon className="h-4 w-4" />
                <span>No credit card required</span>
                <span className="mx-2">•</span>
                <CheckIcon className="h-4 w-4" />
                <span>Cancel anytime</span>
                <span className="mx-2">•</span>
                <CheckIcon className="h-4 w-4" />
                <span>Full access for 14 days</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-6 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <GraduationCapIcon className="h-6 w-6" />
                <span className="text-lg font-bold">EduTeach</span>
              </div>
              <p className="text-sm text-muted-foreground">Simplifying teaching workflows for educators worldwide.</p>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">Product</h3>
              <Link href="#features" className="text-sm text-muted-foreground hover:underline">
                Features
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:underline">
                Pricing
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Integrations
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Updates
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">Resources</h3>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Blog
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Help Center
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Tutorials
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Webinars
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">Company</h3>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                About Us
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Careers
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Contact
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Partners
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">Legal</h3>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Cookie Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                GDPR
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2024 EduTeach. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M12 2a10 10 0 0 0-3.16 19.5c.5.08.66-.22.66-.48v-1.7c-2.67.6-3.23-1.13-3.23-1.13-.44-1.1-1.08-1.4-1.08-1.4-.88-.6.07-.6.07-.6.97.07 1.48 1 1.48 1 .87 1.52 2.27 1.07 2.83.82.08-.65.35-1.09.63-1.34-2.13-.25-4.37-1.07-4.37-4.76 0-1.05.37-1.93 1-2.6-.1-.24-.42-1.22.1-2.55 0 0 .8-.26 2.63 1a9.25 9.25 0 0 1 5 0c1.83-1.26 2.63-1 2.63-1 .52 1.33.2 2.31.1 2.55.63.67 1 1.55 1 2.6 0 3.7-2.25 4.5-4.4 4.74.36.31.68.92.68 1.85v2.74c0 .26.16.56.67.48A10 10 0 0 0 12 2z"></path>
                </svg>
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="flex flex-col items-center text-center">
      <CardHeader>
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function TestimonialCard({ quote, name, role, image }: { quote: string; name: string; role: string; image: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
            </svg>
          </div>
          <p className="text-muted-foreground">{quote}</p>
          <div className="flex items-center gap-4">
            <img
              src={image || "/placeholder.svg"}
              alt={name}
              className="h-10 w-10 rounded-full object-cover"
              width={40}
              height={40}
            />
            <div>
              <h4 className="font-medium">{name}</h4>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PricingCard({
  title,
  price,
  period = "per month",
  description,
  features,
  buttonText,
  buttonVariant = "default",
  highlighted = false,
}: {
  title: string
  price: string
  period?: string
  description: string
  features: string[]
  buttonText: string
  buttonVariant?: "default" | "outline"
  highlighted?: boolean
}) {
  return (
    <Card className={cn("flex flex-col", highlighted && "border-primary shadow-lg")}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-4">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground"> {period}</span>
        </div>
        <ul className="space-y-2 text-sm">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <CheckIcon className="h-4 w-4 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant={buttonVariant} className="w-full">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}
