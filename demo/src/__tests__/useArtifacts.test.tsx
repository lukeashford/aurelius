import {act, renderHook} from '@testing-library/react'
import {useArtifacts} from '@lukeashford/aurelius'

describe('useArtifacts', () => {
  it('initializes with empty artifacts array', () => {
    const {result} = renderHook(() => useArtifacts())
    expect(result.current.artifacts).toEqual([])
  })

  it('scheduleArtifact adds artifact with isPending=true', () => {
    const {result} = renderHook(() => useArtifacts())

    act(() => {
      result.current.scheduleArtifact({id: 'art-1', type: 'IMAGE'})
    })

    expect(result.current.artifacts).toHaveLength(1)
    expect(result.current.artifacts[0]).toEqual({
      id: 'art-1',
      type: 'IMAGE',
      isPending: true,
    })
  })

  it('showArtifact updates existing artifact and sets isPending=false', () => {
    const {result} = renderHook(() => useArtifacts())

    act(() => {
      result.current.scheduleArtifact({id: 'art-1', type: 'IMAGE'})
    })

    act(() => {
      result.current.showArtifact('art-1', {
        type: 'IMAGE',
        url: 'https://example.com/image.jpg',
        title: 'Test Image',
      })
    })

    expect(result.current.artifacts).toHaveLength(1)
    expect(result.current.artifacts[0]).toEqual({
      id: 'art-1',
      type: 'IMAGE',
      url: 'https://example.com/image.jpg',
      title: 'Test Image',
      isPending: false,
    })
  })

  it('showArtifact adds new artifact if id does not exist', () => {
    const {result} = renderHook(() => useArtifacts())

    act(() => {
      result.current.showArtifact('art-1', {
        type: 'IMAGE',
        url: 'https://example.com/image.jpg',
        title: 'New Image',
      })
    })

    expect(result.current.artifacts).toHaveLength(1)
    expect(result.current.artifacts[0]).toEqual({
      id: 'art-1',
      type: 'IMAGE',
      url: 'https://example.com/image.jpg',
      title: 'New Image',
      isPending: false,
    })
  })

  it('removeArtifact removes artifact by id', () => {
    const {result} = renderHook(() => useArtifacts())

    act(() => {
      result.current.scheduleArtifact({id: 'art-1', type: 'IMAGE'})
      result.current.scheduleArtifact({id: 'art-2', type: 'TEXT'})
    })

    expect(result.current.artifacts).toHaveLength(2)

    act(() => {
      result.current.removeArtifact('art-1')
    })

    expect(result.current.artifacts).toHaveLength(1)
    expect(result.current.artifacts[0].id).toBe('art-2')
  })

  it('clearArtifacts removes all artifacts', () => {
    const {result} = renderHook(() => useArtifacts())

    act(() => {
      result.current.scheduleArtifact({id: 'art-1', type: 'IMAGE'})
      result.current.scheduleArtifact({id: 'art-2', type: 'TEXT'})
      result.current.scheduleArtifact({id: 'art-3', type: 'VIDEO'})
    })

    expect(result.current.artifacts).toHaveLength(3)

    act(() => {
      result.current.clearArtifacts()
    })

    expect(result.current.artifacts).toEqual([])
  })

  it('maintains stable function references', () => {
    const {result, rerender} = renderHook(() => useArtifacts())

    const firstSchedule = result.current.scheduleArtifact
    const firstShow = result.current.showArtifact
    const firstRemove = result.current.removeArtifact
    const firstClear = result.current.clearArtifacts

    rerender()

    expect(result.current.scheduleArtifact).toBe(firstSchedule)
    expect(result.current.showArtifact).toBe(firstShow)
    expect(result.current.removeArtifact).toBe(firstRemove)
    expect(result.current.clearArtifacts).toBe(firstClear)
  })

  it('supports full artifact lifecycle (schedule -> show -> remove)', () => {
    const {result} = renderHook(() => useArtifacts())

    // 1. Schedule artifact (shows skeleton)
    act(() => {
      result.current.scheduleArtifact({id: 'op-123', type: 'IMAGE'})
    })
    expect(result.current.artifacts[0].isPending).toBe(true)

    // 2. Show artifact (reveals content)
    act(() => {
      result.current.showArtifact('op-123', {
        type: 'IMAGE',
        url: 'https://example.com/result.png',
        title: 'Generated Image',
        subtitle: 'AI-generated artwork',
      })
    })
    expect(result.current.artifacts[0].isPending).toBe(false)
    expect(result.current.artifacts[0].url).toBe('https://example.com/result.png')

    // 3. Clear all
    act(() => {
      result.current.clearArtifacts()
    })
    expect(result.current.artifacts).toEqual([])
  })

  it('handles failure case (schedule -> remove without show)', () => {
    const {result} = renderHook(() => useArtifacts())

    // Schedule artifact
    act(() => {
      result.current.scheduleArtifact({id: 'failed-op', type: 'IMAGE'})
    })
    expect(result.current.artifacts).toHaveLength(1)

    // Operation failed - remove without showing
    act(() => {
      result.current.removeArtifact('failed-op')
    })
    expect(result.current.artifacts).toHaveLength(0)
  })
})
