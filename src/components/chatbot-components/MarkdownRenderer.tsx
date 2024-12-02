"use client";
// @ts-nocheck

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';




export default function MarkdownRenderer({ content, className, inline }: any) {
  return (
    <div className={cn("prose prose-sm max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match[1]}
                PreTag="div"
                className="rounded-md !bg-muted/50"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={cn("bg-muted/50 rounded-md px-1", className)} {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4 border border-muted rounded-lg">
                <table className="min-w-full divide-y divide-muted">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return (
              <thead className="bg-muted">
                {children}
              </thead>
            );
          },
          tbody({ children }) {
            return (
              <tbody className="divide-y divide-muted bg-background">
                {children}
              </tbody>
            );
          },
          tr({ children, isHeader }: any) {
            return (
              <tr className={cn(
                "transition-colors",
                !isHeader && "hover:bg-muted/50"
              )}>
                {children}
              </tr>
            );
          },
          th({ children }) {
            return (
              <th className="px-4 py-3 text-left text-sm font-semibold">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="px-4 py-3 text-sm">
                {children}
              </td>
            );
          },
          a({ children, href }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark underline"
              >
                {children}
              </a>
            );
          },
          p({ children }) {
            return (
              <p className="mb-4 last:mb-0 leading-relaxed">
                {children}
              </p>
            );
          },
          ul({ children }) {
            return (
              <ul className="list-disc pl-6 mb-4 last:mb-0 space-y-2">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="list-decimal pl-6 mb-4 last:mb-0 space-y-2">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return (
              <li className="leading-relaxed">
                {children}
              </li>
            );
          },
          h1({ children }) {
            return (
              <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-xl font-bold mb-3 mt-5 first:mt-0">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-lg font-bold mb-2 mt-4 first:mt-0">
                {children}
              </h3>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-muted pl-4 italic my-4">
                {children}
              </blockquote>
            );
          },
          hr() {
            return <hr className="my-6 border-muted" />;
          },
          img({ src, alt }) {
            return (
              <img
                src={src}
                alt={alt}
                className="rounded-lg max-w-full h-auto my-4"
              />
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}