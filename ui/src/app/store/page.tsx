'use client';

import { motion } from 'framer-motion';
import {
    ArrowLeft,
    BookOpen,
    Layout,
    MessageSquare,
    ExternalLink,
    ShoppingBag,
    Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
    title: string;
    description: string;
    price: string;
    originalPrice?: string;
    icon: React.ElementType;
    accentColor: string;
    isExternal?: boolean;
    href: string;
    badge?: string;
}

function ProductCard({
    title,
    description,
    price,
    originalPrice,
    icon: Icon,
    accentColor,
    isExternal,
    href,
    badge
}: ProductCardProps) {
    const CardContent = (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative h-full p-6 rounded-2xl border border-gray-700 bg-dark-panel hover:border-opacity-50 transition-all group overflow-hidden"
            style={{ boxShadow: `0 0 0 1px ${accentColor}20` }}
        >
            {/* Glow Effect */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(circle at 50% 0%, ${accentColor}15, transparent 70%)`
                }}
            />

            {/* Badge */}
            {badge && (
                <div
                    className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: accentColor }}
                >
                    {badge}
                </div>
            )}

            {/* Icon */}
            <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${accentColor}20` }}
            >
                <Icon className="w-7 h-7" style={{ color: accentColor }} />
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">{description}</p>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold" style={{ color: accentColor }}>{price}</span>
                {originalPrice && (
                    <span className="text-gray-500 line-through">{originalPrice}</span>
                )}
            </div>

            {/* CTA Button */}
            <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                style={{
                    backgroundColor: accentColor,
                    color: '#0a0a0f'
                }}
            >
                {isExternal ? (
                    <>
                        Buy on Amazon
                        <ExternalLink className="w-4 h-4" />
                    </>
                ) : (
                    <>
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                    </>
                )}
            </motion.button>
        </motion.div>
    );

    if (isExternal) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
                {CardContent}
            </a>
        );
    }

    return <div className="h-full">{CardContent}</div>;
}

export default function StorePage() {
    const products: ProductCardProps[] = [
        {
            title: 'Digital Book Bundle',
            description: 'Complete "Software Architecture 3.0" e-book with bonus chapters, code examples, and architecture diagrams.',
            price: '$39',
            originalPrice: '$49',
            icon: BookOpen,
            accentColor: '#00d4ff',
            href: '#',
            badge: 'POPULAR'
        },
        {
            title: 'Physical Book',
            description: 'Premium hardcover edition with exclusive cover art. Ships worldwide via Amazon.',
            price: '$29.99',
            icon: BookOpen,
            accentColor: '#f59e0b',
            isExternal: true,
            href: 'https://amazon.com'
        },
        {
            title: "Architect's OS (Notion)",
            description: 'Complete Notion workspace template with architecture decision records, system design docs, and project trackers.',
            price: '$29',
            icon: Layout,
            accentColor: '#7c3aed',
            href: '#'
        },
        {
            title: 'Interview Deck',
            description: '150+ system design interview questions with detailed solutions. Ace your next FAANG interview.',
            price: '$19',
            icon: MessageSquare,
            accentColor: '#10b981',
            href: '#'
        }
    ];

    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Background Effects */}
            <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-cyan/5 pointer-events-none" />

            {/* Back Button */}
            <Link
                href="/"
                className="fixed top-6 left-6 p-3 rounded-xl bg-dark-panel border border-gray-700 hover:border-neon-cyan transition-colors z-50"
            >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-panel border border-gray-700 text-sm text-gray-400 mb-6">
                        <Sparkles className="w-4 h-4 text-neon-purple" />
                        The Armory
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
                        Equip Yourself for the
                        <br />
                        <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                            Architect's Journey
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Premium resources to level up your software architecture skills.
                        Books, templates, and interview prep.
                    </p>
                </motion.div>

                {/* Product Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {products.map((product, idx) => (
                        <motion.div
                            key={product.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * idx }}
                        >
                            <ProductCard {...product} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-4 p-6 rounded-2xl bg-dark-panel border border-gray-700">
                        <div className="text-left">
                            <p className="text-gray-400 text-sm">Want all resources?</p>
                            <p className="text-white font-bold">Get PRO Membership - $9.99/mo</p>
                        </div>
                        <Link href="/get-book">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-pink-500 text-white font-bold"
                            >
                                Subscribe
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
