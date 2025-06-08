"use client";

import React, { useState, useEffect } from 'react';
import { Star, Heart, MapPin, Phone, Mail, MessageCircle, ChefHat, Clock, Award, Sun, Moon, Sparkles, Zap } from 'lucide-react';
// Type definitions
interface Dish {
  id: number;
  name: string;
  description: string;
  price: string;
  rating: number;
  image: string;
  cookTime: string;
}

interface Testimonial {
  name: string;
  text: string;
  rating: number;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface MousePosition {
  x: number;
  y: number;
}

interface VisibilityState {
  [key: number]: boolean;
}

export default function HomePage() {
  const [isVisible, setIsVisible] = useState<VisibilityState>({});
  const [likedDishes, setLikedDishes] = useState<Set<number>>(new Set());
  const [currentTestimonial, setCurrentTestimonial] = useState<number>(0);
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isClient, setIsClient] = useState<boolean>(false);
  

  const dishes: Dish[] = [
    {
      id: 1,
      name: "Nasi Goreng",
      description: "Classic Indonesian fried rice with aromatic spices and fresh ingredients",
      price: "Rp 25.000",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
      cookTime: "15 min"
    },
    {
      id: 2,
      name: "Sate Ayam",
      description: "Tender grilled chicken skewers with rich peanut sauce and cucumber",
      price: "Rp 30.000",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop",
      cookTime: "20 min"
    },
    {
      id: 3,
      name: "Lasagna",
      description: "Refreshing iced dessert with coconut milk, palm sugar, and pandan",
      price: "Rp 45.000",
      rating: 4.7,
      image: "https://unsplash.com/photos/-9ypyrRAjdw/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzQ5MzUxNTE3fA&force=true",
      cookTime: "5 min"
    }
  ];

  const testimonials: Testimonial[] = [
    { name: "Sari Dewi", text: "Rasanya benar-benar otentik! Seperti masakan ibu di rumah.", rating: 5 },
    { name: "Budi Santoso", text: "Nasi gorengnya juara, pasti akan balik lagi!", rating: 5 },
    { name: "Maya Putri", text: "Tempatnya nyaman dan makanannya enak banget!", rating: 5 }
  ];

