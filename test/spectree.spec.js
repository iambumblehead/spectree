var spectree = require('../spectree');

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
});
