import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type CodeLanguage =
  | 'typescript'
  | 'javascript'
  | 'html'
  | 'css'
  | 'json'
  | 'markdown'
  | 'python'
  | 'java'
  | 'csharp'
  | 'sql'
  | 'bash'
  | 'plaintext';

export type CodeTheme = 'light' | 'dark' | 'monokai' | 'github' | 'dracula';

export interface CodeEditorConfig {
  showLineNumbers?: boolean;
  readOnly?: boolean;
  wordWrap?: boolean;
  fontSize?: number;
  tabSize?: number;
  highlightActiveLine?: boolean;
  autoCloseBrackets?: boolean;
}

@Component({
  selector: 'app-code-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css'],
})
export class CodeEditorComponent implements OnInit, OnChanges {
  @Input() code = '';
  @Input() language: CodeLanguage = 'typescript';
  @Input() theme: CodeTheme = 'dark';
  @Input() config: CodeEditorConfig = {
    showLineNumbers: true,
    readOnly: false,
    wordWrap: false,
    fontSize: 14,
    tabSize: 2,
    highlightActiveLine: true,
    autoCloseBrackets: true,
  };
  @Input() height = '400px';
  @Input() placeholder = 'Enter code...';

  @Output() codeChange = new EventEmitter<string>();
  @Output() languageChange = new EventEmitter<CodeLanguage>();
  @Output() themeChange = new EventEmitter<CodeTheme>();
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();

  editorCode = signal('');
  lines = signal<string[]>([]);
  activeLineNumber = signal<number | null>(null);

  private fullConfig: CodeEditorConfig = {};

  constructor() {
    effect(() => {
      this.updateLines();
    });
  }

