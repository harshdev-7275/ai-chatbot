import React from "react";

export const CustomMarkdownComponents = {
  table: (props: any) => (
    <div className="overflow-x-auto">
      <table
        className="min-w-full border-collapse bg-white dark:bg-gray-800"
        {...props}
      >
        {props.children}
      </table>
    </div>
  ),
  thead: (props: any) => (
    <thead className="bg-[#2F2F2F] text-white">{props.children}</thead>
  ),
  tbody: (props: any) => <tbody>{props.children}</tbody>,
  tr: (props: any) => (
    <tr className="border-b bg-[#2F2F2F] text-white" {...props}>
      {props.children}
    </tr>
  ),
  th: (props: any) => (
    <th
      className="px-4 py-2 text-xs font-medium bg-[#2F2F2F] text-white uppercase tracking-wide"
      {...props}
    >
      {props.children}
    </th>
  ),
  td: (props: any) => (
    <td className="px-4 py-2 text-xs bg-[#2F2F2F] text-white" {...props}>
      {props.children}
    </td>
  ),
  p: (props: any) => (
    <p className="my-1 text-sm leading-snug bg-[#2F2F2F] text-white" {...props}>
      {props.children}
    </p>
  ),
  h1: (props: any) => (
    <h1 className="my-3 text-xl font-bold bg-[#2F2F2F] text-white" {...props}>
      {props.children}
    </h1>
  ),
  h2: (props: any) => (
    <h2
      className="my-2 text-lg font-semibold bg-[#2F2F2F] text-white"
      {...props}
    >
      {props.children}
    </h2>
  ),
};
