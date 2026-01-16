import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

export interface UploadedFile {
    file: File;
    name: string;
    size: number;
    type: string;
    preview?: string;
}

@Component({
    selector: 'app-file-upload',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './file-upload.component.html',
    styleUrl: './file-upload.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent {
    @Input() accept?: string;
    @Input() multiple = false;
    @Input() maxSize?: number; // in bytes
    @Input() maxFiles?: number;
    @Input() disabled = false;
    @Input() showPreview = true;
    @Input() label = 'Drop files here or click to browse';
    @Input() hint?: string;

    @Output() filesSelected = new EventEmitter<UploadedFile[]>();
    @Output() fileRemoved = new EventEmitter<UploadedFile>();
    @Output() error = new EventEmitter<string>();

    uploadedFiles = signal<UploadedFile[]>([]);
    isDragging = signal(false);

    onDragOver(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        if (!this.disabled) {
            this.isDragging.set(true);
        }
    }

    onDragLeave(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging.set(false);
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isDragging.set(false);

        if (this.disabled) {
            return;
        }

        const files = event.dataTransfer?.files;
        if (files) {
            this.handleFiles(Array.from(files));
        }
    }

    onFileSelect(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.handleFiles(Array.from(input.files));
            input.value = ''; // Reset input to allow selecting same file again
        }
    }

    private handleFiles(files: File[]): void {
        const currentFiles = this.uploadedFiles();

        // Check max files limit
        if (this.maxFiles && currentFiles.length + files.length > this.maxFiles) {
            this.error.emit(`Maximum ${this.maxFiles} files allowed`);
            return;
        }

        const validFiles: UploadedFile[] = [];

        for (const file of files) {
            // Check file size
            if (this.maxSize && file.size > this.maxSize) {
                this.error.emit(`File ${file.name} exceeds maximum size of ${this.formatFileSize(this.maxSize)}`);
                continue;
            }

            // Check file type
            if (this.accept) {
                const acceptedTypes = this.accept.split(',').map(t => t.trim());
                const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
                const isAccepted = acceptedTypes.some(type => {
                    if (type.startsWith('.')) {
                        return type.toLowerCase() === fileExtension;
                    }
                    // Handle MIME types like image/*, application/pdf
                    if (type.includes('*')) {
                        const baseType = type.split('/')[0];
                        return file.type.startsWith(baseType + '/');
                    }
                    return file.type === type;
                });

                if (!isAccepted) {
                    this.error.emit(`File ${file.name} type not accepted`);
                    continue;
                }
            }

            const uploadedFile: UploadedFile = {
                file,
                name: file.name,
                size: file.size,
                type: file.type,
            };

            // Generate preview for images
            if (this.showPreview && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    uploadedFile.preview = e.target?.result as string;
                    this.uploadedFiles.set([...this.uploadedFiles()]);
                };
                reader.readAsDataURL(file);
            }

            validFiles.push(uploadedFile);
        }

        if (validFiles.length > 0) {
            const newFiles = this.multiple
                ? [...currentFiles, ...validFiles]
                : validFiles;

            this.uploadedFiles.set(newFiles);
            this.filesSelected.emit(newFiles);
        }
    }

    removeFile(file: UploadedFile): void {
        const files = this.uploadedFiles().filter(f => f !== file);
        this.uploadedFiles.set(files);
        this.fileRemoved.emit(file);
    }

    clearAll(): void {
        this.uploadedFiles.set([]);
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    getFileIcon(type: string): string {
        if (type.startsWith('image/')) return '🖼️';
        if (type.startsWith('video/')) return '🎥';
        if (type.startsWith('audio/')) return '🎵';
        if (type.includes('pdf')) return '📄';
        if (type.includes('word') || type.includes('document')) return '📝';
        if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
        if (type.includes('powerpoint') || type.includes('presentation')) return '📽️';
        if (type.includes('zip') || type.includes('compressed')) return '📦';
        return '📎';
    }
}
