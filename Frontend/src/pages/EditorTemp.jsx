import React, { useState, useEffect, useRef } from 'react';
import { Play, Save, Download, Upload, Copy, Check, Settings, Moon, Sun, ZoomIn, ZoomOut, RotateCcw, FileCode, Folder, Search, Replace } from 'lucide-react';

const Editor = () => {
  const [code, setCode] = useState(`// Welcome to the Code Editor
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const textareaRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });

  const languages = [
    { value: 'javascript', label: 'JavaScript', ext: '.js' },
    { value: 'python', label: 'Python', ext: '.py' },
    { value: 'html', label: 'HTML', ext: '.html' },
    { value: 'css', label: 'CSS', ext: '.css' },
    { value: 'java', label: 'Java', ext: '.java' },
    { value: 'cpp', label: 'C++', ext: '.cpp' },
    { value: 'typescript', label: 'TypeScript', ext: '.ts' },
    { value: 'json', label: 'JSON', ext: '.json' }
  ];

  useEffect(() => {
    if (autoSave) {
      const timer = setTimeout(() => {
        localStorage.setItem('savedCode', code);
        localStorage.setItem('savedLanguage', language);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [code, language, autoSave]);

  useEffect(() => {
    const saved = localStorage.getItem('savedCode');
    const savedLang = localStorage.getItem('savedLanguage');
    if (saved) setCode(saved);
    if (savedLang) setLanguage(savedLang);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
    
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
      e.preventDefault();
      setShowSearch(!showSearch);
    }

    updateCursorPosition(e.target);
  };

  const updateCursorPosition = (textarea) => {
    const pos = textarea.selectionStart;
    const lines = code.substring(0, pos).split('\n');
    setCursorPosition({
      line: lines.length,
      col: lines[lines.length - 1].length + 1
    });
  };

  const handleRun = () => {
    setOutput('Running code...\n');
    
    if (language === 'javascript') {
      try {
        const logs = [];
        const customConsole = {
          log: (...args) => logs.push(args.join(' ')),
          error: (...args) => logs.push('ERROR: ' + args.join(' ')),
          warn: (...args) => logs.push('WARNING: ' + args.join(' '))
        };
        
        const func = new Function('console', code);
        func(customConsole);
        
        setOutput(logs.length ? logs.join('\n') : 'Code executed successfully (no output)');
      } catch (err) {
        setOutput(`Error: ${err.message}`);
      }
    } else {
      setOutput(`Execution for ${language} is simulated.\nIn production, this would connect to your backend API.`);
    }
  };

  const handleSave = () => {
    localStorage.setItem('savedCode', code);
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code${languages.find(l => l.value === language)?.ext || '.txt'}`;
    a.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCode(e.target.result);
      reader.readAsText(file);
    }
  };

  const handleSearch = () => {
    if (!searchTerm) return;
    const textarea = textareaRef.current;
    const index = code.indexOf(searchTerm, textarea.selectionEnd);
    if (index !== -1) {
      textarea.focus();
      textarea.setSelectionRange(index, index + searchTerm.length);
    }
  };

  const handleReplace = () => {
    if (!searchTerm) return;
    setCode(code.replace(new RegExp(searchTerm, 'g'), replaceTerm));
  };

  const getLineNumbers = () => {
    return code.split('\n').map((_, i) => i + 1).join('\n');
  };

  const themeColors = {
    dark: {
      bg: 'bg-gray-900',
      editor: 'bg-gray-800',
      text: 'text-gray-100',
      border: 'border-gray-700',
      hover: 'hover:bg-gray-700',
      active: 'bg-gray-700'
    },
    light: {
      bg: 'bg-gray-100',
      editor: 'bg-white',
      text: 'text-gray-900',
      border: 'border-gray-300',
      hover: 'hover:bg-gray-200',
      active: 'bg-gray-200'
    }
  };

  const t = themeColors[theme];

  return (
    <div className={`h-screen flex flex-col ${t.bg} ${t.text} font-mono`}>
      {/* Top Toolbar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${t.border} ${t.editor}`}>
        <div className="flex items-center gap-3">
          <FileCode className="w-5 h-5 text-blue-500" />
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`${t.editor} ${t.text} border ${t.border} rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <button onClick={() => setFontSize(Math.max(10, fontSize - 1))} className={`p-1.5 rounded ${t.hover}`}>
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs px-2">{fontSize}px</span>
            <button onClick={() => setFontSize(Math.min(24, fontSize + 1))} className={`p-1.5 rounded ${t.hover}`}>
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleRun} className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm">
            <Play className="w-4 h-4" /> Run
          </button>
          <button onClick={handleSave} className={`p-1.5 rounded ${t.hover}`} title="Save & Download">
            <Download className="w-4 h-4" />
          </button>
          <label className={`p-1.5 rounded ${t.hover} cursor-pointer`} title="Upload File">
            <Upload className="w-4 h-4" />
            <input type="file" onChange={handleUpload} className="hidden" accept=".js,.py,.html,.css,.java,.cpp,.ts,.json,.txt" />
          </label>
          <button onClick={handleCopy} className={`p-1.5 rounded ${t.hover}`} title="Copy Code">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button onClick={() => setShowSearch(!showSearch)} className={`p-1.5 rounded ${t.hover}`} title="Search (Ctrl+F)">
            <Search className="w-4 h-4" />
          </button>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`p-1.5 rounded ${t.hover}`}>
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className={`p-1.5 rounded ${showSettings ? t.active : t.hover}`}>
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className={`flex items-center gap-2 px-4 py-2 border-b ${t.border} ${t.editor}`}>
          <input
            type="text"
            placeholder="Find..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`${t.editor} ${t.text} border ${t.border} rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1`}
          />
          <input
            type="text"
            placeholder="Replace..."
            value={replaceTerm}
            onChange={(e) => setReplaceTerm(e.target.value)}
            className={`${t.editor} ${t.text} border ${t.border} rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1`}
          />
          <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm">
            Find
          </button>
          <button onClick={handleReplace} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm">
            Replace All
          </button>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className={`px-4 py-3 border-b ${t.border} ${t.editor}`}>
          <div className="flex items-center gap-6 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={lineNumbers} onChange={(e) => setLineNumbers(e.target.checked)} className="rounded" />
              Line Numbers
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={autoSave} onChange={(e) => setAutoSave(e.target.checked)} className="rounded" />
              Auto Save
            </label>
            <button onClick={() => setCode('')} className="flex items-center gap-1 text-red-500 hover:text-red-400">
              <RotateCcw className="w-4 h-4" /> Clear
            </button>
          </div>
        </div>
      )}

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex">
          {lineNumbers && (
            <div className={`${t.editor} border-r ${t.border} px-3 py-4 text-right select-none opacity-50`} style={{ fontSize: `${fontSize}px` }}>
              <pre className="leading-6">{getLineNumbers()}</pre>
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              updateCursorPosition(e.target);
            }}
            onKeyDown={handleKeyDown}
            onMouseUp={(e) => updateCursorPosition(e.target)}
            className={`flex-1 ${t.editor} ${t.text} px-4 py-4 font-mono resize-none focus:outline-none leading-6`}
            style={{ fontSize: `${fontSize}px`, tabSize: 2 }}
            spellCheck={false}
          />
        </div>

        {/* Output Panel */}
        <div className={`w-96 border-l ${t.border} ${t.editor} flex flex-col`}>
          <div className={`px-4 py-2 border-b ${t.border} font-semibold text-sm flex items-center justify-between`}>
            <span>Output</span>
            <button onClick={() => setOutput('')} className="text-xs opacity-60 hover:opacity-100">Clear</button>
          </div>
          <pre className="flex-1 px-4 py-3 overflow-auto text-sm leading-6 whitespace-pre-wrap">
            {output || 'Press Run to execute code...'}
          </pre>
        </div>
      </div>

      {/* Status Bar */}
      <div className={`flex items-center justify-between px-4 py-1.5 border-t ${t.border} ${t.editor} text-xs`}>
        <div className="flex items-center gap-4">
          <span>Ln {cursorPosition.line}, Col {cursorPosition.col}</span>
          <span>{code.split('\n').length} lines</span>
          <span>{code.length} chars</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="opacity-60">UTF-8</span>
          <span className="opacity-60">{language.toUpperCase()}</span>
          <span className={`px-2 py-0.5 rounded ${autoSave ? 'bg-green-600' : 'bg-gray-600'} text-white text-xs`}>
            {autoSave ? 'Auto-Save ON' : 'Auto-Save OFF'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Editor;