"use client";

import { useState, useCallback, useEffect } from "react";
import { generatePasswords, PasswordOptions, AVAILABLE_SYMBOLS } from "./lib/generatePassword";

// Icons
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
);

const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
    </svg>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const EmptyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);

export default function Home() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [passwords, setPasswords] = useState<string[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [customLength, setCustomLength] = useState<string>("");
    const [customCount, setCustomCount] = useState<string>("");
    const [lengthMode, setLengthMode] = useState<8 | 16 | "custom">(16);
    const [countMode, setCountMode] = useState<10 | 100 | "custom">(10);

    const [options, setOptions] = useState<PasswordOptions>({
        length: 16,
        count: 10,
        includeNumbers: true,
        includeLowercase: true,
        includeUppercase: true,
        includeSymbols: false,
        selectedSymbols: [...AVAILABLE_SYMBOLS],
        excludeSimilar: false,
        firstCharType: "any",
    });

    useEffect(() => {
        const savedTheme = document.documentElement.getAttribute("data-theme") as "light" | "dark";
        setTheme(savedTheme || "light");
        // Generate passwords on page load
        try {
            const initialPasswords = generatePasswords({
                length: 16,
                count: 10,
                includeNumbers: true,
                includeLowercase: true,
                includeUppercase: true,
                includeSymbols: false,
                selectedSymbols: [...AVAILABLE_SYMBOLS],
                excludeSimilar: false,
                firstCharType: "any",
            });
            setPasswords(initialPasswords);
        } catch (e) {
            console.error(e);
        }
    }, []);

    const toggleTheme = useCallback(() => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    }, [theme]);

    const handleGenerate = useCallback(() => {
        try {
            const newPasswords = generatePasswords(options);
            setPasswords(newPasswords);
            setCopiedIndex(null);
        } catch (error) {
            showToast(error instanceof Error ? error.message : "エラーが発生しました");
        }
    }, [options]);

    const showToast = useCallback((message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 2000);
    }, []);

    const copyToClipboard = useCallback(async (text: string, index: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            showToast("クリップボードにコピーしました");
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch {
            showToast("コピーに失敗しました");
        }
    }, [showToast]);

    const downloadPasswords = useCallback(() => {
        if (passwords.length === 0) return;

        const csvContent = "password\n" + passwords.join("\n");
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        const blob = new Blob([bom, csvContent], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `passwords_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast("CSVダウンロードを開始しました");
    }, [passwords, showToast]);

    const updateOption = <K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) => {
        setOptions(prev => ({ ...prev, [key]: value }));
    };

    const handleLengthChange = (mode: 8 | 16 | "custom") => {
        setLengthMode(mode);
        if (mode !== "custom") {
            updateOption("length", mode);
        }
    };

    const handleCountChange = (mode: 10 | 100 | "custom") => {
        setCountMode(mode);
        if (mode !== "custom") {
            updateOption("count", mode);
        }
    };

    const handleCustomLengthChange = (value: string) => {
        setCustomLength(value);
        const num = parseInt(value);
        if (num >= 2 && num <= 40) {
            updateOption("length", num);
        }
    };

    const handleCustomCountChange = (value: string) => {
        setCustomCount(value);
        const num = parseInt(value);
        if (num >= 1 && num <= 1000) {
            updateOption("count", num);
        }
    };

    const toggleSymbol = (symbol: string) => {
        const current = options.selectedSymbols;
        if (current.includes(symbol)) {
            updateOption("selectedSymbols", current.filter(s => s !== symbol));
        } else {
            updateOption("selectedSymbols", [...current, symbol]);
        }
    };

    const selectAllSymbols = () => {
        updateOption("selectedSymbols", [...AVAILABLE_SYMBOLS]);
    };

    const clearAllSymbols = () => {
        updateOption("selectedSymbols", []);
    };

    return (
        <main className="container">
            <header className="header">
                <h1>🔐 パスワード生成</h1>
                <button className="theme-toggle" onClick={toggleTheme} aria-label="テーマ切替">
                    {theme === "light" ? <MoonIcon /> : <SunIcon />}
                    <span>{theme === "light" ? "ダーク" : "ライト"}</span>
                </button>
            </header>

            {/* Compact Settings Card */}
            <div className="card compact">
                {/* Row 1: Length & Count */}
                <div className="settings-row">
                    <div className="setting-group">
                        <label className="form-label">文字数</label>
                        <div className="preset-buttons">
                            <button
                                className={`preset-btn ${lengthMode === 8 ? "active" : ""}`}
                                onClick={() => handleLengthChange(8)}
                            >8</button>
                            <button
                                className={`preset-btn ${lengthMode === 16 ? "active" : ""}`}
                                onClick={() => handleLengthChange(16)}
                            >16</button>
                            <button
                                className={`preset-btn ${lengthMode === "custom" ? "active" : ""}`}
                                onClick={() => handleLengthChange("custom")}
                            >任意</button>
                            {lengthMode === "custom" && (
                                <input
                                    type="number"
                                    className="input compact-input"
                                    min={2}
                                    max={40}
                                    value={customLength}
                                    placeholder="2-40"
                                    onChange={(e) => handleCustomLengthChange(e.target.value)}
                                />
                            )}
                        </div>
                    </div>

                    <div className="setting-group">
                        <label className="form-label">生成個数</label>
                        <div className="preset-buttons">
                            <button
                                className={`preset-btn ${countMode === 10 ? "active" : ""}`}
                                onClick={() => handleCountChange(10)}
                            >10</button>
                            <button
                                className={`preset-btn ${countMode === 100 ? "active" : ""}`}
                                onClick={() => handleCountChange(100)}
                            >100</button>
                            <button
                                className={`preset-btn ${countMode === "custom" ? "active" : ""}`}
                                onClick={() => handleCountChange("custom")}
                            >任意</button>
                            {countMode === "custom" && (
                                <input
                                    type="number"
                                    className="input compact-input"
                                    min={1}
                                    max={1000}
                                    value={customCount}
                                    placeholder="1-1000"
                                    onChange={(e) => handleCustomCountChange(e.target.value)}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Row 2: Character Types */}
                <div className="settings-row">
                    <div className="setting-group flex-1">
                        <label className="form-label">使用する文字</label>
                        <div className="checkbox-group compact">
                            <label className={`checkbox-label compact ${options.includeNumbers ? "checked" : ""}`}>
                                <input
                                    type="checkbox"
                                    checked={options.includeNumbers}
                                    onChange={(e) => updateOption("includeNumbers", e.target.checked)}
                                />
                                <span className="checkbox-icon"><CheckIcon /></span>
                                数字
                            </label>
                            <label className={`checkbox-label compact ${options.includeLowercase ? "checked" : ""}`}>
                                <input
                                    type="checkbox"
                                    checked={options.includeLowercase}
                                    onChange={(e) => updateOption("includeLowercase", e.target.checked)}
                                />
                                <span className="checkbox-icon"><CheckIcon /></span>
                                小文字
                            </label>
                            <label className={`checkbox-label compact ${options.includeUppercase ? "checked" : ""}`}>
                                <input
                                    type="checkbox"
                                    checked={options.includeUppercase}
                                    onChange={(e) => updateOption("includeUppercase", e.target.checked)}
                                />
                                <span className="checkbox-icon"><CheckIcon /></span>
                                大文字
                            </label>
                            <label className={`checkbox-label compact ${options.includeSymbols ? "checked" : ""}`}>
                                <input
                                    type="checkbox"
                                    checked={options.includeSymbols}
                                    onChange={(e) => updateOption("includeSymbols", e.target.checked)}
                                />
                                <span className="checkbox-icon"><CheckIcon /></span>
                                記号
                            </label>
                        </div>
                    </div>
                </div>

                {/* Symbol Selection (shown only when symbols enabled) */}
                {options.includeSymbols && (
                    <div className="settings-row">
                        <div className="setting-group flex-1">
                            <div className="symbol-header">
                                <label className="form-label">使用する記号</label>
                                <div className="symbol-actions">
                                    <button className="text-btn" onClick={selectAllSymbols}>全選択</button>
                                    <button className="text-btn" onClick={clearAllSymbols}>全解除</button>
                                </div>
                            </div>
                            <div className="symbol-grid">
                                {AVAILABLE_SYMBOLS.map((symbol) => (
                                    <button
                                        key={symbol}
                                        className={`symbol-btn ${options.selectedSymbols.includes(symbol) ? "active" : ""}`}
                                        onClick={() => toggleSymbol(symbol)}
                                    >
                                        {symbol}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Row 3: Options & First Char */}
                <div className="settings-row">
                    <div className="setting-group">
                        <label className={`checkbox-label compact ${options.excludeSimilar ? "checked" : ""}`}>
                            <input
                                type="checkbox"
                                checked={options.excludeSimilar}
                                onChange={(e) => updateOption("excludeSimilar", e.target.checked)}
                            />
                            <span className="checkbox-icon"><CheckIcon /></span>
                            類似文字を除外
                        </label>
                    </div>
                    <div className="setting-group">
                        <label className="form-label inline">頭文字</label>
                        <select
                            className="select compact"
                            value={options.firstCharType}
                            onChange={(e) => updateOption("firstCharType", e.target.value as PasswordOptions["firstCharType"])}
                        >
                            <option value="any">指定なし</option>
                            <option value="uppercase">大文字</option>
                            <option value="lowercase">小文字</option>
                            <option value="number">数字</option>
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={handleGenerate}>
                        <KeyIcon />
                        生成
                    </button>
                </div>
            </div>

            {/* Results Card */}
            <div className="card">
                <div className="result-header">
                    <h2 className="card-title">
                        <KeyIcon />
                        生成結果
                        {passwords.length > 0 && <span className="count-badge">{passwords.length}</span>}
                    </h2>
                    {passwords.length > 0 && (
                        <button className="btn btn-secondary btn-sm" onClick={downloadPasswords}>
                            <DownloadIcon />
                            CSVをダウンロード
                        </button>
                    )}
                </div>

                <div className="password-list">
                    {passwords.length === 0 ? (
                        <div className="empty-state">
                            <EmptyIcon />
                            <p>「生成」をクリックしてください</p>
                        </div>
                    ) : (
                        passwords.map((password, index) => (
                            <div
                                key={index}
                                className={`password-item ${copiedIndex === index ? "copied" : ""}`}
                                onClick={() => copyToClipboard(password, index)}
                            >
                                <span className="password-text">{password}</span>
                                <div className="password-actions">
                                    <button
                                        className={`copy-btn ${copiedIndex === index ? "copied" : ""}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            copyToClipboard(password, index);
                                        }}
                                        aria-label="コピー"
                                    >
                                        {copiedIndex === index ? <CheckIcon /> : <CopyIcon />}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Toast */}
            <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
        </main>
    );
}
