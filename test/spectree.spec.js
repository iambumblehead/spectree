var spectree = require('../spectree'),
    compareobj = require('compareobj');

describe("spectree()", function () {
  it("should create a new spectree node", function () {
    var node = spectree({ name : 'canvas' });
    
    expect( node.name ).toBe( 'canvas' );
  });
});

describe("spectree.addnode()", function () {
  it("should add a node to a spectree node", function () {
    var pnode = spectree({ name : 'canvas' }),
        cnode = spectree({ name : 'nav' });

    pnode = spectree.addnode(pnode, cnode);
    
    expect( pnode.childs[0].name ).toBe( 'nav' );
    expect( pnode.childs[0].uid ).toBe( 'canvas-0-nav' );    
  });

  it("should add a node to a spectree node to build a tree", function () {
    var rnode = spectree({ name : 'canvas' }),
        cnode = spectree({ name : 'nav' }),
        lnode = spectree({ name : 'links' }),
        inode = spectree({ name : 'img' });    

    rnode = spectree.addnode(rnode, cnode);
    cnode = spectree.addnode(cnode, lnode);
    lnode = spectree.addnode(lnode, inode);

    var resultexpected = {
      name: 'canvas',
      uid: 'canvas',
      childs: [{
        name: 'nav',
        uid: 'canvas-0-nav',
        childs: [{
          name: 'links',
          uid: 'canvas-0-nav-0-links',
          childs: [{
          name: 'img',
            uid: 'canvas-0-nav-0-links-0-img'
          }]
        }]
      }]
    };

    expect(compareobj.isSameMembersDefinedSame(resultexpected, rnode)).toBe(true);    
  });  
});

describe("spectree.getpnodenear()", function () {
  it("should return the nearest matching node", function () {
    var rnode = spectree({ name : 'canvas' }),
        cnode = spectree({ name : 'nav' }),
        lnode = spectree({ name : 'links' }),
        inode = spectree({ name : 'img' });    

    rnode = spectree.addnode(rnode, cnode);
    cnode = spectree.addnode(cnode, lnode);
    lnode = spectree.addnode(lnode, inode);
    
    var nnode = spectree.getpnodenear(rnode, inode, function (tree, pnode) {
      return pnode.name === 'nav';
    });

    expect(nnode.uid).toBe(cnode.uid);
  });  
});

describe("spectree.getdmax()", function () {
  it("should return max depth at node", function () {
    var tree = {
      name: 'canvas',
      uid: 'canvas',

      childs: [{
        name: 'nav',
        uid: 'canvas-0-nav',
        childs: [{
          name: 'links',
          uid: 'canvas-0-nav-0-links',
          childs: [{
            name: 'img',
            uid: 'canvas-0-nav-0-links-0-img',
            childs: []
          }]
        }]
      }]
    };

    expect( spectree.getdmax(tree) ).toBe(4);

  });
});


describe("spectree.bftraversed()", function () {
  it("should return cnode that passes function", function () {
    
    var tree = {
      name: 'canvas',
      uid: 'canvas',
      childs: [{
        name: 'nav',
        uid: 'canvas-0-nav',
        childs: [{
          name: 'links',
          uid: 'canvas-0-nav-0-links',
          childs: [{
            name: 'img',
            uid: 'canvas-0-nav-0-links-0-img',
            childs: []
          },{
            name: 'thumb',
            uid: 'canvas-0-nav-0-links-0-thumb',
            childs: []
          }]
        }]
      }]
    };

    var fnode = spectree.bftraversed(tree, tree, 4, function (tree, node) {
      return node.name === 'img';
    });

    expect( fnode.name ).toBe( 'img' );
  });
});

describe("spectree.dftraverse()", function () {
  it("should return cnode that passes function", function () {
    
    var tree = {
      name: 'canvas',
      uid: 'canvas',
      childs: [{
        name: 'nav',
        uid: 'canvas-0-nav',
        childs: [{
          name: 'links',
          uid: 'canvas-0-nav-0-links',
          childs: [{
            name: 'img',
            uid: 'canvas-0-nav-0-links-0-img',
            childs: []
          },{
            name: 'thumb',
            uid: 'canvas-0-nav-0-links-0-thumb',
            childs: []
          }]
        }]
      }]
    };

    var fnode = spectree.dftraverse(tree, function (tree, node) {
      return node.name === 'thumb';
    });

    expect( fnode.name ).toBe( 'thumb' );
  });
});

describe("spectree.cnodenear()", function () {
  it("should return cnode that passes function", function () {
    
    var tree = {
      name: 'canvas',
      uid: 'canvas',
      childs: [{
        name: 'nav',
        uid: 'canvas-0-nav',
        childs: [{
          name: 'links',
          uid: 'canvas-0-nav-0-links',
          childs: [{
            name: 'img',
            uid: 'canvas-0-nav-0-links-0-img',
            childs: []
          },{
            name: 'thumb',
            uid: 'canvas-0-nav-0-links-0-thumb',
            childs: []
          }]
        }]
      }]
    };

    var fnode = spectree.bftraverse(tree, function (tree, node) {
      return node.name === 'links';
    });

    expect( fnode.name ).toBe( 'links' );
  });
});

describe("spectree.getpathnode", function () {
  it("should return the node at the path", function () {
    
    var tree = {
      name: 'canvas',
      uid: 'canvas',
      childs: [{
        name: 'nav',
        uid: 'canvas-0-nav',
        childs: [{
          name: 'links',
          uid: 'canvas-0-nav-0-links',
          childs: [{
            name: 'img',
            uid: 'canvas-0-nav-0-links-0-img',
            childs: []
          },{
            name: 'thumb',
            uid: 'canvas-0-nav-0-links-0-thumb',
            childs: []
          }]
        }]
      }]
    };

    var cwd_node = tree.childs[0].childs[0].childs[1]; // 'thumb'
    var img_node = spectree.getpathnode(tree, cwd_node, '../img');

    expect( img_node.name ).toBe( 'img' );
  });
});
