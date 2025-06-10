'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Award, Globe, Heart, Shield, Truck } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Happy Customers', value: '50K+', icon: Users },
    { label: 'Products Sold', value: '100K+', icon: Award },
    { label: 'Countries Served', value: '25+', icon: Globe },
    { label: 'Years of Experience', value: '10+', icon: Heart }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'We ensure every product meets our high standards before reaching you.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to get your orders to you as soon as possible.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We\'re here to help every step of the way.'
    },
    {
      icon: Award,
      title: 'Premium Products',
      description: 'Carefully curated selection of high-quality products from trusted brands.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Passionate about creating exceptional shopping experiences.'
    },
    {
      name: 'Jinal Chen',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Leading our technology initiatives and innovation.'
    },
    {
      name: 'Emily Davis',
      role: 'Head of Design',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Creating beautiful and intuitive user experiences.'
    },
    {
      name: 'David Wilson',
      role: 'Operations Manager',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Ensuring smooth operations and customer satisfaction.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About ShopEasy
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                We're passionate about bringing you the finest products with exceptional service. 
                Our mission is to make premium shopping accessible, enjoyable, and trustworthy for everyone.
              </p>
              <Badge variant="secondary" className="text-lg px-6 py-2">
                Trusted by thousands worldwide
              </Badge>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        
        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These core principles guide everything we do and shape our commitment to you.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-600">{value.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The passionate people behind ShopEasy who work tirelessly to bring you the best shopping experience.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}