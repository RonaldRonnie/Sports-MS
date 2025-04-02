import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Medal, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: Trophy,
      title: "Games Management",
      description: "Efficiently manage and organize a wide range of sports events, track participation, and ensure compliance with detailed game rules. Our system allows for custom game creation, scheduling, and rule enforcement, ensuring every event runs smoothly.",
      href: "/games"
    },
    {
      icon: Users,
      title: "Player Profiles",
      description: "Keep detailed records of your players, including their achievements, statistics, and participation history. Easily manage profiles for each athlete, helping you track performance over time, and celebrate milestones as they progress.",
      href: "/players"
    },
    {
      icon: Medal,
      title: "Results & Rankings",
      description: "Record game results effortlessly, and maintain up-to-date player rankings based on performance. Whether it’s a league, a tournament, or a friendly match, you can easily publish results and keep your community engaged with live updates.",
      href: "/results"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16 text-center bg-green-600 text-white rounded-lg shadow-lg mb-12">
        <h1 className="text-5xl font-extrabold mb-6">Revolutionize Your Sports Management</h1>
        <p className="text-2xl text-gray-200 max-w-3xl mx-auto mb-8">
          Say goodbye to complex spreadsheets and outdated systems. Our platform is designed to streamline your sports management tasks, empowering you to focus on what truly matters—delivering great experiences for players and fans alike.
        </p>
        <Link href="/register/school-register">
          <button className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 transition-all mt-4">
            Get Started Today
          </button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 py-12 px-6">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.href}>
            <Card className="h-full hover:shadow-xl transition-shadow bg-white border border-gray-200 rounded-lg shadow-md">
              <CardHeader className="flex flex-col items-center py-6">
                <feature.icon className="h-12 w-12 mb-4 text-green-600" />
                <CardTitle className="text-2xl font-semibold text-gray-800">{feature.title}</CardTitle>
                <CardDescription className="text-gray-600 text-lg">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center text-green-600">
                Discover More <ArrowRight className="ml-2 h-4 w-4 text-green-600" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      {/* Get Started Section */}
      <section className="py-16 text-center bg-green-500 text-white rounded-lg mt-16">
        <h2 className="text-4xl font-extrabold mb-6">Start Managing Sports Like a Pro</h2>
        <p className="text-xl text-gray-100 max-w-3xl mx-auto mb-8">
          Don’t wait any longer! Join hundreds of sports institutions that trust our system to manage their games and players. From schools and clubs to professional leagues, our platform scales to meet your needs. Start managing your sports activities efficiently today!
        </p>
        <Link href="/school-register">
          <button className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 transition-all mt-4">
            Sign Up Now
          </button>
        </Link>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-gray-100 rounded-lg mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl font-semibold text-gray-800 mb-6">Why Choose Our Platform?</h3>
          <p className="text-xl text-gray-600 mb-6">
            Whether you're managing a local tournament or a professional league, our system is designed to scale and adapt to your needs. Here’s why sports organizations love our platform:
          </p>
          <ul className="text-left space-y-4 text-lg max-w-2xl mx-auto">
            <li className="flex items-center">
              <span className="text-green-600 mr-3">✔️</span> Easy-to-use interface that anyone can master.
            </li>
            <li className="flex items-center">
              <span className="text-green-600 mr-3">✔️</span> Fully customizable to suit different types of sports and events.
            </li>
            <li className="flex items-center">
              <span className="text-green-600 mr-3">✔️</span> Automated player tracking and game results recording.
            </li>
            <li className="flex items-center">
              <span className="text-green-600 mr-3">✔️</span> Real-time updates to keep your players and fans engaged.
            </li>
          </ul>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-white text-center mt-16">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">What Our Clients Say</h3>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          "This platform has been a game changer for our league! It’s incredibly user-friendly, and the ability to manage everything from one place has saved us so much time."
        </p>
        <p className="mt-4 text-lg text-gray-500">- Jessica Martin, League Manager</p>
      </section>

      {/* Footer Section */}
      <footer className="py-8 bg-gray-800 text-white text-center mt-16">
        <p>&copy; 2025 Healthy-Sport | All rights reserved.</p>
      </footer>
    </div>
  );
}