  ngOnInit(): void {
    this.fullConfig = { ...this.config };
    this.editorCode.set(this.code);
    this.updateLines();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['code'] && !changes['code'].firstChange) {
      this.editorCode.set(this.code);
      this.updateLines();
    }
    if (changes['config'] && !changes['config'].firstChange) {
      this.fullConfig = { ...this.config };
    }
  }

  onCodeChange(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.editorCode.set(value);
    this.updateLines();
    this.codeChange.emit(value);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.fullConfig.autoCloseBrackets) return;

    const textarea = event.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Auto-close brackets
    const bracketPairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`',
    };

    if (bracketPairs[event.key]) {
      event.preventDefault();
      const currentCode = this.editorCode();
      const newCode =
        currentCode.substring(0, start) +
        event.key +
        bracketPairs[event.key] +
        currentCode.substring(end);
      this.editorCode.set(newCode);
      this.codeChange.emit(newCode);
      this.updateLines();

      // Set cursor position between brackets
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      });
    }

    // Handle Tab key
    if (event.key === 'Tab') {
      event.preventDefault();
      const spaces = ' '.repeat(this.fullConfig.tabSize || 2);
      const currentCode = this.editorCode();
      const newCode = currentCode.substring(0, start) + spaces + currentCode.substring(end);
      this.editorCode.set(newCode);
      this.codeChange.emit(newCode);
      this.updateLines();

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      });
    }
  }

  onFocus(): void {
    this.focus.emit();
  }

  onBlur(): void {
    this.blur.emit();
  }

  onLineClick(lineNumber: number): void {
    if (this.fullConfig.highlightActiveLine) {
      this.activeLineNumber.set(lineNumber);
    }
  }

  private updateLines(): void {
    const code = this.editorCode();
    if (!code) {
      this.lines.set(['']);
      return;
    }
    this.lines.set(code.split('\n'));
  }

  getHighlightedCode(): string {
    const code = this.editorCode();
    if (!code) return '';

    // Simple syntax highlighting based on language
    return this.highlightCode(code, this.language);
  }

  private highlightCode(code: string, language: CodeLanguage): string {
    // Basic syntax highlighting patterns
    let highlighted = this.escapeHtml(code);

    switch (language) {
      case 'typescript':
      case 'javascript':
        highlighted = this.highlightJavaScript(highlighted);
        break;
      case 'html':
        highlighted = this.highlightHtml(highlighted);
        break;
      case 'css':
        highlighted = this.highlightCss(highlighted);
        break;
      case 'json':
        highlighted = this.highlightJson(highlighted);
        break;
      case 'python':
        highlighted = this.highlightPython(highlighted);
        break;
      case 'sql':
        highlighted = this.highlightSql(highlighted);
        break;
      case 'bash':
        highlighted = this.highlightBash(highlighted);
        break;
    }

    return highlighted;
  }

  private highlightJavaScript(code: string): string {
    // Keywords
    const keywords =
      /\b(const|let|var|function|class|interface|type|import|export|from|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|async|await|new|this|super|extends|implements|public|private|protected|static|readonly|enum|namespace)\b/g;
    code = code.replace(keywords, '<span class="keyword">$1</span>');

    // Strings
    code = code.replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="string">$1</span>');

    // Comments
    code = code.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
    code = code.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');

    // Numbers
    code = code.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');

    return code;
  }

  private highlightHtml(code: string): string {
    // Tags
    code = code.replace(/(&lt;\/?[a-zA-Z][^&gt;]*&gt;)/g, '<span class="tag">$1</span>');

    // Attributes
    code = code.replace(/\b([a-zA-Z-]+)=/g, '<span class="attribute">$1</span>=');

    // Strings
    code = code.replace(/(".*?"|'.*?')/g, '<span class="string">$1</span>');

    return code;
  }

  private highlightCss(code: string): string {
    // Selectors
    code = code.replace(/^([\w\-\.#:\[\]]+)\s*{/gm, '<span class="selector">$1</span> {');

    // Properties
    code = code.replace(/\b([a-zA-Z-]+):/g, '<span class="property">$1</span>:');

    // Values
    code = code.replace(/:\s*([^;{]+)/g, ': <span class="value">$1</span>');

    // Comments
    code = code.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');

    return code;
  }

  private highlightJson(code: string): string {
    // Keys
    code = code.replace(/"([^"]+)":/g, '<span class="key">"$1"</span>:');

    // Strings
    code = code.replace(/:\s*"([^"]*)"/g, ': <span class="string">"$1"</span>');

    // Numbers
    code = code.replace(/:\s*(\d+)/g, ': <span class="number">$1</span>');

    // Booleans and null
    code = code.replace(/:\s*(true|false|null)/g, ': <span class="boolean">$1</span>');

    return code;
  }

  private highlightPython(code: string): string {
    // Keywords
    const keywords =
      /\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|with|pass|break|continue|lambda|yield|async|await|None|True|False)\b/g;
    code = code.replace(keywords, '<span class="keyword">$1</span>');

    // Strings
    code = code.replace(
      /(".*?"|'.*?'|"""[\s\S]*?"""|'''[\s\S]*?''')/g,
      '<span class="string">$1</span>',
    );

    // Comments
    code = code.replace(/(#.*$)/gm, '<span class="comment">$1</span>');

    // Decorators
    code = code.replace(/(@\w+)/g, '<span class="decorator">$1</span>');

    return code;
  }

  private highlightSql(code: string): string {
    // Keywords
    const keywords =
      /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TABLE|INDEX|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AND|OR|NOT|NULL|PRIMARY|KEY|FOREIGN|UNIQUE|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET)\b/gi;
    code = code.replace(keywords, '<span class="keyword">$1</span>');

    // Strings
    code = code.replace(/('.*?')/g, '<span class="string">$1</span>');

    // Comments
    code = code.replace(/(--.*$)/gm, '<span class="comment">$1</span>');

    return code;
  }

  private highlightBash(code: string): string {
    // Commands
    code = code.replace(/^(\$\s*)(\w+)/gm, '$1<span class="command">$2</span>');

    // Strings
    code = code.replace(/(".*?"|'.*?')/g, '<span class="string">$1</span>');

    // Comments
    code = code.replace(/(#.*$)/gm, '<span class="comment">$1</span>');

    // Flags
    code = code.replace(/(\s-{1,2}[\w-]+)/g, '<span class="flag">$1</span>');

    return code;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
