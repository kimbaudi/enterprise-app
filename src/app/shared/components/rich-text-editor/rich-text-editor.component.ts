import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

export interface RichTextEditorConfig {
  toolbar?: boolean;
  minHeight?: string;
  maxHeight?: string;
  placeholder?: string;
  readonly?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
  toolbarButtons?: ToolbarButton[];
}

export type ToolbarButton =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'paragraph'
  | 'orderedList'
  | 'unorderedList'
  | 'blockquote'
  | 'code'
  | 'link'
  | 'image'
  | 'alignLeft'
  | 'alignCenter'
  | 'alignRight'
  | 'alignJustify'
  | 'undo'
  | 'redo'
  | 'clear';

interface ToolbarGroup {
  name: string;
  buttons: ToolbarButton[];
}

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './rich-text-editor.component.html',
  styleUrl: './rich-text-editor.component.css',
})
export class RichTextEditorComponent implements AfterViewInit {
  @ViewChild('editor', { static: false }) editorRef!: ElementRef<HTMLDivElement>;

  @Input() content = '';
  @Input() config: RichTextEditorConfig = {
    toolbar: true,
    minHeight: '200px',
    maxHeight: 'auto',
    placeholder: 'Start typing...',
    readonly: false,
    showCharCount: false,
    maxLength: undefined,
    toolbarButtons: undefined,
  };

  @Output() contentChange = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();
  @Output() focus = new EventEmitter<void>();

  // State
  isFocused = signal(false);
  charCount = signal(0);
  linkUrl = signal('');
  showLinkDialog = signal(false);

  defaultToolbarGroups: ToolbarGroup[] = [
    {
      name: 'text-style',
      buttons: ['bold', 'italic', 'underline', 'strikethrough'],
    },
    {
      name: 'headings',
      buttons: ['h1', 'h2', 'h3', 'paragraph'],
    },
    {
      name: 'lists',
      buttons: ['orderedList', 'unorderedList', 'blockquote'],
    },
    {
      name: 'alignment',
      buttons: ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'],
    },
    {
      name: 'insert',
      buttons: ['link', 'image', 'code'],
    },
    {
      name: 'actions',
      buttons: ['undo', 'redo', 'clear'],
    },
  ];

  toolbarGroups = computed(() => {
    if (this.config.toolbarButtons && this.config.toolbarButtons.length > 0) {
      // Filter groups based on configured buttons
      return this.defaultToolbarGroups
        .map((group) => ({
          ...group,
          buttons: group.buttons.filter((btn) => this.config.toolbarButtons!.includes(btn)),
        }))
        .filter((group) => group.buttons.length > 0);
    }
    return this.defaultToolbarGroups;
  });

  charCountText = computed(() => {
    const count = this.charCount();
    const max = this.config.maxLength;
    if (max) {
      return `${count} / ${max}`;
    }
    return `${count} characters`;
  });

  isMaxLengthExceeded = computed(() => {
    if (!this.config.maxLength) return false;
    return this.charCount() > this.config.maxLength;
  });

  ngAfterViewInit() {
    if (this.editorRef) {
      this.editorRef.nativeElement.innerHTML = this.content;
      this.updateCharCount();
    }
  }

  // Formatting commands
  execCommand(command: string, value?: string) {
    if (this.config.readonly) return;
    document.execCommand(command, false, value);
    this.editorRef.nativeElement.focus();
    this.onContentChange();
  }

  formatBold() {
    this.execCommand('bold');
  }

  formatItalic() {
    this.execCommand('italic');
  }

  formatUnderline() {
    this.execCommand('underline');
  }

  formatStrikethrough() {
    this.execCommand('strikeThrough');
  }

  formatHeading(level: number) {
    this.execCommand('formatBlock', `<h${level}>`);
  }

  formatParagraph() {
    this.execCommand('formatBlock', '<p>');
  }

  formatOrderedList() {
    this.execCommand('insertOrderedList');
  }

  formatUnorderedList() {
    this.execCommand('insertUnorderedList');
  }

  formatBlockquote() {
    this.execCommand('formatBlock', '<blockquote>');
  }

  formatCode() {
    this.execCommand('formatBlock', '<pre>');
  }

  alignLeft() {
    this.execCommand('justifyLeft');
  }

  alignCenter() {
    this.execCommand('justifyCenter');
  }

  alignRight() {
    this.execCommand('justifyRight');
  }

  alignJustify() {
    this.execCommand('justifyFull');
  }

  undo() {
    this.execCommand('undo');
  }

  redo() {
    this.execCommand('redo');
  }

  clear() {
    if (this.config.readonly) return;
    if (confirm('Clear all content?')) {
      this.editorRef.nativeElement.innerHTML = '';
      this.onContentChange();
    }
  }

