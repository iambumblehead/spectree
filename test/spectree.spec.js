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
