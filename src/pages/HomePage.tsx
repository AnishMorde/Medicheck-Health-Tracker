// HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Define blog post interface
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image?: string;
  category: string;
}

const HomePage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch blog posts from API
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await axios.get<BlogPost[]>('https://api.example.com/medical-blogs');
        setBlogPosts(response.data.slice(0, 3)); // Get latest 3 blog posts
        setLoading(false);
      } catch (err) {
        setError('Failed to load blog posts. Please try again later.');
        setLoading(false);
        console.error('Error fetching blog posts:', err);
        
        // Fallback data for demonstration purposes
        setBlogPosts([
          {
            id: 1,
            title: 'New Research on Preventing Heart Disease',
            excerpt: 'Recent studies suggest that combining specific lifestyle changes can reduce heart disease risk by up to 80%.',
            author: 'Dr. Sarah Johnson',
            date: '2025-02-15',
            category: 'Research'
          },
          {
            id: 2,
            title: 'Understanding Heart Palpitations: When to Worry',
            excerpt: 'Heart palpitations are common but can sometimes signal a more serious condition. Learn the warning signs.',
            author: 'Dr. Michael Chen',
            date: '2025-02-10',
            category: 'Education'
          },
          {
            id: 3,
            title: 'Heart-Healthy Mediterranean Diet: A Complete Guide',
            excerpt: 'The Mediterranean diet has been linked to improved heart health outcomes. Here\'s how to incorporate it into your daily meals.',
            author: 'Emma Roberts, RD',
            date: '2025-02-05',
            category: 'Nutrition'
          }
        ]);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Heart Health Awareness</h1>
          <p className="text-xl mb-8">Understanding heart disease for a healthier tomorrow</p>
          <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-100 transition">
            Learn More
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-12 px-4">
        {/* Overview Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Understanding Heart Disease</h2>
          <p className="text-gray-700 mb-6">
            Heart disease remains the leading cause of death worldwide. Education and awareness
            are crucial first steps in prevention and early intervention.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">What is Heart Disease?</h3>
              <p className="text-gray-600">
                Heart disease refers to several conditions that affect your heart's structure and function,
                including coronary artery disease, heart rhythm problems, and heart defects.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Risk Factors</h3>
              <p className="text-gray-600">
                Common risk factors include high blood pressure, high cholesterol, smoking, diabetes,
                obesity, poor diet, physical inactivity, and excessive alcohol use.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Prevention</h3>
              <p className="text-gray-600">
                Many heart diseases can be prevented through healthy lifestyle choices like regular
                exercise, balanced diet, limiting alcohol, and avoiding tobacco.
              </p>
            </div>
          </div>
        </section>

        {/* Heart Attack Awareness Section */}
        <section className="mb-16 bg-red-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-red-700 mb-6">Heart Attack Warning Signs</h2>
          <p className="text-gray-700 mb-6">
            Recognizing the signs of a heart attack can save lives. Symptoms can differ between men and women.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <h3 className="text-xl font-semibold text-red-700 mb-3">Common Symptoms</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Chest pain or discomfort</li>
                <li>• Pain spreading to the arm, neck, jaw or back</li>
                <li>• Shortness of breath</li>
                <li>• Cold sweat, nausea, or lightheadedness</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <h3 className="text-xl font-semibold text-red-700 mb-3">What To Do</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Call emergency services immediately (911)</li>
                <li>• Chew and swallow an aspirin (if not allergic)</li>
                <li>• Sit or lie down and try to remain calm</li>
                <li>• If trained, perform CPR if the person becomes unconscious</li>
              </ul>
            </div>
          </div>
          <div className="bg-red-100 p-6 rounded-lg border border-red-200">
            <p className="text-red-800 font-medium">
              Remember: Every minute matters during a heart attack. Don't wait to see if symptoms go away.
              Immediate medical attention can save heart muscle and lives.
            </p>
          </div>
        </section>

        {/* Medical Blogs Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-blue-800">Latest Medical Blogs</h2>
            <Link to="/blogs" className="text-blue-600 hover:underline font-medium">
              View All Blogs →
            </Link>
          </div>
          
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading medical blogs...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700 mb-6">
              {error}
            </div>
          )}
          
          {!loading && !error && (
            <div className="grid md:grid-cols-3 gap-6">
              {blogPosts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                  <div className="h-48 bg-gray-200">
                    {post.image ? (
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-100">
                        <span className="text-blue-500 text-2xl font-semibold">♥</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="mt-auto">
                      <div className="text-sm text-gray-500 mb-3">By {post.author}</div>
                      <Link 
                        to={`/blog/${post.id}`} 
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                      >
                        Read More 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Resources Section */}
        <section>
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Resources & Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Health Check Tools</h3>
              <p className="text-gray-600 mb-4">
                Assess your heart health risk with our online tools.
              </p>
              <Link to="/risk-assessment" className="text-blue-600 hover:underline font-medium">
                Take Heart Risk Assessment →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Find a Cardiologist</h3>
              <p className="text-gray-600 mb-4">
                Connect with heart specialists in your area.
              </p>
              <Link to="/find-doctor" className="text-blue-600 hover:underline font-medium">
                Find a Doctor →
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Newsletter Signup */}
      <section className="bg-blue-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl font-bold mb-2">Stay Informed</h2>
              <p>Get the latest heart health news and articles delivered to your inbox.</p>
            </div>
            <div className="w-full md:w-auto">
              <form className="flex flex-col sm:flex-row gap-2 w-full">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 rounded-lg text-gray-800 w-full"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-white text-blue-700 px-6 py-2 rounded-lg font-medium hover:bg-blue-100 transition whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className="bg-blue-700 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Take Control of Your Heart Health Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Learn more about prevention, treatment options, and lifestyle changes that can help maintain a healthy heart.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/learn-more" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-100 transition">
              Learn More
            </Link>
            <Link to="/emergency" className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition">
              Emergency Info
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-white mb-3">Heart Health Initiative</h3>
              <p className="max-w-xs">
                Dedicated to raising awareness and providing education about heart disease and prevention.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                  <li><Link to="/resources" className="hover:text-white">Resources</Link></li>
                  <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Medical Info</h4>
                <ul className="space-y-2">
                  <li><Link to="/blogs" className="hover:text-white">Blog Articles</Link></li>
                  <li><Link to="/conditions" className="hover:text-white">Heart Conditions</Link></li>
                  <li><Link to="/prevention" className="hover:text-white">Prevention</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-sm text-center">
            <p>© {new Date().getFullYear()} Heart Health Initiative. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;