  insertLink() {
    if (this.config.readonly) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      alert('Please select text first');
      return;
    }
    this.showLinkDialog.set(true);
  }

  applyLink() {
    const url = this.linkUrl();
    if (url) {
      this.execCommand('createLink', url);
      this.showLinkDialog.set(false);
      this.linkUrl.set('');
    }
  }

  cancelLink() {
    this.showLinkDialog.set(false);
    this.linkUrl.set('');
  }

  insertImage() {
    if (this.config.readonly) return;
    const url = prompt('Enter image URL:');
    if (url) {
      this.execCommand('insertImage', url);
    }
  }

  // Button action handlers
  handleToolbarAction(button: ToolbarButton) {
    switch (button) {
      case 'bold':
        this.formatBold();
        break;
      case 'italic':
        this.formatItalic();
        break;
      case 'underline':
        this.formatUnderline();
        break;
      case 'strikethrough':
        this.formatStrikethrough();
        break;
      case 'h1':
        this.formatHeading(1);
        break;
      case 'h2':
        this.formatHeading(2);
        break;
      case 'h3':
        this.formatHeading(3);
        break;
      case 'paragraph':
        this.formatParagraph();
        break;
      case 'orderedList':
        this.formatOrderedList();
        break;
      case 'unorderedList':
        this.formatUnorderedList();
        break;
      case 'blockquote':
        this.formatBlockquote();
        break;
      case 'code':
        this.formatCode();
        break;
      case 'link':
        this.insertLink();
        break;
      case 'image':
        this.insertImage();
        break;
      case 'alignLeft':
        this.alignLeft();
        break;
      case 'alignCenter':
        this.alignCenter();
        break;
      case 'alignRight':
        this.alignRight();
        break;
      case 'alignJustify':
        this.alignJustify();
        break;
      case 'undo':
        this.undo();
        break;
      case 'redo':
        this.redo();
        break;
      case 'clear':
        this.clear();
        break;
    }
  }

  getButtonIcon(button: ToolbarButton): string {
    const icons: Record<ToolbarButton, string> = {
      bold: '𝐁',
      italic: '𝐼',
      underline: 'U̲',
      strikethrough: 'S̶',
      h1: 'H1',
      h2: 'H2',
      h3: 'H3',
      paragraph: '¶',
      orderedList: '1.',
      unorderedList: '•',
      blockquote: '❝',
      code: '</>',
      link: '🔗',
      image: '🖼',
      alignLeft: '≡',
      alignCenter: '≣',
      alignRight: '≡',
      alignJustify: '≣',
      undo: '↶',
      redo: '↷',
      clear: '✕',
    };
    return icons[button] || button;
  }

  getButtonTitle(button: ToolbarButton): string {
    const titles: Record<ToolbarButton, string> = {
      bold: 'Bold',
      italic: 'Italic',
      underline: 'Underline',
      strikethrough: 'Strikethrough',
      h1: 'Heading 1',
      h2: 'Heading 2',
      h3: 'Heading 3',
      paragraph: 'Paragraph',
      orderedList: 'Numbered List',
      unorderedList: 'Bullet List',
      blockquote: 'Quote',
      code: 'Code Block',
      link: 'Insert Link',
      image: 'Insert Image',
      alignLeft: 'Align Left',
      alignCenter: 'Align Center',
      alignRight: 'Align Right',
      alignJustify: 'Align Justify',
      undo: 'Undo',
      redo: 'Redo',
      clear: 'Clear All',
    };
    return titles[button] || button;
  }

  // Event handlers
  onContentChange() {
    const html = this.editorRef.nativeElement.innerHTML;
    this.content = html;
    this.contentChange.emit(html);
    this.updateCharCount();
  }

  onFocus() {
    this.isFocused.set(true);
    this.focus.emit();
  }

  onBlur() {
    this.isFocused.set(false);
    this.blur.emit();
  }

  onPaste(event: ClipboardEvent) {
    if (this.config.readonly) {
      event.preventDefault();
      return;
    }

    // Prevent pasting HTML by default, only paste plain text
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain');
    if (text) {
      document.execCommand('insertText', false, text);
      this.onContentChange();
    }
  }

  updateCharCount() {
    const text = this.editorRef.nativeElement.innerText || '';
    this.charCount.set(text.length);
  }

  getContent(): string {
    return this.editorRef.nativeElement.innerHTML;
  }

  setContent(html: string) {
    this.editorRef.nativeElement.innerHTML = html;
    this.content = html;
    this.updateCharCount();
  }

  clearContent() {
    this.clear();
  }
}
