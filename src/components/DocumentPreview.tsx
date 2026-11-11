import React, { useState } from 'react';
import { SchoolProfile } from '../types/index.ts';
import { Copy, Check, Printer, Download, Edit3, Eye, FileText } from 'lucide-react';

interface Props {
  content: string;
  profile: SchoolProfile;
  documentTitle: string;
  onUpdateContent?: (newContent: string) => void;
}

export const DocumentPreview: React.FC<Props> = ({
  content,
  profile,
  documentTitle,
  onUpdateContent,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState(content);

  // Sync if content changes from outside
  React.useEffect(() => {
    setEditableText(content);
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMd = () => {
    const blob = new Blob([editableText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentTitle.replace(/\s+/g, '_')}_${profile.subject}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    if (onUpdateContent) {
      onUpdateContent(editableText);
    }
  };

  // Convert basic Markdown to simple formatted HTML
  const renderFormattedMarkdown = (markdown: string) => {
    const lines = markdown.split('\n');
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];
    let isHeaderRow = true;

    const flushTable = (key: number) => {
      if (tableRows.length > 0) {
        elements.push(
          <div key={`table-${key}`} className="overflow-x-auto my-4 border border-slate-300 rounded-lg shadow-xs">
            <table className="min-w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  {tableRows[0]?.map((cell, idx) => (
                    <th key={idx} className="px-3 py-2 font-bold text-slate-800 border-r border-slate-200 last:border-r-0">
                      {cell.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tableRows.slice(1).map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-slate-700 border-r border-slate-200 last:border-r-0">
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Table line
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        // Check if it's separator row |---|---|
        if (/^\|(\s*[-:]+\s*\|)+$/.test(trimmed)) {
          return;
        }
        const cells = trimmed
          .slice(1, -1)
          .split('|')
          .map(c => c.trim());
        tableRows.push(cells);
        return;
      } else if (inTable) {
        flushTable(index);
      }

      // Headers
      if (trimmed.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-xl font-black text-slate-900 border-b-2 border-emerald-600 pb-2 mt-6 mb-4 uppercase tracking-wide">
            {trimmed.replace('# ', '')}
          </h1>
        );
      } else if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-lg font-bold text-emerald-950 mt-5 mb-2 pb-1 border-b border-slate-200">
            {trimmed.replace('## ', '')}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-sm font-bold text-emerald-900 mt-4 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-emerald-600 rounded-xs inline-block"></span>
            {trimmed.replace('### ', '')}
          </h3>
        );
      } else if (trimmed.startsWith('#### ')) {
        elements.push(
          <h4 key={index} className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-3 mb-1">
            {trimmed.replace('#### ', '')}
          </h4>
        );
      } else if (trimmed.startsWith('---')) {
        elements.push(<hr key={index} className="my-4 border-slate-200" />);
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        elements.push(
          <li key={index} className="ml-5 list-disc text-xs text-slate-700 my-0.5 leading-relaxed">
            {trimmed.slice(2)}
          </li>
        );
      } else if (/^\d+\.\s/.test(trimmed)) {
        elements.push(
          <p key={index} className="ml-4 text-xs text-slate-800 my-1 leading-relaxed font-medium">
            {trimmed}
          </p>
        );
      } else if (trimmed === '') {
        elements.push(<div key={index} className="h-2"></div>);
      } else {
        elements.push(
          <p key={index} className="text-xs text-slate-700 leading-relaxed my-1">
            {trimmed}
          </p>
        );
      }
    });

    if (inTable) {
      flushTable(lines.length);
    }

    return elements;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Top Action Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-2 print:hidden">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-800 truncate max-w-xs md:max-w-md">
            {documentTitle}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
            Format Resmi
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 flex items-center gap-1.5 transition"
            title="Edit teks secara langsung"
          >
            {isEditing ? (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lihat Tampilan</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                <span>Edit Teks</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
            title="Salin teks ke clipboard untuk di-paste ke Google Docs / Word"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Tersalin! Siap Paste di Word</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin ke Word / Docs</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-900 text-white flex items-center gap-1.5 shadow-xs transition"
            title="Cetak dokumen atau simpan sebagai file PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>

          <button
            onClick={handleDownloadMd}
            className="p-1.5 text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 rounded-lg transition"
            title="Unduh format Markdown (.md)"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Document Sheet Body */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50/50 print:p-0 print:bg-white">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-md rounded-xl border border-slate-200 font-sans print:shadow-none print:border-none print:p-0">
          {/* Formal School Letterhead (KOP SURAT) */}
          <div className="text-center font-serif text-slate-900 border-b-4 border-double border-slate-900 pb-3 mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
              PEMERINTAH DAERAH PROVINSI / KABUPATEN
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
              DINAS PENDIDIKAN DAN KEBUDAYAAN
            </p>
            <h2 className="text-lg md:text-xl font-black uppercase tracking-wide my-1 text-slate-950">
              {profile.schoolName}
            </h2>
            <p className="text-[11px] text-slate-600 italic">
              NPSN: {profile.npsn || '10293847'} | Alamat: {profile.address}
            </p>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Mode Edit Dokumen (Markdown / Teks Biasa):</span>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-emerald-600 text-white font-semibold rounded text-xs hover:bg-emerald-700"
                >
                  Simpan Perubahan
                </button>
              </div>
              <textarea
                value={editableText}
                onChange={e => setEditableText(e.target.value)}
                rows={24}
                className="w-full p-4 font-mono text-xs text-slate-800 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          ) : (
            <div className="text-slate-800 space-y-3 print:text-black">
              {renderFormattedMarkdown(editableText)}
            </div>
          )}

          {/* Official Signatures Section (Mengetahui Kepala Sekolah & Guru) */}
          <div className="mt-12 pt-6 border-t border-slate-300 text-xs text-slate-800 flex justify-between items-start page-break-inside-avoid">
            <div className="text-center w-64">
              <p>Mengetahui,</p>
              <p className="font-semibold">Kepala {profile.schoolName}</p>
              <div className="h-20 flex items-center justify-center text-slate-300 italic text-[11px]">
                (Tanda Tangan & Cap Sekolah)
              </div>
              <p className="font-bold underline uppercase">{profile.principalName}</p>
              <p className="text-[11px] text-slate-600">NIP. {profile.principalNip}</p>
            </div>

            <div className="text-center w-64">
              <p>Dibuat di: Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="font-semibold">Guru Mata Pelajaran</p>
              <div className="h-20 flex items-center justify-center text-slate-300 italic text-[11px]">
                (Tanda Tangan)
              </div>
              <p className="font-bold underline uppercase">{profile.teacherName}</p>
              <p className="text-[11px] text-slate-600">NIP. {profile.teacherNip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
