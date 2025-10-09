"use client"

import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Spotlight } from "../ui/BackgroundEffects"
import { useTheme } from "../../context/ThemeContext"

const Compiler = () => {
  const { theme: appTheme, toggleTheme } = useTheme()
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState("")
  const [theme, setTheme] = useState("vs-dark")
  const [output, setOutput] = useState("")
  const [customInput, setCustomInput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [editorReady, setEditorReady] = useState(false)
  const [showOutput, setShowOutput] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const editorRef = useRef(null)
  const monacoRef = useRef(null)

  const languageOptions = [
    { id: "javascript", name: "JavaScript", version: "18.15.0" },
    { id: "python", name: "Python", version: "3.10.0" },
    { id: "java", name: "Java", version: "15.0.2" },
    { id: "cpp", name: "C++", version: "10.2.0" },
    { id: "c", name: "C", version: "10.2.0" },
    { id: "csharp", name: "C#", version: "6.12.0" },
    { id: "typescript", name: "TypeScript", version: "5.0.3" },
    { id: "go", name: "Go", version: "1.16.2" },
    { id: "rust", name: "Rust", version: "1.68.2" },
    { id: "php", name: "PHP", version: "8.2.3" },
    { id: "ruby", name: "Ruby", version: "3.0.1" },
    { id: "kotlin", name: "Kotlin", version: "1.8.20" },
    { id: "swift", name: "Swift", version: "5.3.3" },
    { id: "r", name: "R", version: "4.1.1" },
    { id: "sql", name: "SQL", version: "3.36.0" },
  ]

  // Language Templates
  const languageTemplates = {
    javascript: `// JavaScript Template
// Write your code here

// Example: Hello World
console.log("Hello, World!");

// Example: Function
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("User"));

// Example: Array operations
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// Example: Object
const person = {
  name: "John",
  age: 30,
  greet: function() {
    console.log("Hello, I'm " + this.name);
  }
};
person.greet();`,

    python: `# Python Template
# Write your code here

# Example: Hello World
print("Hello, World!")

# Example: Function
def greet(name):
    return f"Hello, {name}!"

print(greet("User"))

# Example: List operations
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print("Doubled:", doubled)

# Example: Dictionary
person = {
    "name": "John",
    "age": 30
}
print(f"{person['name']} is {person['age']} years old")

# Example: Input (use custom input section)
# name = input("Enter your name: ")
# print(f"Welcome, {name}!")`,

    java: `// Java Template
public class Main {
    public static void main(String[] args) {
        // Example: Hello World
        System.out.println("Hello, World!");
        
        // Example: Function call
        String greeting = greet("User");
        System.out.println(greeting);
        
        // Example: Array operations
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.print("Numbers: ");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
        
        // Example: Sum calculation
        int sum = calculateSum(numbers);
        System.out.println("Sum: " + sum);
    }
    
    // Example: Method
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
    
    public static int calculateSum(int[] arr) {
        int sum = 0;
        for (int num : arr) {
            sum += num;
        }
        return sum;
    }
}`,

    cpp: `// C++ Template
#include <iostream>
#include <vector>
#include <string>
using namespace std;

// Example: Function
string greet(string name) {
    return "Hello, " + name + "!";
}

int calculateSum(vector<int> numbers) {
    int sum = 0;
    for (int num : numbers) {
        sum += num;
    }
    return sum;
}

int main() {
    // Example: Hello World
    cout << "Hello, World!" << endl;
    
    // Example: Function call
    cout << greet("User") << endl;
    
    // Example: Vector operations
    vector<int> numbers = {1, 2, 3, 4, 5};
    cout << "Numbers: ";
    for (int num : numbers) {
        cout << num << " ";
    }
    cout << endl;
    
    // Example: Sum calculation
    int sum = calculateSum(numbers);
    cout << "Sum: " << sum << endl;
    
    return 0;
}`,

    c: `// C Template
#include <stdio.h>
#include <string.h>

// Example: Function
void greet(char *name) {
    printf("Hello, %s\\n", name);
}

int calculateSum(int arr[], int size) {
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += arr[i];
    }
    return sum;
}

int main() {
    // Example: Hello World
    printf("Hello, World!\\n");
    
    // Example: Function call
    greet("User");
    
    // Example: Array operations
    int numbers[] = {1, 2, 3, 4, 5};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    
    printf("Numbers: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");
    
    // Example: Sum calculation
    int sum = calculateSum(numbers, size);
    printf("Sum: %d\\n", sum);
    
    return 0;
}`,

    csharp: `// C# Template
using System;
using System.Linq;

class Program {
    static void Main() {
        // Example: Hello World
        Console.WriteLine("Hello, World!");
        
        // Example: Function call
        string greeting = Greet("User");
        Console.WriteLine(greeting);
        
        // Example: Array operations
        int[] numbers = {1, 2, 3, 4, 5};
        Console.Write("Numbers: ");
        foreach (int num in numbers) {
            Console.Write(num + " ");
        }
        Console.WriteLine();
        
        // Example: LINQ
        var doubled = numbers.Select(n => n * 2);
        Console.WriteLine("Doubled: " + string.Join(", ", doubled));
        
        // Example: Sum calculation
        int sum = numbers.Sum();
        Console.WriteLine("Sum: " + sum);
    }
    
    static string Greet(string name) {
        return "Hello, " + name + "!";
    }
}`,

    typescript: `// TypeScript Template
// Write your code here

// Example: Hello World
console.log("Hello, World!");

// Example: Function with types
function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

console.log(greet("User"));

// Example: Interface
interface Person {
    name: string;
    age: number;
}

const person: Person = {
    name: "John",
    age: 30
};

console.log(\`\${person.name} is \${person.age} years old\`);

// Example: Array with types
const numbers: number[] = [1, 2, 3, 4, 5];
const doubled: number[] = numbers.map(n => n * 2);
console.log("Doubled:", doubled);`,

    go: `// Go Template
package main

import (
    "fmt"
)

// Example: Function
func greet(name string) string {
    return "Hello, " + name + "!"
}

func calculateSum(numbers []int) int {
    sum := 0
    for _, num := range numbers {
        sum += num
    }
    return sum
}

func main() {
    // Example: Hello World
    fmt.Println("Hello, World!")
    
    // Example: Function call
    fmt.Println(greet("User"))
    
    // Example: Slice operations
    numbers := []int{1, 2, 3, 4, 5}
    fmt.Print("Numbers: ")
    for _, num := range numbers {
        fmt.Print(num, " ")
    }
    fmt.Println()
    
    // Example: Sum calculation
    sum := calculateSum(numbers)
    fmt.Println("Sum:", sum)
}`,

    rust: `// Rust Template
fn main() {
    // Example: Hello World
    println!("Hello, World!");
    
    // Example: Function call
    let greeting = greet("User");
    println!("{}", greeting);
    
    // Example: Vector operations
    let numbers = vec![1, 2, 3, 4, 5];
    print!("Numbers: ");
    for num in &numbers {
        print!("{} ", num);
    }
    println!();
    
    // Example: Map and collect
    let doubled: Vec<i32> = numbers.iter().map(|x| x * 2).collect();
    println!("Doubled: {:?}", doubled);
    
    // Example: Sum calculation
    let sum: i32 = numbers.iter().sum();
    println!("Sum: {}", sum);
}

// Example: Function
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}`,

    php: `<?php
// PHP Template
// Write your code here

// Example: Hello World
echo "Hello, World!\\n";

// Example: Function
function greet($name) {
    return "Hello, " . $name . "!";
}

echo greet("User") . "\\n";

// Example: Array operations
$numbers = [1, 2, 3, 4, 5];
echo "Numbers: ";
foreach ($numbers as $num) {
    echo $num . " ";
}
echo "\\n";

// Example: Array map
$doubled = array_map(function($n) {
    return $n * 2;
}, $numbers);
echo "Doubled: " . implode(", ", $doubled) . "\\n";

// Example: Sum calculation
$sum = array_sum($numbers);
echo "Sum: " . $sum . "\\n";

// Example: Associative array
$person = [
    "name" => "John",
    "age" => 30
];
echo $person["name"] . " is " . $person["age"] . " years old\\n";
?>`,

    ruby: `# Ruby Template
# Write your code here

# Example: Hello World
puts "Hello, World!"

# Example: Function (Method)
def greet(name)
  "Hello, #{name}!"
end

puts greet("User")

# Example: Array operations
numbers = [1, 2, 3, 4, 5]
print "Numbers: "
numbers.each { |num| print "#{num} " }
puts

# Example: Map
doubled = numbers.map { |n| n * 2 }
puts "Doubled: #{doubled.join(', ')}"

# Example: Sum calculation
sum = numbers.sum
puts "Sum: #{sum}"

# Example: Hash
person = {
  name: "John",
  age: 30
}
puts "#{person[:name]} is #{person[:age]} years old"`,

    kotlin: `// Kotlin Template
fun main() {
    // Example: Hello World
    println("Hello, World!")
    
    // Example: Function call
    val greeting = greet("User")
    println(greeting)
    
    // Example: List operations
    val numbers = listOf(1, 2, 3, 4, 5)
    print("Numbers: ")
    numbers.forEach { print("\$it ") }
    println()
    
    // Example: Map
    val doubled = numbers.map { it * 2 }
    println("Doubled: \${doubled.joinToString(", ")}")
    
    // Example: Sum calculation
    val sum = numbers.sum()
    println("Sum: \$sum")
    
    // Example: Data class
    val person = Person("John", 30)
    println("\${person.name} is \${person.age} years old")
}

// Example: Function
fun greet(name: String): String {
    return "Hello, \$name!"
}

// Example: Data class
data class Person(val name: String, val age: Int)`,

    swift: `// Swift Template
import Foundation

// Example: Function
func greet(_ name: String) -> String {
    return "Hello, \\(name)!"
}

func calculateSum(_ numbers: [Int]) -> Int {
    return numbers.reduce(0, +)
}

// Example: Hello World
print("Hello, World!")

// Example: Function call
print(greet("User"))

// Example: Array operations
let numbers = [1, 2, 3, 4, 5]
print("Numbers: ", terminator: "")
for num in numbers {
    print("\\(num) ", terminator: "")
}
print()

// Example: Map
let doubled = numbers.map { \$0 * 2 }
print("Doubled: \\(doubled)")

// Example: Sum calculation
let sum = calculateSum(numbers)
print("Sum: \\(sum)")

// Example: Struct
struct Person {
    let name: String
    let age: Int
}

let person = Person(name: "John", age: 30)
print("\\(person.name) is \\(person.age) years old")`,

    r: `# R Template
# Write your code here

# Example: Hello World
print("Hello, World!")

# Example: Function
greet <- function(name) {
  paste("Hello,", name, "!")
}

print(greet("User"))

# Example: Vector operations
numbers <- c(1, 2, 3, 4, 5)
cat("Numbers:", numbers, "\\n")

# Example: Apply function
doubled <- numbers * 2
cat("Doubled:", doubled, "\\n")

# Example: Sum calculation
total <- sum(numbers)
cat("Sum:", total, "\\n")

# Example: Data frame
person <- data.frame(
  name = c("John", "Jane"),
  age = c(30, 25)
)
print(person)`,

    sql: `-- SQL Template
-- Write your SQL queries here

-- Example: Create a table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    age INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example: Insert data
INSERT INTO users (id, name, email, age) VALUES
(1, 'John Doe', 'john@example.com', 30),
(2, 'Jane Smith', 'jane@example.com', 25),
(3, 'Bob Johnson', 'bob@example.com', 35);

-- Example: Select all users
SELECT * FROM users;

-- Example: Select with condition
SELECT name, email FROM users WHERE age > 25;

-- Example: Update data
UPDATE users SET age = 31 WHERE name = 'John Doe';

-- Example: Count records
SELECT COUNT(*) as total_users FROM users;

-- Example: Order by
SELECT name, age FROM users ORDER BY age DESC;

-- Note: This is a template. Actual execution depends on the SQL engine.`,
  }

  // Language mappings for Piston API (code execution)
  const languageMappings = {
    javascript: "javascript",
    python: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    csharp: "csharp",
    typescript: "typescript",
    go: "go",
    rust: "rust",
    php: "php",
    ruby: "ruby",
    kotlin: "kotlin",
    swift: "swift",
    r: "r",
    sql: "sqlite3",
  }

  // Language mappings for Monaco Editor (syntax highlighting)
  const monacoLanguageMappings = {
    javascript: "javascript",
    python: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    csharp: "csharp",
    typescript: "typescript",
    go: "go",
    rust: "rust",
    php: "php",
    ruby: "ruby",
    kotlin: "kotlin",
    swift: "swift",
    r: "r",
    sql: "sql",
  }

  const getFileExtension = (lang) => {
    const extensions = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      csharp: "cs",
      typescript: "ts",
      go: "go",
      rust: "rs",
      php: "php",
      ruby: "rb",
      kotlin: "kt",
      swift: "swift",
      r: "r",
      sql: "sql",
    }
    return extensions[lang] || "txt"
  }

  const copyCode = () => {
    if (!monacoRef.current) return

    const model = monacoRef.current.getModel()
    const selection = monacoRef.current.getSelection()
    const hasSelection = selection && !selection.isEmpty()

    const text = hasSelection ? model.getValueInRange(selection) : monacoRef.current.getValue()
    navigator.clipboard.writeText(text)
    setOutput("Code copied to clipboard!")
    setShowOutput(true)
  }

  const selectAll = () => {
    if (!monacoRef.current || !window.monaco) return
    const model = monacoRef.current.getModel()
    if (!model) return
    const full = model.getFullModelRange()
    monacoRef.current.setSelection(full)
    monacoRef.current.focus()
  }

  const pasteCode = async () => {
    if (!monacoRef.current || !navigator.clipboard?.readText) return
    const text = await navigator.clipboard.readText()
    const selection = monacoRef.current.getSelection()
    monacoRef.current.executeEdits("paste", [{ range: selection, text, forceMoveMarkers: true }])
    monacoRef.current.focus()
  }

  const cutCode = async () => {
    if (!monacoRef.current) return
    const selection = monacoRef.current.getSelection()
    const model = monacoRef.current.getModel()
    if (!selection || !model) return
    const selectedText = model.getValueInRange(selection)
    await navigator.clipboard.writeText(selectedText)
    monacoRef.current.executeEdits("cut", [{ range: selection, text: "" }])
    monacoRef.current.focus()
  }

  const undo = () => {
    monacoRef.current?.trigger("keyboard", "undo", null)
  }

  const redo = () => {
    monacoRef.current?.trigger("keyboard", "redo", null)
  }

  const runCode = async () => {
    if (!monacoRef.current) return

    setIsRunning(true)
    setOutput("Running code...")
    setShowOutput(true)

    const currentCode = monacoRef.current.getValue()

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: languageMappings[language] || language,
          version: languageOptions.find((lang) => lang.id === language)?.version || "*",
          files: [
            {
              name: `main.${getFileExtension(language)}`,
              content: currentCode,
            },
          ],
          stdin: customInput,
          args: [],
          compile_timeout: 10000,
          run_timeout: 3000,
          compile_memory_limit: -1,
          run_memory_limit: -1,
        }),
      })

      const data = await response.json()

      if (data.run) {
        const output = data.run.stdout || data.run.stderr || "No output generated"
        setOutput(output)
      } else if (data.compile) {
        setOutput(data.compile.stderr || data.compile.output || "Compilation error")
      } else {
        setOutput(data.message || "Failed to run code")
      }
    } catch (error) {
      setOutput(`Error: ${error.message || "Failed to execute code"}`)
    } finally {
      setIsRunning(false)
    }
  }

  // Function to generate a shareable link
  const shareLink = async () => {
    if (!monacoRef.current) return

    const codeContent = monacoRef.current.getValue()
    const lang = language

    try {
      // Create a gist or similar to store the code
      // For simplicity, we'll simulate a shareable link with encoded content
      // In a real app, you'd use a backend service to store and retrieve code
      const encodedContent = btoa(JSON.stringify({ code: codeContent, language: lang }))
      const shareableLink = `${window.location.origin}/compiler?code=${encodeURIComponent(encodedContent)}`

      navigator.clipboard.writeText(shareableLink)
      setOutput("Shareable link copied to clipboard!")
      setShowOutput(true)
    } catch (error) {
      setOutput(`Error generating share link: ${error.message}`)
      setShowOutput(true)
    }
  }

  React.useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js"
    script.async = true
    script.onload = () => {
      window.require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs" } })
      window.require(["vs/editor/editor.main"], () => {
        if (editorRef.current) {
          const initialTemplate = languageTemplates[language] || "// Write your code here"
          const monacoLang = monacoLanguageMappings[language] || language
          const editor = window.monaco.editor.create(editorRef.current, {
            value: initialTemplate,
            language: monacoLang,
            theme: theme,
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            readOnly: false,
            contextmenu: true,
            quickSuggestions: true,
            acceptSuggestionOnCommitCharacter: true,
            acceptSuggestionOnEnter: "on",
            accessibilitySupport: "auto",
            // Enable keyboard shortcuts
            find: {
              seedSearchStringFromSelection: true,
              autoFindInSelection: "never"
            },
            // Make sure editor can receive keyboard events
            domReadOnly: false,
            // Enable all standard keybindings
            wordBasedSuggestions: true,
          })

          // Listen to content changes
          editor.onDidChangeModelContent(() => {
            setCode(editor.getValue())
          })

          // Make sure editor is focused and ready for keyboard input
          editor.focus()

          monacoRef.current = editor
          setCode(initialTemplate)
          setEditorReady(true)
        }
      })
    }
    document.body.appendChild(script)

    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose()
      }
    }
  }, [])

  React.useEffect(() => {
    if (monacoRef.current) {
      const model = monacoRef.current.getModel()
      if (model) {
        const monacoLang = monacoLanguageMappings[language] || language
        window.monaco.editor.setModelLanguage(model, monacoLang)
      }
    }
  }, [language])

  React.useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.updateOptions({ theme: theme })
    }
  }, [theme])

  React.useEffect(() => {
    if (monacoRef.current && window.monaco) {
      window.monaco.editor.setTheme(theme)
    }
  }, [theme])

  // Sync editor theme with app theme
  React.useEffect(() => {
    const editorTheme = appTheme === "dark" ? "vs-dark" : "light"
    setTheme(editorTheme)
  }, [appTheme])

  // Load template when language changes
  React.useEffect(() => {
    if (!monacoRef.current) return

    const template = languageTemplates[language]
    if (!template) {
      console.error("Template not found for language:", language)
      return
    }

    console.log("Loading template for language:", language)
    console.log("Template preview:", template.substring(0, 50) + "...")

    setCode(template)
    monacoRef.current.setValue(template)
    console.log("Template successfully set in editor")
  }, [language, languageTemplates])

  // Robust language switch: new model per language + safe fallback
  React.useEffect(() => {
    if (!monacoRef.current || !window.monaco) return

    const desired = monacoLanguageMappings[language] || language
    const isRegistered =
      typeof window.monaco.languages.getEncodedLanguageId === "function" &&
      window.monaco.languages.getEncodedLanguageId(desired) !== 0

    const langId = isRegistered ? desired : "plaintext"

    // Prefer the selected language's template; fall back to current editor value
    const template = languageTemplates[language] || ""
    const content = template || monacoRef.current.getValue()

    const uri = window.monaco.Uri.parse(`inmemory://model/main.${getFileExtension(language)}`)
    const newModel = window.monaco.editor.createModel(content, langId, uri)

    monacoRef.current.setModel(newModel)
    setCode(content)
  }, [language])

  return (
    <div className="flex h-screen bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden relative z-10">
      {/* Spotlight Effect */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="orange" />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent dark:from-orange-950/20 dark:via-transparent dark:to-transparent pointer-events-none" />

      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static z-30 w-16 md:w-16 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex flex-col items-center py-4 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 h-full`}
      >
        <button
          className="p-2.5 md:p-3 hover:bg-orange-100 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg mb-3 md:mb-4 transition-all duration-200 hover:scale-105"
          title="Files"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="md:w-5 md:h-5"
          >
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
        </button>
        <button
          className="p-2.5 md:p-3 hover:bg-orange-100 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg mb-3 md:mb-4 transition-all duration-200 hover:scale-105"
          title="Git"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="md:w-5 md:h-5"
          >
            <line x1="6" y1="3" x2="6" y2="15"></line>
            <circle cx="18" cy="6" r="3"></circle>
            <circle cx="6" cy="18" r="3"></circle>
            <path d="M18 9a9 9 0 0 1-9 9"></path>
          </svg>
        </button>
        <button
          className="p-2.5 md:p-3 hover:bg-orange-100 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg mb-3 md:mb-4 transition-all duration-200 hover:scale-105"
          title="Whiteboard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="md:w-5 md:h-5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </button>
        <button
          className="p-2.5 md:p-3 hover:bg-orange-100 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg mb-3 md:mb-4 transition-all duration-200 hover:scale-105"
          title="Screenshare"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="md:w-5 md:h-5"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </button>
        <div className="flex-grow"></div>
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2.5 md:p-3 hover:bg-orange-100 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg mb-3 md:mb-4 transition-all duration-200 hover:scale-105"
          title="Settings"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="md:w-5 md:h-5"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0 2.83l.06-.06a1.65 1.65 0 0 0 .33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
        <button
          className="p-2.5 md:p-3 hover:bg-orange-100 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg transition-all duration-200 hover:scale-105"
          title="Exit"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="md:w-5 md:h-5"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </motion.div>

      {/* Mobile Sidebar Toggle */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-lg transition-all duration-200 hover:scale-110"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </motion.button>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Toolbar */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/50 dark:bg-black/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-2 sm:p-3 md:p-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
            {/* Left: Language and Theme Selectors */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              <select
                className="bg-white dark:bg-black text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 hover:border-orange-500 dark:hover:border-orange-400 transition-all duration-200 flex-1 sm:flex-none min-w-0"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languageOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              {/* Quick Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="flex items-center justify-center bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 p-1.5 sm:p-2 rounded-lg transition-all duration-200"
                title={appTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {appTheme === "dark" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="sm:w-[18px] sm:h-[18px]"
                  >
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="sm:w-[18px] sm:h-[18px]"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center justify-center bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mr-1 sm:mr-2 sm:w-4 sm:h-4"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                <span className="whitespace-nowrap">{isRunning ? "Running..." : "Run"}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyCode}
                className="flex items-center justify-center bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="sm:mr-2 sm:w-4 sm:h-4"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span className="hidden sm:inline">Copy</span>
              </motion.button>

             

    

              {/* Mobile Output Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowOutput(!showOutput)}
                className="flex lg:hidden items-center justify-center bg-orange-100 dark:bg-orange-900/20 hover:bg-orange-200 dark:hover:bg-orange-900/40 text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1 sm:mr-2 sm:w-4 sm:h-4"
                >
                  <polyline points="4 17 10 11 4 5"></polyline>
                  <line x1="12" y1="19" x2="20" y2="19"></line>
                </svg>
                <span className="whitespace-nowrap">{showOutput ? "Hide" : "Show"} Output</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Editor and Output */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Monaco Editor */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`flex-1 ${showOutput ? "hidden lg:block" : "block"}`}
            ref={editorRef}
          ></motion.div>

          {/* Output & Input Panel */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`w-full lg:w-1/3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 flex flex-col ${showOutput ? "flex" : "hidden lg:flex"}`}
          >
            {/* Output Section */}
            <div className="flex-1 p-3 sm:p-4 overflow-auto min-h-0">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Output</h2>
                <button
                  onClick={() => setShowOutput(false)}
                  className="lg:hidden text-gray-500 hover:text-orange-600 dark:text-gray-400 dark:hover:text-orange-400 transition-colors duration-200 p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <pre className="bg-black text-green-400 p-3 sm:p-4 rounded-lg h-full min-h-[150px] sm:min-h-[200px] overflow-auto whitespace-pre-wrap font-mono text-xs sm:text-sm border border-gray-700 shadow-inner">
                {output || 'Click "Run" to see output here'}
              </pre>
            </div>

            {/* Custom Input Section */}
            <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-800">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                Custom Input
              </h2>
              <textarea
                className="w-full bg-white dark:bg-black text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-400 p-3 sm:p-4 rounded-lg h-24 sm:h-32 resize-none font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter input for your program here..."
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {settingsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSettingsOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
              onClick={() => setSettingsOpen(false)}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-orange-600 dark:text-orange-400 sm:w-6 sm:h-6"
                      >
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0 2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0 1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0-2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
                  </div>
                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500 dark:text-gray-400 sm:w-5 sm:h-5"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                {/* Settings Content */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Theme Toggle */}
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                        {appTheme === "dark" ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-orange-600 dark:text-orange-400 sm:w-5 sm:h-5"
                          >
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-orange-600 dark:text-orange-400 sm:w-5 sm:h-5"
                          >
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Theme</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          {appTheme === "dark" ? "Dark Mode" : "Light Mode"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                        appTheme === "dark" ? "bg-orange-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform duration-300 ${
                          appTheme === "dark" ? "translate-x-6 sm:translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Additional Info */}
                  <div className="p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-200 dark:border-orange-800">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-semibold text-orange-600 dark:text-orange-400">💡 Tip:</span> Theme
                      preference is saved automatically and applies across the entire application.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  >
                    Close Settings
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Compiler
