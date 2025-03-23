import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { CodeBlockView } from "./code-block-view"


export interface CodeBlockOptions {
  HTMLAttributes: Record<string, any>
  languageClassPrefix: string
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    codeBlock: {
      setCodeBlock: (attributes?: { language: string }) => ReturnType
      toggleCodeBlock: (attributes?: { language: string }) => ReturnType
    }
  }
}

export const CodeBlockExtension = Node.create<CodeBlockOptions>({
  name: "codeBlock",

  addOptions() {
    return {
      HTMLAttributes: {},
      languageClassPrefix: "language-",
    }
  },

  content: "text*",

  marks: "",

  group: "block",

  code: true,

  defining: true,

  addAttributes() {
    return {
      language: {
        default: "plain",
        parseHTML: (element) => {
          const { languageClassPrefix } = this.options
          const classNames = [...(element.firstElementChild?.classList || [])]
          const languages = classNames
            .filter((className) => className.startsWith(languageClassPrefix))
            .map((className) => className.replace(languageClassPrefix, ""))

          return languages[0] || "plain"
        },
        renderHTML: (attributes) => {
          return {
            class: attributes.language ? this.options.languageClassPrefix + attributes.language : null,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "pre",
        preserveWhitespace: "full",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["pre", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), ["code", {}, 0]]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView)
  },

  addCommands() {
    return {
      setCodeBlock:
        (attributes) =>
        ({ commands }) => {
          return commands.setNode(this.name, attributes)
        },
      toggleCodeBlock:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleNode(this.name, "paragraph", attributes)
        },
    }
  },
})