  // Initialize client-side only
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate sparkles only on client
  useEffect(() => {
    if (!isClient) return;
    
    const generateSparkles = () => {
      const newSparkles: Sparkle[] = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 2
      }));
      setSparkles(newSparkles);
    };

    generateSparkles();
    const sparkleInterval = setInterval(generateSparkles, 10000);
    return () => clearInterval(sparkleInterval);
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    const handleScroll = () => {
      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        setIsVisible(prev => ({ ...prev, [index]: isVisible }));
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    handleScroll();

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(testimonialInterval);
    };
  }, [isClient, testimonials.length]);

  const toggleLike = (dishId: number) => {
    setLikedDishes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dishId)) {
        newSet.delete(dishId);
      } else {
        newSet.add(dishId);
      }
      return newSet;
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <main className={`min-h-screen transition-all duration-700 overflow-x-hidden ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100' 
        : 'bg-gradient-to-br from-orange-50 via-white to-yellow-50 text-gray-800'
    }`}>
      
      {/* Dark Mode Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleDarkMode}
          className={`p-4 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 ${
            darkMode 
              ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' 
              : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
          }`}
        >
          {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>

      {/* Animated Sparkles - Only render on client */}
      {isClient && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {sparkles.map((sparkle) => (
            <div
              key={sparkle.id}
              className={`absolute animate-pulse ${darkMode ? 'text-yellow-400' : 'text-orange-400'}`}
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                fontSize: `${sparkle.size}px`,
                animationDelay: `${sparkle.delay}s`,
                animationDuration: '3s'
              }}
            >
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Floating Elements - Only render on client */}
      {isClient && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div 
            className={`absolute w-6 h-6 rounded-full opacity-30 animate-pulse ${
              darkMode ? 'bg-purple-400' : 'bg-orange-300'
            }`}
            style={{
              left: mousePosition.x * 0.05 + 100,
              top: mousePosition.y * 0.03 + 50,
              transition: 'all 0.3s ease',
              transform: `rotate(${mousePosition.x * 0.1}deg)`
            }}
          />
          <div 
            className={`absolute w-8 h-8 rounded-full opacity-20 ${
              darkMode ? 'bg-blue-400 animate-bounce' : 'bg-yellow-300 animate-bounce'
            }`}
            style={{
              left: mousePosition.x * 0.03 + 200,
              top: mousePosition.y * 0.05 + 150,
              transition: 'all 0.5s ease',
              transform: `scale(${1 + Math.sin(Date.now() * 0.001) * 0.2})`
            }}
          />
          <div 
            className={`absolute w-4 h-4 rounded-full opacity-25 animate-ping ${
              darkMode ? 'bg-pink-400' : 'bg-red-300'
            }`}
            style={{
              right: mousePosition.x * 0.02 + 150,
              bottom: mousePosition.y * 0.04 + 100,
              transition: 'all 0.4s ease'
            }}
          />
        </div>
      )}

      {/* Enhanced Hero Section */}
      <section className={`relative h-screen flex items-center justify-center overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900' 
          : 'bg-gradient-to-br from-orange-600 via-red-500 to-yellow-500'
      }`}>
        
        {/* Enhanced Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute top-32 right-20 w-16 h-16 border-2 border-white rounded-full animate-ping" />
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-white rounded-full animate-bounce" />
          <div className="absolute top-1/2 right-1/3 w-8 h-8 border-2 border-white rounded-full animate-pulse" />
          <div className="absolute bottom-1/3 right-10 w-14 h-14 border-2 border-white rounded-full animate-spin" style={{ animationDuration: '15s' }} />
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white transform rotate-45 animate-bounce" style={{ animationDuration: '3s' }} />
        </div>

        <div className={`relative z-10 backdrop-blur-sm p-12 rounded-3xl text-center text-white max-w-4xl mx-4 transform hover:scale-105 transition-all duration-700 shadow-2xl hover:shadow-3xl ${
          darkMode 
            ? 'bg-black bg-opacity-60 border border-purple-500/30' 
            : 'bg-black bg-opacity-40'
        }`}>
          <div className="flex justify-center mb-6">
            <ChefHat className={`w-16 h-16 animate-bounce ${
              darkMode ? 'text-purple-400' : 'text-yellow-400'
            }`} style={{ animationDuration: '2s' }} />
          </div>
          <h1 className={`text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent animate-pulse ${
            darkMode 
              ? 'bg-gradient-to-r from-purple-400 to-pink-400' 
              : 'bg-gradient-to-r from-yellow-400 to-orange-300'
          }`}>
            Pawon Kitchen
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fadeIn">
            Authentic Indonesian Taste, Made with Love ❤️
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center">
            <a 
              href="#menu" 
              className={`inline-block px-8 py-4 rounded-full font-bold text-lg transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl text-black ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500' 
                  : 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500'
              }`}
            >
              🍽️ View Menu
            </a>
            <a 
              href="#contact" 
              className={`inline-block px-8 py-4 rounded-full font-bold text-lg transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl text-black ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500' 
                  : 'bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500'
              }`}
            >
              📞 Contact Us
            </a>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <div className={`w-6 h-10 border-2 rounded-full flex justify-center ${
              darkMode ? 'border-purple-400' : 'border-white'
            }`}>
              <div className={`w-1 h-3 rounded-full mt-2 animate-pulse ${
                darkMode ? 'bg-purple-400' : 'bg-white'
              }`} />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section 
        className={`py-20 px-6 md:px-20 text-center relative transition-all duration-700 ${
          darkMode 
            ? 'bg-gradient-to-r from-gray-800 to-gray-900' 
            : 'bg-gradient-to-r from-orange-100 to-yellow-100'
        }`}
        data-animate
      >
        <div className={`transform transition-all duration-1000 ${isVisible[0] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="flex justify-center mb-8">
            <Award className={`w-12 h-12 animate-pulse ${
              darkMode ? 'text-purple-400' : 'text-orange-500'
            }`} />
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold mb-8 ${
            darkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>About Pawon Kitchen</h2>
          <p className={`text-xl max-w-4xl mx-auto leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Pawon Kitchen is your home for delicious, authentic Indonesian food. Inspired by traditional flavors 
            and cooked with heart, we serve meals that bring comfort and joy in every bite. 
            <span className={`font-semibold ${
              darkMode ? 'text-purple-400' : 'text-orange-600'
            }`}> Experience the taste of Indonesia! 🇮🇩</span>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            {[
              { icon: "👨‍🍳", title: "Expert Chefs", desc: "Traditional recipes passed down through generations" },
              { icon: "🌿", title: "Fresh Ingredients", desc: "Only the finest local and imported spices" },
              { icon: "❤️", title: "Made with Love", desc: "Every dish prepared with care and passion" }
            ].map((item, index) => (
              <div 
                key={index}
                className={`rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-4 transition-all duration-500 hover:rotate-1 ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl mb-4 animate-bounce" style={{ animationDelay: `${index * 100}ms` }}>
                  {item.icon}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${
                  darkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>{item.title}</h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Menu Preview */}
