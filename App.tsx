
import React, { useState, useEffect, ReactNode, useMemo } from 'react';
import { HashRouter, Routes, Route, NavLink, Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, FileText, BarChart2, DollarSign, Calendar, BookOpen, ChevronDown, ChevronRight, X, MessageSquare, Send } from 'lucide-react';
import { GoogleGenAI, Chat } from '@google/genai';

import type { Report, Insight } from './types';
import { REPORTS, INSIGHTS, CATEGORIES } from './data';

// --- HOOKS ---
const useData = <T,>(data: T) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500); // Simulate network delay
        return () => clearTimeout(timer);
    }, []);

    return { data, loading, error };
};

const useTitle = (title: string) => {
    useEffect(() => {
        document.title = `${title} | IntelliSource Reports`;
    }, [title]);
};


// --- UI COMPONENTS ---

const PageTransition: React.FC<{ children: ReactNode }> = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ type: 'tween', duration: 0.4 }}
    >
        {children}
    </motion.div>
);


const SkeletonLoader: React.FC<{ className?: string }> = ({ className = 'h-4 bg-gray-200 rounded w-3/4' }) => (
    <div className={`animate-pulse ${className}`} />
);

const Button: React.FC<{ children: ReactNode, onClick?: () => void, to?: string, state?: any, className?: string, variant?: 'primary' | 'secondary' }> = ({ children, onClick, to, state, className = '', variant = 'primary' }) => {
    const baseClasses = 'inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variantClasses = {
        primary: 'bg-brand-blue text-white hover:bg-brand-blue-dark focus:ring-brand-blue',
        secondary: 'bg-white text-brand-blue border border-brand-blue hover:bg-brand-blue-light focus:ring-brand-blue'
    };

    const motionProps = {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 }
    };

    if (to) {
        return (
            <Link to={to} state={state}>
                <motion.div {...motionProps} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
                    {children}
                </motion.div>
            </Link>
        );
    }

    return (
        <motion.button {...motionProps} onClick={onClick} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {children}
        </motion.button>
    );
};

const ReportCard: React.FC<{ report: Report }> = ({ report }) => (
    <motion.div
        className="bg-white rounded-xl overflow-hidden shadow-subtle hover:shadow-medium transition-shadow duration-300 flex flex-col"
        whileHover={{ y: -5 }}
    >
        <img src={report.coverImage} alt={report.title} className="w-full h-48 object-cover" />
        <div className="p-6 flex flex-col flex-grow">
            <span className="text-brand-blue font-semibold text-sm mb-2">{report.category}</span>
            <h3 className="text-lg font-bold text-brand-text mb-3 leading-tight flex-grow">{report.title}</h3>
            <p className="text-brand-subtext text-sm mb-4">{report.summary}</p>
            <div className="mt-auto flex justify-between items-center">
                <span className="text-xl font-bold text-brand-blue">${report.price.toLocaleString()}</span>
                <Button to={`/reports/${report.id}`} variant="secondary">Details <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
        </div>
    </motion.div>
);

const BlogCard: React.FC<{ insight: Insight }> = ({ insight }) => (
    <motion.div
        className="bg-white rounded-xl overflow-hidden shadow-subtle hover:shadow-medium transition-shadow duration-300 flex flex-col"
        whileHover={{ y: -5 }}
    >
        <img src={insight.coverImage} alt={insight.title} className="w-full h-48 object-cover" />
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-brand-text mb-2 flex-grow">{insight.title}</h3>
            <p className="text-brand-subtext text-sm mb-4">{insight.summary}</p>
            <div className="mt-auto">
                 <Link to={`/insights/${insight.id}`} className="font-semibold text-brand-blue hover:text-brand-blue-dark transition-colors duration-200 flex items-center">
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </div>
        </div>
    </motion.div>
);

