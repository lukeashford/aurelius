import {expect, test} from '@playwright/test'

test.describe('Chat Demo', () => {
  test.beforeEach(async ({page}) => {
    // Navigate to the chat demo
    await page.goto('/chat-demo')
    await page.waitForLoadState('networkidle')
    // Wait for the chat interface to be visible
    await expect(page.locator('text=Chat Interface Demo')).toBeVisible()
  })

  test.describe('Initial State', () => {
    test('renders the chat interface', async ({page}) => {
      // Check for the main components
      await expect(page.getByRole('textbox')).toBeVisible()
      await expect(page.getByText('New Chat')).toBeVisible()
    })

    test('shows empty state helper text', async ({page}) => {
      await expect(page.getByText(/Type anything to start/i)).toBeVisible()
    })

    test('shows attachment button', async ({page}) => {
      await expect(page.getByRole('button', {name: /attach file/i})).toBeVisible()
    })

    test('shows send button', async ({page}) => {
      await expect(page.getByRole('button', {name: /send message/i})).toBeVisible()
    })

    test('shows conversation sidebar', async ({page}) => {
      await expect(page.getByText('Interactive Demo')).toBeVisible()
    })
  })

  test.describe('Sending Messages', () => {
    test('can type a message', async ({page}) => {
      const textarea = page.getByRole('textbox')
      await textarea.fill('Hello, this is a test message')
      await expect(textarea).toHaveValue('Hello, this is a test message')
    })

    test('can submit a message with Enter key', async ({page}) => {
      const textarea = page.getByRole('textbox')
      await textarea.fill('Hello world')
      await textarea.press('Enter')

      // Message should appear in the chat
      await expect(page.getByText('Hello world')).toBeVisible()
    })

    test('can submit a message with send button', async ({page}) => {
      const textarea = page.getByRole('textbox')
      await textarea.fill('Test message via button')

      await page.getByRole('button', {name: /send message/i}).click()

      // Message should appear in the chat
      await expect(page.getByText('Test message via button')).toBeVisible()
    })

    test('clears input after sending', async ({page}) => {
      const textarea = page.getByRole('textbox')
      await textarea.fill('Message to send')
      await textarea.press('Enter')

      // Input should be cleared
      await expect(textarea).toHaveValue('')
    })

    test('does not submit empty message', async ({page}) => {
      const textarea = page.getByRole('textbox')
      await textarea.press('Enter')

      // Should still be in empty state
      await expect(page.getByText(/Type anything to start/i)).toBeVisible()
    })
  })

  test.describe('Streaming Response', () => {
    test('shows thinking indicator after sending message', async ({page}) => {
      const textarea = page.getByRole('textbox')
      await textarea.fill('Tell me something')
      await textarea.press('Enter')

      // Should show thinking indicator (role="status")
      await expect(page.getByRole('status')).toBeVisible({timeout: 5000})
    })

    test('shows streaming response from assistant', async ({page}) => {
      const textarea = page.getByRole('textbox')
      await textarea.fill('Hello')
      await textarea.press('Enter')

      // Wait for the response to start streaming
      await expect(page.getByText(/Thanks for your message|production-grade/i).first())
      .toBeVisible({
        timeout: 10000,
      })
    })

    test('disables input during streaming', async ({page}) => {
      const textarea = page.getByRole('textbox')
      await textarea.fill('Hello')
      await textarea.press('Enter')

      // Wait a bit for streaming to start
      await page.waitForTimeout(500)

      // Textarea should be disabled during streaming
      await expect(textarea).toBeDisabled()
    })

    test('re-enables input after streaming completes', async ({page}) => {
      const textarea = page.getByRole('textbox')
      await textarea.fill('Hello')
      await textarea.press('Enter')

      // Wait for streaming to complete (demo responses are relatively short)
      await page.waitForTimeout(5000)

      // Input should be enabled again
      await expect(textarea).toBeEnabled({timeout: 10000})
    })
  })

  test.describe('Stop Button', () => {
    test('shows stop button during streaming', async ({page}) => {
      const textarea = page.getByRole('textbox')
      // Use "slow" to trigger the slow demo response
      await textarea.fill('show me something slow')
      await textarea.press('Enter')

      // Wait for streaming to start
      await page.waitForTimeout(1500)

      // Stop button should be visible
      await expect(page.getByRole('button', {name: /stop generation/i})).toBeVisible({
        timeout: 5000,
      })
    })

    test('can stop streaming with stop button', async ({page}) => {
      const textarea = page.getByRole('textbox')
      await textarea.fill('show me something slow')
      await textarea.press('Enter')

      // Wait for streaming to start
      await page.waitForTimeout(2000)

      // Click stop button
      const stopButton = page.getByRole('button', {name: /stop generation/i})
      await expect(stopButton).toBeVisible({timeout: 5000})
      await stopButton.click()

      // Input should be re-enabled
      await expect(textarea).toBeEnabled({timeout: 5000})
    })

    test('preserves partial response after stopping', async ({page}) => {
      const textarea = page.getByRole('textbox')
      await textarea.fill('show me something slow')
      await textarea.press('Enter')

      // Wait for thinking to finish and streaming to start
      const stopButton = page.getByRole('button', {name: /stop generation/i})
      await expect(stopButton).toBeVisible({timeout: 10000})

      // Wait for some content to appear
      await expect(page.getByText(/deliberately slow/i)).toBeVisible({timeout: 10000})

      // Stop streaming
      await stopButton.click()

      // The content should still be visible
      await expect(page.getByText(/deliberately slow/i)).toBeVisible()
    })

    test('message becomes finished state after stopping', async ({page}) => {
      const textarea = page.getByRole('textbox')
      await textarea.fill('show me something slow')
      await textarea.press('Enter')

      // Wait for streaming to start
      await page.waitForTimeout(2000)

      // Stop streaming
      const stopButton = page.getByRole('button', {name: /stop generation/i})
      await expect(stopButton).toBeVisible({timeout: 5000})
      await stopButton.click()

      // Wait a bit for state to update
      await page.waitForTimeout(500)

      // Stop button should be gone and send button visible
      await expect(stopButton).not.toBeVisible()
      await expect(page.getByRole('button', {name: /send message/i})).toBeVisible()
    })
  })

  test.describe('Conversation Sidebar', () => {
    test('can collapse sidebar', async ({page}) => {
      const collapseButton = page.getByRole('button', {name: /collapse sidebar/i})
      await collapseButton.click()

      // Sidebar content should be hidden
      await expect(page.getByText('Interactive Demo')).not.toBeVisible()
      await expect(page.getByRole('button', {name: /expand sidebar/i})).toBeVisible()
    })

    test('can expand sidebar after collapsing', async ({page}) => {
      // Collapse first
      await page.getByRole('button', {name: /collapse sidebar/i}).click()

      // Then expand
      await page.getByRole('button', {name: /expand sidebar/i}).click()

      // Content should be visible again
      await expect(page.getByText('Interactive Demo')).toBeVisible()
    })

    test('can switch to branching demo', async ({page}) => {
      await page.getByText('Branching Demo').click()

      // Should show pre-populated branching conversation
      await expect(page.getByText('What programming language should I learn first?')).toBeVisible()
    })

    test('can create new chat', async ({page}) => {
      // First send a message to have some content
      const textarea = page.getByRole('textbox')
      await textarea.fill('Hello')
      await textarea.press('Enter')
      await page.waitForTimeout(500)

      // Click New Chat
      await page.getByText('New Chat').click()

      // Should be back to empty state
      await expect(page.getByText(/Type anything to start/i)).toBeVisible()
    })
  })

  test.describe('Branching Demo', () => {
    test.beforeEach(async ({page}) => {
      // Switch to branching demo
      await page.getByText('Branching Demo').click()
      await page.waitForTimeout(500)
    })

    test('shows branch navigator for messages with siblings', async ({page}) => {
      // Should show branch navigation (e.g., 1/2)
      await expect(page.getByText(/1\/2/)).toBeVisible()
    })

    test('can navigate between branches', async ({page}) => {
      // Find and click next branch button
      const nextButton = page.getByRole('button', {name: /next branch/i}).first()
      await nextButton.click()

      // Should now show 2/2
      await expect(page.getByText(/2\/2/)).toBeVisible()

      // Content should change (JavaScript vs Python)
      await expect(page.getByText(/JavaScript/)).toBeVisible()
    })

    test('can navigate back to previous branch', async ({page}) => {
      // Go to next branch first
      await page.getByRole('button', {name: /next branch/i}).first().click()
      await expect(page.getByText(/2\/2/)).toBeVisible()

      // Then go back
      await page.getByRole('button', {name: /previous branch/i}).first().click()
      await expect(page.getByText(/1\/2/)).toBeVisible()
    })
  })

  test.describe('Message Actions', () => {
    test.beforeEach(async ({page}) => {
      // Send a message first to have content
      const textarea = page.getByRole('textbox')
      await textarea.fill('Hello')
      await textarea.press('Enter')

      // Wait for response to complete
      await page.waitForTimeout(5000)
    })

    test('shows copy button on hover', async ({page}) => {
      // Hover over the user message
      await page.getByText('Hello').hover()

      // Copy button should be visible
      await expect(page.getByRole('button', {name: /copy message/i}).first()).toBeVisible()
    })

    test('shows edit button on hover for user messages', async ({page}) => {
      // Hover over the user message
      await page.getByText('Hello').hover()

      // Edit button should be visible
      await expect(page.getByRole('button', {name: /edit message/i})).toBeVisible()
    })

    test('shows retry button on hover for assistant messages', async ({page}) => {
      // Wait for the response
      await expect(page.getByText(/Thanks for your message/i)).toBeVisible({timeout: 10000})

      // Hover over the assistant message
      await page.getByText(/Thanks for your message/i).hover()

      // Retry button should be visible (may need to wait for actions to appear)
      await expect(page.getByRole('button', {name: /regenerate response/i})).toBeVisible({
        timeout: 5000,
      })
    })
  })

  test.describe('Artifacts Panel', () => {
    test('shows artifacts panel when response contains artifacts', async ({page}) => {
      // Send first message, then second to trigger artifact response
      const textarea = page.getByRole('textbox')
      await textarea.fill('First message')
      await textarea.press('Enter')
      await page.waitForTimeout(5000)

      // Send second message to get artifact response
      await textarea.fill('Second message')
      await textarea.press('Enter')

      // Wait for artifact to appear
      await expect(page.getByRole('heading', {name: 'Artifacts'})).toBeVisible({timeout: 15000})
    })

    test('can collapse artifacts panel', async ({page}) => {
      // Trigger artifact by sending two messages
      const textarea = page.getByRole('textbox')
      await textarea.fill('First')
      await textarea.press('Enter')
      await page.waitForTimeout(5000)
      await textarea.fill('Second')
      await textarea.press('Enter')

      // Wait for artifacts panel
      const panelTitle = page.getByRole('heading', {name: 'Artifacts'})
      await expect(panelTitle).toBeVisible({timeout: 15000})

      // Click the Artifacts toggle button in the tool sidebar to collapse the panel
      await page.getByRole('button', {name: 'Artifacts'}).click()

      // Panel title should not be visible
      await expect(panelTitle).not.toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('textarea has proper role', async ({page}) => {
      await expect(page.getByRole('textbox')).toBeVisible()
    })

    test('buttons have proper labels', async ({page}) => {
      await expect(page.getByRole('button', {name: /send message/i})).toBeVisible()
      await expect(page.getByRole('button', {name: /attach file/i})).toBeVisible()
      await expect(page.getByRole('button', {name: /collapse sidebar/i})).toBeVisible()
    })

    test('sidebar has proper navigation structure', async ({page}) => {
      // Sidebar should contain conversation buttons
      const conversations = page.locator('button:has-text("Interactive Demo")')
      await expect(conversations).toBeVisible()
    })

    test('thinking indicator has role="status"', async ({page}) => {
      const textarea = page.getByRole('textbox')
      await textarea.fill('Hello')
      await textarea.press('Enter')

      await expect(page.getByRole('status')).toBeVisible({timeout: 5000})
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('can focus textarea', async ({page}) => {
      const textarea = page.getByRole('textbox')
      await textarea.focus()
      await expect(textarea).toBeFocused()
    })

    test('Enter submits message', async ({page}) => {
      const textarea = page.getByRole('textbox')
      await textarea.fill('Keyboard test')
      await textarea.press('Enter')

      await expect(page.getByText('Keyboard test')).toBeVisible()
    })

    test('Shift+Enter adds new line instead of submitting', async ({page}) => {
      const textarea = page.getByRole('textbox')
      await textarea.fill('Line 1')
      await textarea.press('Shift+Enter')
      await textarea.type('Line 2')

      // Message should not be submitted yet
      await expect(page.getByText(/Type anything to start/i)).toBeVisible()

      // Textarea should contain both lines
      const value = await textarea.inputValue()
      expect(value).toContain('Line 1')
      expect(value).toContain('Line 2')
    })
  })
})
