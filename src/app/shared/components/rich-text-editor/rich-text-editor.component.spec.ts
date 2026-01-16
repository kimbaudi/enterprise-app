import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RichTextEditorComponent } from './rich-text-editor.component';

describe('RichTextEditorComponent', () => {
  let component: RichTextEditorComponent;
  let fixture: ComponentFixture<RichTextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RichTextEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RichTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty content', () => {
    expect(component.content).toBe('');
    expect(component.charCount()).toBe(0);
  });

  it('should update char count on content change', () => {
    component.editorRef.nativeElement.innerText = 'Hello World';
    component.updateCharCount();
    expect(component.charCount()).toBe(11);
  });

  it('should emit contentChange event', () => {
    jest.spyOn(component.contentChange, 'emit');
    component.onContentChange();
    expect(component.contentChange.emit).toHaveBeenCalled();
  });

  it('should set focused state', () => {
    component.onFocus();
    expect(component.isFocused()).toBe(true);

    component.onBlur();
    expect(component.isFocused()).toBe(false);
  });

  it('should show link dialog', () => {
    component.insertLink = jest.fn();
    component.showLinkDialog.set(true);
    expect(component.showLinkDialog()).toBe(true);
  });

  it('should apply link with URL', () => {
    component.linkUrl.set('https://example.com');
    component.execCommand = jest.fn();
    component.applyLink();
    expect(component.execCommand).toHaveBeenCalledWith('createLink', 'https://example.com');
    expect(component.showLinkDialog()).toBe(false);
  });

  it('should cancel link dialog', () => {
    component.showLinkDialog.set(true);
    component.linkUrl.set('https://example.com');
    component.cancelLink();
    expect(component.showLinkDialog()).toBe(false);
    expect(component.linkUrl()).toBe('');
  });

  it('should get correct button icon', () => {
    expect(component.getButtonIcon('bold')).toBe('𝐁');
    expect(component.getButtonIcon('italic')).toBe('𝐼');
    expect(component.getButtonIcon('link')).toBe('🔗');
  });

  it('should get correct button title', () => {
    expect(component.getButtonTitle('bold')).toBe('Bold');
    expect(component.getButtonTitle('h1')).toBe('Heading 1');
    expect(component.getButtonTitle('orderedList')).toBe('Numbered List');
  });

  it('should handle toolbar actions', () => {
    component.formatBold = jest.fn();
    component.handleToolbarAction('bold');
    expect(component.formatBold).toHaveBeenCalled();
  });

  it('should check max length exceeded', () => {
    component.config.maxLength = 10;
    component.charCount.set(5);
    expect(component.isMaxLengthExceeded()).toBe(false);

    component.charCount.set(15);
    expect(component.isMaxLengthExceeded()).toBe(true);
  });

  it('should set and get content', () => {
    const html = '<p>Test content</p>';
    component.setContent(html);
    expect(component.getContent()).toContain('Test content');
  });
});
