"use client"

import Link from 'next/link'
import { Trophy, Users, Medal, Menu, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Track if the component is mounted (client-side)
  useEffect(() => {
    setIsClient(true)
  }, [])

  const navigation = [
    { name: 'Games', href: '/games', icon: Trophy },
    { name: 'Players', href: '/players', icon: Users },
    { name: 'Results', href: '/results', icon: Medal },
    { name: 'Register School', href: '/register/school-register', icon: null }, // Register School button
  ]

  return (
    <nav className="bg-teal-900 text-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src="/images/sport.jpg"
              alt="Healthy Sport Logo"
              className="w-12 h-12 object-cover rounded-full"
            />
            <Link href="/" className="text-2xl font-bold text-orange-500">
              Healthy-Sport
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-orange-600 ${
                  item.name === 'Register School' ? 'bg-orange-500' : ''
                }`} // Highlight Register School button
                aria-current={isClient && item.href === window.location.pathname ? 'page' : undefined} // Safe check for window
              >
                {item.icon && <item.icon className="h-5 w-5 text-white" />}
                <span className="text-white">{item.name}</span>
              </Link>
            ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              <span className="sr-only">Toggle theme</span>
              {theme === 'dark' ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-white" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-white" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-orange-600 text-white ${
                        item.name === 'Register School' ? 'bg-orange-500' : ''
                      }`} // Highlight Register School button
                      onClick={() => setOpen(false)}
                    >
                      {item.icon && <item.icon className="h-5 w-5 text-white" />}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    aria-label="Toggle theme"
                  >
                    <span className="sr-only">Toggle theme</span>
                    {theme === 'dark' ? <Sun className="h-5 w-5 text-white" /> : <Moon className="h-5 w-5 text-white" />}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
