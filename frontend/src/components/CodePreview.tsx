import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export function CodePreview({ code }: { code: string }) {
	return (
		<div className="rounded border border-gray-200 bg-white overflow-hidden">
			<SyntaxHighlighter language="python" style={oneDark} customStyle={{ margin: 0, padding: '16px' }}>
				{code || '# Code will appear here'}
			</SyntaxHighlighter>
		</div>
	)
}