<section id="menu" className={`py-20 px-6 md:px-20 transition-all duration-700 ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`} data-animate>
        <div className={`transform transition-all duration-1000 delay-300 ${isVisible[1] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <h2 className={`text-4xl md:text-5xl font-bold text-center mb-4 ${
            darkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>Our Signature Dishes</h2>
          <p className={`text-xl text-center mb-16 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>Taste the authentic flavors of Indonesia</p>
          
          {/* Mobile: Horizontal scroll, Desktop: Grid */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto pb-6 space-x-6 snap-x snap-mandatory scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              {dishes.map((dish, index) => (
                <div 
                  key={dish.id}
                  className={`group rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-6 hover:rotate-1 transition-all duration-700 overflow-hidden border flex-shrink-0 w-80 snap-center ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 hover:border-purple-500' 
                      : 'bg-white border-gray-100 hover:border-orange-300'
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={dish.image} 
                      alt={dish.name} 
                      className="w-full h-64 object-cover group-hover:scale-125 transition-transform duration-700 group-hover:rotate-2" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => toggleLike(dish.id)}
                        className={`p-3 rounded-full transition-all duration-500 transform hover:scale-125 ${
                          likedDishes.has(dish.id) 
                            ? 'bg-red-500 text-white scale-110 animate-pulse' 
                            : `${darkMode ? 'bg-gray-800 text-gray-300 hover:text-red-500' : 'bg-white text-gray-400 hover:text-red-500'}`
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${likedDishes.has(dish.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 text-white px-4 py-2 rounded-full text-sm flex items-center backdrop-blur-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {dish.cookTime}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`text-2xl font-bold transition-colors duration-300 ${
                        darkMode 
                          ? 'text-gray-100 group-hover:text-purple-400' 
                          : 'text-gray-800 group-hover:text-orange-600'
                      }`}>
                        {dish.name}
                      </h3>
                      <div className={`flex items-center px-3 py-2 rounded-full transition-colors duration-300 ${
                        darkMode ? 'bg-gray-700' : 'bg-yellow-100'
                      }`}>
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1 animate-pulse" />
                        <span className="text-sm font-semibold">{dish.rating}</span>
                      </div>
                    </div>
                    <p className={`mb-4 leading-relaxed ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{dish.description}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-2xl font-bold ${
                        darkMode ? 'text-purple-400' : 'text-orange-600'
                      }`}>{dish.price}</span>
                      <button className={`px-6 py-3 rounded-full transform hover:scale-110 transition-all duration-300 shadow-lg font-bold flex items-center space-x-2 ${
                        darkMode 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white' 
                          : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                      }`}>
                        <span>Order Now</span>
                        <Zap className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Scroll indicator for mobile */}
            <div className="flex justify-center mt-6">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                ← Swipe to explore more dishes →
              </p>
            </div>
          </div>

          {/* Desktop: Original grid layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {dishes.map((dish, index) => (
              <div 
                key={dish.id}
                className={`group rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-6 hover:rotate-1 transition-all duration-700 overflow-hidden border ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 hover:border-purple-500' 
                    : 'bg-white border-gray-100 hover:border-orange-300'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={dish.image} 
                    alt={dish.name} 
                    className="w-full h-64 object-cover group-hover:scale-125 transition-transform duration-700 group-hover:rotate-2" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => toggleLike(dish.id)}
                      className={`p-3 rounded-full transition-all duration-500 transform hover:scale-125 ${
                        likedDishes.has(dish.id) 
                          ? 'bg-red-500 text-white scale-110 animate-pulse' 
                          : `${darkMode ? 'bg-gray-800 text-gray-300 hover:text-red-500' : 'bg-white text-gray-400 hover:text-red-500'}`
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${likedDishes.has(dish.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-80 text-white px-4 py-2 rounded-full text-sm flex items-center backdrop-blur-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {dish.cookTime}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`text-2xl font-bold transition-colors duration-300 ${
                      darkMode 
                        ? 'text-gray-100 group-hover:text-purple-400' 
                        : 'text-gray-800 group-hover:text-orange-600'
                    }`}>
                      {dish.name}
                    </h3>
                    <div className={`flex items-center px-3 py-2 rounded-full transition-colors duration-300 ${
                      darkMode ? 'bg-gray-700' : 'bg-yellow-100'
                    }`}>
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1 animate-pulse" />
                      <span className="text-sm font-semibold">{dish.rating}</span>
                    </div>
                  </div>
                  <p className={`mb-4 leading-relaxed ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>{dish.description}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-2xl font-bold ${
                      darkMode ? 'text-purple-400' : 'text-orange-600'
                    }`}>{dish.price}</span>
                    <button className={`px-6 py-3 rounded-full transform hover:scale-110 transition-all duration-300 shadow-lg font-bold flex items-center space-x-2 ${
                      darkMode 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white' 
                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                    }`}>
                      <span>Order Now</span>
                      <Zap className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className={`py-20 px-6 md:px-20 transition-all duration-700 ${
        darkMode 
          ? 'bg-gradient-to-r from-gray-800 to-gray-900' 
          : 'bg-gradient-to-r from-orange-100 to-yellow-100'
      }`} data-animate>
        <div className={`transform transition-all duration-1000 delay-500 ${isVisible[2] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <h2 className={`text-4xl font-bold text-center mb-16 ${
            darkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>What Our Customers Say</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className={`rounded-3xl p-8 shadow-xl transform hover:scale-105 transition-all duration-700 hover:rotate-1 ${
              darkMode ? 'bg-gray-700' : 'bg-white'
            }`}>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-6 h-6 text-yellow-500 fill-current animate-pulse mx-1" 
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
                <p className={`text-xl mb-6 italic transform transition-all duration-500 ${
                  darkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  &quot;{testimonials[currentTestimonial].text}&quot;
                </p>
                <p className={`font-bold text-lg ${
                  darkMode ? 'text-purple-400' : 'text-orange-600'
                }`}>
                  - {testimonials[currentTestimonial].name}
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-500 transform hover:scale-125 ${
                    index === currentTestimonial 
                      ? `scale-125 ${darkMode ? 'bg-purple-500' : 'bg-orange-500'}` 
                      : `${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className={`py-20 px-6 md:px-20 text-white transition-all duration-700 ${
        darkMode 
          ? 'bg-gradient-to-br from-black to-gray-900' 
          : 'bg-gradient-to-br from-gray-800 to-gray-900'
      }`} data-animate>
        <div className={`transform transition-all duration-1000 delay-700 ${isVisible[3] ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <h2 className="text-4xl font-bold text-center mb-16">Get In Touch</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-8">
              {[
                { icon: MapPin, color: 'bg-orange-500', title: 'Address', content: 'Perum Kopkar Dwi Karya Blok B2 No. 31, Lampung Tengah, Lampung' },
                { icon: Phone, color: 'bg-green-500', title: 'Phone', content: '0821-7520-3156' },
                { icon: Mail, color: 'bg-blue-500', title: 'Email', content: 'pawonkitchen@email.com' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-4 group">
                  <div className={`${item.color} p-4 rounded-full group-hover:scale-125 transform transition-all duration-500 group-hover:rotate-12`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="transform group-hover:translate-x-2 transition-transform duration-300">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-gray-300">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={`rounded-3xl p-8 transform hover:scale-105 transition-all duration-500 ${
              darkMode ? 'bg-gray-800' : 'bg-gray-700'
            }`}>
              <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className={`w-full p-4 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 transition-all duration-300 transform focus:scale-105 ${
                    darkMode 
                      ? 'bg-gray-700 focus:ring-purple-500' 
                      : 'bg-gray-600 focus:ring-orange-500'
                  }`}
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className={`w-full p-4 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 transition-all duration-300 transform focus:scale-105 ${
                    darkMode 
                      ? 'bg-gray-700 focus:ring-purple-500' 
                      : 'bg-gray-600 focus:ring-orange-500'
                  }`}
                />
                <textarea 
                  placeholder="Your Message" 
                  rows={4}
                  className={`w-full p-4 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 transition-all duration-300 transform focus:scale-105 resize-none ${
                    darkMode 
                      ? 'bg-gray-700 focus:ring-purple-500' 
                      : 'bg-gray-600 focus:ring-orange-500'
                  }`}
                />
                <button className={`w-full py-4 rounded-xl font-bold transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                    : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                }`}>
                  <span>Send Message</span>
                  <Sparkles className="w-5 h-5 animate-spin" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <a 
              href="https://wa.me/6282175203156" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse"
            >
              <MessageCircle className="w-6 h-6 mr-2 animate-bounce" />
              Chat via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className={`text-white text-center py-12 transition-all duration-700 ${
        darkMode ? 'bg-black' : 'bg-black'
      }`}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-center mb-6">
            <ChefHat className={`w-10 h-10 animate-bounce ${
              darkMode ? 'text-purple-500' : 'text-orange-500'
            }`} style={{ animationDuration: '2s' }} />
          </div>
          <p className="text-lg mb-6">Follow us on social media for daily updates!</p>
          <div className="flex justify-center space-x-6 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:scale-125 transform transition-all duration-300 cursor-pointer font-bold text-lg hover:rotate-12">
              f
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-125 transform transition-all duration-300 cursor-pointer text-lg hover:rotate-12">
              📷
            </div>
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:scale-125 transform transition-all duration-300 cursor-pointer text-lg hover:rotate-12">
              ▶️
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center hover:scale-125 transform transition-all duration-300 cursor-pointer text-lg hover:rotate-12">
              💬
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 mt-6">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Pawon Kitchen. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Made with ❤️ for Indonesian food lovers
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button className={`p-4 rounded-full shadow-lg transform hover:scale-110 transition-all duration-300 animate-bounce ${
          darkMode 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
            : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
        } text-white`}>
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
          50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02);
        }
        
        .hover-rotate:hover {
          transform: rotate(5deg) scale(1.05);
        }
        
        .gradient-text {
          background: linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 3s ease infinite;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .shadow-glow {
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        
        .shadow-glow-dark {
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
        }
        
        .backdrop-blur-xl {
          backdrop-filter: blur(20px);
        }
        
        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }
        
        @keyframes wiggle {
          0%, 7% { transform: rotateZ(0); }
          15% { transform: rotateZ(-15deg); }
          20% { transform: rotateZ(10deg); }
          25% { transform: rotateZ(-10deg); }
          30% { transform: rotateZ(6deg); }
          35% { transform: rotateZ(-4deg); }
          40%, 100% { transform: rotateZ(0); }
        }
      `}</style>
    </main>
  );
}