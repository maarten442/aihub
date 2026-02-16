'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';

const predefinedTools = [
  'Claude Code',
  'ChatGPT',
  'Copilot',
  'Gemini',
  'Cursor',
  'Midjourney',
];

const categories = [
  { value: 'Productivity', label: 'Productivity' },
  { value: 'Customer Support', label: 'Customer Support' },
  { value: 'Development', label: 'Development' },
  { value: 'Data & Reporting', label: 'Data & Reporting' },
  { value: 'Communication', label: 'Communication' },
  { value: 'Creative Work', label: 'Creative Work' },
  { value: 'Other', label: 'Other' },
];

const complexities = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function SubmitUseCasePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [otherTool, setOtherTool] = useState('');
  const [steps, setSteps] = useState([{ title: '', description: '' }]);

  function toggleTool(tool: string) {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  }

  function addStep() {
    setSteps((prev) => [...prev, { title: '', description: '' }]);
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  function updateStep(index: number, field: 'title' | 'description', value: string) {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, [field]: value } : step))
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const form = new FormData(e.currentTarget);

    // Collect tools
    const tools = [...selectedTools];
    if (otherTool.trim()) {
      tools.push(otherTool.trim());
    }

    // Upload image if present
    let imageUrl: string | undefined;
    if (file) {
      const uploadForm = new FormData();
      uploadForm.append('file', file);
      const uploadRes = await fetch('/api/uploads', { method: 'POST', body: uploadForm });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        setErrors({ image_url: data.error || 'File upload failed' });
        setSubmitting(false);
        return;
      }

      const uploadData = await uploadRes.json();
      imageUrl = uploadData.path;
    }

    const body = {
      title: form.get('title'),
      description: form.get('description'),
      category: form.get('category'),
      complexity: form.get('complexity'),
      tools,
      steps: steps.filter((s) => s.title.trim() || s.description.trim()),
      image_url: imageUrl,
    };

    const res = await fetch('/api/use-cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      if (Array.isArray(data.error)) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of data.error) {
          const path = issue.path?.[0] ?? 'general';
          fieldErrors[path] = issue.message;
        }
        setErrors(fieldErrors);
      } else {
        setErrors({ general: data.error || 'Something went wrong' });
      }
      setSubmitting(false);
      return;
    }

    router.push('/use-cases');
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/use-cases" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Use Cases
        </Link>
        <h1 className="mb-2 text-3xl font-bold text-foreground">Share a Use Case</h1>
        <p className="text-muted-foreground">
          Describe how you used AI to solve a problem or improve a workflow. Your submission will be reviewed by a moderator.
        </p>
      </div>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="title"
              name="title"
              label="Title"
              placeholder="e.g., Automated Weekly Report Generation"
              required
              error={errors.title}
            />
            <Textarea
              id="description"
              name="description"
              label="Description"
              placeholder="Describe how you used AI, what problem it solved, and the results you achieved."
              required
              error={errors.description}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Select
                id="category"
                name="category"
                label="Category"
                options={categories}
                placeholder="Select a category"
                required
                error={errors.category}
              />
              <Select
                id="complexity"
                name="complexity"
                label="Complexity"
                options={complexities}
                placeholder="Select complexity"
                required
                error={errors.complexity}
              />
            </div>

            {/* Tools */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Tools Used</label>
              <div className="flex flex-wrap gap-2">
                {predefinedTools.map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => toggleTool(tool)}
                    className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                      selectedTools.includes(tool)
                        ? 'border-primary-500 bg-primary-100 text-primary-700'
                        : 'border-border text-muted-foreground hover:border-primary-300'
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
              <Input
                id="otherTool"
                placeholder="Other tool (optional)"
                value={otherTool}
                onChange={(e) => setOtherTool(e.target.value)}
              />
              {errors.tools && <p className="text-xs text-red-600">{errors.tools}</p>}
            </div>

            {/* Steps */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">Workflow Steps</label>
              {steps.map((step, i) => (
                <div key={i} className="flex gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">
                    {i + 1}
                  </span>
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Step title"
                      value={step.title}
                      onChange={(e) => updateStep(i, 'title', e.target.value)}
                      required
                    />
                    <Input
                      placeholder="Step description"
                      value={step.description}
                      onChange={(e) => updateStep(i, 'description', e.target.value)}
                      required
                    />
                  </div>
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(i)}
                      className="mt-1 rounded p-1 text-muted-foreground hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button type="button" variant="ghost" size="sm" onClick={addStep}>
                <Plus className="h-4 w-4" /> Add Step
              </Button>
              {errors.steps && <p className="text-xs text-red-600">{errors.steps}</p>}
            </div>

            <FileUpload
              label="Screenshot / Demo (optional)"
              accept="image/*"
              onFileSelect={setFile}
              error={errors.image_url}
            />

            {errors.general && (
              <p className="text-sm text-red-600">{errors.general}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Link href="/use-cases">
                <Button type="button" variant="ghost">Cancel</Button>
              </Link>
              <Button type="submit" disabled={submitting}>
                <Send className="h-4 w-4" />
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