const FilterSidebar = ({ categories, selectedCategories, setSelectedCategories }: { categories: string[], selectedCategories: string[], setSelectedCategories: (cats: string[]) => void }) => {
    const handleToggle = (category: string) => {
        setSelectedCategories(
            selectedCategories.includes(category)
                ? selectedCategories.filter(c => c !== category)
                : [...selectedCategories, category]
        );
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-subtle">
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <div className="space-y-3">
                {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleToggle(category)}
                        />
                        <span className="ml-3 text-brand-subtext">{category}</span>
                    </label>
                ))}
            </div>
             {selectedCategories.length > 0 && (
                <button 
                    onClick={() => setSelectedCategories([])}
                    className="text-sm text-brand-blue hover:underline mt-4 w-full text-left"
                >
                    Clear Filters
                </button>
            )}
        </div>
    );
};

const Navbar = () => (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-brand-blue flex items-center">
                <BarChart2 className="mr-2"/>
                IntelliSource
            </Link>
            <div className="hidden md:flex items-center space-x-8">
                <NavLink to="/" className={({ isActive }) => `font-medium hover:text-brand-blue transition-colors ${isActive ? 'text-brand-blue' : 'text-brand-subtext'}`}>Home</NavLink>
                <NavLink to="/reports" className={({ isActive }) => `font-medium hover:text-brand-blue transition-colors ${isActive ? 'text-brand-blue' : 'text-brand-subtext'}`}>Reports</NavLink>
                <NavLink to="/insights" className={({ isActive }) => `font-medium hover:text-brand-blue transition-colors ${isActive ? 'text-brand-blue' : 'text-brand-subtext'}`}>Insights</NavLink>
            </div>
            <Button to="/reports">Explore Reports</Button>
        </nav>
    </header>
);

const Footer = () => (
    <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-brand-blue mb-2">IntelliSource</h3>
                    <p className="text-brand-subtext text-sm">Actionable intelligence for market leaders.</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-3">Quick Links</h4>
                    <ul className="space-y-2">
                        <li><Link to="/reports" className="text-sm text-brand-subtext hover:text-brand-blue">All Reports</Link></li>
                        <li><Link to="/insights" className="text-sm text-brand-subtext hover:text-brand-blue">Insights Blog</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-3">Legal</h4>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-sm text-brand-subtext hover:text-brand-blue">Terms of Service</a></li>
                        <li><a href="#" className="text-sm text-brand-subtext hover:text-brand-blue">Privacy Policy</a></li>
                    </ul>
                </div>
                <div>
                     <h4 className="font-semibold mb-3">Newsletter</h4>
                     <p className="text-sm text-brand-subtext mb-2">Get the latest insights delivered to your inbox.</p>
                     <div className="flex">
                        <input type="email" placeholder="Your email" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:ring-brand-blue focus:border-brand-blue"/>
                        <button className="bg-brand-blue text-white px-4 py-2 rounded-r-md hover:bg-brand-blue-dark">&rarr;</button>
                     </div>
                </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} IntelliSource Reports. All Rights Reserved.
            </div>
        </div>
    </footer>
);

// --- AI CHAT WIDGET ---

const aiContext = `
You are IntelliSource Assistant, a friendly and professional AI helper for the IntelliSource Reports website. Your goal is to help users find the right market research reports and industry insights.

You have access to the following data:

**Available Reports:**
${REPORTS.map(r => `- ID: ${r.id}, Title: ${r.title}, Summary: ${r.summary} (Category: ${r.category}, Price: $${r.price})`).join('\n')}

**Available Insights (Blog Posts):**
${INSIGHTS.map(i => `- ID: ${i.id}, Title: ${i.title}, Summary: ${i.summary}`).join('\n')}

When a user asks a question, use this data to provide helpful answers.
- If a user asks for a report on a topic, identify the most relevant report(s) from the list and mention their title and a brief summary.
- If a user asks for insights or articles, refer them to the relevant blog posts.
- Be conversational and helpful.
- Do not make up reports or insights that are not on the list.
- Keep your answers concise and to the point.
- You can suggest navigating to the report or insight page. For example, you can say "You can find more details on the 'Global AI Market Trends 2024' report page."
`;

