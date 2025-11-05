# C++ Multiplication Calculator

A simple multiplication calculator with a C++ backend using cpp-httplib and an HTML/CSS/JS frontend.

## Project Structure
```
CppCalculator/
├── httplib.h          # cpp-httplib header (already included)
├── src/
│   └── main.cpp       # C++ backend server
├── web/
│   ├── index.html     # Calculator interface
│   ├── style.css      # Styling
│   └── script.js      # Frontend logic
└── README.md          # This file
```

## Prerequisites

- C++ compiler (g++, clang++, or MSVC)
- Modern web browser
- Windows: MinGW, Visual Studio, or similar C++ development environment

## Building and Running

### Option 1: Using g++ (MinGW on Windows)
```bash
# Navigate to the project directory
cd CppCalculator

# Compile the C++ server
g++ -std=c++11 -pthread -o calculator src/main.cpp -lws2_32

# Run the server
./calculator.exe
```

### Option 2: Using Visual Studio (Windows)
```bash
# Navigate to the project directory
cd CppCalculator

# Compile with MSVC
cl /EHsc /std:c++11 src/main.cpp /Fe:calculator.exe

# Run the server
calculator.exe
```

### Option 3: Using clang++ (if available)
```bash
# Navigate to the project directory
cd CppCalculator

# Compile the C++ server
clang++ -std=c++11 -pthread -o calculator src/main.cpp

# Run the server
./calculator
```

## Usage

1. **Start the Backend Server:**
   - Run the compiled executable
   - The server will start on `http://localhost:8080`
   - You should see: "Starting C++ Calculator Server on http://localhost:8080"

2. **Open the Calculator:**
   - Open your web browser
   - Navigate to `http://localhost:8080`
   - The calculator interface will load automatically

3. **Use the Calculator:**
   - Enter two numbers in the input fields
   - Click "Multiply" or press Enter
   - The result will be displayed below

## Features

- **C++ Backend:** Fast multiplication processing using cpp-httplib
- **Modern UI:** Clean, responsive design with gradient background
- **Real-time Validation:** Input validation and error handling
- **CORS Support:** Proper cross-origin resource sharing configuration
- **Static File Serving:** C++ server serves HTML/CSS/JS files directly
- **Error Handling:** Graceful error messages for invalid inputs or server issues

## API Endpoint

- **POST** `/api/multiply`
  - Content-Type: `application/x-www-form-urlencoded`
  - Body: `num1=<number>&num2=<number>`
  - Response: `{"result": <number>}` or `{"error": "<message>"}`

## Architecture

1. **Frontend (HTML/CSS/JS):** Provides user interface and sends HTTP requests
2. **Backend (C++):** Processes multiplication requests and serves static files
3. **Communication:** RESTful API using HTTP POST requests with form data

## Troubleshooting

- **Server won't start:** Check if port 8080 is available
- **CORS errors:** Ensure the server is running and accessible
- **Compilation errors:** Verify C++11 support and threading libraries
- **Browser issues:** Try a different modern browser or clear cache

## License

This project is for educational purposes. The cpp-httplib library has its own license terms.