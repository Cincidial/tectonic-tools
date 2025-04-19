export class NTreeNode<T> {
    private parent: NTreeNode<T> | null;
    private children: NTreeNode<T>[];
    private data: T;

    constructor(data: T) {
        this.parent = null;
        this.children = [];
        this.data = data;
    }

    getData(): T {
        return this.data;
    }

    isRoot(): boolean {
        return this.parent == null;
    }

    isLeaf(): boolean {
        return this.children.length == 0;
    }

    getParent(): NTreeNode<T> | null {
        return this.parent;
    }

    hasChildren(): boolean {
        return this.children.length > 0;
    }

    addChild(data: T): NTreeNode<T> {
        const node = new NTreeNode<T>(data);
        node.parent = this;

        this.children.push(node);
        return node;
    }

    depthFirst(fn: (depth: number, node: NTreeNode<T>) => void, depth: number = 0) {
        fn(depth, this);
        this.children.forEach((x) => x.depthFirst(fn, depth + 1));
    }

    getLeafs(): NTreeNode<T>[] {
        const leafs: NTreeNode<T>[] = [];
        this.depthFirst((_index, node) => {
            if (node.isLeaf()) {
                leafs.push(node);
            }
        });

        return leafs;
    }

    findDepthFirst(fn: (node: NTreeNode<T>) => boolean): NTreeNode<T> | null {
        if (fn(this)) {
            return this;
        }

        for (const child of this.children) {
            const result = child.findDepthFirst(fn);
            if (result != null) {
                return result;
            }
        }

        return null;
    }

    callSelfAndParents(fn: (node: NTreeNode<T>) => void) {
        fn(this);
        if (this.parent) {
            this.parent.callSelfAndParents(fn);
        }
    }

    callParents(fn: (node: NTreeNode<T>) => void) {
        if (this.parent) {
            this.parent.callSelfAndParents(fn);
        }
    }

    asBreadthFirst(): NTreeNode<T>[][] {
        const levels: NTreeNode<T>[][] = [];
        this.depthFirst((depth, node) => {
            while (levels.length <= depth) {
                levels.push([]);
            }

            levels[depth].push(node);
        });

        return levels;
    }

    asBranches(): NTreeNode<T>[][] {
        const branches: NTreeNode<T>[][] = [];
        for (const leaf of this.getLeafs()) {
            branches.push([]);
            leaf.callSelfAndParents((node) => branches[branches.length - 1].unshift(node));
        }

        return branches;
    }
}
