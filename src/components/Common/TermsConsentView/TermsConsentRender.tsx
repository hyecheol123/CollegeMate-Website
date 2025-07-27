/**
 *
 * @author Joomyoung Park <joommm516@gmail.com>
 */

import React from 'react';
import { Box } from '@mui/material';
import { TncH2, TncH3, TncBody, TncList, TncH4 } from './TermsCosnentStyle';

/**
 * TermsConsentRenderer - Renders markdown-style terms & conditions with styled components.
 * @param {object} props - Component props object
 * @param {string} props.content - Markdown-style string (##, ###, -, etc.)
 * @returns {React.ReactElement[]} Rendered styled terms elements
 */
export function TermsConsentRenderer({
  content,
}: {
  content: string;
}): React.ReactElement[] {
  const lines = content.split('\n');
  const rendered: React.ReactElement[] = [];
  let listBuffer: string[] = [];

  const flushList = (): void => {
    if (listBuffer.length > 0) {
      rendered.push(
        <TncList key={`ul-${rendered.length}`}>
          {listBuffer.map((item, i) => (
            <li key={i}>
              <TncBody>{item}</TncBody>
            </li>
          ))}
        </TncList>,
      );
      listBuffer = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed === '') {
      flushList();
      rendered.push(<Box key={`space-${idx}`} height={12} />);
    } else if (trimmed.startsWith('## ')) {
      flushList();
      rendered.push(<TncH2 key={idx}>{trimmed.slice(3)}</TncH2>);
    } else if (trimmed.startsWith('### ')) {
      flushList();
      rendered.push(<TncH3 key={idx}>{trimmed.slice(4)}</TncH3>);
    } else if (trimmed.startsWith('#### ')) {
      flushList();
      rendered.push(<TncH4 key={idx}>{trimmed.slice(4)}</TncH4>);
    } else if (/^[-*+]\s+/.test(trimmed)) {
      listBuffer.push(trimmed.replace(/^[-*+]\s+/, ''));
    } else {
      flushList();
      rendered.push(<TncBody key={idx}>{trimmed}</TncBody>);
    }
  });

  flushList();
  return rendered;
}
