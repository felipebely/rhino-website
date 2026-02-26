// src/pages/OrderStatus/index.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { getBatchStatus, formatDateBR } from "../../utils/dateLogic";

type OrderItem = {
    id: string;
    quantity: number;
    price_at_purchase: number;
    product_id: string;
    products: {
        name: string;
    } | null;
};

type Order = {
    id: string;
    customer_name: string;
    status: string;
    payment_method: string;
    total_amount: number;
    delivery_date: string;
    order_items: OrderItem[];
};

export function OrderStatus() {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [canceling, setCanceling] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { cutoffLimit } = getBatchStatus();
    const canCancel = new Date() <= cutoffLimit;

    useEffect(() => {
        async function fetchOrder() {
            if (!id) return;
            try {
                const { data, error } = await supabase
                    .from("orders")
                    .select(`
                        id, customer_name, status, payment_method, total_amount, delivery_date,
                        order_items (
                            id, quantity, price_at_purchase, product_id,
                            products (name)
                        )
                    `)
                    .eq("id", id)
                    .single();

                if (error) throw error;
                setOrder(data as unknown as Order);
            } catch (err: any) {
                console.error("Error fetching order:", err);
                setError("Pedido não encontrado ou ocorreu um erro.");
            } finally {
                setLoading(false);
            }
        }

        fetchOrder();
    }, [id]);

    const handleCancel = async () => {
        if (!window.confirm("Tem certeza que deseja cancelar este pedido?")) return;

        setCanceling(true);
        try {
            const { error } = await supabase
                .from("orders")
                .update({ status: 'Cancelada' })
                .eq("id", id);

            if (error) throw error;

            // Optimistic UI update
            if (order) {
                setOrder({ ...order, status: 'Cancelada' });
            }
        } catch (err: any) {
            console.error("Error canceling order:", err);
            alert("Não foi possível cancelar o pedido. Tente novamente ou contate-nos pelo WhatsApp.");
        } finally {
            setCanceling(false);
        }
    };

    if (loading) {
        return <div className="min-h-[50vh] flex items-center justify-center font-work-sans">Carregando detalhes do pedido...</div>;
    }

    if (error || !order) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center font-work-sans p-4 text-center">
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'DM Serif Text', serif" }}>Ops!</h2>
                <p className="text-gray-600 mb-6">{error || "Pedido não encontrado."}</p>
                <a href="/produtos" className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition font-bold">
                    Voltar aos Produtos
                </a>
            </div>
        );
    }

    const isPending = order.status === 'Pendente';
    const isCancelled = order.status === 'Cancelada';

    // Parse the date to ensure correct timezone handling for display
    const deliveryDateObj = new Date(order.delivery_date + 'T00:00:00');
    const formattedDeliveryDate = formatDateBR(deliveryDateObj);

    return (
        <main className="bg-white min-h-screen py-16 px-4 md:px-8 font-work-sans">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-10" style={{ fontFamily: "'DM Serif Text', serif" }}>
                    Status do Pedido
                </h1>

                <div className="bg-gray-50 border border-gray-200 p-6 md:p-8 rounded-lg shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 mb-6">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">ID do Pedido</p>
                            <p className="font-mono text-xs text-gray-800 bg-gray-200 px-2 py-1 rounded inline-block">{order.id}</p>
                            <h2 className="text-2xl font-bold mt-4 mb-1">Olá, {order.customer_name}!</h2>
                            <p className="text-gray-600">Entrega: <b>{formattedDeliveryDate}</b></p>
                        </div>
                        <div className="mt-4 md:mt-0 text-left md:text-right">
                            <span className={`inline-block px-4 py-2 font-bold uppercase tracking-wider text-sm rounded border ${isPending ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                isCancelled ? 'bg-red-100 text-red-800 border-red-200' :
                                    'bg-green-100 text-green-800 border-green-200'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-bold text-lg mb-4 border-b pb-2">Itens Solicitados</h3>
                        <ul className="space-y-3">
                            {order.order_items.map(item => (
                                <li key={item.id} className="flex justify-between items-center">
                                    <span>{item.quantity}x {item.products?.name || "Produto Removido"}</span>
                                    <span className="text-gray-600">R$ {(item.price_at_purchase * item.quantity).toFixed(2).replace('.', ',')}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-300">
                            <span className="font-bold text-lg">Total Pago no {order.payment_method}</span>
                            <span className="font-bold text-2xl">R$ {order.total_amount.toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>

                    {isPending && canCancel && (
                        <div className="bg-red-50 border border-red-200 p-4 mt-8 rounded flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-red-800 text-sm max-w-md">
                                Você ainda está dentro do prazo para cancelar este pedido. O cancelamento pode ser feito até <b>Segunda-feira às 23:59</b>.
                            </p>
                            <button
                                onClick={handleCancel}
                                disabled={canceling}
                                className="w-full md:w-auto px-6 py-2 bg-red-600 text-white font-bold hover:bg-red-700 transition disabled:opacity-50 whitespace-nowrap"
                            >
                                {canceling ? "Cancelando..." : "Cancelar Pedido"}
                            </button>
                        </div>
                    )}

                    {isPending && !canCancel && (
                        <div className="bg-yellow-50 border border-yellow-200 p-4 mt-8 rounded">
                            <p className="text-yellow-800 text-sm text-center">
                                O prazo para cancelamento automático expirou (Segunda-feira às 23:59). Por favor, entre em contato via WhatsApp caso precise de assistência.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
