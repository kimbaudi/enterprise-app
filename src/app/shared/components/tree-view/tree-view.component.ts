import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TreeNode {
  id: string;
  label: string;
  icon?: string;
  children?: TreeNode[];
  data?: any;
  disabled?: boolean;
  selectable?: boolean;
}

export interface TreeNodeState {
  expanded: boolean;
  selected: boolean;
  level: number;
  hasChildren: boolean;
  visible: boolean;
}

@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css'],
})
export class TreeViewComponent {
  @Input() nodes: TreeNode[] = [];
  @Input() expandAll: boolean = false;
  @Input() selectable: boolean = true;
  @Input() multiSelect: boolean = false;
  @Input() showIcons: boolean = true;
  @Input() showLines: boolean = true;
  @Input() disabled: boolean = false;
  @Output() nodeClick = new EventEmitter<TreeNode>();
  @Output() nodeSelect = new EventEmitter<TreeNode[]>();
  @Output() nodeExpand = new EventEmitter<TreeNode>();
  @Output() nodeCollapse = new EventEmitter<TreeNode>();

  // Internal state management
  private nodeStates = new Map<string, TreeNodeState>();
  private selectedNodes = signal<Set<string>>(new Set());

  // Computed flat list of visible nodes with their states
  flatNodes = computed(() => {
    return this.flattenNodes(this.nodes, 0);
  });

  constructor() {
    // Initialize node states
    this.initializeStates();
  }

  ngOnInit(): void {
    this.initializeStates();
  }

  ngOnChanges(): void {
    this.initializeStates();
  }

  private initializeStates(): void {
    this.nodeStates.clear();
    this.initializeNodeStates(this.nodes, 0);
  }

  private initializeNodeStates(nodes: TreeNode[], level: number): void {
    nodes.forEach((node) => {
      const hasChildren = !!(node.children && node.children.length > 0);
      this.nodeStates.set(node.id, {
        expanded: this.expandAll,
        selected: false,
        level,
        hasChildren,
        visible: true,
      });

      if (hasChildren && node.children) {
        this.initializeNodeStates(node.children, level + 1);
      }
    });
  }

  private flattenNodes(
    nodes: TreeNode[],
    level: number,
    parentVisible: boolean = true,
  ): Array<{ node: TreeNode; state: TreeNodeState }> {
    const result: Array<{ node: TreeNode; state: TreeNodeState }> = [];

    nodes.forEach((node) => {
      const state = this.nodeStates.get(node.id);
      if (!state) return;

      const visible = parentVisible;
      result.push({ node, state: { ...state, level, visible } });

      if (node.children && node.children.length > 0 && state.expanded && visible) {
        result.push(...this.flattenNodes(node.children, level + 1, visible));
      }
    });

    return result;
  }

  toggleNode(nodeId: string): void {
    if (this.disabled) return;

    const state = this.nodeStates.get(nodeId);
    if (!state || !state.hasChildren) return;

    state.expanded = !state.expanded;
    this.nodeStates.set(nodeId, state);

    // Find the actual node
    const node = this.findNode(this.nodes, nodeId);
    if (node) {
      if (state.expanded) {
        this.nodeExpand.emit(node);
      } else {
        this.nodeCollapse.emit(node);
      }
    }

    // Trigger change detection
    this.selectedNodes.update((v) => new Set(v));
  }

  selectNode(node: TreeNode): void {
    if (this.disabled || node.disabled || node.selectable === false) return;
    if (!this.selectable) return;

    const selected = this.selectedNodes();

    if (this.multiSelect) {
      if (selected.has(node.id)) {
        selected.delete(node.id);
      } else {
        selected.add(node.id);
      }
    } else {
      selected.clear();
      selected.add(node.id);
    }

    this.selectedNodes.set(new Set(selected));

    // Update states
    this.nodeStates.forEach((state, id) => {
      state.selected = selected.has(id);
    });

    // Emit selected nodes
    const selectedNodeObjects = Array.from(selected)
      .map((id) => this.findNode(this.nodes, id))
      .filter((n): n is TreeNode => n !== null);

    this.nodeSelect.emit(selectedNodeObjects);
  }

  onNodeClick(node: TreeNode): void {
    if (this.disabled || node.disabled) return;
    this.nodeClick.emit(node);
  }

  isNodeExpanded(nodeId: string): boolean {
    return this.nodeStates.get(nodeId)?.expanded || false;
  }

  isNodeSelected(nodeId: string): boolean {
    return this.selectedNodes().has(nodeId);
  }

  getNodeState(nodeId: string): TreeNodeState | undefined {
    return this.nodeStates.get(nodeId);
  }

  private findNode(nodes: TreeNode[], nodeId: string): TreeNode | null {
    for (const node of nodes) {
      if (node.id === nodeId) return node;
      if (node.children) {
        const found = this.findNode(node.children, nodeId);
        if (found) return found;
      }
    }
    return null;
  }

  expandNode(nodeId: string): void {
    const state = this.nodeStates.get(nodeId);
    if (state && state.hasChildren && !state.expanded) {
      this.toggleNode(nodeId);
    }
  }

  collapseNode(nodeId: string): void {
    const state = this.nodeStates.get(nodeId);
    if (state && state.hasChildren && state.expanded) {
      this.toggleNode(nodeId);
    }
  }

  expandAllNodes(): void {
    this.nodeStates.forEach((state, id) => {
      if (state.hasChildren) {
        state.expanded = true;
        this.nodeStates.set(id, state);
      }
    });
    this.selectedNodes.update((v) => new Set(v));
  }

  collapseAllNodes(): void {
    this.nodeStates.forEach((state, id) => {
      if (state.hasChildren) {
        state.expanded = false;
        this.nodeStates.set(id, state);
      }
    });
    this.selectedNodes.update((v) => new Set(v));
  }

  clearSelection(): void {
    this.selectedNodes.set(new Set());
    this.nodeStates.forEach((state) => {
      state.selected = false;
    });
  }

  getSelectedNodes(): TreeNode[] {
    const selected = this.selectedNodes();
    return Array.from(selected)
      .map((id) => this.findNode(this.nodes, id))
      .filter((n): n is TreeNode => n !== null);
  }
}