type Message = {
    sender: 'user' | 'ai';
    text: string;
};

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "Hello! How can I help you find the right report or insight today?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initChat = () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
                const session = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: aiContext,
                    },
                });
                setChatSession(session);
            } catch (e) {
                console.error("Failed to initialize chat session:", e);
                setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
            }
        };
        initChat();
    }, []);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (userInput: string) => {
        if (!userInput.trim() || isLoading || !chatSession) return;

        const newUserMessage: Message = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);

        try {
            // FIX: The `sendMessage` method expects an object with a `message` property.
            const response = await chatSession.sendMessage({ message: userInput });
            const aiResponse: Message = { sender: 'ai', text: response.text };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = { sender: 'ai', text: "Oops! Something went wrong. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <motion.div
                className="fixed bottom-6 right-6 z-[100]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-brand-blue text-white rounded-full p-4 shadow-medium"
                    aria-label="Open chat"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isOpen ? 'close' : 'open'}
                            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
                        </motion.div>
                    </AnimatePresence>
                </button>
            </motion.div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed bottom-24 right-6 w-[calc(100vw-48px)] max-w-sm h-[60vh] max-h-[500px] bg-white rounded-2xl shadow-medium flex flex-col z-[99] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 bg-brand-blue text-white flex-shrink-0">
                            <h3 className="font-bold text-lg">IntelliSource Assistant</h3>
                        </div>

                        {/* Messages */}
                        <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                            <div className="space-y-4">
                                {messages.map((msg, index) => (
                                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`rounded-xl px-4 py-2 max-w-[85%] break-words ${msg.sender === 'user' ? 'bg-brand-blue text-white' : 'bg-gray-200 text-brand-text'}`}>
                                            <p className="text-sm">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="rounded-xl px-4 py-2 bg-gray-200 text-brand-text">
                                            <div className="flex items-center space-x-1">
                                                <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                             <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const input = e.currentTarget.message;
                                handleSendMessage(input.value);
                                input.value = '';
                            }} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    name="message"
                                    placeholder="Ask a question..."
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                                    disabled={isLoading}
                                    autoComplete="off"
                                />
                                <button type="submit" disabled={isLoading} className="bg-brand-blue text-white p-2.5 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition">
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <ChatWidget />
        </div>
    );
};

// --- PAGE COMPONENTS ---

const HomePage = () => {
    useTitle("Home");
    const { data: reports, loading } = useData(REPORTS);
    const { data: insights } = useData(INSIGHTS);
    const featuredReports = reports.slice(0, 3);
    const latestInsights = insights.slice(0, 3);

    return (
        <PageTransition>
            {/* Hero Section */}
            <div className="bg-white">
                <div className="container mx-auto px-6 py-24 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-bold text-brand-text mb-4"
                    >
                        Clarity in a Complex World.
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-brand-subtext max-w-3xl mx-auto mb-8"
                    >
                        We deliver premier market research and strategic insights to help you make confident decisions and stay ahead of the curve.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Button to="/reports" className="px-8 py-4 text-lg">
                            Browse Reports <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Featured Reports */}
            <div className="py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Featured Reports</h2>
                    {loading ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, i) => <SkeletonLoader key={i} className="h-[450px] bg-gray-200 rounded-xl" />)}
                         </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredReports.map(report => <ReportCard key={report.id} report={report} />)}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Insights Section */}
            <div className="py-20 bg-white">
                <div className="container mx-auto px-6">
                     <h2 className="text-3xl font-bold text-center mb-12">Latest Insights</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {latestInsights.map(insight => <BlogCard key={insight.id} insight={insight} />)}
                      </div>
                      <div className="text-center mt-12">
                          <Button to="/insights" variant="secondary">View All Insights</Button>
                      </div>
                </div>
            </div>
        </PageTransition>
    );
};

