import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface MarkdownToHtmlProps {
  content: string
}

const MarkdownToHtml: React.FC<MarkdownToHtmlProps> = ({ content }) => (
  <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
    {content}
  </ReactMarkdown>
)

export default MarkdownToHtml