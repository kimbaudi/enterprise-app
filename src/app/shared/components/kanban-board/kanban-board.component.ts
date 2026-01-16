import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';
// import { InputComponent } from '../input/input.component';
import { BadgeComponent } from '../badge/badge.component';
// import { AvatarComponent } from '../avatar/avatar.component';

export interface KanbanTask {
  id: string | number;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  tags?: string[];
  dueDate?: Date;
  subtasks?: number;
  completedSubtasks?: number;
}

export interface KanbanColumn {
  id: string | number;
  title: string;
  tasks: KanbanTask[];
  limit?: number;
  color?: string;
}

export interface KanbanConfig {
  allowAddTask?: boolean;
  allowEditTask?: boolean;
  allowDeleteTask?: boolean;
  allowDragDrop?: boolean;
  showTaskCount?: boolean;
  showColumnLimit?: boolean;
  compactMode?: boolean;
}

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    // InputComponent,
    BadgeComponent,
    // AvatarComponent,
  ],
  templateUrl: './kanban-board.component.html',
  styleUrl: './kanban-board.component.css',
})
export class KanbanBoardComponent {
  @Input() columns: KanbanColumn[] = [];
  @Input() config: KanbanConfig = {
    allowAddTask: true,
    allowEditTask: true,
    allowDeleteTask: true,
    allowDragDrop: true,
    showTaskCount: true,
    showColumnLimit: false,
    compactMode: false,
  };

  @Output() taskMove = new EventEmitter<{
    task: KanbanTask;
    fromColumn: string | number;
    toColumn: string | number;
  }>();
  @Output() taskAdd = new EventEmitter<{
    columnId: string | number;
    task: KanbanTask;
  }>();
  @Output() taskEdit = new EventEmitter<KanbanTask>();
  @Output() taskDelete = new EventEmitter<KanbanTask>();
  @Output() taskClick = new EventEmitter<KanbanTask>();

  // State
  draggedTask = signal<KanbanTask | null>(null);
  draggedFromColumn = signal<string | number | null>(null);
  showAddTaskForm = signal<{ [key: string | number]: boolean }>({});
  newTaskTitle = signal<{ [key: string | number]: string }>({});

  // Drag and drop handlers
  onDragStart(task: KanbanTask, columnId: string | number) {
    if (!this.config.allowDragDrop) return;
    this.draggedTask.set(task);
    this.draggedFromColumn.set(columnId);
  }

  onDragOver(event: DragEvent) {
    if (!this.config.allowDragDrop) return;
    event.preventDefault();
  }

  onDrop(event: DragEvent, targetColumnId: string | number) {
    if (!this.config.allowDragDrop) return;
    event.preventDefault();

    const task = this.draggedTask();
    const fromColumnId = this.draggedFromColumn();

    if (!task || fromColumnId === null || fromColumnId === targetColumnId) {
      this.draggedTask.set(null);
      this.draggedFromColumn.set(null);
      return;
    }

    // Find columns
    const fromColumn = this.columns.find((col) => col.id === fromColumnId);
    const toColumn = this.columns.find((col) => col.id === targetColumnId);

    if (!fromColumn || !toColumn) return;

    // Check column limit
    if (
      toColumn.limit &&
      toColumn.tasks.length >= toColumn.limit &&
      fromColumnId !== targetColumnId
    ) {
      alert(`Column "${toColumn.title}" has reached its limit of ${toColumn.limit} tasks`);
      this.draggedTask.set(null);
      this.draggedFromColumn.set(null);
      return;
    }

    // Remove from source column
    const taskIndex = fromColumn.tasks.findIndex((t) => t.id === task.id);
    if (taskIndex !== -1) {
      fromColumn.tasks.splice(taskIndex, 1);
    }

    // Add to target column
    toColumn.tasks.push(task);

    // Emit event
    this.taskMove.emit({
      task,
      fromColumn: fromColumnId,
      toColumn: targetColumnId,
    });

    this.draggedTask.set(null);
    this.draggedFromColumn.set(null);
  }

  onDragEnd() {
    this.draggedTask.set(null);
    this.draggedFromColumn.set(null);
  }

  // Task actions
  toggleAddTaskForm(columnId: string | number) {
    const current = this.showAddTaskForm();
    this.showAddTaskForm.set({
      ...current,
      [columnId]: !current[columnId],
    });
  }

  addTask(columnId: string | number) {
    const titleMap = this.newTaskTitle();
    const title = titleMap[columnId]?.trim();

    if (!title) return;

    const column = this.columns.find((col) => col.id === columnId);
    if (!column) return;

    // Check column limit
    if (column.limit && column.tasks.length >= column.limit) {
      alert(`Column "${column.title}" has reached its limit of ${column.limit} tasks`);
      return;
    }

    const newTask: KanbanTask = {
      id: Date.now(),
      title,
    };

    column.tasks.push(newTask);
    this.taskAdd.emit({ columnId, task: newTask });

    // Reset form
    this.newTaskTitle.set({
      ...titleMap,
      [columnId]: '',
    });
    this.toggleAddTaskForm(columnId);
  }

  cancelAddTask(columnId: string | number) {
    const titleMap = this.newTaskTitle();
    this.newTaskTitle.set({
      ...titleMap,
      [columnId]: '',
    });
    this.toggleAddTaskForm(columnId);
  }

  updateTaskTitle(columnId: string | number, value: string) {
    this.newTaskTitle.set({
      ...this.newTaskTitle(),
      [columnId]: value,
    });
  }

  onTaskClick(task: KanbanTask) {
    this.taskClick.emit(task);
  }

  onDeleteTask(task: KanbanTask, columnId: string | number) {
    if (!this.config.allowDeleteTask) return;

    if (confirm(`Delete task "${task.title}"?`)) {
      const column = this.columns.find((col) => col.id === columnId);
      if (column) {
        const index = column.tasks.findIndex((t) => t.id === task.id);
        if (index !== -1) {
          column.tasks.splice(index, 1);
          this.taskDelete.emit(task);
        }
      }
    }
  }

  // Helpers
  getColumnTaskCount(column: KanbanColumn): string {
    if (!this.config.showTaskCount) return '';
    if (this.config.showColumnLimit && column.limit) {
      return `${column.tasks.length}/${column.limit}`;
    }
    return `${column.tasks.length}`;
  }

  isColumnLimitReached(column: KanbanColumn): boolean {
    return !!(column.limit && column.tasks.length >= column.limit);
  }

  getPriorityColor(priority?: string): 'outline' | 'solid' | 'subtle' {
    switch (priority) {
      case 'high':
        return 'solid';
      case 'medium':
        return 'solid';
      case 'low':
        return 'solid';
      default:
        return 'outline';
    }
  }

  getSubtaskProgress(task: KanbanTask): number {
    if (!task.subtasks || task.subtasks === 0) return 0;
    return ((task.completedSubtasks || 0) / task.subtasks) * 100;
  }

  isOverdue(date?: Date): boolean {
    if (!date) return false;
    return new Date(date) < new Date();
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
