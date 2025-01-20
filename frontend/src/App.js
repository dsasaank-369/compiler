import { useState, useEffect } from 'react';
import './App.css';
import { Input, Select, Button, Spin } from 'antd';
import axios from 'axios';


const { TextArea } = Input;
const SERVER_URL=`http://localhost:5000/`;

function App() {
  const [code, setCode] = useState("");

  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");


  const handleChange = (value) => {
    setLanguage(value);
    console.log('Selected Language:', value); 
  };

  
  

  useEffect(()=>{
    const defaultCode = {
      javascript: 'console.log("hello world");',
      python: 'print("hello world")',
      cpp: `// Edit this code or paste your code

#include <iostream>
using namespace std;

// main() function: where the execution of
// C++ program begins
int main() {
  
    // This statement prints "Hello World"
    cout << "Hello World";

    return 0;
}`,
      java: `import java.util.*;

public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`,
    };
    setCode(defaultCode[language])
  },[language]);

  const handleInput = (e) => {
    setInput(e.target.value);
    console.log('Updated Code:', e.target.value); 
  };

  const handleCode = (e) => {
    setCode(e.target.value);
    console.log('Updated Code:', e.target.value); 
  };


  const handleSubmit = async () => {
    const data = {
      language,
      code, input
    };
    console.log("Data being sent:", data);

    setLoading(true); 
    try {
      const response = await axios.post(SERVER_URL+'run', data);
      console.log("Response from server:", response);
      setOutput(response.data.output); 
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(`Error: ${error.response.data.message || 'An error occurred'}`);
      } else if (error.request) {
        console.error("Error request:", error.request);
        alert("No response from the server. Please try again later.");
      } else {
        console.error("Error message:", error.message);
        alert("An unexpected error occurred.");
      }
    }
    finally {
      setLoading(false);  
    }
  };

  return (
    <>
      <h1 className='title'>Compiler</h1>
      <div className="main-body">
        <Select
          value={language}
          style={{ width: 120 }}
          onChange={handleChange}
          options={[
            { value: 'cpp', label: 'C ++' },
            { value: 'java', label: 'Java' },
            { value: 'python', label: 'Python' },
            { value: 'javascript', label: 'Javascript' },

          ]}
        />
        <TextArea 
          style={{ width: 1000, height: '50vh' }} 
          placeholder="Write your code here..."  
          value={code} 
          onChange={handleCode} 
        />
        <Button type="primary" onClick={handleSubmit}>{loading ? <Spin /> : 'Submit'}</Button> 
        {output?
        <div>
          <h2> {output}</h2>
        </div>:<></>}
        <h2 style={{margin:`0`}}>Input:</h2>
        <TextArea 
          style={{ width: 1000, height: '15vh' }} 
          placeholder="Give your input here..."  
          value={input} 
          onChange={handleInput} 
        />
      </div>
    </>
  );
}

export default App;
