"use client"

import { NodeViewContent, type NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import { useState, useEffect, useRef } from "react"
import { Check, Clipboard, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const languages = [
  { name: "Plain Text", value: "plain" },
  { name: "TypeScript", value: "typescript" },
  { name: "Python", value: "python" },
  { name: "Rust", value: "rust" },
  { name: "Go", value: "go" },
  { name: "SQL", value: "sql" },
]

export function CodeBlockView({ node, updateAttributes, extension, getPos, editor }: NodeViewProps) {
  const [copied, setCopied] = useState(false)
  const [language, setLanguage] = useState(node.attrs.language || "plain")
  const codeBlockRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    updateAttributes({ language })
  }, [language, updateAttributes])

  const copyToClipboard = () => {
    if (!codeBlockRef.current) return

    const content = codeBlockRef.current.textContent || ""
    navigator.clipboard.writeText(content)

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <NodeViewWrapper className="relative my-4 rounded-md overflow-hidden">
      <div className="flex items-center justify-between bg-muted px-4 py-2 text-sm">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
              {languages.find((lang) => lang.value === language)?.name || "Plain Text"}
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.value}
                onClick={() => setLanguage(lang.value)}
                className={cn("text-xs", language === lang.value && "font-medium")}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={copyToClipboard}>
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Clipboard className="h-3.5 w-3.5 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>

      <pre ref={codeBlockRef} className={cn("p-4 overflow-x-auto text-sm font-mono", `language-${language}`)}>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  )
}

