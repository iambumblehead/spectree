// Filename: spectree.js  
// Timestamp: 2015.05.02-00:59:36 (last modified)  
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
      throw new Error('specobj must be object');
    }
    
    return true;
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
