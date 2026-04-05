import { setDoc } from "firebase/firestore";
import { coursesRef } from "@/firebase/firestore";
import type { Course } from "@/types/firebase";
import { getZoomLink, getCapacity, getEnrolledCount } from "@/config/courseConfig";

const instructor = "Ramini Academy";

const courses: Course[] = [
  {
    id: "python-zero-hero",
    title: "Python 0 to Hero",
    description: "Learn Python from basics to advanced, build real-world projects and master core programming concepts.",
    instructor,
    thumbnail: "/images/Python-hero.png",
    duration: "30 hours",
    level: "Beginner",
    progress: 0,
    category: "Programming",
    totalClasses: 10,
    completedClasses: 0,
    price: 99,
    originalPrice: 499,
    isBestSeller: true,
    syllabus: [
      { week: 1, topic: "Setup & Syntax Basics", description: "Installation, variables, basic operations" },
      { week: 2, topic: "Data Types & Structures", description: "Lists, tuples, dictionaries, sets" },
      { week: 3, topic: "Control Flow", description: "If/else, loops, comprehensions" },
      { week: 4, topic: "Functions & Modules", description: "Function definition, parameters, libraries" },
      { week: 5, topic: "Object-Oriented Programming", description: "Classes, inheritance, polymorphism" },
      { week: 6, topic: "File Handling & Exceptions", description: "Reading/writing files, error handling" },
      { week: 7, topic: "Web Scraping & APIs", description: "requests library, BeautifulSoup, REST APIs" },
      { week: 8, topic: "Database Basics", description: "SQL, SQLite, database integration" }
    ],
    schedule: [
      { id: "py-1", topic: "Python Setup & Syntax", date: "2026-04-16", time: "7:00 PM", status: "upcoming", meetLink: getZoomLink("python-zero-hero") },
      { id: "py-2", topic: "Data Types & Structures", date: "2026-04-23", time: "7:00 PM", status: "upcoming", meetLink: getZoomLink("python-zero-hero") },
      { id: "py-3", topic: "Control Flow", date: "2026-04-30", time: "7:00 PM", status: "upcoming", meetLink: getZoomLink("python-zero-hero") },
      { id: "py-4", topic: "Functions & Modules", date: "2026-05-07", time: "7:00 PM", status: "upcoming", meetLink: getZoomLink("python-zero-hero") },
      { id: "py-5", topic: "Object-Oriented Python", date: "2026-05-14", time: "7:00 PM", status: "upcoming", meetLink: getZoomLink("python-zero-hero") },
      { id: "py-6", topic: "File Handling", date: "2026-05-21", time: "7:00 PM", status: "upcoming", meetLink: getZoomLink("python-zero-hero") },
      { id: "py-7", topic: "Web Scraping", date: "2026-05-28", time: "7:00 PM", status: "upcoming", meetLink: getZoomLink("python-zero-hero") },
      { id: "py-8", topic: "APIs & Requests", date: "2026-06-04", time: "7:00 PM", status: "upcoming", meetLink: getZoomLink("python-zero-hero") },
      { id: "py-9", topic: "Error Handling & Testing", date: "2026-06-11", time: "7:00 PM", status: "upcoming", meetLink: getZoomLink("python-zero-hero") },
      { id: "py-10", topic: "Final Project", date: "2026-06-18", time: "7:00 PM", status: "upcoming", meetLink: getZoomLink("python-zero-hero") }
    ],
    notes: [
      { id: "py-note-1", title: "Python Syntax & Basic Data Types", description: "Comprehensive guide to strings, integers, floats, and boolean logic in Python.", fileUrl: "https://docs.python.org/3/tutorial/introduction.html", type: "pdf" },
      { id: "py-note-2", title: "Mastering Lists & Dictionaries", description: "Efficient use of Python collections for high-performance data handling.", fileUrl: "https://docs.python.org/3/tutorial/datastructures.html", type: "pdf" },
      { id: "py-note-3", title: "Object Oriented Programming (OOP)", description: "Best practices for building modular and reusable Python classes.", fileUrl: "https://realpython.com/python3-object-oriented-programming/", type: "pdf" },
      { id: "py-note-4", title: "Python Standard Library Cheatsheet", description: "A quick reference for common modules like os, sys, datetime, and math.", fileUrl: "https://docs.python.org/3/library/index.html", type: "pdf" }
    ],
    announcements: [
      { id: "py-ann-1", title: "Welcome to Python 0 to Hero", message: "Session 1 recording is available now.", date: "2026-04-01", priority: "normal" }
    ],
    finalQuiz: { id: "py-quiz-1", title: "Python 0 to Hero - Final Exam", topic: "Python Fundamentals", isFinalExam: true, questions: [
      { id: "q1", question: "What is a list in Python?", options: ["Ordered mutable sequence", "Immutable mapping", "Set type", "Tuple"], correctAnswer: 0 },
      { id: "q2", question: "How do you start a for loop?", options: ["for i in range():", "while i < 10", "loop i in range", "iterate i from 0"], correctAnswer: 0 },
      { id: "q3", question: "What does lambda do in Python?", options: ["Creates classes", "Creates anonymous functions", "Loops through data", "Declares variables"], correctAnswer: 1 },
      { id: "q4", question: "How do you handle exceptions in Python?", options: ["throw", "catch", "try/except", "if/else"], correctAnswer: 2 },
      { id: "q5", question: "What is OOP?", options: ["Object Oriented Programming", "Output Operation Programming", "Online Order Processing", "Open Operator Platform"], correctAnswer: 0 },
      { id: "q6", question: "Which keyword is used for importing?", options: ["import", "include", "use", "require"], correctAnswer: 0 },
      { id: "q7", question: "What is the purpose of 'def'?", options: ["Define variables", "Define functions", "Define classes", "Default value"], correctAnswer: 1 },
      { id: "q8", question: "How many data types are in Python?", options: ["3", "4", "5", "More than 5"], correctAnswer: 3 },
      { 
        id: "q9", 
        question: "Write a function `find_max(numbers)` that returns the largest number in a list of integers.", 
        type: "coding",
        options: [], 
        correctAnswer: -1, 
        starterCode: "def find_max(numbers):\n    # Write your logic here\n    pass",
        testCases: [
          { input: "[1, 5, 2]", expectedOutput: "5" },
          { input: "[-10, -5, -20]", expectedOutput: "-5" },
          { input: "[42]", expectedOutput: "42" }
        ]
      }
    ] }
  },
  {
    id: "web-dev-basics",
    title: "HTML, CSS, JavaScript (Basic Web Development)",
    description: "Build responsive websites and understand client-side interactivity using HTML, CSS, and JavaScript.",
    instructor,
    thumbnail: "/images/Web-dev.png",
    duration: "28 hours",
    level: "Beginner",
    progress: 0,
    category: "Web Development",
    totalClasses: 8,
    completedClasses: 0,
    price: 99,
    originalPrice: 799,
    capacity: getCapacity("web-dev-basics"),
    enrolledCount: getEnrolledCount("web-dev-basics"),
    syllabus: [
      { week: 1, topic: "HTML Essentials", description: "Semantic HTML5, forms, accessibility" },
      { week: 2, topic: "CSS Fundamentals", description: "Selectors, box model, positioning" },
      { week: 3, topic: "CSS Layouts", description: "Flexbox, Grid, responsive design" },
      { week: 4, topic: "JavaScript Basics", description: "Variables, operators, functions" },
      { week: 5, topic: "DOM Manipulation", description: "Event listeners, CRUD operations" },
      { week: 6, topic: "ES6+ Features", description: "Arrow functions, destructuring, async" },
      { week: 7, topic: "Responsive Design", description: "Mobile-first, media queries" },
      { week: 8, topic: "Real Project Build", description: "Portfolio website showcase" }
    ],
    schedule: [
      { id: "web-1", topic: "HTML Structure", date: "2026-04-16", time: "8:15 PM", status: "upcoming", meetLink: getZoomLink("web-dev-basics") },
      { id: "web-2", topic: "CSS Layouts", date: "2026-04-23", time: "8:15 PM", status: "upcoming", meetLink: getZoomLink("web-dev-basics") },
      { id: "web-3", topic: "JavaScript Fundamentals", date: "2026-04-30", time: "8:15 PM", status: "upcoming", meetLink: getZoomLink("web-dev-basics") },
      { id: "web-4", topic: "DOM Manipulation", date: "2026-05-07", time: "8:15 PM", status: "upcoming", meetLink: getZoomLink("web-dev-basics") },
      { id: "web-5", topic: "CSS Flexbox & Grid", date: "2026-05-14", time: "8:15 PM", status: "upcoming", meetLink: getZoomLink("web-dev-basics") },
      { id: "web-6", topic: "Responsive Design", date: "2026-05-21", time: "8:15 PM", status: "upcoming", meetLink: getZoomLink("web-dev-basics") },
      { id: "web-7", topic: "Intro to ES6", date: "2026-05-28", time: "8:15 PM", status: "upcoming", meetLink: getZoomLink("web-dev-basics") },
      { id: "web-8", topic: "Capstone Website", date: "2026-06-04", time: "8:15 PM", status: "upcoming", meetLink: getZoomLink("web-dev-basics") }
    ],
    notes: [
      { id: "web-note-1", title: "Semantic HTML5 Guide", description: "Why using the right tags matters for SEO and accessibility.", fileUrl: "https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html", type: "pdf" },
      { id: "web-note-2", title: "CSS Flexbox & Grid Mastery", description: "Modern layout techniques for responsive design.", fileUrl: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", type: "pdf" },
      { id: "web-note-3", title: "Modern JavaScript (ES6+)", description: "Arrows functions, spread operators, and destructing.", fileUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", type: "pdf" }
    ],
    announcements: [],
    finalQuiz: { id: "web-quiz-1", title: "Web Development - Final Exam", topic: "HTML/CSS/JavaScript", isFinalExam: true, questions: [
      { id: "q1", question: "Which tag holds the page title?", options: ["<head>", "<title>", "<h1>", "<meta>"], correctAnswer: 1 },
      { id: "q2", question: "How do you select a class in CSS?", options: ["#class", ".class", "class", "*class"], correctAnswer: 1 },
      { id: "q3", question: "What does DOM stand for?", options: ["Direct Object Model", "Document Object Model", "Data Output Module", "Dynamic Object Management"], correctAnswer: 1 },
      { id: "q4", question: "Which is correct syntax for JavaScript?", options: ["var x = 5;", "var x: int = 5;", "x = 5;", "declare x = 5;"], correctAnswer: 0 },
      { id: "q5", question: "What does async/await do?", options: ["Slows execution", "Speeds execution", "Handles asynchronous operations", "Waits indefinitely"], correctAnswer: 2 },
      { id: "q6", question: "Which CSS property controls text color?", options: ["font-color", "color", "text-color", "bgcolor"], correctAnswer: 1 },
      { id: "q7", question: "What is JSON?", options: ["JavaScript Object Notation", "Java Standard Output Network", "Just Simple Output Name", "JavaScript Online Network"], correctAnswer: 0 },
      { id: "q8", question: "What does 'this' refer to in JavaScript?", options: ["Current function", "Current object", "Global scope", "Parent element"], correctAnswer: 1 }
    ] }
  },
  {
    id: "dsa-python",
    title: "Data Structures & Algorithms (Python)",
    description: "Master algorithms and data structures with Python for technical interviews and high-performance apps.",
    instructor,
    thumbnail: "/images/DSA Python.png",  
    duration: "35 hours",
    level: "Beginner",
    progress: 0,
    category: "Algorithms",
    totalClasses: 9,
    completedClasses: 0,
    price: 99,
    originalPrice: 499,
    capacity: getCapacity("dsa-python"),
    enrolledCount: getEnrolledCount("dsa-python"),
    syllabus: [
      { week: 1, topic: "Arrays & Lists", description: "Operations, complexity, searching" },
      { week: 2, topic: "Stacks & Queues", description: "Implementation, use cases" },
      { week: 3, topic: "Linked Lists", description: "Nodes, operations, edge cases" },
      { week: 4, topic: "Recursion", description: "Base cases, call stack, optimization" },
      { week: 5, topic: "Trees", description: "BST, traversals, balancing" },
      { week: 6, topic: "Graphs", description: "DFS, BFS, shortest paths" },
      { week: 7, topic: "Sorting & Searching", description: "Various algorithms, complexity analysis" },
      { week: 8, topic: "Dynamic Programming", description: "Memoization, bottom-up approach" }
    ],
    schedule: [
      { id: "dsa-1", topic: "Arrays & Lists", date: "2026-04-17", time: "5:00 PM", status: "upcoming", meetLink: getZoomLink("dsa-python") },
      { id: "dsa-2", topic: "Stacks & Queues", date: "2026-04-24", time: "5:00 PM", status: "upcoming", meetLink: getZoomLink("dsa-python") },
      { id: "dsa-3", topic: "Recursion", date: "2026-05-01", time: "5:00 PM", status: "upcoming", meetLink: getZoomLink("dsa-python") },
      { id: "dsa-4", topic: "Trees", date: "2026-05-08", time: "5:00 PM", status: "upcoming", meetLink: getZoomLink("dsa-python") },
      { id: "dsa-5", topic: "Graphs", date: "2026-05-15", time: "5:00 PM", status: "upcoming", meetLink: getZoomLink("dsa-python") },
      { id: "dsa-6", topic: "Sorting Algorithms", date: "2026-05-22", time: "5:00 PM", status: "upcoming", meetLink: getZoomLink("dsa-python") },
      { id: "dsa-7", topic: "Searching Algorithms", date: "2026-05-29", time: "5:00 PM", status: "upcoming", meetLink: getZoomLink("dsa-python") },
      { id: "dsa-8", topic: "Dynamic Programming", date: "2026-06-05", time: "5:00 PM", status: "upcoming", meetLink: getZoomLink("dsa-python") },
      { id: "dsa-9", topic: "Interview Problems", date: "2026-06-12", time: "5:00 PM", status: "upcoming", meetLink: getZoomLink("dsa-python") }
    ],
    notes: [
      { id: "dsa-note-1", title: "Big O Complexity Chart", description: "Visualizing time and space complexity for all core DSA patterns.", fileUrl: "https://www.bigocheatsheet.com/", type: "pdf" },
      { id: "dsa-note-2", title: "Arrays & Linked Lists in Python", description: "When to use each and implementation details.", fileUrl: "https://realpython.com/linked-lists-python/", type: "pdf" },
      { id: "dsa-note-3", title: "Recursive Thinking Guide", description: "How to break down complex problems into recursive base cases.", fileUrl: "https://realpython.com/python-recursion/", type: "pdf" }
    ],
    announcements: [],
    finalQuiz: { id: "dsa-quiz-1", title: "Data Structures & Algorithms - Final Exam", topic: "DSA Fundamentals", isFinalExam: true, questions: [
      { id: "q1", question: "A queue follows which ordering?", options: ["LIFO", "FIFO", "Random", "Priority"], correctAnswer: 1 },
      { id: "q2", question: "Binary search works on?", options: ["Unsorted array", "Sorted array", "Linked list", "Graph"], correctAnswer: 1 },
      { id: "q3", question: "Stack follows which principle?", options: ["FIFO", "LIFO", "Random access", "Set ordering"], correctAnswer: 1 },
      { id: "q4", question: "Time complexity of Quick Sort is?", options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"], correctAnswer: 1 },
      { id: "q5", question: "Which data structure uses key-value pairs?", options: ["Array", "Hash Map", "Queue", "Stack"], correctAnswer: 1 },
      { id: "q6", question: "What is a leaf node in a tree?", options: ["Top node", "Node with children", "Node with no children", "Middle node"], correctAnswer: 2 },
      { id: "q7", question: "BFS explores nodes by?", options: ["Depth first", "Breadth first", "Random order", "Weight"], correctAnswer: 1 },
      { id: "q8", question: "What is space complexity?", options: ["Speed of algorithm", "Memory used by algorithm", "Lines of code", "Number of loops"], correctAnswer: 1 }
    ] }
  },
  {
    id: "ai-tools",
    title: "AI Tools Mastery",
    description: "Become efficient with modern AI tools and workflows for content creation, coding assistance, and productivity.",
    instructor,
    thumbnail: "/images/AI.png",
    duration: "20 hours",
    level: "Beginner",
    progress: 0,
    category: "AI",
    totalClasses: 6,
    completedClasses: 0,
    price: 99,
    originalPrice: 699,
    syllabus: [
      { week: 1, topic: "AI Fundamentals & ChatGPT", description: "What is AI, prompt basics" },
      { week: 2, topic: "Advanced Prompt Engineering", description: "Techniques for better outputs" },
      { week: 3, topic: "Content Creation with AI", description: "Marketing, copywriting, ideas" },
      { week: 4, topic: "Coding Assistance Tools", description: "GitHub Copilot, Code generation" },
      { week: 5, topic: "Image & Design Generation", description: "DALL-E, Midjourney alternatives" },
      { week: 6, topic: "Productivity Automation", description: "Workflows, integrations, automation" }
    ],
    schedule: [
      { id: "ai-1", topic: "Intro to AI Tools", date: "2026-04-16", time: "9:15 PM", status: "upcoming", meetLink: getZoomLink("ai-tools") },
      { id: "ai-2", topic: "Chatbots and Automation", date: "2026-04-23", time: "9:15 PM", status: "upcoming", meetLink: getZoomLink("ai-tools") },
      { id: "ai-3", topic: "AI Prompt Engineering", date: "2026-04-30", time: "9:15 PM", status: "upcoming", meetLink: getZoomLink("ai-tools") },
      { id: "ai-4", topic: "AI for Design", date: "2026-05-07", time: "9:15 PM", status: "upcoming", meetLink: getZoomLink("ai-tools") },
      { id: "ai-5", topic: "Productivity Bots", date: "2026-05-14", time: "9:15 PM", status: "upcoming", meetLink: getZoomLink("ai-tools") },
      { id: "ai-6", topic: "AI Ethics", date: "2026-05-21", time: "9:15 PM", status: "upcoming", meetLink: getZoomLink("ai-tools") }
    ],
    notes: [
      { id: "ai-note-1", title: "Prompt Engineering Best Practices", description: "Frameworks for getting perfect results from LLMs every time.", fileUrl: "https://platform.openai.com/docs/guides/prompt-engineering", type: "pdf" },
      { id: "ai-note-2", title: "GitHub Copilot Tips", description: "How to pair program with AI efficiently.", fileUrl: "https://docs.github.com/en/copilot/using-github-copilot/getting-started-with-github-copilot", type: "pdf" },
      { id: "ai-note-3", title: "AI Image Generation Guide", description: "Understanding Midjourney and DALL-E parameters.", fileUrl: "https://docs.midjourney.com/docs/prompts", type: "pdf" }
    ],
    announcements: [],
    finalQuiz: { id: "ai-quiz-1", title: "AI Tools Mastery - Final Exam", topic: "AI Tools & Workflows", isFinalExam: true, questions: [
      { id: "q1", question: "What does LLM stand for?", options: ["Large Language Model", "Local Learning Module", "Lightweight Logic Machine", "Long-lived Memory"], correctAnswer: 0 },
      { id: "q2", question: "Prompt engineering improves output quality by?", options: ["Changing dataset", "Better prompts", "Randomization", "Speeding training"], correctAnswer: 1 },
      { id: "q3", question: "What is ChatGPT?", options: ["Chat Graph Processing", "Conversational AI model", "Chat General Protocol", "Computational Graphics Program"], correctAnswer: 1 },
      { id: "q4", question: "Which tool is for image generation?", options: ["ChatGPT", "DALL-E", "Github Copilot", "Claude"], correctAnswer: 1 },
      { id: "q5", question: "What does AI automation enhance?", options: ["Creativity only", "Speed and efficiency", "Manual work", "Errors"], correctAnswer: 1 },
      { id: "q6", question: "What is a token in AI?", options: ["Money", "Smallest unit of text", "Code", "Algorithm"], correctAnswer: 1 },
      { id: "q7", question: "Temperature in AI models controls?", options: ["Speed", "Randomness/creativity", "Accuracy", "Memory"], correctAnswer: 1 },
      { id: "q8", question: "Best practice for AI prompts?", options: ["Be vague", "Be specific and clear", "Use abbreviations", "Avoid examples"], correctAnswer: 1 }
    ] }
  },
  {
    id: "powerpoint",
    title: "MS PowerPoint",
    price: 99,
    originalPrice: 299,
    syllabus: [
      { week: 1, topic: "PowerPoint Basics", description: "Interface, slide creation, text formatting" },
      { week: 2, topic: "Design & Themes", description: "Layouts, color schemes, master slides" },
      { week: 3, topic: "Animations & Transitions", description: "Adding movement, timing controls" },
      { week: 4, topic: "Charts & Data Visuals", description: "Graphs, SmartArt, data presentation" },
      { week: 5, topic: "Professional Presentation", description: "Best practices, delivery tips" }
    ],
    description: "Design professional slides fast with PowerPoint features, animation, and presentation best practices.",
    instructor,
    thumbnail: "/images/Powerpoint.png",
    duration: "14 hours",
    level: "Beginner",
    progress: 0,
    category: "Productivity",
    totalClasses: 5,
    completedClasses: 0,
    schedule: [
      { id: "ppt-1", topic: "Presentation Basics", date: "2026-04-17", time: "7:15 PM", status: "upcoming", meetLink: "https://zoom.us/j/5678901234" },
      { id: "ppt-2", topic: "Advanced Animations", date: "2026-04-24", time: "7:15 PM", status: "upcoming", meetLink: "https://zoom.us/j/5678901234" },
      { id: "ppt-3", topic: "Templates & Branding", date: "2026-05-01", time: "7:15 PM", status: "upcoming", meetLink: "https://zoom.us/j/5678901234" },
      { id: "ppt-4", topic: "Data Visualizations", date: "2026-05-08", time: "7:15 PM", status: "upcoming", meetLink: "https://zoom.us/j/5678901234" },
      { id: "ppt-5", topic: "Final Presentation", date: "2026-05-15", time: "7:15 PM", status: "upcoming", meetLink: "https://zoom.us/j/5678901234" }
    ],
    notes: [
      { id: "ppt-note-1", title: "Slide Design Best Practices", description: "Rules for typography, white space, and visual hierarchy.", fileUrl: "https://www.microsoft.com/en-us/microsoft-365/blog/2013/11/21/quick-tips-for-creating-powerful-presentations/", type: "pdf" },
      { id: "ppt-note-2", title: "Animations & Transitions Guide", description: "How to use motion to enhance, not distract.", fileUrl: "https://support.microsoft.com/en-us/office/add-animations-to-slides-in-powerpoint-70678d7d-e2d9-43c9-952c-bd93a7e4465b", type: "pdf" }
    ],
    announcements: [],
    finalQuiz: { id: "ppt-quiz-1", title: "MS PowerPoint - Final Exam", topic: "Presentation Skills", isFinalExam: true, questions: [
      { id: "q1", question: "Which tab lets you add transitions?", options: ["Insert", "Design", "Transitions", "Animations"], correctAnswer: 2 },
      { id: "q2", question: "What shortcut starts slideshow?", options: ["F5", "F2", "Ctrl+S", "Alt+F4"], correctAnswer: 0 },
      { id: "q3", question: "What is slide master?", options: ["First slide", "Slide template", "Last slide", "Main slide"], correctAnswer: 1 },
      { id: "q4", question: "Which option applies theme to all slides?", options: ["Delete slides", "Apply to all", "Reset", "Format"], correctAnswer: 1 },
      { id: "q5", question: "How do you add speaker notes?", options: ["Edit menu", "Notes pane", "Slide sorter", "View menu"], correctAnswer: 1 },
      { id: "q6", question: "What is proper font size for body text?", options: ["8pt", "12pt", "18pt+", "3pt"], correctAnswer: 2 },
      { id: "q7", question: "Best practice for slide count?", options: ["One per minute", "As many as possible", "10 minimum", "50+ slides"], correctAnswer: 0 },
      { id: "q8", question: "Animations should be?", options: ["Excessive", "Purposeful and minimal", "Distracting", "Random"], correctAnswer: 1 }
    ] }
  },
  {
    id: "excel",
    title: "MS Excel",
    description: "Get skilled in spreadsheets, formulas, charts, and data analytics using MS Excel.",
    price: 99,
    originalPrice: 299,
    syllabus: [
      { week: 1, topic: "Excel Fundamentals", description: "Navigation, data entry, formatting" },
      { week: 2, topic: "Formulas & Functions", description: "Basic to advanced calculations" },
      { week: 3, topic: "Data Analysis", description: "Sorting, filtering, conditional logic" },
      { week: 4, topic: "Charts & Visualization", description: "Creating professional charts" },
      { week: 5, topic: "Pivot Tables", description: "Summarizing data, reports" },
      { week: 6, topic: "Automation & Best Practices", description: "Macros, templates, pro tips" }
    ],
    instructor,
    thumbnail: "/images/Excel.png",
    duration: "18 hours",
    level: "Beginner",
    progress: 0,
    category: "Productivity",
    totalClasses: 6,
    completedClasses: 0,
    schedule: [
      { id: "xls-1", topic: "Workbook Fundamentals", date: "2026-04-17", time: "6:15 PM", status: "upcoming", meetLink: "https://zoom.us/j/6789012345" },
      { id: "xls-2", topic: "Formulas & Functions", date: "2026-04-24", time: "6:15 PM", status: "upcoming", meetLink: "https://zoom.us/j/6789012345" },
      { id: "xls-3", topic: "Charts", date: "2026-05-01", time: "6:15 PM", status: "upcoming", meetLink: "https://zoom.us/j/6789012345" },
      { id: "xls-4", topic: "PivotTables", date: "2026-05-08", time: "6:15 PM", status: "upcoming", meetLink: "https://zoom.us/j/6789012345" },
      { id: "xls-5", topic: "Data Validation", date: "2026-05-15", time: "6:15 PM", status: "upcoming", meetLink: "https://zoom.us/j/6789012345" },
      { id: "xls-6", topic: "Excel Automation", date: "2026-05-22", time: "6:15 PM", status: "upcoming", meetLink: "https://zoom.us/j/6789012345" }
    ],
    notes: [
      { id: "xls-note-1", title: "Excel Essential Formulas", description: "Lookup, Logical, and Math functions you'll use every day.", fileUrl: "https://support.microsoft.com/en-us/office/excel-functions-by-category-5f91f4e9-7b42-46d2-9bd1-63f26a86c0eb", type: "pdf" },
      { id: "xls-note-2", title: "Data Visualization Guide", description: "Choosing the right chart type for your data storytelling.", fileUrl: "https://support.microsoft.com/en-us/office/available-chart-types-in-office-a6197214-c871-40a3-962e-9d7a220ce660", type: "pdf" },
      { id: "xls-note-3", title: "Mastering Pivot Tables", description: "How to summarize large datasets in seconds.", fileUrl: "https://support.microsoft.com/en-us/office/create-a-pivottable-to-analyze-worksheet-data-a9a84538-b139-40d1-b8e9-28c0a5201888", type: "pdf" }
    ],
    announcements: [],
    finalQuiz: { id: "xls-quiz-1", title: "MS Excel - Final Exam", topic: "Spreadsheet Mastery", isFinalExam: true, questions: [

      { id: "q1", question: "Which function finds average?", options: ["SUM", "AVG", "AVERAGE", "MEDIAN"], correctAnswer: 2 },
      { id: "q2", question: "What does VLOOKUP do?", options: ["Vertical lookup", "Volume calculation", "Video link", "Validation"], correctAnswer: 0 },
      { id: "q3", question: "How do you freeze rows?", options: ["Format menu", "View menu", "Edit menu", "Insert menu"], correctAnswer: 1 },
      { id: "q4", question: "What is a pivot table?", options: ["Rotating data", "Summary of data", "Moving table", "Table schema"], correctAnswer: 1 },
      { id: "q5", question: "Which function counts cells with values?", options: ["SUM", "COUNT", "TOTAL", "LENGTH"], correctAnswer: 1 },
      { id: "q6", question: "What does $ do in formulas?", options: ["Currency", "Absolute reference", "Relative reference", "Function"], correctAnswer: 1 },
      { id: "q7", question: "How to create conditional formatting?", options: ["Data menu", "Format menu", "Home tab", "View menu"], correctAnswer: 1 },
      { id: "q8", question: "What is data validation for?", options: ["Creating formulas", "Restricting input", "Deleting data", "Sorting"], correctAnswer: 1 }
    ] }
  }
];

export const seedCourses = async () => {
  const promises = courses.map((course) => setDoc(coursesRef(course.id), course, { merge: true }));
  await Promise.all(promises);
};

export { courses };
