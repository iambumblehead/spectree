// Filename: spectree.js  
// Timestamp: 2015.05.18-21:29:40 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)

var spectree = ((typeof module === 'object') ? module : {}).exports = (function (s) {

  var isword = /^\D/;

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

  s.getnoderelativennpatharr = function (node, path) {
    var cwdpatharr = s.getnodepatharr(node),
        nodenamearr = path.split('/'),
        nodenamearrlen = nodenamearr.length;

    return (function next (pos, cwdpatharr, nodename) {
      if (pos >= nodenamearrlen) return cwdpatharr;

      nodename = nodenamearr[pos];
      
      if (nodename === '..') {
        cwdpatharr.pop();
      } else if (isword.test(nodename)) {
        cwdpatharr.push(nodename);        
      }

      return next(++pos, cwdpatharr);
    }(0, cwdpatharr));
  };

  s.getpnodepatharr = function (node) {
    var patharr = s.getnodepatharr(node);
    
    return patharr.slice(0, patharr.length - 1);
  };

  s.getnamedcnode = function (pnode, name) {
    for (var childs = pnode.childs, x = childs.length; x--;) {
      if (childs[x].name === name) return childs[x];
    }
  };

  s.getnncnode = function (pnode, nn) {
    if (typeof pnode === 'object') {
      return isword.test(nn) ? s.getnamedcnode(pnode, nn) : pnode.childs[nn];
    }
  };

  s.getnnpatharrnode = function (tree, patharr) {
    return patharr.length ?
      s.getnnpatharrnode(s.getnncnode(tree, patharr[0]), patharr.slice(1)) : tree;
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

  // when fn returns true, traverse ends w/ return of truthy node  
  s.bftraverse = function (node, fn) {
    var height = s.getdmax(node),
        depth = 0,
        fnode = null;

    while (depth++ < height) {
      if ((fnode = s.bftraversed(node, node, depth, fn))) {
        return fnode;
      }
    }

    return fnode;
  };

  // when fn returns true, traverse ends w/ return of truthy node
  s.dftraverse = function (tree, fn) {
    return (function traverse (tree, node, fn, fnode) {
      node.childs.some(function (cnode) {
        return fnode = traverse(tree, cnode, fn);
      });
      return fnode || fn(tree, node) && node;
    }(tree, tree, fn));
  };

  s.flatten = function (tree, optfilterfn) {
    var nodearr = [];
    s.dftraverse(tree, function (tree, node) {
      if (typeof optfilterfn === 'function') {
        optfilterfn(tree, node) && nodearr.push(node);
      } else {
        nodearr.push(node);
      }
    });
    return nodearr;
  };

  s.getpathnode = function (tree, cwdnode, path) {
    return s.getnnpatharrnode(tree, s.getnoderelativennpatharr(cwdnode, path));
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
