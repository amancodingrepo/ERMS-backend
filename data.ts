
import type { Report, Insight } from './types';

export const REPORTS: Report[] = [
  {
    id: "ai-market-2024",
    title: "Global AI Market Trends 2024",
    summary: "An in-depth analysis of the AI industry, focusing on machine learning, NLP, and computer vision.",
    description: [
      "The Global AI Market is poised for unprecedented growth, driven by advancements in machine learning algorithms and increasing adoption across various sectors. This report provides a comprehensive overview of the market dynamics, including key drivers, restraints, and opportunities.",
      "We delve into the competitive landscape, profiling major players and their strategic initiatives. The study also offers a granular analysis of market segmentation by technology, application, and geography, providing stakeholders with actionable insights to navigate this evolving market."
    ],
    price: 4999,
    pages: 350,
    publishedDate: "2024-05-20",
    category: "Technology",
    coverImage: "https://picsum.photos/seed/ai/800/600",
    tableOfContents: ["Executive Summary", "Market Overview", "Technology Landscape", "Competitive Analysis", "Geographical Outlook", "Future Trends"]
  },
  {
    id: "renewable-energy-2024",
    title: "Renewable Energy Outlook 2024",
    summary: "A comprehensive look at the solar, wind, and hydroelectric power sectors and their future growth.",
    description: [
        "The shift towards sustainable energy sources is accelerating globally. Our 2024 Renewable Energy Outlook examines the critical trends shaping the solar, wind, and hydroelectric sectors. The report evaluates policy impacts, technological innovations, and investment flows.",
        "It provides detailed forecasts and market sizing for key regions, highlighting growth hotspots and potential challenges. This is an essential guide for investors, policymakers, and industry professionals seeking to capitalize on the green energy transition."
    ],
    price: 3500,
    pages: 280,
    publishedDate: "2024-04-15",
    category: "Energy",
    coverImage: "https://picsum.photos/seed/energy/800/600",
    tableOfContents: ["Introduction", "Solar Power Market", "Wind Energy Market", "Hydroelectric Power Analysis", "Policy & Regulation", "Investment Trends"]
  },
  {
    id: "fintech-disruption-2024",
    title: "Fintech Disruption & Innovation",
    summary: "Exploring the impact of blockchain, digital payments, and robo-advisors on traditional finance.",
    description: [
      "Financial technology continues to reshape the banking and finance landscape. This report investigates the disruptive forces of blockchain, the proliferation of digital payment solutions, and the rise of automated financial advisory services (robo-advisors).",
      "We analyze consumer adoption rates, regulatory hurdles, and the strategic responses of incumbent financial institutions. The report offers a forward-looking perspective on the technologies and business models that will define the future of finance."
    ],
    price: 5500,
    pages: 410,
    publishedDate: "2024-06-01",
    category: "Finance",
    coverImage: "https://picsum.photos/seed/fintech/800/600",
    tableOfContents: ["The Fintech Revolution", "Blockchain & Crypto Assets", "Digital Payments Ecosystem", "Robo-Advisors & WealthTech", "Regulatory Landscape", "Case Studies"]
  },
  {
    id: "healthcare-tech-2024",
    title: "Digital Health & MedTech Growth",
    summary: "Analysis of telehealth, wearable devices, and AI in diagnostics within the healthcare sector.",
    description: [
        "The convergence of healthcare and technology is creating new paradigms for patient care and diagnostics. This study covers the key segments of the digital health market: telehealth services, the booming wearable device market, and the application of AI in medical diagnostics.",
        "It assesses market size, growth drivers, and the competitive environment, providing a 360-degree view of the opportunities in this rapidly expanding industry."
    ],
    price: 4200,
    pages: 320,
    publishedDate: "2024-03-10",
    category: "Healthcare",
    coverImage: "https://picsum.photos/seed/health/800/600",
    tableOfContents: ["Overview of Digital Health", "Telehealth Market Analysis", "Wearable Technology Trends", "AI in Medical Diagnostics", "Patient Data & Privacy", "Market Forecasts"]
  }
];

export const INSIGHTS: Insight[] = [
  {
    id: "future-of-ai",
    title: "The Generative AI Revolution: More Than Just Chatbots",
    summary: "Generative AI is set to transform industries far beyond customer service. We explore its potential impact on creative fields, software development, and scientific research.",
    content: [
      "While chatbots have become the public face of generative AI, the technology's true potential lies in its ability to create novel content and solutions across a multitude of disciplines. In the creative industries, artists and designers are using AI tools to generate stunning visuals and conceptual designs, accelerating their workflows. Software developers are leveraging AI-powered coding assistants to write, debug, and optimize code, leading to significant productivity gains.",
      "Perhaps most exciting is the application of generative AI in scientific research. From designing new protein structures for drug discovery to simulating complex climate models, AI is enabling breakthroughs that were previously unimaginable. Our full report on the AI Market delves deeper into these applications and their commercial implications."
    ],
    publishedDate: "2024-06-05",
    author: "Dr. Evelyn Reed",
    relatedReportId: "ai-market-2024",
    coverImage: "https://picsum.photos/seed/insight-ai/800/600"
  },
  {
    id: "solar-efficiency",
    title: "Beyond Silicon: The Next Wave of Solar Panel Technology",
    summary: "As solar energy becomes mainstream, the race is on to develop more efficient and cost-effective photovoltaic cells. Perovskites are leading the charge.",
    content: [
      "For decades, silicon has been the undisputed king of solar panel materials. However, its efficiency is approaching theoretical limits. The next frontier in solar technology is the development of alternative materials that can capture more energy from the sun. Perovskite solar cells (PSCs) have emerged as a leading contender, demonstrating rapid improvements in efficiency and the potential for low-cost, flexible manufacturing.",
      "While challenges in durability and scalability remain, research is progressing at a breakneck pace. A breakthrough in this area could dramatically lower the cost of solar energy and accelerate the global transition away from fossil fuels. Our Renewable Energy Outlook provides a detailed analysis of the commercial viability of these next-gen technologies."
    ],
    publishedDate: "2024-05-18",
    author: "Ben Carter",
    relatedReportId: "renewable-energy-2024",
    coverImage: "https://picsum.photos/seed/insight-solar/800/600"
  },
  {
    id: "digital-wallets-battle",
    title: "The Battle for the Digital Wallet: Who Will Win?",
    summary: "Tech giants, banks, and fintech startups are all vying for control of the consumer's digital wallet. The winner will dominate the future of commerce.",
    content: [
      "The smartphone has become the central hub of our digital lives, and the 'digital wallet' is its commercial core. This space is fiercely contested by a diverse set of players. Big tech companies like Apple and Google are leveraging their ecosystem dominance. Traditional banks are scrambling to enhance their mobile apps to retain customers. Meanwhile, nimble fintech startups are innovating with features like peer-to-peer payments and integrated budgeting tools.",
      "The winning platform will not just facilitate payments but will become an integrated financial dashboard for consumers. Understanding the strategies and competitive advantages of these players is crucial for anyone in the financial services or retail industries, a key theme in our Fintech Disruption report."
    ],
    publishedDate: "2024-06-12",
    author: "Maria Gonzalez",
    relatedReportId: "fintech-disruption-2024",
    coverImage: "https://picsum.photos/seed/insight-wallet/800/600"
  }
];

export const CATEGORIES = [...new Set(REPORTS.map(r => r.category))];
