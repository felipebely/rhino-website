// src/pages/AdminOrders/index.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { getBatchStatus, formatDateBR, formatToSQLDate } from "../../utils/dateLogic";

type OrderItem = {
    id: string;
    quantity: number;
    product_id: string;
    products: {
        name: string;
    } | null;
};

type OrderLog = {
    id: string;
    old_status: string | null;
    new_status: string;
    changed_by: string;
    created_at: string;
};

type Order = {
    id: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string | null;
    contact_channel: string;
    status: string;
    payment_method: string;
    total_amount: number;
    delivery_date: string;
    order_items: OrderItem[];
};

export function AdminOrders() {
    const { nextDeliveryDate } = getBatchStatus();
    const defaultDeliverySQL = formatToSQLDate(nextDeliveryDate);

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [batches, setBatches] = useState<string[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<string>(defaultDeliverySQL);

    // Audit logs state
    const [viewingLogsFor, setViewingLogsFor] = useState<string | null>(null);
    const [orderLogs, setOrderLogs] = useState<OrderLog[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    // Initial load: Fetch all unique batches
    useEffect(() => {
        async function fetchBatches() {
            const { data, error } = await supabase
                .from("orders")
                .select("delivery_date");

            if (!error && data) {
                const uniqueDates = Array.from(new Set(data.map(d => d.delivery_date)));
                if (!uniqueDates.includes(defaultDeliverySQL)) {
                    uniqueDates.push(defaultDeliverySQL);
                }
                uniqueDates.sort().reverse();
                setBatches(uniqueDates);
            }
        }
        fetchBatches();
    }, [defaultDeliverySQL]);

    // Fetch orders whenever the selected batch changes
    useEffect(() => {
        async function fetchOrders() {
            setLoading(true);
            const { data, error } = await supabase
                .from("orders")
                .select(`
                    id, customer_name, customer_phone, customer_email, contact_channel, status, payment_method, total_amount, delivery_date,
                    order_items (
                        id, quantity, product_id,
                        products (name)
                    )
                `)
                .eq("delivery_date", selectedBatch);

            if (error) {
                console.error("Error fetching admin orders:", error);
            } else {
                setOrders(data as unknown as Order[]);
            }
            setLoading(false);
        }

        fetchOrders();
    }, [selectedBatch]);

    // Update Status Handler
    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        try {
            const { error } = await supabase
                .from("orders")
                .update({ status: newStatus })
                .eq("id", orderId);

            if (error) throw error;
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Erro ao atualizar o status do pedido.");
            // Revert on failure
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: o.status } : o));
        }
    };

    // View Logs Handler
    const handleViewLogs = async (orderId: string) => {
        setViewingLogsFor(orderId);
        setLoadingLogs(true);
        const { data, error } = await supabase
            .from("order_logs")
            .select("*")
            .eq("order_id", orderId)
            .order("created_at", { ascending: false });

        if (!error && data) {
            setOrderLogs(data as OrderLog[]);
        }
        setLoadingLogs(false);
    };

    // Aggregate totals for bakers
    const aggregatedTotals = orders.reduce((acc, order) => {
        order.order_items.forEach((item) => {
            const productName = item.products?.name || "Produto Removido";
            if (!acc[productName]) {
                acc[productName] = 0;
            }
            acc[productName] += item.quantity;
        });
        return acc;
    }, {} as Record<string, number>);

    const handleCopySummary = async () => {
        const displayDate = formatDateBR(new Date(selectedBatch + "T00:00:00"));
        let summaryText = `*Resumo de Produção Rhino*\n*Lote:* ${displayDate}\n\n`;
        summaryText += `*Total a Produzir:*\n`;

        Object.entries(aggregatedTotals).forEach(([productName, qty]) => {
            summaryText += `- ${qty}x ${productName}\n`;
        });

        summaryText += `\n*Total de Pedidos:* ${orders.length}`;

        try {
            await navigator.clipboard.writeText(summaryText);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            console.error("Failed to copy:", err);
            alert("Não foi possível copiar o texto.");
        }
    };

    const statusOptions = ['Pendente', 'Entregue', 'Cancelada', 'Não Recolhido(a)'];

    return (
        <main className="bg-white min-h-screen pb-24 font-work-sans">
            <div className="bg-black text-white text-center py-4 px-4">
                <h1 className="text-xl font-bold uppercase tracking-widest">Painel Administrativo</h1>
            </div>

            <section className="px-4 md:px-8 py-10 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b pb-6 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'DM Serif Text', serif" }}>
                            Gestão de Lotes
                        </h2>
                        <div className="flex items-center gap-3">
                            <label className="font-bold">Selecionar Lote:</label>
                            <select
                                value={selectedBatch}
                                onChange={(e) => setSelectedBatch(e.target.value)}
                                className="border border-gray-300 p-2 focus:outline-none focus:border-black font-mono text-sm"
                            >
                                {batches.map(date => (
                                    <option key={date} value={date}>
                                        {formatDateBR(new Date(date + "T00:00:00"))} {date === defaultDeliverySQL ? "(Atual)" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleCopySummary}
                        className={`px-6 py-3 font-bold uppercase tracking-wider transition-colors ${copied ? "bg-green-600 text-white" : "bg-black text-white hover:bg-gray-800"}`}
                    >
                        {copied ? "✓ Copiado!" : "Copiar Resumo p/ WhatsApp"}
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20">Carregando pedidos...</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Aggregated Totals for Bakers */}
                        <div className="lg:col-span-1 bg-gray-50 border p-6 self-start sticky top-32">
                            <h3 className="text-xl font-bold mb-6 border-b pb-2">Resumo de Produção</h3>
                            {Object.keys(aggregatedTotals).length === 0 ? (
                                <p className="text-gray-500 italic">Nenhum pedido para este lote ainda.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {Object.entries(aggregatedTotals).map(([name, qty]) => (
                                        <li key={name} className="flex justify-between items-center text-lg">
                                            <span>{name}</span>
                                            <span className="font-bold">{qty}x</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Right Column: Individual Orders List */}
                        <div className="lg:col-span-2">
                            <h3 className="text-xl font-bold mb-6">Pedidos Individuais ({orders.length})</h3>

                            {orders.length === 0 ? (
                                <div className="border p-8 text-center text-gray-500 rounded bg-gray-50">
                                    Nenhum pedido encontrado para este lote.
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <div key={order.id} className="border p-6 shadow-sm hover:shadow-md transition bg-white">
                                            <div className="flex justify-between items-start mb-4 border-b pb-4 gap-4">
                                                <div>
                                                    <p className="font-bold text-lg">{order.customer_name}</p>
                                                    <p className="text-gray-600 text-sm">📲 {order.customer_phone}</p>
                                                    {order.customer_email && (
                                                        <p className="text-gray-600 text-sm">✉️ {order.customer_email}</p>
                                                    )}
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Canal Preferido: <b>{order.contact_channel || "WhatsApp"}</b>
                                                    </p>
                                                    <p className="font-mono text-xs text-gray-400 mt-2">ID: {order.id}</p>
                                                </div>
                                                <div className="text-right flex flex-col items-end">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        className={`border p-1 text-sm font-bold uppercase rounded mb-2 w-full max-w-[160px] focus:outline-none ${order.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                                order.status === 'Entregue' ? 'bg-green-100 text-green-800 border-green-200' :
                                                                    'bg-red-100 text-red-800 border-red-200'
                                                            }`}
                                                    >
                                                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                    <p className="text-sm font-bold mt-1">R$ {order.total_amount.toFixed(2).replace('.', ',')}</p>
                                                    <p className="text-xs text-gray-500">{order.payment_method}</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-end">
                                                <ul className="space-y-1 w-full max-w-sm">
                                                    {order.order_items.map((item) => (
                                                        <li key={item.id} className="flex justify-between text-sm">
                                                            <span className="text-gray-700">{item.quantity}x {item.products?.name || "Produto Removido"}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <button
                                                    onClick={() => handleViewLogs(order.id)}
                                                    className="text-xs underline text-gray-500 hover:text-black whitespace-nowrap"
                                                >
                                                    Ver Histórico
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>

            {/* Order Logs Modal */}
            {viewingLogsFor && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 md:p-10 w-full max-w-lg max-h-[90vh] overflow-y-auto font-work-sans">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold" style={{ fontFamily: "'DM Serif Text', serif" }}>Histórico do Pedido</h2>
                            <button onClick={() => setViewingLogsFor(null)} className="text-gray-500 hover:text-black">✕</button>
                        </div>
                        <p className="font-mono text-xs text-gray-500 mb-6 pb-4 border-b">{viewingLogsFor}</p>

                        {loadingLogs ? (
                            <p className="text-center py-10">Carregando logs...</p>
                        ) : orderLogs.length === 0 ? (
                            <p className="text-center py-10 text-gray-500 italic">Nenhuma mudança registrada ainda.</p>
                        ) : (
                            <div className="space-y-4">
                                {orderLogs.map(log => (
                                    <div key={log.id} className="border-l-2 border-black pl-4 py-1">
                                        <p className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString('pt-BR')}</p>
                                        <p className="text-sm mt-1">
                                            Status alterado para <b className="uppercase">{log.new_status}</b>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Autor: <span className="font-mono">{log.changed_by}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
