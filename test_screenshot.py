from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # Capture console errors
    page.on('console', lambda msg: print(f"CONSOLE: {msg.type}: {msg.text}"))
    page.on('pageerror', lambda err: print(f"PAGE ERROR: {err}"))
    
    print("Navigating to index.html...")
    page.goto('file:///c:/Users/lenovo/.gemini/antigravity/scratch/aura-website/index.html', wait_until='networkidle')
    
    print("Waiting 3 seconds for animations...")
    page.wait_for_timeout(3000)
    
    print("Taking screenshot...")
    # Use the artifacts directory
    page.screenshot(path='c:/Users/lenovo/.gemini/antigravity/brain/5c9efcc2-b6ab-4460-9a05-712ac7e8776e/artifacts/debug_index.png', full_page=True)
    
    browser.close()
    print("Done")
