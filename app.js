document.addEventListener("DOMContentLoaded", () => {
    const inputText = document.getElementById("input-text")
    const outputText = document.getElementById("output-text")
    const processBtn = document.getElementById("process-btn")
    const inputLineNumbers = document.getElementById("input-line-numbers")
    const outputLineNumbers = document.getElementById("output-line-numbers")
    const container = document.getElementById("content-container")
    const inputSection = document.getElementById("input-section")
    const outputSection = document.getElementById("output-section")
    const resizeHandle = document.getElementById("resize-handle")
  
    const defaultModuleText = `module EUTRA_COMMON_DEFS {
      const integer MY_CONST := 40;
  }`
  
    function updateLineNumbers(textarea, lineNumbersElement) {
      const lines = textarea.value.split("\n")
      lineNumbersElement.innerHTML = lines.map((_, index) => index + 1).join("<br>")
    }
  
    function adjustTextareaHeights() {
      const textareas = document.querySelectorAll("textarea")
      const availableHeight = window.innerHeight - 200 // Adjust this value as needed
      textareas.forEach((textarea) => {
        textarea.style.height = `${availableHeight}px`
      })
      updateLineNumbers(inputText, inputLineNumbers)
      updateLineNumbers(outputText, outputLineNumbers)
    }
  
    function validateInput() {
      let content = inputText.value.trim()
  
      if (!content.startsWith("module EUTRA_COMMON_DEFS {")) {
        content = defaultModuleText
      } else {
        const moduleContent = content.match(/module EUTRA_COMMON_DEFS \{([\s\S]*?)\}/)
        if (moduleContent && moduleContent[1].trim() === "") {
          alert("The module definition is empty. Please add a statement within the module.")
          content = defaultModuleText
        }
      }
  
      inputText.value = content
      updateLineNumbers(inputText, inputLineNumbers)
    }
  
    // Set initial content
    inputText.value = defaultModuleText
    updateLineNumbers(inputText, inputLineNumbers)
  
    inputText.addEventListener("input", () => {
      updateLineNumbers(inputText, inputLineNumbers)
      validateInput()
    })
  
    outputText.addEventListener("input", () => updateLineNumbers(outputText, outputLineNumbers))
  
    window.addEventListener("resize", adjustTextareaHeights)
    adjustTextareaHeights() // Initial adjustment
  
    // Resizing functionality
    let isResizing = false
    let lastDownX = 0
  
    resizeHandle.addEventListener("mousedown", (e) => {
      isResizing = true
      lastDownX = e.clientX
    })
  
    document.addEventListener("mousemove", (e) => {
      if (!isResizing) return
  
      const offsetRight = container.clientWidth - (e.clientX - container.offsetLeft)
      const containerWidth = container.clientWidth
  
      inputSection.style.width = `${containerWidth - offsetRight}px`
      outputSection.style.width = `${offsetRight}px`
    })
  
    document.addEventListener("mouseup", (e) => {
      isResizing = false
    })
  
    processBtn.addEventListener("click", async () => {
      validateInput() // Ensure input is valid before processing
      const input = inputText.value
      try {
        const response = await fetch("/process", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: input }),
        })
  
        if (response.ok) {
          const result = await response.text() // Handle response as plain text
          outputText.value = result
          updateLineNumbers(outputText, outputLineNumbers)
        } else {
          outputText.value = "Error processing text"
          updateLineNumbers(outputText, outputLineNumbers)
        }
      } catch (error) {
        console.error("Error:", error)
        outputText.value = "Exception Caught - Error processing text"
        updateLineNumbers(outputText, outputLineNumbers)
      }
    })
  })
  
  