const ReportsPage = () => {
    useTitle("Reports");
    const { data: reports, loading } = useData(REPORTS);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredReports = useMemo(() => {
        return reports
            .filter(report => selectedCategories.length === 0 || selectedCategories.includes(report.category))
            .filter(report => report.title.toLowerCase().includes(searchTerm.toLowerCase()) || report.summary.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [reports, selectedCategories, searchTerm]);


    return (
        <PageTransition>
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold mb-2">Research Reports</h1>
                <p className="text-lg text-brand-subtext mb-8">Explore our catalog of in-depth market analysis.</p>

                 <div className="mb-8 relative">
                    <input 
                        type="text" 
                        placeholder="Search reports..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <FilterSidebar categories={CATEGORIES} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} />
                    </div>
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[...Array(4)].map((_, i) => <SkeletonLoader key={i} className="h-[450px] bg-gray-200 rounded-xl" />)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {filteredReports.map(report => <ReportCard key={report.id} report={report} />)}
                            </div>
                        )}
                        {filteredReports.length === 0 && !loading && (
                            <div className="text-center py-16 bg-white rounded-lg">
                                <h3 className="text-xl font-semibold">No reports found.</h3>
                                <p className="text-brand-subtext mt-2">Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

const ReportDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const report = REPORTS.find(r => r.id === id);

    useTitle(report?.title || "Report");

    if (!report) {
        return <div className="text-center py-20">Report not found.</div>;
    }

    return (
        <PageTransition>
            <div className="bg-white">
                <div className="container mx-auto px-6 py-12">
                    <p className="text-brand-blue font-semibold mb-2">{report.category}</p>
                    <h1 className="text-4xl font-bold mb-4">{report.title}</h1>
                    <div className="flex flex-wrap text-brand-subtext text-sm gap-x-6 gap-y-2 mb-8">
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-2" />Published: {report.publishedDate}</span>
                        <span className="flex items-center"><FileText className="w-4 h-4 mr-2" />Pages: {report.pages}</span>
                        <span className="flex items-center"><BookOpen className="w-4 h-4 mr-2" />ID: {report.id}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold border-b pb-2">Report Description</h2>
                    {report.description.map((p, i) => <p key={i} className="text-lg leading-relaxed text-brand-subtext">{p}</p>)}
                    
                    <h2 className="text-2xl font-bold border-b pb-2 pt-8">Table of Contents</h2>
                    <ul className="space-y-2">
                        {report.tableOfContents.map((item, i) => (
                            <li key={i} className="flex items-start">
                                <ChevronRight className="w-5 h-5 text-brand-blue mt-1 mr-2 flex-shrink-0" />
                                <span className="text-brand-subtext">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-subtle p-6 sticky top-28">
                        <p className="text-lg text-brand-subtext">Price</p>
                        <p className="text-4xl font-bold text-brand-blue mb-6">${report.price.toLocaleString()}</p>
                        <Button to="/checkout" state={{ report }} className="w-full text-lg">
                            <DollarSign className="mr-2 h-5 w-5" /> Buy Now
                        </Button>
                        <p className="text-xs text-gray-500 mt-4 text-center">Secure transaction via Stripe.</p>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};


const InsightsPage = () => {
    useTitle("Insights");
    const { data: insights, loading } = useData(INSIGHTS);
    
    return (
        <PageTransition>
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold mb-2">Industry Insights</h1>
                <p className="text-lg text-brand-subtext mb-8">Our latest analysis on market-moving trends.</p>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => <SkeletonLoader key={i} className="h-[400px] bg-gray-200 rounded-xl" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {insights.map(insight => <BlogCard key={insight.id} insight={insight} />)}
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

const InsightDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const insight = INSIGHTS.find(i => i.id === id);
    const relatedReport = REPORTS.find(r => r.id === insight?.relatedReportId);

    useTitle(insight?.title || "Insight");

    if (!insight) {
        return <div className="text-center py-20">Insight not found.</div>;
    }

    return (
        <PageTransition>
             <div className="container mx-auto px-6 py-12 max-w-4xl">
                 <img src={insight.coverImage} alt={insight.title} className="w-full h-96 object-cover rounded-xl mb-8"/>
                <h1 className="text-4xl font-bold mb-4">{insight.title}</h1>
                <div className="flex items-center text-brand-subtext text-sm mb-8">
                    <span>By {insight.author}</span>
                    <span className="mx-2">|</span>
                    <span>{insight.publishedDate}</span>
                </div>
                <div className="prose lg:prose-lg max-w-none text-brand-text space-y-6">
                    {insight.content.map((p, i) => <p key={i}>{p}</p>)}
                </div>

                {relatedReport && (
                    <div className="mt-16 p-8 bg-brand-blue-light rounded-xl text-center">
                        <h3 className="text-2xl font-bold text-brand-text mb-3">Go Deeper with the Full Report</h3>
                        <p className="text-brand-subtext mb-6">This insight is based on our comprehensive report: <strong>{relatedReport.title}</strong></p>
                        <Button to={`/reports/${relatedReport.id}`}>
                            View Full Report <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

const CheckoutPage = () => {
    useTitle("Checkout");
    const { state } = useLocation();
    const navigate = useNavigate();
    const report = state?.report as Report | undefined;

    useEffect(() => {
        if (!report) {
            navigate('/reports');
        }
    }, [report, navigate]);
    
    // In a real app, this would call a backend endpoint to create a Stripe Checkout Session
    const handlePayment = () => {
        console.log("Initiating payment for:", report?.title);
        // Fake payment success
        navigate('/thank-you', { state: { report } });
    };

    if (!report) return <div className="py-20 text-center">Loading...</div>;

    return (
        <PageTransition>
            <div className="container mx-auto px-6 py-12 max-w-2xl">
                <h1 className="text-4xl font-bold mb-8 text-center">Secure Checkout</h1>
                <div className="bg-white rounded-xl shadow-subtle p-8">
                    <h2 className="text-2xl font-bold mb-6 border-b pb-4">Order Summary</h2>
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="font-semibold text-lg">{report.title}</p>
                            <p className="text-brand-subtext text-sm">{report.category}</p>
                        </div>
                        <p className="font-bold text-lg">${report.price.toLocaleString()}</p>
                    </div>
                    <div className="border-t pt-4">
                         <div className="flex justify-between items-center text-xl font-bold">
                            <span>Total</span>
                            <span>${report.price.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4">Payment Information</h3>
                        <p className="text-brand-subtext mb-4 text-sm">This is a mock checkout page. In a real application, a Stripe payment element would be rendered here.</p>
                        <Button onClick={handlePayment} className="w-full text-lg">
                           Pay ${report.price.toLocaleString()}
                        </Button>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

const ThankYouPage = () => {
    useTitle("Thank You");
    const { state } = useLocation();
    const report = state?.report as Report | undefined;

    if (!report) {
        return (
            <PageTransition>
                 <div className="container mx-auto px-6 py-20 text-center">
                    <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
                    <p className="text-lg text-brand-subtext">Your purchase was successful.</p>
                 </div>
            </PageTransition>
        )
    }

    return (
        <PageTransition>
            <div className="container mx-auto px-6 py-20 text-center max-w-2xl">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} className="mx-auto bg-green-100 h-16 w-16 rounded-full flex items-center justify-center mb-6">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </motion.div>
                <h1 className="text-4xl font-bold mb-4">Thank You for Your Purchase!</h1>
                <p className="text-lg text-brand-subtext mb-8">A confirmation email has been sent to you. You can download your report below.</p>
                <div className="bg-white p-6 rounded-lg shadow-subtle text-left mb-8">
                    <h2 className="font-bold text-xl mb-2">{report.title}</h2>
                    <p className="text-brand-subtext text-sm">A PDF copy of the report is ready for download.</p>
                </div>
                <Button onClick={() => alert('Downloading report...')}>
                    Download Report (PDF)
                </Button>
            </div>
        </PageTransition>
    );
};

// --- MAIN APP ROUTER ---

const App = () => {
    const location = useLocation();
    return (
        <Layout>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/reports/:id" element={<ReportDetailPage />} />
                    <Route path="/insights" element={<InsightsPage />} />
                    <Route path="/insights/:id" element={<InsightDetailPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/thank-you" element={<ThankYouPage />} />
                </Routes>
            </AnimatePresence>
        </Layout>
    );
};

const AppContainer = () => (
    <HashRouter>
        <App />
    </HashRouter>
);

export default AppContainer;
