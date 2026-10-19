import React, { useRef, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';

const CodeEditor = ({
    languages = [],
    selectedLanguage,
    onLanguageChange,
    code,
    onCodeChange,
    onReset,
    onRunSample,
    onSubmit,
    runningSample,
    submittingCode,
    isAssessment = false
}) => {
    const textareaRef = useRef(null);

    // Support Tab key indentation in textarea
    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const { selectionStart, selectionEnd, value } = textareaRef.current;
            const updated = value.substring(0, selectionStart) + '    ' + value.substring(selectionEnd);
            onCodeChange(updated);

            // Restore cursor
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.selectionStart = selectionStart + 4;
                    textareaRef.current.selectionEnd = selectionStart + 4;
                }
            }, 0);
        }
    };

    // Calculate line numbers
    const lines = (code || '').split('\n');
    const lineCount = Math.max(lines.length, 18);

    return (
        <div className="coding-editor-wrapper">
            {/* Editor Toolbar */}
            <div className="coding-editor-toolbar">
                <LanguageSelector
                    languages={languages}
                    selectedLanguage={selectedLanguage}
                    onChange={onLanguageChange}
                    disabled={runningSample || submittingCode}
                />

                <div className="coding-editor-toolbar__actions">
                    <button
                        type="button"
                        className="coding-btn coding-btn--ghost"
                        onClick={onReset}
                        disabled={runningSample || submittingCode}
                        title="Reset code to original template"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                            <path d="M8 16H3v5" />
                        </svg>
                        <span>Reset</span>
                    </button>

                    <button
                        type="button"
                        className="coding-btn coding-btn--secondary"
                        onClick={onRunSample}
                        disabled={runningSample || submittingCode}
                    >
                        {runningSample ? (
                            <>
                                <span className="coding-spinner"></span>
                                <span>Running...</span>
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                                <span>Run Sample</span>
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        className="coding-btn coding-btn--primary"
                        onClick={onSubmit}
                        disabled={runningSample || submittingCode}
                    >
                        {submittingCode ? (
                            <>
                                <span className="coding-spinner"></span>
                                <span>Evaluating...</span>
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>{isAssessment ? 'Save & Submit' : 'Submit Code'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Code Input Area */}
            <div className="coding-editor-canvas">
                <div className="coding-editor-linenumbers" aria-hidden="true">
                    {Array.from({ length: lineCount }).map((_, i) => (
                        <div key={i + 1} className="coding-editor-linenumber">
                            {i + 1}
                        </div>
                    ))}
                </div>
                <textarea
                    ref={textareaRef}
                    className="coding-editor-textarea"
                    value={code}
                    onChange={(e) => onCodeChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="// Write your solution here..."
                    spellCheck="false"
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                />
            </div>
        </div>
    );
};

export default CodeEditor;
