// Filename: spectree.js  
// Timestamp: 2015.05.07-23:54:14 (last modified)  
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

  s.dftraverse = function (tree, fn) {
    (function traverse (node, tree, fn) {
      node.childs.map(function (cnode) {
        traverse(cnode, tree, fn);
      });
      fn(node, tree);
    }(tree, tree, fn));

    return tree;    
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

  s.getcnodeuid = function (pnode, cnode) {
    return ':specpuid-:specci-:speccname'
      .replace(/:specpuid/, pnode.uid)
      .replace(/:speccname/, cnode.name)
      .replace(/:specci/, pnode.childs.length);
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
