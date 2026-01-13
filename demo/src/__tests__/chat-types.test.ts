import {
  addMessageToTree,
  createEmptyTree,
  createPreviewUrl,
  generateId,
  getActivePathMessages,
  getSiblingInfo,
  isBranchPoint,
  isImageFile,
  messagesToTree,
  revokePreviewUrl,
  switchBranch,
  updateNodeContent,
} from '@lukeashford/aurelius'

describe('Chat Types Utilities', () => {
  describe('createEmptyTree', () => {
    it('creates an empty tree with correct structure', () => {
      const tree = createEmptyTree()
      expect(tree.nodes).toEqual({})
      expect(tree.rootIds).toEqual([])
      expect(tree.activeLeafId).toBeNull()
    })
  })

  describe('addMessageToTree', () => {
    it('adds a root message to empty tree', () => {
      const tree = createEmptyTree()
      const newTree = addMessageToTree(
          tree,
          {id: 'msg-1', role: 'user', content: 'Hello', parentId: null},
          null
      )

      expect(newTree.nodes['msg-1']).toBeDefined()
      expect(newTree.nodes['msg-1'].content).toBe('Hello')
      expect(newTree.nodes['msg-1'].role).toBe('user')
      expect(newTree.rootIds).toContain('msg-1')
      expect(newTree.activeLeafId).toBe('msg-1')
    })

    it('adds a child message to existing message', () => {
      let tree = createEmptyTree()
      tree = addMessageToTree(
          tree,
          {id: 'msg-1', role: 'user', content: 'Hello', parentId: null},
          null
      )
      tree = addMessageToTree(
          tree,
          {id: 'msg-2', role: 'assistant', content: 'Hi!', parentId: 'msg-1'},
          'msg-1'
      )

      expect(tree.nodes['msg-2']).toBeDefined()
      expect(tree.nodes['msg-2'].parentId).toBe('msg-1')
      expect(tree.nodes['msg-1'].children).toContain('msg-2')
      expect(tree.activeLeafId).toBe('msg-2')
    })

    it('sets correct branch index for sibling messages', () => {
      let tree = createEmptyTree()
      tree = addMessageToTree(
          tree,
          {id: 'msg-1', role: 'user', content: 'Hello', parentId: null},
          null
      )
      tree = addMessageToTree(
          tree,
          {id: 'msg-2a', role: 'assistant', content: 'Response A', parentId: 'msg-1'},
          'msg-1'
      )

      // Add another sibling
      tree = addMessageToTree(
          tree,
          {id: 'msg-2b', role: 'assistant', content: 'Response B', parentId: 'msg-1'},
          'msg-1'
      )

      expect(tree.nodes['msg-2a'].branchIndex).toBe(0)
      expect(tree.nodes['msg-2b'].branchIndex).toBe(1)
    })

    it('sets createdAt timestamp', () => {
      const tree = createEmptyTree()
      const before = Date.now()
      const newTree = addMessageToTree(
          tree,
          {id: 'msg-1', role: 'user', content: 'Hello', parentId: null},
          null
      )
      const after = Date.now()

      expect(newTree.nodes['msg-1'].createdAt).toBeGreaterThanOrEqual(before)
      expect(newTree.nodes['msg-1'].createdAt).toBeLessThanOrEqual(after)
    })
  })

  describe('getActivePathMessages', () => {
    it('returns empty array for empty tree', () => {
      const tree = createEmptyTree()
      expect(getActivePathMessages(tree)).toEqual([])
    })

    it('returns path from root to active leaf', () => {
      let tree = createEmptyTree()
      tree = addMessageToTree(
          tree,
          {id: 'msg-1', role: 'user', content: 'Hello', parentId: null},
          null
      )
      tree = addMessageToTree(
          tree,
          {id: 'msg-2', role: 'assistant', content: 'Hi!', parentId: 'msg-1'},
          'msg-1'
      )
      tree = addMessageToTree(
          tree,
          {id: 'msg-3', role: 'user', content: 'How are you?', parentId: 'msg-2'},
          'msg-2'
      )

      const path = getActivePathMessages(tree)
      expect(path.length).toBe(3)
      expect(path[0].id).toBe('msg-1')
      expect(path[1].id).toBe('msg-2')
      expect(path[2].id).toBe('msg-3')
    })
  })

  describe('getSiblingInfo', () => {
    it('returns 1/1 for single node', () => {
      let tree = createEmptyTree()
      tree = addMessageToTree(
          tree,
          {id: 'msg-1', role: 'user', content: 'Hello', parentId: null},
          null
      )

      const info = getSiblingInfo(tree, 'msg-1')
      expect(info.total).toBe(1)
      expect(info.current).toBe(1)
    })

    it('returns correct info for siblings', () => {
      let tree = createEmptyTree()
      tree = addMessageToTree(
          tree,
          {id: 'msg-1', role: 'user', content: 'Hello', parentId: null},
          null
      )
      tree = addMessageToTree(
          tree,
          {id: 'msg-2a', role: 'assistant', content: 'Response A', parentId: 'msg-1'},
          'msg-1'
      )
      tree = addMessageToTree(
          tree,
          {id: 'msg-2b', role: 'assistant', content: 'Response B', parentId: 'msg-1'},
          'msg-1'
      )
      tree = addMessageToTree(
          tree,
          {id: 'msg-2c', role: 'assistant', content: 'Response C', parentId: 'msg-1'},
          'msg-1'
      )

      expect(getSiblingInfo(tree, 'msg-2a')).toEqual({total: 3, current: 1})
      expect(getSiblingInfo(tree, 'msg-2b')).toEqual({total: 3, current: 2})
      expect(getSiblingInfo(tree, 'msg-2c')).toEqual({total: 3, current: 3})
    })

    it('returns default for non-existent node', () => {
      const tree = createEmptyTree()
      expect(getSiblingInfo(tree, 'nonexistent')).toEqual({total: 1, current: 1})
    })
  })

  describe('switchBranch', () => {
    it('returns same tree if node not found', () => {
      const tree = createEmptyTree()
      expect(switchBranch(tree, 'nonexistent', 'next')).toBe(tree)
    })

    it('returns same tree if only one sibling', () => {
      let tree = createEmptyTree()
      tree = addMessageToTree(
          tree,
          {id: 'msg-1', role: 'user', content: 'Hello', parentId: null},
          null
      )

      const result = switchBranch(tree, 'msg-1', 'next')
      expect(result).toBe(tree)
    })

    it('switches to next branch', () => {
      let tree = createEmptyTree()
      tree = addMessageToTree(
          tree,
          {id: 'msg-1', role: 'user', content: 'Hello', parentId: null},
          null
      )
      tree = addMessageToTree(
          tree,
          {id: 'msg-2a', role: 'assistant', content: 'Response A', parentId: 'msg-1'},
          'msg-1'
      )
      tree = addMessageToTree(
          tree,
          {id: 'msg-2b', role: 'assistant', content: 'Response B', parentId: 'msg-1'},
          'msg-1'
      )

      // Currently at msg-2b (last added)
      // Switch to next from msg-2a should go to msg-2b
      const newTree = switchBranch(tree, 'msg-2a', 'next')
      expect(newTree.activeLeafId).toBe('msg-2b')
    })

    it('switches to previous branch', () => {
      let tree = createEmptyTree()
      tree = addMessageToTree(
          tree,
          {id: 'msg-1', role: 'user', content: 'Hello', parentId: null},
          null
      )
      tree = addMessageToTree(
          tree,
          {id: 'msg-2a', role: 'assistant', content: 'Response A', parentId: 'msg-1'},
          'msg-1'
      )
      tree = addMessageToTree(
          tree,
          {id: 'msg-2b', role: 'assistant', content: 'Response B', parentId: 'msg-1'},
          'msg-1'
      )

      const newTree = switchBranch(tree, 'msg-2b', 'prev')
      expect(newTree.activeLeafId).toBe('msg-2a')
    })

    it('wraps around when going next from last sibling', () => {
      let tree = createEmptyTree()
      tree = addMessageToTree(
          tree,
          {id: 'msg-1', role: 'user', content: 'Hello', parentId: null},
          null
      )
      tree = addMessageToTree(
          tree,
          {id: 'msg-2a', role: 'assistant', content: 'Response A', parentId: 'msg-1'},
          'msg-1'
      )
      tree = addMessageToTree(
          tree,
          {id: 'msg-2b', role: 'assistant', content: 'Response B', parentId: 'msg-1'},
          'msg-1'
      )

      const newTree = switchBranch(tree, 'msg-2b', 'next')
      expect(newTree.activeLeafId).toBe('msg-2a')
    })
  })

  describe('updateNodeContent', () => {
    it('updates content of existing node', () => {
      let tree = createEmptyTree()
      tree = addMessageToTree(
          tree,
          {id: 'msg-1', role: 'assistant', content: 'Initial', parentId: null},
          null
      )

      const newTree = updateNodeContent(tree, 'msg-1', 'Updated content')
      expect(newTree.nodes['msg-1'].content).toBe('Updated content')
    })

    it('updates isStreaming flag', () => {
      let tree = createEmptyTree()
      tree = addMessageToTree(
          tree,
          {id: 'msg-1', role: 'assistant', content: '', parentId: null, isStreaming: true},
          null
      )

      const newTree = updateNodeContent(tree, 'msg-1', 'Complete', false)
      expect(newTree.nodes['msg-1'].isStreaming).toBe(false)
    })

    it('preserves isStreaming if not specified', () => {
      let tree = createEmptyTree()
      tree = addMessageToTree(
          tree,
          {id: 'msg-1', role: 'assistant', content: '', parentId: null, isStreaming: true},
          null
      )

      const newTree = updateNodeContent(tree, 'msg-1', 'Partial')
      expect(newTree.nodes['msg-1'].isStreaming).toBe(true)
    })

    it('returns same tree if node not found', () => {
      const tree = createEmptyTree()
      const result = updateNodeContent(tree, 'nonexistent', 'content')
      expect(result).toBe(tree)
    })

    it('correctly sets isStreaming to false', () => {
      let tree = createEmptyTree()
      tree = addMessageToTree(
          tree,
          {
            id: 'msg-1',
            role: 'assistant',
            content: 'Streaming...',
            parentId: null,
            isStreaming: true
          },
          null
      )

      // This is the critical case - explicitly setting isStreaming to false
      const newTree = updateNodeContent(tree, 'msg-1', 'Complete message', false)
      expect(newTree.nodes['msg-1'].isStreaming).toBe(false)
      expect(newTree.nodes['msg-1'].content).toBe('Complete message')
    })
  })

  describe('messagesToTree', () => {
    it('converts flat array to tree', () => {
      const messages = [
        {id: 'msg-1', role: 'user' as const, content: 'Hello'},
        {id: 'msg-2', role: 'assistant' as const, content: 'Hi!'},
        {id: 'msg-3', role: 'user' as const, content: 'How are you?'},
      ]

      const tree = messagesToTree(messages)

      expect(Object.keys(tree.nodes).length).toBe(3)
      expect(tree.rootIds).toContain('msg-1')
      expect(tree.nodes['msg-2'].parentId).toBe('msg-1')
      expect(tree.nodes['msg-3'].parentId).toBe('msg-2')
      expect(tree.activeLeafId).toBe('msg-3')
    })

    it('returns empty tree for empty array', () => {
      const tree = messagesToTree([])
      expect(tree.nodes).toEqual({})
      expect(tree.rootIds).toEqual([])
      expect(tree.activeLeafId).toBeNull()
    })

    it('preserves isStreaming flag', () => {
      const messages = [
        {id: 'msg-1', role: 'user' as const, content: 'Hello'},
        {id: 'msg-2', role: 'assistant' as const, content: 'Typing...', isStreaming: true},
      ]

      const tree = messagesToTree(messages)
      expect(tree.nodes['msg-2'].isStreaming).toBe(true)
    })
  })

  describe('isBranchPoint', () => {
    it('returns false for node with no children', () => {
      let tree = createEmptyTree()
      tree = addMessageToTree(
          tree,
          {id: 'msg-1', role: 'user', content: 'Hello', parentId: null},
          null
      )

      expect(isBranchPoint(tree, 'msg-1')).toBe(false)
    })

    it('returns false for node with one child', () => {
      let tree = createEmptyTree()
      tree = addMessageToTree(
          tree,
          {id: 'msg-1', role: 'user', content: 'Hello', parentId: null},
          null
      )
      tree = addMessageToTree(
          tree,
          {id: 'msg-2', role: 'assistant', content: 'Hi!', parentId: 'msg-1'},
          'msg-1'
      )

      expect(isBranchPoint(tree, 'msg-1')).toBe(false)
    })

    it('returns true for node with multiple children', () => {
      let tree = createEmptyTree()
      tree = addMessageToTree(
          tree,
          {id: 'msg-1', role: 'user', content: 'Hello', parentId: null},
          null
      )
      tree = addMessageToTree(
          tree,
          {id: 'msg-2a', role: 'assistant', content: 'Response A', parentId: 'msg-1'},
          'msg-1'
      )
      tree = addMessageToTree(
          tree,
          {id: 'msg-2b', role: 'assistant', content: 'Response B', parentId: 'msg-1'},
          'msg-1'
      )

      expect(isBranchPoint(tree, 'msg-1')).toBe(true)
    })

    it('returns false for non-existent node', () => {
      const tree = createEmptyTree()
      expect(isBranchPoint(tree, 'nonexistent')).toBe(false)
    })
  })

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    it('generates string IDs', () => {
      const id = generateId()
      expect(typeof id).toBe('string')
    })

    it('includes timestamp component', () => {
      const before = Date.now()
      const id = generateId()
      const after = Date.now()

      const timestamp = parseInt(id.split('-')[0], 10)
      expect(timestamp).toBeGreaterThanOrEqual(before)
      expect(timestamp).toBeLessThanOrEqual(after)
    })
  })

  describe('isImageFile', () => {
    it('returns true for image files', () => {
      const imageFile = new File([''], 'test.png', {type: 'image/png'})
      expect(isImageFile(imageFile)).toBe(true)
    })

    it('returns true for jpeg files', () => {
      const jpegFile = new File([''], 'test.jpg', {type: 'image/jpeg'})
      expect(isImageFile(jpegFile)).toBe(true)
    })

    it('returns false for non-image files', () => {
      const textFile = new File([''], 'test.txt', {type: 'text/plain'})
      expect(isImageFile(textFile)).toBe(false)
    })

    it('returns false for pdf files', () => {
      const pdfFile = new File([''], 'test.pdf', {type: 'application/pdf'})
      expect(isImageFile(pdfFile)).toBe(false)
    })
  })

  describe('createPreviewUrl', () => {
    it('creates URL for image files', () => {
      const imageFile = new File(['image data'], 'test.png', {type: 'image/png'})
      const url = createPreviewUrl(imageFile)
      expect(url).toBeDefined()
      expect(url).toContain('blob:')
    })

    it('returns undefined for non-image files', () => {
      const textFile = new File(['text'], 'test.txt', {type: 'text/plain'})
      const url = createPreviewUrl(textFile)
      expect(url).toBeUndefined()
    })
  })

  describe('revokePreviewUrl', () => {
    it('does not throw for undefined url', () => {
      expect(() => revokePreviewUrl(undefined)).not.toThrow()
    })

    it('revokes valid blob URL', () => {
      const imageFile = new File(['image data'], 'test.png', {type: 'image/png'})
      const url = createPreviewUrl(imageFile)
      expect(() => revokePreviewUrl(url)).not.toThrow()
    })
  })
})
