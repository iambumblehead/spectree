// Filename: spectree.js  
// Timestamp: 2015.05.08-17:03:39 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)

var spectree = ((typeof module === 'object') ? module : {}).exports = (function (s) {

  s = function (root) {
    return s.node(root);
  };

  s.isspecvalid = function (specobj) {
    return typeof specobj === 'object' && specobj
      && typeof specobj.name === 'string';
  };

  s.isspecvalidorerr = function (specobj) {
    if (!s.isspecvalid(specobj)) {
      throw new Error('object w/ named-property "name" required');
    }
    
    return true;
  };

  s.getnodepatharr = function (node) {
    var patharr = [];
    
    node.uid.replace(/-([\d]*)-/g, function (_, d) {
      patharr.push(d);
    });
    
    return patharr;
  };

  s.getpnodepatharr = function (node) {
    var patharr = s.getnodepatharr(node);
    
    return patharr.slice(0, patharr.length - 1);
  };

  s.getpatharrnode = function (tree, patharr) {
    return patharr.length ?
      s.getpatharrnode(tree.childs[patharr[0]], patharr.slice(1)) : tree;
  };

  // return pnode of given node 
  s.getpnode = function (tree, node) {
    return s.getpatharrnode(tree, s.getpnodepatharr(node));
  };

  // return pnode near given node where fn is true
  s.getpnodenear = function (tree, node, fn) {
    var patharr = s.getpnodepatharr(node);
    
    return (function next (x, pnode) {
      pnode = --x && tree.childs[patharr[x]];
      return pnode && fn(tree, pnode) ? pnode : next(x, tree);
    }(patharr.length));
  };

  s.getdmax = function (tree) {
    var height = 1,
        childs = tree && tree.childs;

    if (childs.length) {
      height += Math.max.apply(s, childs.map(s.getdmax));
    }

    return height;
  };

  s.getdmin = function (tree) {
    var height = 1,
        childs = tree && tree.childs;

    if (childs.length) {
      height += Math.min.apply(s, childs.map(s.getdmax));
    }

    return height;
  };

  s.bftraversed = function (tree, node, depth, fn) {
    var fnode;
    
    if (depth === 1 && fn(tree, node)) {
      fnode = node;
    } else if (depth-- > 1) {      
      node.childs.some(function (n) {
        return fnode = s.bftraversed(tree, n, depth, fn);
      });
    }

    return fnode;
  };

  s.bftraverse = function (node, fn) {
    var height = s.getdmax(node),
        depth = 0,
        fnode = null;

    while (++depth < height) {
      if ((fnode = s.bftraversed(node, node, depth, fn))) {
        return fnode;
      }
    }

    return fnode;
  };

  s.dftraverse = function (tree, fn) {
    (function traverse (node, tree, fn) {
      node.childs.map(function (cnode) {
        traverse(cnode, tree, fn);
      });
      fn(node, tree);
    }(tree, tree, fn));

    return tree;    
  };

  s.getcnodeuid = function (pnode, cnode) {
    return [pnode.uid,pnode.childs.length,cnode.name].join('-');
  };
  
  s.addnode = function (pnode, cnode) {
    cnode.uid = s.getcnodeuid(pnode, cnode);
    pnode.childs.push(cnode);
    return pnode;
  };

  // tradeoff:
  // cloning reduces chance of mutating specobj
  // but reduces discoverability of properties :/
  s.node = function (specobj) {
    var node;
    
    s.isspecvalidorerr(specobj);

    node = Object.create(specobj);
    node.childs = [];
    node.data = {};
    node.name = String(specobj.name);
    node.uid = String(specobj.name);
    node.obj = specobj;

    return node;
  };
  
  return s;
  
}());
