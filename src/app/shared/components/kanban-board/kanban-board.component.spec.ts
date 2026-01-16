import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KanbanBoardComponent } from './kanban-board.component';

describe('KanbanBoardComponent', () => {
  let component: KanbanBoardComponent;
  let fixture: ComponentFixture<KanbanBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KanbanBoardComponent);
    component = fixture.componentInstance;
    component.columns = [
      { id: 1, title: 'To Do', tasks: [] },
      { id: 2, title: 'In Progress', tasks: [] },
      { id: 3, title: 'Done', tasks: [] },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display columns', () => {
    expect(component.columns.length).toBe(3);
  });

  it('should handle drag start', () => {
    const task = { id: 1, title: 'Test Task' };
    component.onDragStart(task, 1);
    expect(component.draggedTask()).toEqual(task);
    expect(component.draggedFromColumn()).toBe(1);
  });

  it('should handle drag end', () => {
    component.draggedTask.set({ id: 1, title: 'Test' });
    component.onDragEnd();
    expect(component.draggedTask()).toBeNull();
  });

  it('should toggle add task form', () => {
    component.toggleAddTaskForm(1);
    expect(component.showAddTaskForm()[1]).toBe(true);
    component.toggleAddTaskForm(1);
    expect(component.showAddTaskForm()[1]).toBe(false);
  });

  it('should add task to column', () => {
    component.updateTaskTitle(1, 'New Task');
    const initialLength = component.columns[0].tasks.length;
    component.addTask(1);
    expect(component.columns[0].tasks.length).toBe(initialLength + 1);
  });

  it('should delete task from column', () => {
    const task = { id: 1, title: 'Test Task' };
    component.columns[0].tasks.push(task);
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    component.onDeleteTask(task, 1);
    expect(component.columns[0].tasks.length).toBe(0);
  });

  it('should get column task count', () => {
    component.config.showTaskCount = true;
    component.columns[0].tasks = [{ id: 1, title: 'Task 1' }];
    expect(component.getColumnTaskCount(component.columns[0])).toBe('1');
  });

  it('should check column limit', () => {
    component.columns[0].limit = 2;
    component.columns[0].tasks = [
      { id: 1, title: 'Task 1' },
      { id: 2, title: 'Task 2' },
    ];
    expect(component.isColumnLimitReached(component.columns[0])).toBe(true);
  });

  it('should get priority color', () => {
    expect(component.getPriorityColor('high')).toBe('error');
    expect(component.getPriorityColor('medium')).toBe('warning');
    expect(component.getPriorityColor('low')).toBe('success');
  });

  it('should calculate subtask progress', () => {
    const task = { id: 1, title: 'Test', subtasks: 4, completedSubtasks: 2 };
    expect(component.getSubtaskProgress(task)).toBe(50);
  });

  it('should check if task is overdue', () => {
    const pastDate = new Date('2020-01-01');
    expect(component.isOverdue(pastDate)).toBe(true);

    const futureDate = new Date('2030-01-01');
    expect(component.isOverdue(futureDate)).toBe(false);
  });
});
