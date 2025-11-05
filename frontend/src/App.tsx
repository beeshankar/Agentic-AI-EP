import { useMemo, useState } from 'react'
import './index.css'
import { CodePreview } from './components/CodePreview'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

const FRAMEWORKS = ['LangChain', 'CrewAI', 'Google ADK'] as const
const MODELS = [
	'gemma2-9b-it',
	'llama3-8b-8192',
	'llama3-70b-8192',
	'mixtral-8x7b-32768',
] as const

type Framework = typeof FRAMEWORKS[number]

type Config = {
	framework: Framework
	model: string
	goal: string
	num_agents: number
	tools: string
	memory: string
}

function App() {
	const [config, setConfig] = useState<Config>({
		framework: 'LangChain',
		model: 'llama3-8b-8192',
		goal: '',
		num_agents: 1,
		tools: '',
		memory: '',
	})
	const [code, setCode] = useState<string>('')
	const [explanation, setExplanation] = useState<string>('')
	const [loadingGen, setLoadingGen] = useState(false)
	const [loadingExplain, setLoadingExplain] = useState(false)
	const [activeTab, setActiveTab] = useState<'code' | 'explain'>('code')

	const toolsArray = useMemo(() =>
		config.tools
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean),
	[config.tools]
	)

	async function callGenerate() {
		setLoadingGen(true)
		setExplanation('')
		setActiveTab('code')
		try {
			const res = await fetch('http://localhost:8000/generate_code', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					framework: config.framework,
					model: config.model,
					goal: config.goal,
					num_agents: config.num_agents,
					tools: toolsArray,
					memory: config.memory || null,
				}),
			})
			if (!res.ok) throw new Error(await res.text())
			const data = await res.json()
			setCode(data.code || '')
		} catch (err: any) {
			setCode(`# Error generating code\n${err?.message || String(err)}`)
		} finally {
			setLoadingGen(false)
		}
	}

	async function callExplain() {
		if (!code) return
		setLoadingExplain(true)
		setActiveTab('explain')
		try {
			const res = await fetch('http://localhost:8000/explain', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code }),
			})
			if (!res.ok) throw new Error(await res.text())
			const data = await res.json()
			setExplanation(data.explanation || '')
		} catch (err: any) {
			setExplanation(`Error: ${err?.message || String(err)}`)
		} finally {
			setLoadingExplain(false)
		}
	}

	async function loadExample() {
		try {
			const res = await fetch('http://localhost:8000/examples/langchain')
			const data = await res.json()
			setCode(data.code || '')
			setActiveTab('code')
		} catch {}
	}

	return (
		<div className="min-h-screen w-full bg-gray-50 text-gray-900">
			<header className="border-b bg-white/70 backdrop-blur sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
					<h1 className="text-xl sm:text-2xl font-semibold">Agentic AI Learning Portal</h1>
					<a className="text-sm text-blue-600" href="#" onClick={(e)=>{e.preventDefault();loadExample();}}>Load Example</a>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
				<PanelGroup direction="horizontal" className="rounded-lg border bg-white shadow-sm overflow-hidden">
					<Panel defaultSize={45} minSize={30} className="p-4">
						<h2 className="text-base font-medium mb-4 flex items-center gap-2"><span>Agent Configuration</span></h2>
						<div className="space-y-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<label className="block">
									<span className="block text-sm font-medium mb-1">Framework</span>
									<select
										className="w-full rounded border border-gray-300 bg-white px-3 py-2"
										value={config.framework}
										onChange={(e) => setConfig((c) => ({ ...c, framework: e.target.value as Framework }))}
									>
										{FRAMEWORKS.map((fw) => (
											<option key={fw} value={fw}>{fw}</option>
										))}
									</select>
								</label>
								<label className="block">
									<span className="block text-sm font-medium mb-1">Model</span>
									<select
										className="w-full rounded border border-gray-300 bg-white px-3 py-2"
										value={config.model}
										onChange={(e) => setConfig((c) => ({ ...c, model: e.target.value }))}
									>
										{MODELS.map((m) => (
											<option key={m} value={m}>{m}</option>
										))}
									</select>
								</label>
							</div>

							<label className="block">
								<span className="block text-sm font-medium mb-1">Agent Role / Goal</span>
								<textarea
									className="w-full rounded border border-gray-300 bg-white px-3 py-2 min-h-[100px]"
									placeholder="e.g., Build a research assistant that searches the web and summarizes papers"
									value={config.goal}
									onChange={(e) => setConfig((c) => ({ ...c, goal: e.target.value }))}
								/>
							</label>

							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<label className="block">
									<span className="block text-sm font-medium mb-1"># Agents</span>
									<input
										type="number"
										min={1}
										max={10}
										className="w-full rounded border border-gray-300 bg-white px-3 py-2"
										value={config.num_agents}
										onChange={(e) => setConfig((c) => ({ ...c, num_agents: Number(e.target.value) }))}
									/>
								</label>
								<label className="block sm:col-span-2">
									<span className="block text-sm font-medium mb-1">Tools (comma-separated)</span>
									<input
										type="text"
										className="w-full rounded border border-gray-300 bg-white px-3 py-2"
										placeholder="search, serpapi, wikipedia, file_io"
										value={config.tools}
										onChange={(e) => setConfig((c) => ({ ...c, tools: e.target.value }))}
									/>
								</label>
							</div>

							<label className="block">
								<span className="block text-sm font-medium mb-1">Memory</span>
								<input
									type="text"
									className="w-full rounded border border-gray-300 bg-white px-3 py-2"
									placeholder="e.g., buffer memory, window size 5"
									value={config.memory}
									onChange={(e) => setConfig((c) => ({ ...c, memory: e.target.value }))}
								/>
							</label>

							<div className="flex flex-wrap gap-3 pt-2">
								<button onClick={callGenerate} disabled={loadingGen} className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-60">{loadingGen ? 'Generating…' : 'Generate Code'}</button>
								<button onClick={callExplain} disabled={!code || loadingExplain} className="rounded bg-emerald-600 text-white px-4 py-2 disabled:opacity-60">{loadingExplain ? 'Explaining…' : 'Explain Code'}</button>
								<button onClick={loadExample} className="rounded border border-gray-300 px-4 py-2">Load Example</button>
							</div>
						</div>
					</Panel>

					<PanelResizeHandle className="w-1.5 bg-gray-200 hover:bg-gray-300 transition-colors cursor-col-resize" />

					<Panel defaultSize={55} minSize={30} className="flex flex-col">
						<div className="border-b px-3 pt-3">
							<div className="inline-flex rounded-md bg-gray-100 p-1">
								<button onClick={() => setActiveTab('code')} className={`px-3 py-1.5 text-sm rounded ${activeTab==='code' ? 'bg-white shadow border' : 'text-gray-600'}`}>Generated Code</button>
								<button onClick={() => setActiveTab('explain')} className={`ml-1 px-3 py-1.5 text-sm rounded ${activeTab==='explain' ? 'bg-white shadow border' : 'text-gray-600'}`}>Explanation</button>
							</div>
							<button onClick={() => navigator.clipboard.writeText(activeTab==='code'? code : explanation)} disabled={activeTab==='code'? !code : !explanation} className="float-right mb-2 text-sm text-blue-600 disabled:opacity-60">Copy</button>
						</div>
						<div className="flex-1 overflow-auto p-3 bg-gray-50">
							{activeTab === 'code' ? (
								<CodePreview code={code} />
							) : (
								<div className="rounded border border-gray-200 bg-white p-4 min-h-[200px]">
									{explanation ? (
										<div style={{ whiteSpace: 'pre-wrap' }}>{explanation}</div>
									) : (
										<p className="text-gray-500">Click "Explain Code" to see an explanation.</p>
									)}
								</div>
							)}
						</div>
					</Panel>
				</PanelGroup>
			</main>
		</div>
	)
}

export default App
