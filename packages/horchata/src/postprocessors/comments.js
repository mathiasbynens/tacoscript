/**
 * Performs comment attachment from the cst.
 */

export default function(ast) { new Postprocessor().process(ast); return ast; }

export class Postprocessor {
  process(ast) {
    this.ast = ast;
    this.traverse(ast);
  }

  dereference(parent, childReference, state) {
    if (childReference === undefined) return undefined;
    let [key, list] = childReference.reference.split('#');
    let node;
    if (list === "next") {
      let i = state.list[key] || 0;
      node = parent[key][i];
      state.list[key] = i + 1;
    } else {
      node = parent[key];
    }
    return node;
  }

  // TODO: convert to use a traverse helper, similar to babel's traversal helpers
  traverse(node) {
    let lastChild;
    let state = {list: {}};
    let unclaimedComments = node.innerComments || [];
    delete node.innerComments;
    for (let len = node.sourceElements.length, i = 0; i < len; i++) {
      let el = node.sourceElements[i];
      if (el.element === "CommentBody") {
        unclaimedComments.push(this.ast.comments[el.extra.tokenValue.index]);
      }
      if (el.reference) {
        let child = this.dereference(node, el, state);
        if (!el.element) {
          if (unclaimedComments.length) {
            this.assignComments(child, unclaimedComments);
            unclaimedComments = [];
          }
          this.traverse(child);
          lastChild = child;
        }
      }
    }
    if (unclaimedComments.length) {
      if (lastChild) {
        lastChild.trailingComments = unclaimedComments;
      } else {
        this.assignComments(node, unclaimedComments);
      }
    }
  }

  assignComments(node, unclaimedComments) {
    let i = 0;
    const nodeStart = node.start;
    for (; i < unclaimedComments.length; i++) {
      if (unclaimedComments[i].start >= nodeStart) break;
    }
    if (i > 0) {
      node.leadingComments = (node.leadingComments || []).concat(unclaimedComments.slice(0, i));
    }
    if (i < unclaimedComments.length) {
      const firstInnerIndex = i;
      const nodeEndLine = node.loc.end.line - 1;
      if (node.type === "Program") {
        i = unclaimedComments.length;
      } else for (; i < unclaimedComments.length; i++) {
        const c = unclaimedComments[i];
        if (c.type === "CommentLine" && c.loc.start.line >= nodeEndLine) break;
      }
      if (i > firstInnerIndex) {
        node.innerComments = (node.innerComments || []).concat(unclaimedComments.slice(firstInnerIndex, i));
      }
      if (i < unclaimedComments.length) {
        node.trailingComments = (node.trailingComments || []).concat(unclaimedComments.slice(i));
      }
    }
  }
}
