'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { Input } from './input'

interface AutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  suggestions: string[]
  placeholder?: string
  style?: React.CSSProperties
  onFocus?: () => void
  onEnter?: (value: string) => void
  onSelectionComplete?: (value: string) => void
  disabled?: boolean
}

export function AutocompleteInput({
  value,
  onChange,
  suggestions,
  placeholder,
  style,
  onFocus,
  onEnter,
  onSelectionComplete,
  disabled = false
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter suggestions based on current input value
  useEffect(() => {
    if (!value.trim()) {
      setFilteredSuggestions(suggestions)
    } else {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      )
      // Add "Add new: [input]" option if the exact value doesn't exist
      if (!suggestions.some(s => s.toLowerCase() === value.toLowerCase()) && value.trim()) {
        filtered.push(`Add new: "${value}"`)
      }
      setFilteredSuggestions(filtered)
    }
    setSelectedIndex(-1)
  }, [value, suggestions])

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true)
    if (onFocus) onFocus()
  }

  // Handle input blur
  const handleBlur = () => {
    // Delay closing to allow for click events on dropdown
    setTimeout(() => {
      if (!dropdownRef.current?.contains(document.activeElement)) {
        setIsOpen(false)
      }
    }, 100)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          handleSelectSuggestion(filteredSuggestions[selectedIndex])
        } else {
          // No suggestion selected, trigger search with current value
          if (onEnter) {
            onEnter(value)
          }
          setIsOpen(false)
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: string) => {
    let selectedValue: string
    
    if (suggestion.startsWith('Add new: "')) {
      // Extract the value from "Add new: [value]"
      selectedValue = suggestion.slice(11, -1) // Remove 'Add new: "' and trailing '"'
    } else {
      selectedValue = suggestion
    }
    
    onChange(selectedValue)
    setIsOpen(false)
    inputRef.current?.blur()
    
    // Trigger selection complete callback
    if (onSelectionComplete) {
      onSelectionComplete(selectedValue)
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={style}
        disabled={disabled}
        autoComplete="off"
      />
      
      {isOpen && filteredSuggestions.length > 0 && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: '4px',
            marginTop: '4px',
            zIndex: 1000,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              onClick={() => handleSelectSuggestion(suggestion)}
              style={{
                padding: '12px',
                cursor: 'pointer',
                backgroundColor: index === selectedIndex ? '#3a3a3a' : 'transparent',
                borderBottom: index < filteredSuggestions.length - 1 ? '1px solid #444' : 'none',
                color: suggestion.startsWith('Add new:') ? '#00ffff' : '#fff',
                fontSize: '14px',
                fontWeight: suggestion.startsWith('Add new:') ? '600' : 'normal',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}