export const getLessonQuestions = (topic: string): Array<{ question: string; options: string[]; correctAnswer: number }> => {
  const dictionary: Record<string, Array<{ question: string; options: string[]; correctAnswer: number }>> = {
    // Python
    "Python Setup & Basics": [
      { question: "What is Python?", options: ["Operating system", "A programming language", "A video player", "A web browser"], correctAnswer: 1 },
      { question: "Which function is used to display output?", options: ["display()", "print()", "output()", "show()"], correctAnswer: 1 },
      { question: "What does input() do?", options: ["Displays output", "Imports modules", "Takes user input", "Defines variables"], correctAnswer: 2 },
      { question: "What is a variable?", options: ["A function", "A container to store data", "A loop", "A module"], correctAnswer: 1 },
      { question: "Which symbol is used for comments?", options: ["//", "#", "/*", "--"], correctAnswer: 1 }
    ],
    "Data Types & Variables": [
      { question: "What is the data type of 10?", options: ["String", "Float", "Integer (int)", "Boolean"], correctAnswer: 2 },
      { question: "What is the data type of 'Hello'?", options: ["Integer", "String (str)", "List", "Dictionary"], correctAnswer: 1 },
      { question: "What is the data type of True?", options: ["String", "Integer", "Boolean (bool)", "Float"], correctAnswer: 2 },
      { question: "What is the output of 5 + 2 * 3?", options: ["21", "11", "17", "15"], correctAnswer: 1 },
      { question: "What is the output of '5' + '5'?", options: ["10", "'10'", "'55'", "Error"], correctAnswer: 2 }
    ],
    "Lists, Tuples, Sets & Dictionaries": [
      { question: "Which data type is ordered and changeable?", options: ["Tuple", "String", "List", "Set"], correctAnswer: 2 },
      { question: "Which data type is immutable?", options: ["List", "Dictionary", "Set", "Tuple"], correctAnswer: 3 },
      { question: "Which data type stores unique values only?", options: ["List", "Dictionary", "Set", "Tuple"], correctAnswer: 2 },
      { question: "Which data type uses key-value pairs?", options: ["List", "Tuple", "Set", "Dictionary"], correctAnswer: 3 },
      { question: "How do you access the first element of list a=[10,20]?", options: ["a[1]", "a[0]", "a(0)", "a.first"], correctAnswer: 1 }
    ],
    "Conditional Statements (if-else)": [
      { question: "Which keyword is used for condition checking?", options: ["when", "if", "check", "condition"], correctAnswer: 1 },
      { question: "What does elif mean?", options: ["Else if", "End if", "Else in", "And if"], correctAnswer: 0 },
      { question: "What is the output of: if 5 > 3: print('Yes')", options: ["No", "5 > 3", "Yes", "Error"], correctAnswer: 2 },
      { question: "AND operator returns true when?", options: ["One condition is true", "Both conditions are true", "Any condition is true", "No condition is true"], correctAnswer: 1 },
      { question: "What does NOT operator do?", options: ["Combines conditions", "Reverses condition", "Checks equality", "Compares values"], correctAnswer: 1 }
    ],
    "Loops (for & while)": [
      { question: "Which loop is used for fixed iterations?", options: ["while loop", "for loop", "do-while loop", "repeat loop"], correctAnswer: 1 },
      { question: "Which loop runs until condition is false?", options: ["for loop", "repeat loop", "while loop", "foreach loop"], correctAnswer: 2 },
      { question: "What is the output of range(3)?", options: ["1,2,3", "0,1,2,3", "0,1,2", "3"], correctAnswer: 2 },
      { question: "What does break do?", options: ["Skips current iteration", "Stops loop", "Restarts loop", "Continues to next"], correctAnswer: 1 },
      { question: "What does continue do?", options: ["Stops loop", "Skips current iteration", "Restarts loop", "Ends program"], correctAnswer: 1 }
    ],
    "Functions in Python": [
      { question: "What keyword is used to define a function?", options: ["func", "function", "def", "declare"], correctAnswer: 2 },
      { question: "What is a parameter?", options: ["Output of function", "Input to function", "Return value", "Variable name"], correctAnswer: 1 },
      { question: "What does return do?", options: ["Sends value back", "Exits program", "Prints value", "Stores value"], correctAnswer: 0 },
      { question: "Functions help in?", options: ["Creating loops", "Code reuse", "Storing data", "Displaying output"], correctAnswer: 1 },
      { question: "Can a function return multiple values?", options: ["No", "Yes", "Only in classes", "Not recommended"], correctAnswer: 1 }
    ],
    "Modules & File Handling": [
      { question: "What keyword is used to import a module?", options: ["include", "using", "import", "require"], correctAnswer: 2 },
      { question: "Which module gives random numbers?", options: ["math", "random", "statistics", "datetime"], correctAnswer: 1 },
      { question: "What is open() used for?", options: ["Opening applications", "File handling", "Opening websites", "Opening databases"], correctAnswer: 1 },
      { question: "What does 'r' mode mean?", options: ["Read", "Write", "Run", "Remove"], correctAnswer: 0 },
      { question: "What does 'w' mode mean?", options: ["Wait", "Read", "Write", "Watch"], correctAnswer: 2 }
    ],
    "Error Handling & Debugging": [
      { question: "Which block handles errors?", options: ["try", "except", "finally", "else"], correctAnswer: 1 },
      { question: "Which block contains risky code?", options: ["except", "try", "finally", "else"], correctAnswer: 1 },
      { question: "What error occurs when dividing by zero?", options: ["ValueError", "ZeroDivisionError", "TypeError", "NameError"], correctAnswer: 1 },
      { question: "What is debugging?", options: ["Writing code", "Finding and fixing errors", "Testing code", "Documenting code"], correctAnswer: 1 },
      { question: "When does finally block run?", options: ["Only on error", "Only on success", "Always", "Never"], correctAnswer: 2 }
    ],
    "Intro to OOP (Classes & Objects) ⭐": [
      { question: "What is a class?", options: ["An object", "A blueprint", "A function", "A module"], correctAnswer: 1 },
      { question: "What is an object?", options: ["A blueprint", "Instance of class", "A function", "A variable"], correctAnswer: 1 },
      { question: "What is __init__?", options: ["Initializer", "Constructor", "A method", "Both B and C"], correctAnswer: 3 },
      { question: "What does self refer to?", options: ["The class", "Current object", "Other objects", "The module"], correctAnswer: 1 },
      { question: "OOP helps in?", options: ["Organizing code", "Code reuse", "Making code modular", "All of above"], correctAnswer: 3 }
    ],
    "Final Project & Revision": [
      { question: "Which concept is used for repetition?", options: ["Functions", "Loops", "Classes", "Modules"], correctAnswer: 1 },
      { question: "Which concept is used to reuse code?", options: ["Loops", "Classes", "Functions", "Variables"], correctAnswer: 2 },
      { question: "Which concept stores data permanently?", options: ["Variables", "Functions", "File handling", "Classes"], correctAnswer: 2 },
      { question: "Which concept organizes code into objects?", options: ["Functions", "Modules", "OOP", "Loops"], correctAnswer: 2 },
      { question: "What is testing?", options: ["Writing code", "Checking program correctness", "Debugging code", "Documenting code"], correctAnswer: 1 }
    ],

    // Web Dev
    "HTML Structure": [
      { question: "Which HTML tag defines an unordered list?", options: ["<ol>", "<ul>", "<li>", "<dl>"], correctAnswer: 1 },
      { question: "Where should the <title> tag be placed?", options: ["<body>", "<head>", "<footer>", "<header>"], correctAnswer: 1 },
      { question: "Which tag is used for the main heading?", options: ["<heading>", "<h2>", "<h1>", "<title>"], correctAnswer: 2 }
    ],
    "CSS Layouts": [
      { question: "Which is NOT part of the CSS box model?", options: ["Margin", "Padding", "Font", "Border"], correctAnswer: 2 },
      { question: "Which property controls the text color?", options: ["font-color", "color", "text-color", "bg-color"], correctAnswer: 1 },
      { question: "What is the default display value of a <div>?", options: ["inline", "block", "inline-block", "flex"], correctAnswer: 1 }
    ],
    "JavaScript Fundamentals": [
      { question: "What does 'typeof []' return in JS?", options: ["object", "array", "list", "undefined"], correctAnswer: 0 },
      { question: "Which operator is used for strict equality?", options: ["==", "=", "===", "!=="], correctAnswer: 2 },
      { question: "How do you declare a constant in JS?", options: ["var", "let", "const", "constant"], correctAnswer: 2 }
    ],
    "DOM Manipulation": [
      { question: "How do you select an element by ID?", options: ["querySelector('.id')", "getElementById('id')", "getElementsByClassName('id')", "select('id')"], correctAnswer: 1 },
      { question: "Which method adds a class to an element?", options: ["element.class.add()", "element.classList.add()", "element.addClass()", "element.className += ' '"], correctAnswer: 1 },
      { question: "How do you attach an event listener?", options: ["element.onEvent = ", "element.listen()", "element.addEventListener()", "element.attachEvent()"], correctAnswer: 2 }
    ],
    "CSS Flexbox & Grid": [
      { question: "Which property aligns items vertically in a flex row?", options: ["justify-content", "align-items", "flex-direction", "align-content"], correctAnswer: 1 },
      { question: "Which value enables CSS Grid?", options: ["display: flex", "display: grid", "grid-template: true", "layout: grid"], correctAnswer: 1 },
      { question: "What property defines grid columns?", options: ["grid-col", "grid-template-columns", "columns", "grid-layout"], correctAnswer: 1 }
    ],
    "Responsive Design": [
      { question: "What rule specifies responsive breakpoints?", options: ["@media", "@import", "@font-face", "@responsive"], correctAnswer: 0 },
      { question: "What meta tag is essential for mobile responsiveness?", options: ["<meta name='viewport'>", "<meta name='mobile'>", "<meta responsive>", "<meta view='true'>"], correctAnswer: 0 },
      { question: "Which unit is relative to the viewport width?", options: ["px", "em", "vw", "vh"], correctAnswer: 2 }
    ],
    "Intro to ES6": [
      { question: "Which keyword defines block-scoped variables?", options: ["var", "let", "declare", "global"], correctAnswer: 1 },
      { question: "What is the syntax for an arrow function?", options: ["function() {}", "() => {}", "=> ()", "fun() => {}"], correctAnswer: 1 },
      { question: "Which feature allows extracting object properties easily?", options: ["Destructuring", "Spreading", "Rest", "Classes"], correctAnswer: 0 }
    ],
    "Capstone Website": [
      { question: "What phase comes before coding?", options: ["Testing", "Deployment", "Design/Wireframing", "Maintenance"], correctAnswer: 2 },
      { question: "Which tool is best for version control?", options: ["Git", "Dropbox", "Google Drive", "FTP"], correctAnswer: 0 },
      { question: "Ready to deploy to production?", options: ["Yes!", "Wait, let me debug"], correctAnswer: 0 }
    ],

    // DSA
    "Arrays & Lists": [
      { question: "Accessing an array element by index takes?", options: ["O(n)", "O(1)", "O(log n)", "O(n^2)"], correctAnswer: 1 },
      { question: "Inserting an element at the beginning of an array takes?", options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], correctAnswer: 1 },
      { question: "What is a contiguous block of memory?", options: ["Linked List", "Tree", "Array", "Graph"], correctAnswer: 2 }
    ],
    "Stacks & Queues": [
      { question: "Queue insertion operations are usually called?", options: ["Push", "Enqueue", "Insert", "Add"], correctAnswer: 1 },
      { question: "A Stack follows which principle?", options: ["FIFO", "LIFO", "FILO", "Random Access"], correctAnswer: 1 },
      { question: "Which data structure is recursive by nature?", options: ["Stack", "Queue", "Tree", "Graph"], correctAnswer: 2 }
    ],
    "Recursion": [
      { question: "What is required to stop recursion?", options: ["Loops", "Classes", "Base Case", "Static variables"], correctAnswer: 2 },
      { question: "What error occurs if recursion never stops?", options: ["Stack Overflow", "Heap Exhaustion", "Memory Leak", "Infinite Loop"], correctAnswer: 0 },
      { question: "Which mathematical sequence is often used to teach recursion?", options: ["Fibonacci", "Prime numbers", "Euler's totient", "Collatz conjecture"], correctAnswer: 0 }
    ],
    "Trees": [
      { question: "In a Binary Search Tree, the left child is always?", options: ["Greater than parent", "Less than parent", "Equal to parent", "Random"], correctAnswer: 1 },
      { question: "What is the top node of a tree called?", options: ["Leaf", "Branch", "Root", "Stem"], correctAnswer: 2 },
      { question: "Which traversal visits Left, Root, Right?", options: ["Pre-order", "Post-order", "In-order", "Level-order"], correctAnswer: 2 }
    ],
    "Graphs": [
      { question: "Which graph traversal uses a Queue?", options: ["DFS", "BFS", "Inorder", "Postorder"], correctAnswer: 1 },
      { question: "A graph with directed edges is called?", options: ["Undirected graph", "Weighted graph", "Directed acyclic graph", "Directed graph"], correctAnswer: 3 },
      { question: "Which algorithm finds the shortest path?", options: ["Dijkstra's", "Bubble Sort", "Merge Sort", "Kruskal's"], correctAnswer: 0 }
    ],
    "Sorting Algorithms": [
      { question: "What is Merge Sort's average time complexity?", options: ["O(n)", "O(n^2)", "O(n log n)", "O(1)"], correctAnswer: 2 },
      { question: "Which sorting algorithm is often the fastest in practice?", options: ["Bubble Sort", "Insertion Sort", "Selection Sort", "Quick Sort"], correctAnswer: 3 },
      { question: "Which sorting algorithm is stable by default?", options: ["Merge Sort", "Quick Sort", "Heap Sort", "Selection Sort"], correctAnswer: 0 }
    ],
    "Searching Algorithms": [
      { question: "Binary search requires what?", options: ["Unsorted data", "Sorted data", "Numbers only", "Strings only"], correctAnswer: 1 },
      { question: "What is the time complexity of linear search?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], correctAnswer: 2 },
      { question: "Which search algorithm checks every element?", options: ["Binary Search", "Linear Search", "Jump Search", "Interpolation Search"], correctAnswer: 1 }
    ],
    "Dynamic Programming": [
      { question: "Memoization implies what approach?", options: ["Top-down", "Bottom-up", "Iterative", "Divide and conquer"], correctAnswer: 0 },
      { question: "Dynamic programming relies on?", options: ["Overlapping subproblems", "Randomization", "Sorting", "Graphs"], correctAnswer: 0 },
      { question: "Which problem is a classic DP example?", options: ["Linear Search", "Bubble sort", "Knapsack Problem", "Binary Search"], correctAnswer: 2 }
    ],
    "Interview Problems": [
      { question: "When reversing a linked list, how many pointers do you typically need?", options: ["1", "2", "3", "4"], correctAnswer: 2 },
      { question: "Two pointer technique is best used on?", options: ["Trees", "Graphs", "Sorted Arrays", "Hash Maps"], correctAnswer: 2 },
      { question: "Which data structure is typically used for caching (LRU)?", options: ["Array", "Linked List + Hash Map", "Binary Tree", "Stack"], correctAnswer: 1 }
    ],

    // AI
    "Intro to AI Tools": [
      { question: "What model architecture is behind ChatGPT?", options: ["CNN", "RNN", "Transformer", "GAN"], correctAnswer: 2 },
      { question: "What does NLP stand for?", options: ["Natural Language Processing", "Neural Logic Programming", "Network Layer Protocol", "Node Logic Process"], correctAnswer: 0 },
      { question: "What is a token?", options: ["A payment coin", "A chunk of text", "A login code", "An image parameter"], correctAnswer: 1 }
    ],
    "Chatbots and Automation": [
      { question: "What tool is famous for automating workflows?", options: ["Zapier", "Photoshop", "Excel", "Word"], correctAnswer: 0 },
      { question: "Which is a common chatbot integration platform?", options: ["Slack", "Figma", "Canva", "VS Code"], correctAnswer: 0 },
      { question: "Chatbots typically use which AI technique?", options: ["Computer Vision", "NLP", "Robotics", "Reinforcement Learning"], correctAnswer: 1 }
    ],
    "AI Prompt Engineering": [
      { question: "To get specific formats, you should?", options: ["Be vague", "Include examples", "Use less words", "Never ask formatting"], correctAnswer: 1 },
      { question: "What does 'Few-Shot' prompting mean?", options: ["Providing many examples", "Providing 2-3 examples", "Providing no examples", "Guessing outputs"], correctAnswer: 1 },
      { question: "Which AI parameter controls randomness?", options: ["Seed", "Temperature", "Top-K", "Tokens"], correctAnswer: 1 }
    ],
    "AI for Design": [
      { question: "Which AI primarily generates images?", options: ["Midjourney", "ChatGPT", "Claude", "GitHub Copilot"], correctAnswer: 0 },
      { question: "What is a common technique used for AI image generation?", options: ["Diffusion", "Regression", "Clustering", "Recursion"], correctAnswer: 0 },
      { question: "Which text-to-image tool is built into Windows?", options: ["DALL-E / Bing Image Creator", "Midjourney", "Stable Diffusion", "Runway"], correctAnswer: 0 }
    ],
    "Productivity Bots": [
      { question: "Which is a popular AI code assistant?", options: ["Excel", "GitHub Copilot", "Trello", "Slack"], correctAnswer: 1 },
      { question: "Which AI tool helps transcribe meetings?", options: ["Otter.ai", "Midjourney", "ChatGPT", "Zapier"], correctAnswer: 0 },
      { question: "Can AI reliably replace all human verification?", options: ["Yes", "No, it hallucinates", "Only in code", "Only in text"], correctAnswer: 1 }
    ],
    "AI Ethics": [
      { question: "AI models trained on public data can exhibit?", options: ["Empathy", "Consciousness", "Bias", "Free will"], correctAnswer: 2 },
      { question: "What is AI hallucination?", options: ["Seeing ghosts", "Generating false information confidently", "A visual glitch", "Hardware failure"], correctAnswer: 1 },
      { question: "Who holds responsibility for AI output usage?", options: ["The AI", "The developers alone", "The human user", "Nobody"], correctAnswer: 2 }
    ],

    // PPT
    "Presentation Basics": [
      { question: "What feature creates a unified presentation layout layer?", options: ["Slide Master", "Random colors", "Many fonts", "Animations"], correctAnswer: 0 },
      { question: "Which view helps you sort entire slides quickly?", options: ["Normal", "Reading View", "Slide Sorter", "Notes Page"], correctAnswer: 2 },
      { question: "What key starts a presentation from the beginning?", options: ["Esc", "Enter", "F5", "Space"], correctAnswer: 2 }
    ],
    "Advanced Animations": [
      { question: "Which animation makes an object disappear?", options: ["Entrance", "Emphasis", "Exit", "Path"], correctAnswer: 2 },
      { question: "What pane allows you to reorder animations?", options: ["Format Pane", "Animation Pane", "Slide Pane", "Selection Pane"], correctAnswer: 1 },
      { question: "How can you trigger an animation?", options: ["On Click", "With Previous", "After Previous", "All of the above"], correctAnswer: 3 }
    ],
    "Templates & Branding": [
      { question: "Where do you save custom themes offline?", options: ["Desktop", "Custom Office Templates", "Documents", "Downloads"], correctAnswer: 1 },
      { question: "A PowerPoint template has which extension?", options: [".pptx", ".potx", ".pdf", ".docx"], correctAnswer: 1 },
      { question: "Which feature lets you define brand colors?", options: ["Theme Colors", "Shape Fill", "Font Color", "Format Background"], correctAnswer: 0 }
    ],
    "Data Visualizations": [
      { question: "What is the best chart for trends over time?", options: ["Pie", "Line", "Scatter", "Bar"], correctAnswer: 1 },
      { question: "How do you insert a flow diagram easily?", options: ["Draw it manually", "SmartArt", "ClipArt", "WordArt"], correctAnswer: 1 },
      { question: "Which chart is best for parts of a whole?", options: ["Line", "Bar", "Pie", "Radar"], correctAnswer: 2 }
    ],
    "Final Presentation": [
      { question: "Are you ready to deliver a clean presentation?", options: ["Yes", "No"], correctAnswer: 0 },
      { question: "What should you avoid during delivery?", options: ["Eye contact", "Speaking clearly", "Reading directly off slides", "Using gestures"], correctAnswer: 2 },
      { question: "What tool helps rehearse timing?", options: ["Record Slide Show", "Rehearse Timings", "Presenter View", "All of the above"], correctAnswer: 3 }
    ],

    // Excel
    "Workbook Fundamentals": [
      { question: "How many columns are there in a modern Excel worksheet?", options: ["256", "1024", "16,384", "Infinite"], correctAnswer: 2 },
      { question: "What is a single spreadsheet file called?", options: ["Document", "Workbook", "Presentation", "Database"], correctAnswer: 1 },
      { question: "What is the intersection of a row and column?", options: ["Box", "Square", "Cell", "Grid"], correctAnswer: 2 }
    ],
    "Formulas & Functions": [
      { question: "All Excel formulas must begin with?", options: ["+", "-", "=", "*"], correctAnswer: 2 },
      { question: "Which function adds up a range?", options: ["ADD", "TOTAL", "SUM", "PLUS"], correctAnswer: 2 },
      { question: "What symbol denotes an absolute reference?", options: ["&", "%", "$", "#"], correctAnswer: 2 }
    ],
    "Charts": [
      { question: "A pie chart is best utilized for?", options: ["Time series", "Proportions/Percentages", "Scatter data", "Hierarchies"], correctAnswer: 1 },
      { question: "Which tool allows quick mini-charts in a cell?", options: ["Sparklines", "MiniCharts", "SmartArt", "Shapes"], correctAnswer: 0 },
      { question: "How do you add a secondary axis?", options: ["Insert Axis", "Format Data Series", "Add Chart Element", "Change Chart Type"], correctAnswer: 1 }
    ],
    "PivotTables": [
      { question: "PivotTables are primarily used to?", options: ["Delete data", "Summarize data", "Color cells", "Print sheets"], correctAnswer: 1 },
      { question: "Which area is NOT part of a PivotTable field list?", options: ["Filters", "Columns", "Values", "Formats"], correctAnswer: 3 },
      { question: "How do you update a PivotTable when underlying data changes?", options: ["Refresh", "Update", "Rebuild", "Sync"], correctAnswer: 0 }
    ],
    "Data Validation": [
      { question: "Data Validation dropdowns are primarily used to?", options: ["Create formulas", "Format cells", "Restrict input", "Analyze subsets"], correctAnswer: 2 },
      { question: "Which tab contains the Data Validation tool?", options: ["Home", "Insert", "Data", "Review"], correctAnswer: 2 },
      { question: "Can Data Validation display an error message?", options: ["Yes", "No", "Only if macro is used", "Only in numbers"], correctAnswer: 0 }
    ],
    "Excel Automation": [
      { question: "Excel Macros are natively written in?", options: ["Python", "JavaScript", "VBA", "C++"], correctAnswer: 2 },
      { question: "How do you record a macro?", options: ["Developer Tab -> Record Macro", "Insert -> Macro", "Data -> Automate", "Review -> Record"], correctAnswer: 0 },
      { question: "What must you save an Excel file as to keep macros?", options: [".xlsx", ".xlsm", ".csv", ".xlsb"], correctAnswer: 1 }
    ]
  };

  return dictionary[topic] || [
    { question: `Did you understand the introduction to ${topic}?`, options: ["Yes", "No"], correctAnswer: 0 },
    { question: `Can you apply the concepts from ${topic}?`, options: ["Yes", "Not yet"], correctAnswer: 0 },
    { question: `Are you ready to proceed beyond ${topic}?`, options: ["Yes", "Need more time"], correctAnswer: 0 }
  ];
};
