export class NTreeArrayNode<T> {
    data: T;
    parentIndex?: number;

    constructor(data: T, parentIndex?: number) {
        this.data = data;
        this.parentIndex = parentIndex;
    }

    static buildTree<T>(array: NTreeArrayNode<T>[]): NTreeNode<T> {
        const treeNodes = array.map((x) => new NTreeNode(x.data));
        array.forEach((x, index) => {
            if (x.parentIndex !== undefined) {
                treeNodes[x.parentIndex].addChildByNode(treeNodes[index]);
            }
        });

        return treeNodes[0];
    }
}

export class NTreeNode<T> {
    private parent: NTreeNode<T> | null;
    private children: NTreeNode<T>[];
    private data: T;
    private arrayIndex: number = 0;

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

    removefromParent(): void {
        if (this.parent) {
            this.parent.children = this.parent.children.filter((x) => x != this);
        }
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

    addChildByNode(node: NTreeNode<T>): void {
        node.removefromParent();
        node.parent = this;

        this.children.push(node);
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

    findBySelfAndParents(fn: (node: NTreeNode<T>) => boolean): NTreeNode<T> | null {
        if (fn(this)) {
            return this;
        }

        if (this.parent) {
            return this.parent.findBySelfAndParents(fn);
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

    toArray(): NTreeArrayNode<T>[] {
        let index = 0;
        this.depthFirst((_, node) => (node.arrayIndex = index++));

        const array: NTreeArrayNode<T>[] = [];
        this.depthFirst(
            (_, node) => (array[node.arrayIndex] = new NTreeArrayNode<T>(node.data, node.parent?.arrayIndex))
        );

        return array;
    }
}
