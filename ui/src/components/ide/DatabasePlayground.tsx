'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Play, Trash2, Download, Upload, Table, AlertCircle } from 'lucide-react';

// SQL.js types (loaded dynamically)
interface SqlJsDatabase {
    run: (sql: string) => void;
    exec: (sql: string) => QueryResult[];
    close: () => void;
}

interface QueryResult {
    columns: string[];
    values: (string | number | null)[][];
}

interface SqlJs {
    Database: new (data?: ArrayLike<number>) => SqlJsDatabase;
}

declare global {
    interface Window {
        initSqlJs?: () => Promise<SqlJs>;
    }
}

interface DatabasePlaygroundProps {
    initialSchema?: string;
    initialQuery?: string;
    readOnly?: boolean;
}

// Sample schemas for different mission types
export const SampleSchemas = {
    ecommerce: `
-- E-Commerce Database Schema
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    stock INTEGER DEFAULT 0
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price REAL NOT NULL
);

-- Sample Data
INSERT INTO users (name, email) VALUES 
    ('Alice', 'alice@example.com'),
    ('Bob', 'bob@example.com'),
    ('Charlie', 'charlie@example.com');

INSERT INTO products (name, price, stock) VALUES 
    ('Laptop', 999.99, 10),
    ('Mouse', 29.99, 50),
    ('Keyboard', 79.99, 25),
    ('Monitor', 349.99, 15);

INSERT INTO orders (user_id, total, status) VALUES 
    (1, 1029.98, 'completed'),
    (2, 79.99, 'pending'),
    (1, 349.99, 'shipped');
`,
    blog: `
-- Blog Database Schema
CREATE TABLE authors (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT
);

CREATE TABLE posts (
    id INTEGER PRIMARY KEY,
    author_id INTEGER REFERENCES authors(id),
    title TEXT NOT NULL,
    content TEXT,
    published BOOLEAN DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id INTEGER PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id),
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data
INSERT INTO authors (name, bio) VALUES 
    ('John Doe', 'Senior Software Architect'),
    ('Jane Smith', 'DevOps Engineer');

INSERT INTO posts (author_id, title, content, published) VALUES 
    (1, 'Introduction to Microservices', 'Microservices are...', 1),
    (1, 'Event Sourcing Patterns', 'Event sourcing is...', 1),
    (2, 'Kubernetes Best Practices', 'When deploying to K8s...', 0);

INSERT INTO comments (post_id, author_name, content) VALUES 
    (1, 'Reader1', 'Great article!'),
    (1, 'Reader2', 'Very helpful, thanks!');
`,
};

export function DatabasePlayground({
    initialSchema = SampleSchemas.ecommerce,
    initialQuery = 'SELECT * FROM users;',
    readOnly = false,
}: DatabasePlaygroundProps) {
    const [db, setDb] = useState<SqlJsDatabase | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<QueryResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [schemaLoaded, setSchemaLoaded] = useState(false);

    // Load SQL.js
    useEffect(() => {
        const loadSqlJs = async () => {
            setIsLoading(true);

            try {
                // Load SQL.js script if not present
                if (!window.initSqlJs) {
                    await new Promise<void>((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js';
                        script.onload = () => resolve();
                        script.onerror = () => reject(new Error('Failed to load SQL.js'));
                        document.head.appendChild(script);
                    });
                }

                // Initialize SQL.js
                const SQL = await window.initSqlJs!();
                const database = new SQL.Database();
                setDb(database);

                // Load initial schema
                if (initialSchema) {
                    try {
                        database.run(initialSchema);
                        setSchemaLoaded(true);
                    } catch (err) {
                        setError(`Schema error: ${err}`);
                    }
                }
            } catch (err) {
                setError(`Failed to load SQL.js: ${err}`);
            } finally {
                setIsLoading(false);
            }
        };

        loadSqlJs();

        return () => {
            db?.close();
        };
    }, []);

    const executeQuery = useCallback(() => {
        if (!db || !query.trim()) return;

        setError(null);
        try {
            const result = db.exec(query);
            setResults(result);
            if (result.length === 0) {
                // For non-SELECT queries
                setResults([{ columns: ['Result'], values: [['Query executed successfully']] }]);
            }
        } catch (err) {
            setError(`SQL Error: ${err}`);
            setResults([]);
        }
    }, [db, query]);

    const resetDatabase = useCallback(() => {
        if (!db) return;

        try {
            // Close and recreate database
            db.close();

            const loadNewDb = async () => {
                const SQL = await window.initSqlJs!();
                const newDb = new SQL.Database();
                newDb.run(initialSchema);
                setDb(newDb);
                setResults([]);
                setError(null);
            };

            loadNewDb();
        } catch (err) {
            setError(`Reset error: ${err}`);
        }
    }, [db, initialSchema]);

    return (
        <div className="bg-dark-panel rounded-xl border border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-dark-bg border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-neon-purple" />
                    <span className="text-sm font-medium text-gray-300">SQL Playground</span>
                    {schemaLoaded && (
                        <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                            Schema Loaded
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={resetDatabase}
                        className="p-1.5 rounded hover:bg-gray-700 transition-colors text-gray-400 hover:text-orange-400"
                        title="Reset Database"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Query Input */}
            <div className="p-4 border-b border-gray-800">
                <div className="flex gap-2">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 bg-dark-bg border border-gray-700 rounded-lg p-3 text-sm font-mono text-white resize-none focus:border-neon-cyan focus:outline-none"
                        rows={3}
                        placeholder="Enter SQL query..."
                        readOnly={readOnly}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                e.preventDefault();
                                executeQuery();
                            }
                        }}
                    />
                    <button
                        onClick={executeQuery}
                        disabled={isLoading || !db}
                        className="px-4 py-2 bg-neon-cyan text-dark-bg rounded-lg font-medium text-sm hover:bg-neon-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Play className="w-4 h-4" />
                        Run
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Press Ctrl+Enter to execute query
                </p>
            </div>

            {/* Results */}
            <div className="p-4 max-h-64 overflow-auto">
                {isLoading && (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                        Loading SQL.js...
                    </div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <pre className="text-sm font-mono whitespace-pre-wrap">{error}</pre>
                    </motion.div>
                )}

                {!isLoading && !error && results.length === 0 && (
                    <div className="flex items-center justify-center py-8 text-gray-500 text-sm">
                        <Table className="w-4 h-4 mr-2" />
                        Run a query to see results
                    </div>
                )}

                <AnimatePresence>
                    {results.map((result, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="overflow-x-auto"
                        >
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-dark-bg">
                                        {result.columns.map((col, i) => (
                                            <th
                                                key={i}
                                                className="px-4 py-2 text-left font-medium text-neon-cyan border-b border-gray-700"
                                            >
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.values.map((row, rowIdx) => (
                                        <tr
                                            key={rowIdx}
                                            className="hover:bg-gray-800/50 transition-colors"
                                        >
                                            {row.map((cell, cellIdx) => (
                                                <td
                                                    key={cellIdx}
                                                    className="px-4 py-2 text-gray-300 border-b border-gray-800 font-mono"
                                                >
                                                    {cell === null ? (
                                                        <span className="text-gray-500 italic">NULL</span>
                                                    ) : (
                                                        String(cell)
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="text-xs text-gray-500 mt-2">
                                {result.values.length} row(s) returned
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
